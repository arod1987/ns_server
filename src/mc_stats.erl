% Copyright (c) 2009, NorthScale, Inc.
% All rights reserved.

-module(mc_stats).

-behaviour(gen_server).

-include_lib("eunit/include/eunit.hrl").

-include("mc_constants.hrl").

-include("mc_entry.hrl").

-compile(export_all).

-record(state, {dict}).

%% API
-export([start_link/0,
         stats_more/2,
         stats_more/3,
         stats_done/1]).

%% gen_server callbacks
-export([init/1, terminate/2, code_change/3,
         handle_call/3, handle_cast/2, handle_info/2]).

start_link() ->
    gen_server:start_link(?MODULE, ignored, []).

stats_more(Pid, LineBin) ->
    case misc:space_split(LineBin) of
        {<<"STAT">>, <<" ", KeyVal/binary>>} ->
            case misc:space_split(KeyVal) of
                {Key, <<" ", Val/binary>>} ->
                    stats_more(Pid, Key, Val);
                _ -> error
            end;
        _ -> error
    end.

stats_more(Pid, Key, Val) ->
    gen_server:call(Pid, {more, Key, Val}).

stats_done(Pid) ->
    gen_server:call(Pid, done).

% -------------------------------------------------------

init(ignored) -> {ok, #state{dict = dict:new()}}.

terminate(_Reason, _State)     -> ok.
code_change(_OldVsn, State, _) -> {ok, State}.
handle_cast(stop, State)       -> {stop, shutdown, State}.
handle_info(_Info, State)      -> {noreply, State}.

handle_call({more, Key, Val}, _From, #state{dict = Dict} = State) ->
    Dict2 =
        dict:update(Key,
                    fun(ValOld) ->
                            X = sum_binary(ValOld, Val),
?debugVal({sb, Key, ValOld, Val, X}),
X
                        end,
                        Val,
                        Dict),
    {reply, ok, State#state{dict = Dict2}};

handle_call(done, _From, #state{dict = Dict} = State) ->
    {stop, normal, {ok, dict:to_list(Dict)}, State}.

binary_to_integer(Bin) ->
    L = binary_to_list(Bin),
    I = (catch erlang:list_to_integer(L)),
    case is_number(I) of
        true  -> I;
        false -> false
    end.

sum_binary(XBin, YBin) ->
    case binary_to_integer(XBin) of
        false -> XBin;
        XInt  -> case binary_to_integer(YBin) of
                     false -> XBin;
                     YInt  -> Z = integer_to_list(XInt + YInt),
                              list_to_binary(Z)
                 end
    end.

% -------------------------------------------------------

sum_binary_test() ->
    ?assertEqual(<<"2">>, sum_binary(<<"1">>, <<"1">>)),
    ok.

binary_to_integer_test() ->
    ?assertEqual(123, binary_to_integer(<<"123">>)),
    ?assertEqual(0, binary_to_integer(<<"0">>)),
    ?assertEqual(0, binary_to_integer(<<"-0">>)),
    ?assertEqual(-123, binary_to_integer(<<"-123">>)),
    ?assertEqual(false, binary_to_integer(<<"hello">>)),
    ?assertEqual(false, binary_to_integer(<<>>)),
    ok.

