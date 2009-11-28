-module(mc_server_ascii_proxy).

-include_lib("eunit/include/eunit.hrl").

-include("mc_constants.hrl").

-include("mc_entry.hrl").

-import(mc_downstream, [send/6, accum/2, await_ok/1, group_by/2]).

-compile(export_all).

-record(session_proxy, {bucket}).

session(_Sock, Pool) ->
    {ok, Bucket} = mc_pool:get_bucket(Pool, "default"),
    {ok, Pool, #session_proxy{bucket = Bucket}}.

% ------------------------------------------

cmd(get, #session_proxy{bucket = Bucket} = Session,
    _InSock, Out, Keys) ->
    Groups =
        group_by(Keys,
                 fun (Key) ->
                     {Key, Addr} = mc_bucket:choose_addr(Bucket, Key),
                     Addr
                 end),
    {NumFwd, Monitors} =
        lists:foldl(fun ({Addr, AddrKeys}, Acc) ->
                        accum(send(Addr, Out, get, AddrKeys,
                                   undefined, ?MODULE), Acc)
                    end,
                    {0, []}, Groups),
    await_ok(NumFwd),
    mc_ascii:send(Out, <<"END\r\n">>),
    mc_downstream:demonitor(Monitors),
    {ok, Session};

cmd(set, Session, InSock, Out, CmdArgs) ->
    forward_update(set, Session, InSock, Out, CmdArgs);
cmd(add, Session, InSock, Out, CmdArgs) ->
    forward_update(add, Session, InSock, Out, CmdArgs);
cmd(replace, Session, InSock, Out, CmdArgs) ->
    forward_update(replace, Session, InSock, Out, CmdArgs);
cmd(append, Session, InSock, Out, CmdArgs) ->
    forward_update(append, Session, InSock, Out, CmdArgs);
cmd(prepend, Session, InSock, Out, CmdArgs) ->
    forward_update(prepend, Session, InSock, Out, CmdArgs);

cmd(incr, Session, InSock, Out, CmdArgs) ->
    forward_arith(incr, Session, InSock, Out, CmdArgs);
cmd(decr, Session, InSock, Out, CmdArgs) ->
    forward_arith(decr, Session, InSock, Out, CmdArgs);

cmd(delete, #session_proxy{bucket = Bucket} = Session,
    _InSock, Out, [Key]) ->
    {Key, Addr} = mc_bucket:choose_addr(Bucket, Key),
    {ok, Monitor} = send(Addr, Out, delete, #mc_entry{key = Key},
                         undefined, ?MODULE),
    case await_ok(1) of
        1 -> true;
        _ -> mc_ascii:send(Out, <<"ERROR\r\n">>)
    end,
    mc_downstream:demonitor([Monitor]),
    {ok, Session};

cmd(flush_all, #session_proxy{bucket = Bucket} = Session,
    _InSock, Out, _CmdArgs) ->
    Addrs = mc_bucket:addrs(Bucket),
    {NumFwd, Monitors} =
        lists:foldl(fun (Addr, Acc) ->
                        % Using undefined Out to swallow the OK
                        % responses from the downstreams.
                        % TODO: flush_all arguments.
                        accum(send(Addr, undefined,
                                   flush_all, #mc_entry{},
                                   undefined, ?MODULE), Acc)
                    end,
                    {0, []}, Addrs),
    await_ok(NumFwd),
    mc_ascii:send(Out, <<"OK\r\n">>),
    mc_downstream:demonitor(Monitors),
    {ok, Session};

cmd(quit, _Session, _InSock, _Out, _Rest) ->
    exit({ok, quit_received}).

% ------------------------------------------

forward_update(Cmd, #session_proxy{bucket = Bucket} = Session,
               InSock, Out, [Key, FlagIn, ExpireIn, DataLenIn]) ->
    Flag = list_to_integer(FlagIn),
    Expire = list_to_integer(ExpireIn),
    DataLen = list_to_integer(DataLenIn),
    {ok, DataCRNL} = mc_ascii:recv_data(InSock, DataLen + 2),
    {Data, _} = mc_ascii:split_binary_suffix(DataCRNL, 2),
    {Key, Addr} = mc_bucket:choose_addr(Bucket, Key),
    Entry = #mc_entry{key = Key, flag = Flag, expire = Expire, data = Data},
    {ok, Monitor} = send(Addr, Out, Cmd, Entry, undefined, ?MODULE),
    case await_ok(1) of
        1 -> true;
        _ -> mc_ascii:send(Out, <<"ERROR\r\n">>)
    end,
    mc_downstream:demonitor([Monitor]),
    {ok, Session}.

forward_arith(Cmd, #session_proxy{bucket = Bucket} = Session,
              _InSock, Out, [Key, Amount]) ->
    {Key, Addr} = mc_bucket:choose_addr(Bucket, Key),
    {ok, Monitor} = send(Addr, Out, Cmd,
                         #mc_entry{key = Key, data = Amount},
                         undefined, ?MODULE),
    case await_ok(1) of
        1 -> true;
        _ -> mc_ascii:send(Out, <<"ERROR\r\n">>)
    end,
    mc_downstream:demonitor([Monitor]),
    {ok, Session}.

% ------------------------------------------

send_response(ascii, Out, _Cmd, Head, Body) ->
    % Downstream is ascii.
    (Out =/= undefined) andalso
    ((Head =/= undefined) andalso
     (ok =:= mc_ascii:send(Out, [Head, <<"\r\n">>]))) andalso
    ((Body =:= undefined) orelse
     (ok =:= mc_ascii:send(Out, [Body#mc_entry.data, <<"\r\n">>])));

send_response(binary, Out, _Cmd,
              #mc_header{status = Status,
                         opcode = Opcode} = _Head, Body) ->
    % Downstream is binary.
    case Status =:= ?SUCCESS of
        true ->
            case Opcode of
                ?GETKQ     -> send_entry_binary(Out, Body);
                ?GETK      -> send_entry_binary(Out, Body);
                ?NOOP      -> mc_ascii:send(Out, <<"END\r\n">>);
                ?INCREMENT -> send_arith_response(Out, Body);
                ?DECREMENT -> send_arith_response(Out, Body);
                _ -> mc_ascii:send(Out, mc_binary:b2a_code(Opcode, Status))
            end;
        false ->
            mc_ascii:send(Out, mc_binary:b2a_code(Opcode, Status))
    end.

send_entry_binary(Out, #mc_entry{key = Key, data = Data, flag = Flag}) ->
    % TODO: CAS during a gets.
    DataLen = integer_to_list(bin_size(Data)),
    FlagStr = integer_to_list(Flag),
    ok =:= mc_ascii:send(Out, [<<"VALUE ">>, Key,
                               <<" ">>, FlagStr, <<" ">>,
                               DataLen, <<"\r\n">>,
                               Data, <<"\r\n">>]).

send_arith_response(Out, #mc_entry{data = Data}) ->
    <<Amount:64>> = Data,
    AmountStr = integer_to_list(Amount), % TODO: 64-bit parse issue here?
    ok =:= mc_ascii:send(Out, [AmountStr, <<"\r\n">>]).

kind_to_module(ascii)  -> mc_client_ascii_ac;
kind_to_module(binary) -> mc_client_binary_ac.

bin_size(undefined)               -> 0;
bin_size(List) when is_list(List) -> bin_size(iolist_to_binary(List));
bin_size(Binary)                  -> size(Binary).

