import{_ as e}from"./common/tslib.es6-1ce727b1.js";import{A as i,a as o,O as s,i as a,m as d,b as p,c as b,d as m,e as g,f as k,g as A,h as _,j as Y,E as Z,k as $,l as ee,n as re,S as te,o as ne,s as ie,p as oe}from"./common/zip-585f594f.js";export{z as ArgumentOutOfRangeError,c as AsyncSubject,B as BehaviorSubject,C as ConnectableObservable,E as EMPTY,D as EmptyError,G as GroupedObservable,N as Notification,x as NotificationKind,F as ObjectUnsubscribedError,O as Observable,R as ReplaySubject,v as Scheduler,r as Subject,w as Subscriber,S as Subscription,T as TimeoutError,U as UnsubscriptionError,t as asapScheduler,l as asyncScheduler,H as combineLatest,I as concat,X as config,j as defer,J as empty,f as from,h as identity,K as merge,n as noop,q as observable,L as of,y as pipe,u as queueScheduler,M as race,W as scheduled,P as throwError,Q as timer,V as zip}from"./common/zip-585f594f.js";var ce=function(r){function t(e,t){var n=r.call(this,e,t)||this;return n.scheduler=e,n.work=t,n}return e(t,r),t.prototype.requestAsyncId=function(e,t,n){return void 0===n&&(n=0),null!==n&&n>0?r.prototype.requestAsyncId.call(this,e,t,n):(e.actions.push(this),e.scheduled||(e.scheduled=requestAnimationFrame((function(){return e.flush(null)}))))},t.prototype.recycleAsyncId=function(e,t,n){if(void 0===n&&(n=0),null!==n&&n>0||null===n&&this.delay>0)return r.prototype.recycleAsyncId.call(this,e,t,n);0===e.actions.length&&(cancelAnimationFrame(t),e.scheduled=void 0)},t}(i),ue=new(function(r){function t(){return null!==r&&r.apply(this,arguments)||this}return e(t,r),t.prototype.flush=function(e){this.active=!0,this.scheduled=void 0;var r,t=this.actions,n=-1,i=t.length;e=e||t.shift();do{if(r=e.execute(e.state,e.delay))break}while(++n<i&&(e=t.shift()));if(this.active=!1,r){for(;++n<i&&(e=t.shift());)e.unsubscribe();throw r}},t}(o))(ce),se=function(r){function t(e,t){void 0===e&&(e=ae),void 0===t&&(t=Number.POSITIVE_INFINITY);var n=r.call(this,e,(function(){return n.frame}))||this;return n.maxFrames=t,n.frame=0,n.index=-1,n}return e(t,r),t.prototype.flush=function(){for(var e,r,t=this.actions,n=this.maxFrames;(r=t[0])&&r.delay<=n&&(t.shift(),this.frame=r.delay,!(e=r.execute(r.state,r.delay))););if(e){for(;r=t.shift();)r.unsubscribe();throw e}},t.frameTimeFactor=10,t}(o),ae=function(r){function t(e,t,n){void 0===n&&(n=e.index+=1);var i=r.call(this,e,t)||this;return i.scheduler=e,i.work=t,i.index=n,i.active=!0,i.index=e.index=n,i}return e(t,r),t.prototype.schedule=function(e,n){if(void 0===n&&(n=0),!this.id)return r.prototype.schedule.call(this,e,n);this.active=!1;var i=new t(this.scheduler,this.work);return this.add(i),i.schedule(e,n)},t.prototype.requestAsyncId=function(e,r,n){void 0===n&&(n=0),this.delay=e.frame+n;var i=e.actions;return i.push(this),i.sort(t.sortActions),!0},t.prototype.recycleAsyncId=function(e,r,t){},t.prototype._execute=function(e,t){if(!0===this.active)return r.prototype._execute.call(this,e,t)},t.sortActions=function(e,r){return e.delay===r.delay?e.index===r.index?0:e.index>r.index?1:-1:e.delay>r.delay?1:-1},t}(i);function fe(e){return!!e&&(e instanceof s||"function"==typeof e.lift&&"function"==typeof e.subscribe)}function le(e,r,t){if(r){if(!a(r))return function(){for(var n=[],i=0;i<arguments.length;i++)n[i]=arguments[i];return le(e,t).apply(void 0,n).pipe(d((function(e){return p(e)?r.apply(void 0,e):r(e)})))};t=r}return function(){for(var r=[],n=0;n<arguments.length;n++)r[n]=arguments[n];var i,o=this,c={context:o,subject:i,callbackFunc:e,scheduler:t};return new s((function(n){if(t){var u={args:r,subscriber:n,params:c};return t.schedule(de,0,u)}if(!i){i=new b;try{e.apply(o,r.concat([function(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];i.next(e.length<=1?e[0]:e),i.complete()}]))}catch(e){m(i)?i.error(e):console.warn(e)}}return i.subscribe(n)}))}}function de(e){var r=this,t=e.args,n=e.subscriber,i=e.params,o=i.callbackFunc,c=i.context,u=i.scheduler,s=i.subject;if(!s){s=i.subject=new b;try{o.apply(c,t.concat([function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];var n=e.length<=1?e[0]:e;r.add(u.schedule(he,0,{value:n,subject:s}))}]))}catch(e){s.error(e)}}this.add(s.subscribe(n))}function he(e){var r=e.value,t=e.subject;t.next(r),t.complete()}function ve(e,r,t){if(r){if(!a(r))return function(){for(var n=[],i=0;i<arguments.length;i++)n[i]=arguments[i];return ve(e,t).apply(void 0,n).pipe(d((function(e){return p(e)?r.apply(void 0,e):r(e)})))};t=r}return function(){for(var r=[],n=0;n<arguments.length;n++)r[n]=arguments[n];var i={subject:void 0,args:r,callbackFunc:e,scheduler:t,context:this};return new s((function(n){var o=i.context,c=i.subject;if(t)return t.schedule(pe,0,{params:i,subscriber:n,context:o});if(!c){c=i.subject=new b;try{e.apply(o,r.concat([function(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];var t=e.shift();t?c.error(t):(c.next(e.length<=1?e[0]:e),c.complete())}]))}catch(e){m(c)?c.error(e):console.warn(e)}}return c.subscribe(n)}))}}function pe(e){var r=this,t=e.params,n=e.subscriber,i=e.context,o=t.callbackFunc,c=t.args,u=t.scheduler,s=t.subject;if(!s){s=t.subject=new b;try{o.apply(i,c.concat([function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];var n=e.shift();if(n)r.add(u.schedule(ye,0,{err:n,subject:s}));else{var i=e.length<=1?e[0]:e;r.add(u.schedule(be,0,{value:i,subject:s}))}}]))}catch(e){this.add(u.schedule(ye,0,{err:e,subject:s}))}}this.add(s.subscribe(n))}function be(e){var r=e.value,t=e.subject;t.next(r),t.complete()}function ye(e){var r=e.err;e.subject.error(r)}function me(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];if(1===e.length){var t=e[0];if(p(t))return xe(t,null);if(g(t)&&Object.getPrototypeOf(t)===Object.prototype){var n=Object.keys(t);return xe(n.map((function(e){return t[e]})),n)}}if("function"==typeof e[e.length-1]){var i=e.pop();return xe(e=1===e.length&&p(e[0])?e[0]:e,null).pipe(d((function(e){return i.apply(void 0,e)})))}return xe(e,null)}function xe(e,r){return new s((function(t){var n=e.length;if(0!==n)for(var i=new Array(n),o=0,c=0,u=function(u){var s=k(e[u]),a=!1;t.add(s.subscribe({next:function(e){a||(a=!0,c++),i[u]=e},error:function(e){return t.error(e)},complete:function(){++o!==n&&a||(c===n&&t.next(r?r.reduce((function(e,r,t){return e[r]=i[t],e}),{}):i),t.complete())}}))},s=0;s<n;s++)u(s);else t.complete()}))}function ge(e,r,t,n){return A(t)&&(n=t,t=void 0),n?ge(e,r,t).pipe(d((function(e){return p(e)?n.apply(void 0,e):n(e)}))):new s((function(n){!function e(r,t,n,i,o){var c;if(function(e){return e&&"function"==typeof e.addEventListener&&"function"==typeof e.removeEventListener}(r)){var u=r;r.addEventListener(t,n,o),c=function(){return u.removeEventListener(t,n,o)}}else if(function(e){return e&&"function"==typeof e.on&&"function"==typeof e.off}(r)){var s=r;r.on(t,n),c=function(){return s.off(t,n)}}else if(function(e){return e&&"function"==typeof e.addListener&&"function"==typeof e.removeListener}(r)){var a=r;r.addListener(t,n),c=function(){return a.removeListener(t,n)}}else{if(!r||!r.length)throw new TypeError("Invalid event target");for(var f=0,l=r.length;f<l;f++)e(r[f],t,n,i,o)}i.add(c)}(e,r,(function(e){arguments.length>1?n.next(Array.prototype.slice.call(arguments)):n.next(e)}),n,t)}))}function we(e,r,t){return t?we(e,r).pipe(d((function(e){return p(e)?t.apply(void 0,e):t(e)}))):new s((function(t){var n,i=function(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];return t.next(1===e.length?e[0]:e)};try{n=e(i)}catch(e){return void t.error(e)}if(A(r))return function(){return r(i,n)}}))}function je(e,r,t,n,i){var o,c;if(1==arguments.length){var u=e;c=u.initialState,r=u.condition,t=u.iterate,o=u.resultSelector||_,i=u.scheduler}else void 0===n||a(n)?(c=e,o=_,i=n):(c=e,o=n);return new s((function(e){var n=c;if(i)return i.schedule(ke,0,{subscriber:e,iterate:t,condition:r,resultSelector:o,state:n});for(;;){if(r){var u=void 0;try{u=r(n)}catch(r){return void e.error(r)}if(!u){e.complete();break}}var s=void 0;try{s=o(n)}catch(r){return void e.error(r)}if(e.next(s),e.closed)break;try{n=t(n)}catch(r){return void e.error(r)}}}))}function ke(e){var r=e.subscriber,t=e.condition;if(!r.closed){if(e.needIterate)try{e.state=e.iterate(e.state)}catch(e){return void r.error(e)}else e.needIterate=!0;if(t){var n=void 0;try{n=t(e.state)}catch(e){return void r.error(e)}if(!n)return void r.complete();if(r.closed)return}var i;try{i=e.resultSelector(e.state)}catch(e){return void r.error(e)}if(!r.closed&&(r.next(i),!r.closed))return this.schedule(e)}}function Se(e,r,t){return void 0===r&&(r=Z),void 0===t&&(t=Z),Y((function(){return e()?r:t}))}function Ee(e,r){return void 0===e&&(e=0),void 0===r&&(r=ee),(!$(e)||e<0)&&(e=0),r&&"function"==typeof r.schedule||(r=ee),new s((function(t){return t.add(r.schedule(Oe,e,{subscriber:t,counter:0,period:e})),t}))}function Oe(e){var r=e.subscriber,t=e.counter,n=e.period;r.next(t),this.schedule({subscriber:r,counter:t+1,period:n},n)}var Ae=new s(re);function Ie(){return Ae}function Fe(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];if(0===e.length)return Z;var t=e[0],n=e.slice(1);return 1===e.length&&p(t)?Fe.apply(void 0,t):new s((function(e){var r=function(){return e.add(Fe.apply(void 0,n).subscribe(e))};return k(t).subscribe({next:function(r){e.next(r)},error:r,complete:r})}))}function Le(e,r){return new s(r?function(t){var n=Object.keys(e),i=new te;return i.add(r.schedule(Te,0,{keys:n,index:0,subscriber:t,subscription:i,obj:e})),i}:function(r){for(var t=Object.keys(e),n=0;n<t.length&&!r.closed;n++){var i=t[n];e.hasOwnProperty(i)&&r.next([i,e[i]])}r.complete()})}function Te(e){var r=e.keys,t=e.index,n=e.subscriber,i=e.subscription,o=e.obj;if(!n.closed)if(t<r.length){var c=r[t];n.next([c,o[c]]),i.add(this.schedule({keys:r,index:t+1,subscriber:n,subscription:i,obj:o}))}else n.complete()}function qe(e,r,t){return[ne(r,t)(new s(ie(e))),ne(oe(r,t))(new s(ie(e)))]}function Ne(e,r,t){return void 0===e&&(e=0),new s((function(n){void 0===r&&(r=e,e=0);var i=0,o=e;if(t)return t.schedule(Pe,0,{index:i,count:r,start:e,subscriber:n});for(;;){if(i++>=r){n.complete();break}if(n.next(o++),n.closed)break}}))}function Pe(e){var r=e.start,t=e.index,n=e.count,i=e.subscriber;t>=n?i.complete():(i.next(r),i.closed||(e.index=t+1,e.start=r+1,this.schedule(e)))}function ze(e,r){return new s((function(t){var n,i;try{n=e()}catch(e){return void t.error(e)}try{i=r(n)}catch(e){return void t.error(e)}var o=(i?k(i):Z).subscribe(t);return function(){o.unsubscribe(),n&&n.unsubscribe()}}))}export{Ae as NEVER,ae as VirtualAction,se as VirtualTimeScheduler,ue as animationFrameScheduler,le as bindCallback,ve as bindNodeCallback,me as forkJoin,ge as fromEvent,we as fromEventPattern,je as generate,Se as iif,Ee as interval,fe as isObservable,Ie as never,Fe as onErrorResumeNext,Le as pairs,qe as partition,Ne as range,ze as using};
//# sourceMappingURL=rxjs.js.map