@php
$dateFormat = 'D. F j, Y';
$timeFormat = 'h:i A';
$hotel =  $emailData['hotel']??null;
$transfer =  $emailData['transfer']??null;
$activity =  $emailData['activity']??null;
$car =  $emailData['car']??null;
$insurance =  $emailData['insurance']??null;
$isActivityStandalone = isset($activity) && !isset($hotel);
$voucherLink =  isset($activity) &&  !empty($activity['tripInfo'][0] ['vouchers'])?$activity['tripInfo'][0] ['vouchers']:null;
$email_url = $email_url?? config('app.url');

@endphp
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"
xmlns:v="urn:schemas-microsoft-com:vml"
xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <!--[if gtemso 9]><xml>
    <o:OfficeDocumentSettings>
    <o:AllowPNG/>
    <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
    </xml><![endif]-->

    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <!--[if !mso]><!-->
        <meta http-equiv="X-UA-Compatible" content="IE=edge" /><script type="text/javascript">(window.NREUM||(NREUM={})).loader_config={xpid:"VQIDV1NXGwcEU1dRBA==",licenseKey:"b99fa40c2c",applicationID:"447633"};window.NREUM||(NREUM={}),__nr_require=function(t,n,e){function r(e){if(!n[e]){var o=n[e]={exports:{}};t[e][0].call(o.exports,function(n){var o=t[e][1][n];return r(o||n)},o,o.exports)}return n[e].exports}if("function"==typeof __nr_require)return __nr_require;for(var o=0;o<e.length;o++)r(e[o]);return r}({1:[function(t,n,e){function r(t){try{s.console&&console.log(t)}catch(n){}}var o,i=t("ee"),a=t(20),s={};try{o=localStorage.getItem("__nr_flags").split(","),console&&"function"==typeof console.log&&(s.console=!0,o.indexOf("dev")!==-1&&(s.dev=!0),o.indexOf("nr_dev")!==-1&&(s.nrDev=!0))}catch(c){}s.nrDev&&i.on("internal-error",function(t){r(t.stack)}),s.dev&&i.on("fn-err",function(t,n,e){r(e.stack)}),s.dev&&(r("NR AGENT IN DEVELOPMENT MODE"),r("flags: "+a(s,function(t,n){return t}).join(", ")))},{}],2:[function(t,n,e){function r(t,n,e,r,s){try{p?p-=1:o(s||new UncaughtException(t,n,e),!0)}catch(f){try{i("ierr",[f,c.now(),!0])}catch(d){}}return"function"==typeof u&&u.apply(this,a(arguments))}function UncaughtException(t,n,e){this.message=t||"Uncaught error with no additional information",this.sourceURL=n,this.line=e}function o(t,n){var e=n?null:c.now();i("err",[t,e])}var i=t("handle"),a=t(21),s=t("ee"),c=t("loader"),f=t("gos"),u=window.onerror,d=!1,l="nr@seenError",p=0;c.features.err=!0,t(1),window.onerror=r;try{throw new Error}catch(h){"stack"in h&&(t(9),t(8),"addEventListener"in window&&t(5),c.xhrWrappable&&t(10),d=!0)}s.on("fn-start",function(t,n,e){d&&(p+=1)}),s.on("fn-err",function(t,n,e){d&&!e[l]&&(f(e,l,function(){return!0}),this.thrown=!0,o(e))}),s.on("fn-end",function(){d&&!this.thrown&&p>0&&(p-=1)}),s.on("internal-error",function(t){i("ierr",[t,c.now(),!0])})},{}],3:[function(t,n,e){t("loader").features.ins=!0},{}],4:[function(t,n,e){function r(t){}if(window.performance&&window.performance.timing&&window.performance.getEntriesByType){var o=t("ee"),i=t("handle"),a=t(9),s=t(8),c="learResourceTimings",f="addEventListener",u="resourcetimingbufferfull",d="bstResource",l="resource",p="-start",h="-end",m="fn"+p,w="fn"+h,v="bstTimer",g="pushState",y=t("loader");y.features.stn=!0,t(7),"addEventListener"in window&&t(5);var x=NREUM.o.EV;o.on(m,function(t,n){var e=t[0];e instanceof x&&(this.bstStart=y.now())}),o.on(w,function(t,n){var e=t[0];e instanceof x&&i("bst",[e,n,this.bstStart,y.now()])}),a.on(m,function(t,n,e){this.bstStart=y.now(),this.bstType=e}),a.on(w,function(t,n){i(v,[n,this.bstStart,y.now(),this.bstType])}),s.on(m,function(){this.bstStart=y.now()}),s.on(w,function(t,n){i(v,[n,this.bstStart,y.now(),"requestAnimationFrame"])}),o.on(g+p,function(t){this.time=y.now(),this.startPath=location.pathname+location.hash}),o.on(g+h,function(t){i("bstHist",[location.pathname+location.hash,this.startPath,this.time])}),f in window.performance&&(window.performance["c"+c]?window.performance[f](u,function(t){i(d,[window.performance.getEntriesByType(l)]),window.performance["c"+c]()},!1):window.performance[f]("webkit"+u,function(t){i(d,[window.performance.getEntriesByType(l)]),window.performance["webkitC"+c]()},!1)),document[f]("scroll",r,{passive:!0}),document[f]("keypress",r,!1),document[f]("click",r,!1)}},{}],5:[function(t,n,e){function r(t){for(var n=t;n&&!n.hasOwnProperty(u);)n=Object.getPrototypeOf(n);n&&o(n)}function o(t){s.inPlace(t,[u,d],"-",i)}function i(t,n){return t[1]}var a=t("ee").get("events"),s=t("wrap-function")(a,!0),c=t("gos"),f=XMLHttpRequest,u="addEventListener",d="removeEventListener";n.exports=a,"getPrototypeOf"in Object?(r(document),r(window),r(f.prototype)):f.prototype.hasOwnProperty(u)&&(o(window),o(f.prototype)),a.on(u+"-start",function(t,n){var e=t[1],r=c(e,"nr@wrapped",function(){function t(){if("function"==typeof e.handleEvent)return e.handleEvent.apply(e,arguments)}var n={object:t,"function":e}[typeof e];return n?s(n,"fn-",null,n.name||"anonymous"):e});this.wrapped=t[1]=r}),a.on(d+"-start",function(t){t[1]=this.wrapped||t[1]})},{}],6:[function(t,n,e){function r(t,n,e){var r=t[n];"function"==typeof r&&(t[n]=function(){var t=i(arguments),n={};o.emit(e+"before-start",[t],n);var a;n[m]&&n[m].dt&&(a=n[m].dt);var s=r.apply(this,t);return o.emit(e+"start",[t,a],s),s.then(function(t){return o.emit(e+"end",[null,t],s),t},function(t){throw o.emit(e+"end",[t],s),t})})}var o=t("ee").get("fetch"),i=t(21),a=t(20);n.exports=o;var s=window,c="fetch-",f=c+"body-",u=["arrayBuffer","blob","json","text","formData"],d=s.Request,l=s.Response,p=s.fetch,h="prototype",m="nr@context";d&&l&&p&&(a(u,function(t,n){r(d[h],n,f),r(l[h],n,f)}),r(s,"fetch",c),o.on(c+"end",function(t,n){var e=this;if(n){var r=n.headers.get("content-length");null!==r&&(e.rxSize=r),o.emit(c+"done",[null,n],e)}else o.emit(c+"done",[t],e)}))},{}],7:[function(t,n,e){var r=t("ee").get("history"),o=t("wrap-function")(r);n.exports=r;var i=window.history&&window.history.constructor&&window.history.constructor.prototype,a=window.history;i&&i.pushState&&i.replaceState&&(a=i),o.inPlace(a,["pushState","replaceState"],"-")},{}],8:[function(t,n,e){var r=t("ee").get("raf"),o=t("wrap-function")(r),i="equestAnimationFrame";n.exports=r,o.inPlace(window,["r"+i,"mozR"+i,"webkitR"+i,"msR"+i],"raf-"),r.on("raf-start",function(t){t[0]=o(t[0],"fn-")})},{}],9:[function(t,n,e){function r(t,n,e){t[0]=a(t[0],"fn-",null,e)}function o(t,n,e){this.method=e,this.timerDuration=isNaN(t[1])?0:+t[1],t[0]=a(t[0],"fn-",this,e)}var i=t("ee").get("timer"),a=t("wrap-function")(i),s="setTimeout",c="setInterval",f="clearTimeout",u="-start",d="-";n.exports=i,a.inPlace(window,[s,"setImmediate"],s+d),a.inPlace(window,[c],c+d),a.inPlace(window,[f,"clearImmediate"],f+d),i.on(c+u,r),i.on(s+u,o)},{}],10:[function(t,n,e){function r(t,n){d.inPlace(n,["onreadystatechange"],"fn-",s)}function o(){var t=this,n=u.context(t);t.readyState>3&&!n.resolved&&(n.resolved=!0,u.emit("xhr-resolved",[],t)),d.inPlace(t,g,"fn-",s)}function i(t){y.push(t),h&&(b?b.then(a):w?w(a):(E=-E,R.data=E))}function a(){for(var t=0;t<y.length;t++)r([],y[t]);y.length&&(y=[])}function s(t,n){return n}function c(t,n){for(var e in t)n[e]=t[e];return n}t(5);var f=t("ee"),u=f.get("xhr"),d=t("wrap-function")(u),l=NREUM.o,p=l.XHR,h=l.MO,m=l.PR,w=l.SI,v="readystatechange",g=["onload","onerror","onabort","onloadstart","onloadend","onprogress","ontimeout"],y=[];n.exports=u;var x=window.XMLHttpRequest=function(t){var n=new p(t);try{u.emit("new-xhr",[n],n),n.addEventListener(v,o,!1)}catch(e){try{u.emit("internal-error",[e])}catch(r){}}return n};if(c(p,x),x.prototype=p.prototype,d.inPlace(x.prototype,["open","send"],"-xhr-",s),u.on("send-xhr-start",function(t,n){r(t,n),i(n)}),u.on("open-xhr-start",r),h){var b=m&&m.resolve();if(!w&&!m){var E=1,R=document.createTextNode(E);new h(a).observe(R,{characterData:!0})}}else f.on("fn-end",function(t){t[0]&&t[0].type===v||a()})},{}],11:[function(t,n,e){function r(){var t=window.NREUM;if(!t.loader_config)return null;var n=(t.loader_config.accountID||"").toString()||null,e=(t.loader_config.agentID||"").toString()||null,r=(t.loader_config.trustKey||"").toString()||null;if(!n||!e)return null;var a=i.generateCatId(),s=i.generateCatId(),c=Date.now(),f=o(a,s,c,n,e,r);return{header:f,guid:a,traceId:s,timestamp:c}}function o(t,n,e,r,o,i){var a="btoa"in window&&"function"==typeof window.btoa;if(!a)return null;var s={v:[0,1],d:{ty:"Browser",ac:r,ap:o,id:t,tr:n,ti:e}};return i&&r!==i&&(s.d.tk=i),btoa(JSON.stringify(s))}var i=t(18);n.exports={generateTracePayload:r,generateTraceHeader:o}},{}],12:[function(t,n,e){function r(t){var n=this.params,e=this.metrics;if(!this.ended){this.ended=!0;for(var r=0;r<p;r++)t.removeEventListener(l[r],this.listener,!1);n.aborted||(e.duration=s.now()-this.startTime,this.loadCaptureCalled||4!==t.readyState?null==n.status&&(n.status=0):a(this,t),e.cbTime=this.cbTime,d.emit("xhr-done",[t],t),c("xhr",[n,e,this.startTime]))}}function o(t,n){var e=t.responseType;if("json"===e&&null!==n)return n;var r="arraybuffer"===e||"blob"===e||"json"===e?t.response:t.responseText;return w(r)}function i(t,n){var e=f(n),r=t.params;r.host=e.hostname+":"+e.port,r.pathname=e.pathname,t.sameOrigin=e.sameOrigin}function a(t,n){t.params.status=n.status;var e=o(n,t.lastSize);if(e&&(t.metrics.rxSize=e),t.sameOrigin){var r=n.getResponseHeader("X-NewRelic-App-Data");r&&(t.params.cat=r.split(", ").pop())}t.loadCaptureCalled=!0}var s=t("loader");if(s.xhrWrappable){var c=t("handle"),f=t(13),u=t(11).generateTracePayload,d=t("ee"),l=["load","error","abort","timeout"],p=l.length,h=t("id"),m=t(16),w=t(15),v=window.XMLHttpRequest;s.features.xhr=!0,t(10),t(6),d.on("new-xhr",function(t){var n=this;n.totalCbs=0,n.called=0,n.cbTime=0,n.end=r,n.ended=!1,n.xhrGuids={},n.lastSize=null,n.loadCaptureCalled=!1,t.addEventListener("load",function(e){a(n,t)},!1),m&&(m>34||m<10)||window.opera||t.addEventListener("progress",function(t){n.lastSize=t.loaded},!1)}),d.on("open-xhr-start",function(t){this.params={method:t[0]},i(this,t[1]),this.metrics={}}),d.on("open-xhr-end",function(t,n){"loader_config"in NREUM&&"xpid"in NREUM.loader_config&&this.sameOrigin&&n.setRequestHeader("X-NewRelic-ID",NREUM.loader_config.xpid);var e=!1;if("init"in NREUM&&"distributed_tracing"in NREUM.init&&(e=!!NREUM.init.distributed_tracing.enabled),e&&this.sameOrigin){var r=u();r&&r.header&&(n.setRequestHeader("newrelic",r.header),this.dt=r)}}),d.on("send-xhr-start",function(t,n){var e=this.metrics,r=t[0],o=this;if(e&&r){var i=w(r);i&&(e.txSize=i)}this.startTime=s.now(),this.listener=function(t){try{"abort"!==t.type||o.loadCaptureCalled||(o.params.aborted=!0),("load"!==t.type||o.called===o.totalCbs&&(o.onloadCalled||"function"!=typeof n.onload))&&o.end(n)}catch(e){try{d.emit("internal-error",[e])}catch(r){}}};for(var a=0;a<p;a++)n.addEventListener(l[a],this.listener,!1)}),d.on("xhr-cb-time",function(t,n,e){this.cbTime+=t,n?this.onloadCalled=!0:this.called+=1,this.called!==this.totalCbs||!this.onloadCalled&&"function"==typeof e.onload||this.end(e)}),d.on("xhr-load-added",function(t,n){var e=""+h(t)+!!n;this.xhrGuids&&!this.xhrGuids[e]&&(this.xhrGuids[e]=!0,this.totalCbs+=1)}),d.on("xhr-load-removed",function(t,n){var e=""+h(t)+!!n;this.xhrGuids&&this.xhrGuids[e]&&(delete this.xhrGuids[e],this.totalCbs-=1)}),d.on("addEventListener-end",function(t,n){n instanceof v&&"load"===t[0]&&d.emit("xhr-load-added",[t[1],t[2]],n)}),d.on("removeEventListener-end",function(t,n){n instanceof v&&"load"===t[0]&&d.emit("xhr-load-removed",[t[1],t[2]],n)}),d.on("fn-start",function(t,n,e){n instanceof v&&("onload"===e&&(this.onload=!0),("load"===(t[0]&&t[0].type)||this.onload)&&(this.xhrCbStart=s.now()))}),d.on("fn-end",function(t,n){this.xhrCbStart&&d.emit("xhr-cb-time",[s.now()-this.xhrCbStart,this.onload,n],n)}),d.on("fetch-before-start",function(t){var n,e=t[1]||{};"string"==typeof t[0]?n=t[0]:t[0]&&t[0].url&&(n=t[0].url),n&&(this.sameOrigin=f(n).sameOrigin);var r=!1;if("init"in NREUM&&"distributed_tracing"in NREUM.init&&(r=!!NREUM.init.distributed_tracing.enabled),r&&this.sameOrigin){var o=u();if(!o||!o.header)return;var i=o.header;if("string"==typeof t[0]){var a={};for(var s in e)a[s]=e[s];a.headers=new Headers(e.headers||{}),a.headers.set("newrelic",i),this.dt=o,t.length>1?t[1]=a:t.push(a)}else t[0]&&t[0].headers&&(t[0].headers.append("newrelic",i),this.dt=o)}})}},{}],13:[function(t,n,e){n.exports=function(t){var n=document.createElement("a"),e=window.location,r={};n.href=t,r.port=n.port;var o=n.href.split("://");!r.port&&o[1]&&(r.port=o[1].split("/")[0].split("@").pop().split(":")[1]),r.port&&"0"!==r.port||(r.port="https"===o[0]?"443":"80"),r.hostname=n.hostname||e.hostname,r.pathname=n.pathname,r.protocol=o[0],"/"!==r.pathname.charAt(0)&&(r.pathname="/"+r.pathname);var i=!n.protocol||":"===n.protocol||n.protocol===e.protocol,a=n.hostname===document.domain&&n.port===e.port;return r.sameOrigin=i&&(!n.hostname||a),r}},{}],14:[function(t,n,e){function r(){}function o(t,n,e){return function(){return i(t,[f.now()].concat(s(arguments)),n?null:this,e),n?void 0:this}}var i=t("handle"),a=t(20),s=t(21),c=t("ee").get("tracer"),f=t("loader"),u=NREUM;"undefined"==typeof window.newrelic&&(newrelic=u);var d=["setPageViewName","setCustomAttribute","setErrorHandler","finished","addToTrace","inlineHit","addRelease"],l="api-",p=l+"ixn-";a(d,function(t,n){u[n]=o(l+n,!0,"api")}),u.addPageAction=o(l+"addPageAction",!0),u.setCurrentRouteName=o(l+"routeName",!0),n.exports=newrelic,u.interaction=function(){return(new r).get()};var h=r.prototype={createTracer:function(t,n){var e={},r=this,o="function"==typeof n;return i(p+"tracer",[f.now(),t,e],r),function(){if(c.emit((o?"":"no-")+"fn-start",[f.now(),r,o],e),o)try{return n.apply(this,arguments)}catch(t){throw c.emit("fn-err",[arguments,this,t],e),t}finally{c.emit("fn-end",[f.now()],e)}}}};a("actionText,setName,setAttribute,save,ignore,onEnd,getContext,end,get".split(","),function(t,n){h[n]=o(p+n)}),newrelic.noticeError=function(t,n){"string"==typeof t&&(t=new Error(t)),i("err",[t,f.now(),!1,n])}},{}],15:[function(t,n,e){n.exports=function(t){if("string"==typeof t&&t.length)return t.length;if("object"==typeof t){if("undefined"!=typeof ArrayBuffer&&t instanceof ArrayBuffer&&t.byteLength)return t.byteLength;if("undefined"!=typeof Blob&&t instanceof Blob&&t.size)return t.size;if(!("undefined"!=typeof FormData&&t instanceof FormData))try{return JSON.stringify(t).length}catch(n){return}}}},{}],16:[function(t,n,e){var r=0,o=navigator.userAgent.match(/Firefox[\/\s](\d+\.\d+)/);o&&(r=+o[1]),n.exports=r},{}],17:[function(t,n,e){function r(t,n){var e=t.getEntries();e.forEach(function(t){"first-paint"===t.name?a("timing",["fp",Math.floor(t.startTime)]):"first-contentful-paint"===t.name&&a("timing",["fcp",Math.floor(t.startTime)])})}function o(t){if(t instanceof c&&!u){var n,e=Math.round(t.timeStamp);n=e>1e12?Date.now()-e:s.now()-e,u=!0,a("timing",["fi",e,{type:t.type,fid:n}])}}if(!("init"in NREUM&&"page_view_timing"in NREUM.init&&"enabled"in NREUM.init.page_view_timing&&NREUM.init.page_view_timing.enabled===!1)){var i,a=t("handle"),s=t("loader"),c=NREUM.o.EV;if("PerformanceObserver"in window&&"function"==typeof window.PerformanceObserver){i=new PerformanceObserver(r);try{i.observe({entryTypes:["paint"]})}catch(f){}}if("addEventListener"in document){var u=!1,d=["click","keydown","mousedown","pointerdown","touchstart"];d.forEach(function(t){document.addEventListener(t,o,!1)})}}},{}],18:[function(t,n,e){function r(){function t(){return n?15&n[e++]:16*Math.random()|0}var n=null,e=0,r=window.crypto||window.msCrypto;r&&r.getRandomValues&&(n=r.getRandomValues(new Uint8Array(31)));for(var o,i="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx",a="",s=0;s<i.length;s++)o=i[s],"x"===o?a+=t().toString(16):"y"===o?(o=3&t()|8,a+=o.toString(16)):a+=o;return a}function o(){function t(){return n?15&n[e++]:16*Math.random()|0}var n=null,e=0,r=window.crypto||window.msCrypto;r&&r.getRandomValues&&Uint8Array&&(n=r.getRandomValues(new Uint8Array(31)));for(var o=[],i=0;i<16;i++)o.push(t().toString(16));return o.join("")}n.exports={generateUuid:r,generateCatId:o}},{}],19:[function(t,n,e){function r(t,n){if(!o)return!1;if(t!==o)return!1;if(!n)return!0;if(!i)return!1;for(var e=i.split("."),r=n.split("."),a=0;a<r.length;a++)if(r[a]!==e[a])return!1;return!0}var o=null,i=null,a=/Version\/(\S+)\s+Safari/;if(navigator.userAgent){var s=navigator.userAgent,c=s.match(a);c&&s.indexOf("Chrome")===-1&&s.indexOf("Chromium")===-1&&(o="Safari",i=c[1])}n.exports={agent:o,version:i,match:r}},{}],20:[function(t,n,e){function r(t,n){var e=[],r="",i=0;for(r in t)o.call(t,r)&&(e[i]=n(r,t[r]),i+=1);return e}var o=Object.prototype.hasOwnProperty;n.exports=r},{}],21:[function(t,n,e){function r(t,n,e){n||(n=0),"undefined"==typeof e&&(e=t?t.length:0);for(var r=-1,o=e-n||0,i=Array(o<0?0:o);++r<o;)i[r]=t[n+r];return i}n.exports=r},{}],22:[function(t,n,e){n.exports={exists:"undefined"!=typeof window.performance&&window.performance.timing&&"undefined"!=typeof window.performance.timing.navigationStart}},{}],ee:[function(t,n,e){function r(){}function o(t){function n(t){return t&&t instanceof r?t:t?c(t,s,i):i()}function e(e,r,o,i){if(!l.aborted||i){t&&t(e,r,o);for(var a=n(o),s=m(e),c=s.length,f=0;f<c;f++)s[f].apply(a,r);var d=u[y[e]];return d&&d.push([x,e,r,a]),a}}function p(t,n){g[t]=m(t).concat(n)}function h(t,n){var e=g[t];if(e)for(var r=0;r<e.length;r++)e[r]===n&&e.splice(r,1)}function m(t){return g[t]||[]}function w(t){return d[t]=d[t]||o(e)}function v(t,n){f(t,function(t,e){n=n||"feature",y[e]=n,n in u||(u[n]=[])})}var g={},y={},x={on:p,addEventListener:p,removeEventListener:h,emit:e,get:w,listeners:m,context:n,buffer:v,abort:a,aborted:!1};return x}function i(){return new r}function a(){(u.api||u.feature)&&(l.aborted=!0,u=l.backlog={})}var s="nr@context",c=t("gos"),f=t(20),u={},d={},l=n.exports=o();l.backlog=u},{}],gos:[function(t,n,e){function r(t,n,e){if(o.call(t,n))return t[n];var r=e();if(Object.defineProperty&&Object.keys)try{return Object.defineProperty(t,n,{value:r,writable:!0,enumerable:!1}),r}catch(i){}return t[n]=r,r}var o=Object.prototype.hasOwnProperty;n.exports=r},{}],handle:[function(t,n,e){function r(t,n,e,r){o.buffer([t],r),o.emit(t,n,e)}var o=t("ee").get("handle");n.exports=r,r.ee=o},{}],id:[function(t,n,e){function r(t){var n=typeof t;return!t||"object"!==n&&"function"!==n?-1:t===window?0:a(t,i,function(){return o++})}var o=1,i="nr@id",a=t("gos");n.exports=r},{}],loader:[function(t,n,e){function r(){if(!E++){var t=b.info=NREUM.info,n=p.getElementsByTagName("script")[0];if(setTimeout(u.abort,3e4),!(t&&t.licenseKey&&t.applicationID&&n))return u.abort();f(y,function(n,e){t[n]||(t[n]=e)}),c("mark",["onload",a()+b.offset],null,"api");var e=p.createElement("script");e.src="https://"+t.agent,n.parentNode.insertBefore(e,n)}}function o(){"complete"===p.readyState&&i()}function i(){c("mark",["domContent",a()+b.offset],null,"api")}function a(){return R.exists&&performance.now?Math.round(performance.now()):(s=Math.max((new Date).getTime(),s))-b.offset}var s=(new Date).getTime(),c=t("handle"),f=t(20),u=t("ee"),d=t(19),l=window,p=l.document,h="addEventListener",m="attachEvent",w=l.XMLHttpRequest,v=w&&w.prototype;NREUM.o={ST:setTimeout,SI:l.setImmediate,CT:clearTimeout,XHR:w,REQ:l.Request,EV:l.Event,PR:l.Promise,MO:l.MutationObserver};var g=""+location,y={beacon:"bam.nr-data.net",errorBeacon:"bam.nr-data.net",agent:"js-agent.newrelic.com/nr-1153.min.js"},x=w&&v&&v[h]&&!/CriOS/.test(navigator.userAgent),b=n.exports={offset:s,now:a,origin:g,features:{},xhrWrappable:x,userAgent:d};t(14),t(17),p[h]?(p[h]("DOMContentLoaded",i,!1),l[h]("load",r,!1)):(p[m]("onreadystatechange",o),l[m]("onload",r)),c("mark",["firstbyte",s],null,"api");var E=0,R=t(22)},{}],"wrap-function":[function(t,n,e){function r(t){return!(t&&t instanceof Function&&t.apply&&!t[a])}var o=t("ee"),i=t(21),a="nr@original",s=Object.prototype.hasOwnProperty,c=!1;n.exports=function(t,n){function e(t,n,e,o){function nrWrapper(){var r,a,s,c;try{a=this,r=i(arguments),s="function"==typeof e?e(r,a):e||{}}catch(f){l([f,"",[r,a,o],s])}u(n+"start",[r,a,o],s);try{return c=t.apply(a,r)}catch(d){throw u(n+"err",[r,a,d],s),d}finally{u(n+"end",[r,a,c],s)}}return r(t)?t:(n||(n=""),nrWrapper[a]=t,d(t,nrWrapper),nrWrapper)}function f(t,n,o,i){o||(o="");var a,s,c,f="-"===o.charAt(0);for(c=0;c<n.length;c++)s=n[c],a=t[s],r(a)||(t[s]=e(a,f?s+o:o,i,s))}function u(e,r,o){if(!c||n){var i=c;c=!0;try{t.emit(e,r,o,n)}catch(a){l([a,e,r,o])}c=i}}function d(t,n){if(Object.defineProperty&&Object.keys)try{var e=Object.keys(t);return e.forEach(function(e){Object.defineProperty(n,e,{get:function(){return t[e]},set:function(n){return t[e]=n,n}})}),n}catch(r){l([r])}for(var o in t)s.call(t,o)&&(n[o]=t[o]);return n}function l(n){try{t.emit("internal-error",n)}catch(e){}}return t||(t=o),e.inPlace=f,e.flag=a,e}},{}]},{},["loader",2,12,4,3]);</script>
    <!--<![endif]-->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title></title>

    <style type="text/css">
        @media screen and (max-width: 620px) {
            .two-column .column {
                max-width: 100% !important;
            }
            .two-column img {
                max-width: 100% !important;
            }
            .hide-border{
                border: none!important;
            }
            .show-border{
                border-bottom-width: 1px;
                border-bottom-color: #eaebed;
                border-bottom-style: solid;
            }
            .d-mob-none{
                display: none!important;
            }
        }


        body {
            margin: 0 !important;
            padding: 0;
            color: #484848;
        }
        table {
            border-spacing: 0;
            font-family: sans-serif, arial;
            color: #484848;
        }
        td {
            padding: 0;
            text-align: left;
        }
        img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;

            font-family: sans-serif;
            font-size: 22px;
            font-weight: bold;

            text-align: center;
        }
        div[style*="margin: 16px 0"] {
            margin:0 !important;
        }
        table { border-collapse: collapse !important; }
        p {
            margin: 0;
            font-size: 13px;
            line-height: 18px;
        }
        a {
            color: #006fc9;
            text-decoration: underline;
        }
        .title{
            font-size: 17px;
            line-height: 25px;
        }
        .h1 {
            font-size: 25px;
            line-height: 26px;
            font-weight: bold;
            margin-top: 10px;
        }
        .h2 {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 0px;
            margin-top: 10px;
        }
        .h2-flights{
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 0px;
            margin-top: 18px;
        }
        .h3{
            font-size: 18px;
            margin-bottom: 10px;
            margin-top: 0px;
        }
        .red{
            color: #e60b0b;
        }
        .green{
            color: #03a87c;
        }
        .grey{
            color: #626262;
        }
        .blue{
            color: #006fc9;
        }
        .orange{
            color: #FC571F;
        }
        .small{
            font-size: 12px;
        }

        .inner {
            padding: 10px;
        }

        .outer {
            margin: 0 auto;
            width: 100%;
            max-width: 600px;
        }

        .wrapper {
            width: 100%;
            table-layout: fixed;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        .webkit {
            max-width: 600px;
            padding: 0 10px;
            margin: 0 auto;
            background: #FFFFFF;
        }

        .two-column {

            font-size: 0;
        }
        .two-column .column {
            width: 100%;
            max-width: 300px;
            display: inline-block;
            vertical-align: top;
        }
        .two-column .text {
            padding-top: 10px;
        }

        .contents {
            width: 100%;
            font-size: 13px;
        }
        .small{
            font-size: 13px;
        }
        .text-right{
            text-align: right;
        }
        .with-border{
            border-bottom-width: 1px;
            border-bottom-color: #eaebed;
            border-bottom-style: solid;
        }
        .with-thin-border{
            border-bottom: 1px solid #eaebed;
            padding-bottom: 10px;
        }
        .with-thick-border{
            border-bottom: 2px solid #eaebed;
            padding-bottom: 20px;
        }
        .with-thicker-border{
            border-bottom: 5px solid #eaebed;
            padding-bottom: 10px;
        }
        .d-inline{
            display: inline-block;
        }
        .banner-wrapper{
            padding: 20px 10px 0 10px;
        }
        .footer-wrapper{
            padding: 30px 10px;
            font-size: 12px;
        }
        .alert-wrapper{
            background-color: #eaebed;
        }
        .alert-message{
            padding: 10px 10px 10px 0;
            word-break: normal;
        }
    </style>

    <!--[if (gte mso 9)|(IE)]>
    <style type="text/css">
        table {border-collapse: collapse !important;!important !important}
    </style>
    <![endif]-->

</head>


<body bgcolor="#eaebed" style="background-color:#eaebed;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;margin-top:0 !important;margin-bottom:0 !important;margin-right:0 !important;margin-left:0 !important;padding-top:10px;padding-bottom:10px;padding-right:0;padding-left:0;color:#484848;" >
    <center class="wrapper" style="table-layout:fixed;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;" >
        <div class="webkit" style="max-width:600px;padding-top:0;padding-bottom:0;padding-right:10px;padding-left:10px;margin-top:0;margin-bottom:0;margin-right:auto;margin-left:auto;background-color:#FFFFFF;background-image:none;background-repeat:repeat;background-position:top left;background-attachment:scroll;" >
            <!--[if (gte mso 9)|(IE)]>
            <table width="620" align="center" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse;background-color:#FFFFFF;" >
            <tr>
            <td style="padding-top:0;padding-bottom:0;padding-left:10px;padding-right:10px;text-align:left;" >
            <![endif]-->
            <table class="outer" align="center" cellpadding="0" cellspacing="0" border="0" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;margin-top:0;margin-bottom:0;margin-right:auto;margin-left:auto;width:100%;max-width:600px;" >
                <tr>
                    <td class="one-column with-border" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;text-align:left;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" width="100%" >
                        <table class="contents" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;width:100%;font-size:14px;">
                            <tr>

                                <td class="inner" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;font-size:14px;"  width="50%">
                                    @if(!empty($email))
                                    <a href="//{{$email_url}}/emails/confirmation/{{$emailData['bookingID']}}/{{$emailData['emailCode']}}" target="_blank" style="color:#2780c2;text-decoration:none;" >
                                    @lang('email.viewOnBrowser')
                                    </a>
                                    @endif
                                </td>
                                <td class="inner" align="right" style="text-align:right;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;font-size:14px;" width="50%">
                                    <span style="color:#2780c2;">{{ $emailData['bookingDateTime']->format($dateFormat) }} at {{ $emailData['bookingDateTime']->format($timeFormat) }}</span>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                {{-- <tr>
                    <td class="one-column" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;text-align:left;" >
                        <table class="contents" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;width:100%;font-size:14px;">
                            <tr>
                                <td class="inner contents" style="text-align:center;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;font-size:14px;" >
                                    <a href="https://www.redtag.ca" label="redtag.ca Logo" title="redtag.ca" style="color:#006fc9;text-decoration:underline;" >
                                        <img src="https://s3.amazonaws.com/redtag-ca/img/email/redtag-logo.png" width="155" border="0" alt="redtag.ca" style="border-width:0;height:auto;line-height:100%;outline-style:none;text-decoration:none;font-family:sans-serif;font-size:12px;font-weight:normal;text-align:center;" >
                                    </a>
                                    <p style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:14px;line-height:18px;" >A division of Red Label Vacations Inc.</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr> --}}
                <tr>
                    <td class="one-column" style="padding-top:10px;padding-right:0;padding-left:0;text-align:center;font-size:0;" >
                        <div class="column" style="width:100%;display:inline-block;vertical-align:top;" >
                            <table width="100%" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;" >
                                <td class="inner contents" style="text-align:center;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;font-size:14px;" >
                                    <a href="{{config('site.url')}}" lable="{{config('site.name')}}" title="copolo.com" style="color:#006fc9;text-decoration:underline;" >
                                        <img src="{{config('site.email_logo')}}" width="150" border="0" alt="copolo.com" style="border-width:0;height:auto;line-height:100%;outline-style:" >
                                    </a>
                                </td>
                            </table>
                        </div>
                        <div class="column" style="width:100%;max-width:198px;display:inline-block;vertical-align:top;" >
                            <table width="100%" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;" >
                                <tr>
                                    <td class="inner contents" style="text-align:center;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;font-size:14px;" >
                                        <p style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:14px;line-height:18px;" >@lang('confirmation.confirmationNumber') :<br><span style="color:#1790CC">{{ $emailData['bookingNumber'] }}</span></p>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td class="one-column with-thick-border" style="padding-top:0;padding-right:0;padding-left:0;text-align:left;border-bottom-width:2px;border-bottom-style:solid;border-bottom-color:#eaebed;padding-bottom:20px;" >
                        <table class="contents" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;width:100%;font-size:14px;">
                            <tr>
                                <td class="inner contents" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;font-size:14px;" >
                                    <center>
                                        <p class="title" style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:17px;line-height:25px;" >@lang('confirmation.thankYouHeader', ['site' => config('site.name')])</p>
                                        @if($emailData['isConfirmed'])
                                            <p class="title" style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:17px;line-height:25px;">
                                                @if(!$emailData['isStandalone'])
                                                    @lang('confirmation.vacationConfirmed')
                                                @else 
                                                    @if(isset($activity))
                                                        @lang('confirmation.activityConfirmed')
                                                    @else 
                                                        @lang('confirmation.hotelConfirmed')
                                                    @endif 
                                                @endif <span class="green" style="color:#03a87c;">@lang('common.confirmed')</span>.</p>
                                        @else
                                            <p class="title" style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:17px;line-height:25px;" >@lang('confirmation.pending')</p>
                                        @endif
                                         {{--
                                         <p class="title" style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:17px;line-height:25px;" >@lang('confirmation.vacationConfirmed') <span class="orange" style="color: #FC571F;">@lang('common.reserved')</p>
                                         --}}
                                    </center>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                @if($insurance) 
                    @if($emailData['hasInsurance'] && $emailData['insurance']['bookingNumber'] === 'Pending')
                        <tr>
                            <td class="one-column with-thick-border" style="padding-top:0;padding-right:0;padding-left:0;text-align:left;border-bottom-width:2px;border-bottom-style:solid;border-bottom-color:#eaebed;padding-bottom:20px;" >
                                <table width="100%" class="alert-wrapper" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;background-color:#eaebed;" >
                                    <tr>
                                        <td class="inner" style="text-align:left;padding-top:20px;padding-bottom:10px;padding-right:10px;padding-left:10px; vertical-align: top;" >
                                           <img src="https://s3.amazonaws.com/redtag-ca/img/email/icon-alert.png" width="" border="0" alt="" style="border-width:0;height:auto;line-height:100%;outline-style:none;text-decoration:none;font-family:sans-serif;font-size:12px;font-weight:normal;text-align:center;" >
                                        </td>
                                        <td class="inner" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;font-size:14px;" >
                                            <p class="alert-message" style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:14px;line-height:18px;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:0;" >
                                                @lang('confirmation.insuranceErrorWarningMessage', ['phone' => config('site.phone'), 'email' => config('site.email')])
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    @endif
                @endif

                @if(isset($emailData['payment']['deposit']))
                    <tr>
                        <td class="one-column with-thick-border" style="padding-top:0;padding-right:0;padding-left:0;text-align:left;border-bottom-width:2px;border-bottom-style:solid;border-bottom-color:#eaebed;padding-bottom:20px;" >
                            <table class="contents" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;width:100%;font-size:14px;">
                                <tr>
                                    <td class="inner contents" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;font-size:14px;" >
                                        <p class="h1 orange" style="margin-bottom:0;margin-right:0;margin-left:0;line-height:18px;font-size:22px;font-weight:bold;margin-top:10px;color: #FC571F;" >@lang('confirmation.refundableBalance')</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="inner contents" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;font-size:14px;" >
                                        <p style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:14px;line-height:18px;" >
                                            @lang('confirmation.refundableDeposit')
                                        </p>
                                        <p style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:14px;line-height:18px;" >
                                            @lang('confirmation.refundableDepositAmount'){{number_format($emailData['payment']['total'] - $emailData['payment']['deposit'], 2)}} @lang('confirmation.refundableDepositDate') {{$emailData['payment']['balanceDueDate']}}.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                @endif
                @if(!empty($emailData['refundablePath']))
                   <tr>
                        <td class="one-column with-thick-border" style="padding-top:0;padding-right:0;padding-left:0;text-align:left;border-bottom-width:2px;border-bottom-style:solid;border-bottom-color:#eaebed;padding-bottom:20px;" >
                            <table class="contents" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;width:100%;font-size:14px;">
                                <tr>
                                    <td width="120" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:120px;font-size:14px;">
                                        <img width="90" height="114" src="https://redtag-ca.s3.amazonaws.com/img/logos/logo-bwc.svg" alt="">
                                    </td>
                                    <td class="inner contents" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;font-size:14px;" >
                                        <p class="h1" style="margin-bottom:10px;margin-right:0;margin-left:0;line-height:18px;font-size:22px;font-weight:bold;margin-top:10px;color: #0d537a;" >@lang('common.bookConfidence')</p>
                                        <p style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:14px;line-height:18px;" >
                                            @lang('confirmation.refundableSummary')
                                        </p>
                                        <p style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:14px;line-height:18px;">@lang('confirmation.refundableTerms')</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                @endif
                <tr>
                    <td class="one-column with-thick-border" style="padding-top:0;padding-right:0;padding-left:0;text-align:left;border-bottom-width:2px;border-bottom-style:solid;border-bottom-color:#eaebed;padding-bottom:20px;" >
                        <table class="contents" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;width:100%;font-size:14px;">
                            <tr>
                                <td class="inner contents" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;font-size:14px;" >
                                    <p class="h1" style="margin-bottom:0;margin-right:0;margin-left:0;line-height:18px;font-size:22px;font-weight:bold;margin-top:10px;" >@lang('common.importantInformation')</p>
                                </td>
                            </tr>
                            <tr>
                                <td class="inner contents" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;font-size:14px;" >
                                    @if($isActivityStandalone)
                                        <p style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:14px;line-height:18px;" >
                                            @lang('confirmation.confirmationActivityMessage')
                                        </p>
                                        <br />
                                    @elseif(isset($emailData['refundablePath']) && !$emailData['refundablePath'])
                                        <p style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:14px;line-height:18px;" >
                                            @lang('confirmation.confirmationHotelMessage')
                                        </p>
                                        <br />
                                        @if(!empty($emailData['flight']))
                                            <p style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:14px;line-height:18px;" >
                                                @lang('confirmation.confirmationFlightMessage')
                                            </p>
                                            <br />
                                        @endif
                                    @endif
                                    <p style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:14px;line-height:18px;" >
                                        @lang("confirmation.confirmationPassport")
                                    </p>
                                    @if($isActivityStandalone)
                                        <p style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:14px;line-height:18px;" >
                                                @if(!empty($voucherLink))
                                                    <a href="{{$voucherLink}}" target="_blank" style="color:#2780c2;text-decoration:none;" >
                                                        @lang('email.viewVoucher')
                                                    </a>
                                                @else
                                                    <a href="http://{{$email_url}}/emails/activityVoucher/{{$emailData['bookingID']}}/{{$emailData['emailCode']}}" target="_blank" style="color:#2780c2;text-decoration:none;" >
                                                    @lang('email.viewVoucher')
                                                </a>
                                                @endif
                                             
                                        </p>
                                    @endif
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                @if(!empty($emailData['payment']['airmilesCard']))
                    <tr>
                        <td class="inner contents" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;font-size:14px;">
                            <p class="h2" style="margin-right:0;margin-left:0;line-height:18px;font-size:20px;font-weight:bold;margin-bottom:0px;margin-top:10px;">@lang('confirmation.dreamMilesSummary')</p>
                        </td>
                    </tr>
                    <tr>
                        <td class="one-column" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;text-align:left;">
                            <table class="contents" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;width:100%;font-size:14px;">
                                <tbody>
                                    <tr>
                                        <td class="inner with-border" style="font-size:14px;text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;">
                                            @lang('confirmation.airMilesCollectorNumber'):
                                        </td>
                                        <td class="inner with-border text-right" align="right" style="font-size:14px;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;text-align:right;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;">
                                            <b>{{preg_replace('/[0-9]{7}/', 'xxxxxxx', $emailData['payment']['airmilesCard'])}}</b>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="inner with-border" style="font-size:14px;text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;">
                                            @lang('confirmation.airMilesEarned'):
                                        </td>
                                        <td class="inner with-border text-right" align="right" style="font-size:14px;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;text-align:right;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;">
                                            <b>{{floor($emailData['payment']['subTotal'] / 20)}}</b>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                @endif

                @if(!empty($emailData['payment']['petro']))
                    <tr>
                        <td class="inner contents" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;font-size:14px;" >
                            <p class="h2" style="margin-right:0;margin-left:0;line-height:18px;font-size:20px;font-weight:bold;margin-bottom:0px;margin-top:10px;" >@lang('confirmation.petroPointSummary')</p>
                        </td>
                    </tr>
                    @php
                        $displayPetroRow = false;
                        if(!empty($emailData['payment']['petro']['petroAccountno'])) {
                            $displayPetroRow = true;
                            $number = $emailData['payment']['petro']['petroAccountno'];
                        }
                    @endphp

                    <tr>
                        <td class="one-column" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;text-align:left;">
                            <table class="contents" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;width:100%;font-size:14px;">
                                <tbody>
                                    @if($displayPetroRow)
                                    <tr>
                                        <td class="inner with-border" style="font-size:14px;text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                            @lang('confirmation.petroAccount')?>:
                                        </td>
                                        <td class="inner with-border text-right" align="right" style="font-size:14px;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;text-align:right;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                            <b>{{str_repeat('x', (strlen($number) - 4)) . substr($number, - 4)}}</b>
                                        </td>
                                    </tr>
                                    @endif
                                    <tr>
                                        <td class="inner with-border" style="font-size:14px;text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                            @lang('confirmation.regularPointsEarned'):
                                        </td>
                                        <td class="inner with-border text-right" align="right" style="font-size:14px;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;text-align:right;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                            <b>{{$emailData['payment']['petro']['base']}}</b>
                                        </td>
                                    </tr>
                                    @if(!empty($emailData['payment']['petro']['bonus']))
                                    <tr>
                                        <td class="inner with-border" style="font-size:14px;text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                            @lang('confirmation.bonusPointsEarned'):
                                        </td>
                                        <td class="inner with-border text-right" align="right" style="font-size:14px;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;text-align:right;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                            <b>{{$emailData['payment']['petro']['bonus']}}</b>
                                        </td>
                                    </tr>
                                    @endif
                                    @if($emailData['payment']['petro']['redeemDollarAmount'] > 0)
                                    <tr>
                                        <td class="inner" style="font-size:14px;text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;" >
                                            @lang('confirmation.petroPointsUsed'):
                                        </td>
                                        <td class="inner text-right" align="right" style="font-size:14px;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;text-align:right;" >
                                            <b>{{number_format($emailData['payment']['petro']['redeem'])}} </b> (C{{number_format($emailData['payment']['petro']['redeemDollarAmount'])}})
                                        </td>
                                    </tr>
                                    @endif
                                </tbody>
                            </table>
                        </td>
                    </tr>
                @endif
                <tr>
                    <td class="inner contents" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;font-size:14px;" >
                        <p class="h1" style="margin-bottom:0;margin-right:0;margin-left:0;line-height:18px;font-size:22px;font-weight:bold;margin-top:15px;" >@lang('confirmation.bookingSummary')</p>
                    </td>
                </tr>
                <tr>
                    <td class="two-column with-thick-border" style="padding-top:0;padding-right:0;padding-left:0;text-align:left;font-size:0;border-bottom-width:2px;border-bottom-style:solid;border-bottom-color:#eaebed;padding-bottom:20px;" >
                        <!--[if (gte mso 9)|(IE)]>
                        <table class="contents" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;width:100%;font-size:14px;">
                        <tr>
                        <td width="50%" valign="top" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;text-align:left;" >
                        <![endif]-->
                        <div class="column" style="width:100%;max-width:298px;display:inline-block;vertical-align:top;" >
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;" >
                                <tr>
                                    <td class="" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;text-align:left;" >
                                        <table class="contents" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;width:100%;font-size:14px;" >
                                            @if(!$emailData['isStandalone'])
                                            <tr>
                                                <td class="inner with-border" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid; width: 40%;font-size:14px;" >
                                                    @lang('common.departFrom'):
                                                </td>
                                                <td class="inner with-border text-right" align="right" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:0px;font-size:14px;text-align:right;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                                    <b>{{ $emailData['trip']['originCity'] }} ({{$emailData['trip']['originCode']}})</b>
                                                </td>
                                            </tr>
                                            @endif
                                           <tr>
                                                <td class="inner with-border" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;font-size:14px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid; width:30%;" >
                                                    @lang('common.destination'):
                                                </td>
                                                <td class="inner with-border text-right" align="right" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:0px;font-size:14px;text-align:right;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                                    <b>{{ $emailData['trip']['destinationCity'] }} ({{$emailData['trip']['destinationCode']}})</b>
                                                </td>
                                            </tr>
                                            {{-- <tr>
                                                <td class="inner show-border" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;font-size:14px;" >
                                                    Supplier:
                                                </td>
                                                <td class="inner show-border text-right" align="right" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:0px;text-align:right;font-size:14px;" >
                                                    <b>Westjet Vacations</b>
                                                </td>
                                            </tr> --}}
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <!--[if (gte mso 9)|(IE)]>
                        </td><td width="50%" valign="top" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;text-align:left;" >
                        <![endif]-->
                        <div class="column" style="width:100%;max-width:298px;display:inline-block;vertical-align:top;" >
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;" >
                                <tr>
                                    <td class="" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;text-align:left;" >
                                        <table class="contents" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;width:100%;font-size:14px;" >
                                            <tr>
                                                <td class="inner with-border" style="font-size:14px;text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                                    @lang('common.departureDate'):
                                                </td>
                                                <td class="inner with-border text-right" align="right" style="font-size:14px;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:0px;text-align:right;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                                    <b><span style="text-decoration:none;" >{{ $emailData['departDate']->format($dateFormat) }}</span></b>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="inner with-border " style="font-size:14px;text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                                    @lang('common.returnDate'):
                                                </td>
                                                <td class="inner with-border text-right" align="right" style="font-size:14px;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:0px;text-align:right;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                                    <b>{{ $emailData['returnDate']->format($dateFormat) }}</b>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="inner" style="font-size:14px;text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;" >
                                                    @lang('common.duration'):
                                                </td>
                                                <td class="inner text-right" align="right" style="font-size:14px;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:0px;text-align:right;" >
                                                    <b>{{ $emailData['trip']['duration'] }} @lang('common.nights')</b>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <!--[if (gte mso 9)|(IE)]>
                        </td>
                        </tr>
                        </table>
                        <![endif]-->
                        <br><br>
                    </td>
                </tr>
                <tr>
                    <td class="inner contents" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;font-size:14px;" >
                        <p class="h1" style="margin-bottom:0;margin-right:0;margin-left:0;line-height:18px;font-size:22px;font-weight:bold;margin-top:10px;" >@lang('common.passengerDetails')</p>
                    </td>
                </tr>
			    @foreach($emailData['passengers'] as $i => $passenger)
                    <tr>
                        <td class="two-column with-border" style="padding-top:0;padding-right:0;padding-left:0;text-align:left;font-size:0;border-bottom-width:1px;border-bottom-style:solid;border-bottom-color:#eaebed;padding-bottom:0px;" >
                            <!--[if (gte mso 9)|(IE)]>
                            <table class="contents" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;width:100%;font-size:14px;">
                            <tr>
                            <td width="50%" valign="top" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;text-align:left;" >
                            <![endif]-->
                            <div class="column" style="width:100%;max-width:298px;display:inline-block;vertical-align:top;" >
                                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;" >
                                        <tr>
                                            <td class="" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;text-align:left;" >
                                                <table class="contents" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;width:100%;font-size:14px;" >
                                                    <tr>
                                                         <td colspan="2" class="inner" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;" >
                                                            <table class="contents" cellpadding="0" cellspacing="0" border="0" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;font-size:14px;" >
                                                                <tr>
                                                                    <td class="" style="font-size:14px;text-align:left;padding-top:0px;padding-bottom:0px;padding-right:0px;padding-left:0px; width:30%;" >
                                                                        @lang('common.passenger') {{ $loop->index + 1 }}:
                                                                    </td>
                                                                    <td class="" style="font-size:14px;text-align:right;padding-top:0px;padding-bottom:0px;padding-right:0px;padding-left:0px;" >
                                                                        <b>{{ $passenger['name'] }}</b>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    @if($loop->index === 0)
                                                    <tr>
                                                         <td colspan="2" class="inner" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;" >
                                                            <table class="contents" cellpadding="0" cellspacing="0" border="0" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;font-size:14px;" >
                                                                <tr>
                                                                    <td class="" style="font-size:14px;text-align:left;padding-top:0px;padding-bottom:0px;padding-right:0px;padding-left:0px;" >
                                                                        @lang('common.phoneNumber'):
                                                                    </td>
                                                                    <td class="" style="font-size:14px;text-align:right;padding-top:0px;padding-bottom:0px;padding-right:0px;padding-left:0px;" >
                                                                       <b>{{$emailData['contact']['phoneNumber']}}</b>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    @endif
                                                </table>
                                            </td>
                                        </tr>
                                </table>
                            </div>

                            <!--[if (gte mso 9)|(IE)]>
                            </td><td width="50%" valign="top" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;text-align:left;" >
                            <![endif]-->
                            <div class="column" style="width:100%;max-width:298px;display:inline-block;vertical-align:top;" >
                                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;" >
                                    <tr>
                                        <td class="" style="font-size:14px;padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;text-align:left;" >
                                            <table class="contents" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;width:100%;font-size:14px;" >
                                                    <tr>
                                                        <td class="inner" style="font-size:14px;text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;" >
                                                            @lang('common.dateOfBirth'):
                                                        </td>
                                                        <td class="inner text-right" align="right" style="font-size:14px;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:0px;text-align:right;" >
                                                            <b>{{ $passenger['birthDate'] ?? 'n/a'}}</b>
                                                        </td>
                                                    </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    @if($loop->index === 0)
                                    <tr>
                                        <td class="" style="font-size:14px;padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;text-align:left;" >
                                            <table class="contents" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;width:100%;font-size:14px;" >
                                                    <tr>
                                                        <td class="inner" style="font-size:14px;text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;" >
                                                            @lang('common.emailAddress'):
                                                        </td>
                                                        <td class="inner text-right" align="right" style="font-size:14px;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:0px;text-align:right;" >
                                                            <b>{{ $emailData['contact']['email']}}</b>
                                                        </td>
                                                    </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    @endif
                                </table>
                            </div>
                            <!--[if (gte mso 9)|(IE)]>
                            </td>
                            </tr>
                            </table>
                            <![endif]-->

                        </td>
                    </tr>
                @endforeach

                @if(isset($hotel))
                    <tr>
                        <td class="inner contents" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;font-size:14px;" >
                            <p class="h1" style="margin-bottom:0;margin-right:0;margin-left:0;line-height:18px;font-size:22px;font-weight:bold;margin-top:15px;" >@lang('common.hotelDetails')</p>
                            <p class="h2-flights" style="margin-right:0;margin-left:0;line-height:18px;font-size:15px;margin-bottom:0px;margin-top:18px;font-weight:bold;" >@lang('confirmation.confirmationNumber'): <span style="color:#1790CC;">{{$emailData['hotel']['bookingNumber']}}</span></p>
                        </td>
                    </tr>


                    <tr>
                        <td class="one-column" style="padding-top:0;padding-right:0;padding-left:0;text-align:left;" >
                            <table class="contents" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;width:100%;font-size:14px;" >
                                <tr>
                                    <td colspan="2" class="inner with-border" style="font-size:14px;text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                        <b>{{ $emailData['hotel']['name'] }}</b><br>
                                            <img src="http://res-stg.itravel2000.com/dev_react/assets/global/img/icons/stars/{{ $emailData['hotel']['rating'] }}.png" width="" border="0" alt="" style="border-width:0;height:auto;line-height:100%;outline-style:none;text-decoration:none;font-family:sans-serif;font-size:12px;font-weight:normal;text-align:center; margin-top: 10px;" >
                                    </td>
                                </tr>
                                <tr>
                                    <td class="inner with-border" style="font-size:14px;text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                        @lang('common.roomType'):
                                    </td>
                                    <td class="inner with-border text-right" align="right" style="font-size:14px;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;text-align:right;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                        <b>{{ $emailData['hotel']['roomType'] }}</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2" class="inner with-border" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                        <table class="contents" cellpadding="0" cellspacing="0" border="0" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;font-size:14px;" >
                                            <tr>
                                                <td class="" style="font-size:14px;text-align:left;padding-top:0px;padding-bottom:0px;padding-right:0px;padding-left:0px;" >
                                                    @lang('common.numberOfRooms'):
                                                </td>
                                                <td class="" style="font-size:14px;text-align:right;padding-top:0px;padding-bottom:0px;padding-right:0px;padding-left:0px;" >
                                                    <b>{{ $emailData['hotel']['numOfRooms'] }}</b>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                @if(!empty($hotel['bedType']))
                                    <tr>
                                        <td class="inner with-border" style="font-size:14px;text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                            Bed Type:
                                        </td>
                                        <td class="inner with-border text-right" align="right" style="font-size:14px;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;text-align:right;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                            <b>{{ $hotel['bedType']['title'] }}</b>
                                        </td>
                                    </tr>
                                @endif
                                <tr>
                                    <td colspan="2" class="inner with-border" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                        <table class="contents" cellpadding="0" cellspacing="0" border="0" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;font-size:14px;" >
                                            <tr>
                                                <td class="" style="font-size:14px;text-align:left;padding-top:0px;padding-bottom:0px;padding-right:0px;padding-left:0px;" >
                                                    @lang('common.checkInDate'):
                                                </td>
                                                <td class="" style="font-size:14px;text-align:right;padding-top:0px;padding-bottom:0px;padding-right:0px;padding-left:0px;" >
                                                    <b>{{ $emailData['hotel']['checkIn'] }}</b>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2" class="inner with-border" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                        <table class="contents" cellpadding="0" cellspacing="0" border="0" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;font-size:14px;" >
                                            <tr>
                                                <td class="" style="font-size:14px;text-align:left;padding-top:0px;padding-bottom:0px;padding-right:0px;padding-left:0px;" >
                                                    @lang('common.checkOutDate'):
                                                </td>
                                                <td class="" style="font-size:14px;text-align:right;padding-top:0px;padding-bottom:0px;padding-right:0px;padding-left:0px;" >
                                                    <b>{{ $emailData['hotel']['checkOut'] }}</b>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td class="one-column with-thick-border" style="padding-top:0;padding-right:0;padding-left:0;text-align:left;border-bottom-width:2px;border-bottom-style:solid;border-bottom-color:#eaebed;padding-bottom:20px;" >
                            <table class="contents" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;width:100%;font-size:14px;" >
                                <tr>
                                    <td class="inner" align="center" style="font-size:14px;text-align:center;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;overflow:hidden;" >
                                        <img width="580" src="{{ $emailData['hotel']['image'] }}" width="100%" border="0" alt="hotel image" style="border-width:0;height:auto; width:100%;" />
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                @endif
                @if(isset($activity))
                    <tr>
                        <td class="inner contents" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;font-size:14px;" >
                            <p class="h1" style="margin-bottom:0;margin-right:0;margin-left:0;line-height:18px;font-size:22px;font-weight:bold;margin-top:15px;" >Activity Details</p>
                            <p class="h2-flights" style="margin-right:0;margin-left:0;line-height:18px;font-size:15px;margin-bottom:0px;margin-top:18px;font-weight:bold;" >@lang('confirmation.confirmationNumber'): <span style="color:#1790CC;">{{$activity['bookingNumber']}}</span></p>
                        </td>
                    </tr>
                    @foreach($activity['tripInfo'] as $tripInfo)
                    <tr>
                        <td class="one-column with-thick-border" style="padding-top:0;padding-right:0;padding-left:0;text-align:left;border-bottom-width:2px;border-bottom-style:solid;border-bottom-color:#eaebed;padding-bottom:20px;" >
                            <table class="contents" style="border-spacing:0;font-family:sans-serif, arial;color:#484848;border-collapse:collapse !important;width:100%;font-size:13px;" >
                                <tr>
                                    <td colspan="2" class="inner with-border" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                        <b>Suppier: {{$tripInfo['supplier']}}</b><br>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2" class="inner with-border" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                        <b>{{$tripInfo['name']}}</b><br>
                                    </td>
                                </tr>

                                <tr>
                                    <td class="inner with-border" width="30%" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                        From: {{$tripInfo['selectDate']['from']}}
                                    </td>
                                    <td class="inner with-border text-right" width="70%" align="right" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;text-align:right;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                        To: {{$tripInfo['selectDate']['to']}}</b>
                                    </td>
                                </tr>
                                 @if(!empty($tripInfo['comments']))
                                  <tr>
                                      <td class="inner with-border" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                        Comments:
                                      </td>
                                       <td class="inner with-border text-left" align="left" style=" text-align: justify; padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                            {{$tripInfo['comments']['text']}}
                                        </td>
                                  </tr>   
                                    @endif
                                    
                                    @if(!empty($tripInfo['cancellationPolicies']))
                                    <tr>  
                                    <td class="inner with-border" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                        Cancellation Fees:&nbsp;
                                      </td>
                                       <td class="inner with-border text-left" align="left" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;text-align:right;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                           @foreach($tripInfo['cancellationPolicies'] as $pl)
                                              @if(is_array($pl) && !empty($pl['dateFrom']))
                                                @php
                                                    $cancelDate =  new \DateTime($pl['dateFrom']);
                                                    $cancelFreeDate=  (new \DateTime($pl['dateFrom']))->modify('-1 minutes');
                                                @endphp
                                                <p><span class="time">Until {{$cancelFreeDate->format('Y-m-d')." ".$cancelFreeDate->format('h:i A')  }}  </span><span class="amount">Free</span> </p>
                                                <p>&nbsp;&nbsp;<span class="time">From {{$cancelDate->format('Y-m-d')." ".$cancelDate->format('h:i A')}}  </span><span class="amount">${{$pl['amount']}}</span> </p>
                                              @endif
                                             @endforeach
                                        </td>
                                    </tr>     
                                    @endif
                            </table>                            
                        </td>
                    </tr>
                    @endforeach
                @endif
                
                @if(!$emailData['isStandalone'])
                    <tr>
                        <td class="inner contents" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;font-size:14px;" >
                            <p class="h1" style="margin-bottom:0;margin-right:0;margin-left:0;line-height:18px;font-size:22px;font-weight:bold;margin-top:15px;" >@lang('common.flightDetails')</p>
                            <p class="h2-flights" style="margin-right:0;margin-left:0;line-height:18px;font-size:15px;margin-bottom:0px;margin-top:18px;font-weight:bold;" >@lang('confirmation.confirmationNumber'): <span style="color:#1790CC;">{{$emailData['flight']['bookingNumber']}}</span></p>
                            <p class="h2-flights" style="margin-right:0;margin-left:0;line-height:18px;font-size:18px;margin-bottom:0px;margin-top:18px;font-weight:bold;" >@lang('common.departure')</p>
                        </td>
                    </tr>
                    <tr>
                        <td class="inner contents" style="text-align:left;padding-top:0px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;" >
                            <p style="margin-right:0;margin-left:0;line-height:18px;font-size:17px;margin-bottom:10px;margin-top:0px;" >{{ $emailData['flight']['itineraries'][0]['segments'][0]['depDate'] }}</p>
                        </td>
                    </tr>
                    @foreach($emailData['flight']['itineraries'][0]['segments'] as $segment)
                        <tr>
                            <td class="inner" style="text-align:left;padding-top:0px;padding-bottom:0px;padding-right:10px;padding-left:10px;" >
                                <table class="contents" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;width:100%;">
                                    <tr>
                                        <td class="" style="text-align:left;padding-top:0px;padding-bottom:0px;padding-right:0px;padding-left:0px;width:20%;" >
                                            <img src="https://travel-img-assets.s3-us-west-2.amazonaws.com/flights/carrier-48x48/{{ strtolower($segment['carrierCode']) }}.png" border="0" alt="airline logo" style="border-width:0;height:auto;line-height:100%;outline-style:none;text-decoration:none;font-family:sans-serif;font-size:12px;font-weight:normal;text-align:center;" >
                                        </td>
                                        <td class="" style="font-size:14px;text-align:left;padding-top:0px;padding-bottom:0px;padding-right:0px;padding-left:0px;" >
                                            <p class="d-inline" style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:12px;color:#7d7d7d;padding-left:10px;display:inline-block;" >
                                                <br> @lang('common.flight') #{{ $segment['flightNumber'] }}
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td class="one-column" style="padding-top:0;padding-right:0;padding-left:0;text-align:left;" >
                                <table class="contents" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;width:100%;font-size:14px;">
                                    <tr>
                                        <td class="inner contents" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;font-size:14px;" >
                                            <table class="contents" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;width:100%;font-size:14px;">
                                                <tr>
                                                    <td width="45%" class="" style="font-size:14px;text-align:left;padding-top:0px;padding-bottom:0px;padding-right:0px;padding-left:0px;width:45%;">
                                                        <p style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:14px;line-height:21px; color:#2e2e2e;font-weight: bold">{{ $segment['depTime'] }}</p>
                                                        <p style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:14px;line-height:21px; color:#202020;"><b>{{ $segment['departureCode'] }}</b> {{ $segment['departureCity'] }}</p>
                                                        <p style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:14px;line-height:21px; color:#686868;">{{ $segment['depDate'] }}</p>
                                                    </td>
                                                    <td class="" style="font-size:14px;text-align:left;padding-top:0px;padding-bottom:0px;padding-right:0px;padding-left:0px;" >
                                                        <p style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:14px;line-height:21px; color:#2e2e2e; font-weight: bold">{{ $segment['arrTime'] }}</p>
                                                        <p style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:14px;line-height:21px; color:#202020;"><b>{{ $segment['destinationCode'] }}</b> {{ $segment['destinationCity'] }}</p>
                                                        <p style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:14px;line-height:21px; color:#686868;">{{ $segment['arrDate'] }}</p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    @endforeach
                    <tr>
                        <td class="inner contents" style="text-align:left;padding-top:0px;padding-bottom:0px;padding-right:10px;padding-left:10px;width:100%;border-bottom-width:1px;border-bottom-style:solid;border-bottom-color:#eaebed;" >
                            &nbsp;
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" class="inner" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;" >
                            <p class="h2-flights" style="margin-right:0;margin-left:0;line-height:18px;font-size:18px;margin-bottom:0px;margin-top:10px;font-weight:bold;">@lang('common.return')</p>
                        </td>
                    </tr>
                    <tr>
                        <td class="inner contents" style="text-align:left;padding-top:0px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;" >
                            <p style="margin-right:0;margin-left:0;line-height:18px;font-size:17px;margin-bottom:10px;margin-top:0px;" >{{ $emailData['flight']['itineraries'][1]['segments'][0]['depDate'] }}</p>
                        </td>
                    </tr>
                    @foreach($emailData['flight']['itineraries'][1]['segments'] as $segment)
                        <tr>
                            <td class="inner" style="text-align:left;padding-top:0px;padding-bottom:0px;padding-right:10px;padding-left:10px;" >
                                <table class="contents" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;width:100%;">
                                    <tr>
                                        <td class="" style="text-align:left;padding-top:0px;padding-bottom:0px;padding-right:0px;padding-left:0px;width:20%;" >
                                            <img src="https://travel-img-assets.s3-us-west-2.amazonaws.com/flights/carrier-48x48/{{ strtolower($segment['carrierCode']) }}.png" border="0" alt="airline logo" style="border-width:0;height:auto;line-height:100%;outline-style:none;text-decoration:none;font-family:sans-serif;font-size:12px;font-weight:normal;text-align:center;" >
                                        </td>
                                        <td class="" style="font-size:14px;text-align:left;padding-top:0px;padding-bottom:0px;padding-right:0px;padding-left:0px;" >
                                            <p class="d-inline" style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:12px;color:#7d7d7d;padding-left:10px;display:inline-block;" >
                                                <br> @lang('common.flight') #{{ $segment['flightNumber'] }}
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td class="one-column" style="padding-top:0;padding-right:0;padding-left:0;text-align:left;" >
                                <table class="contents" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;width:100%;font-size:14px;">
                                    <tr>
                                        <td class="inner contents" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;font-size:14px;" >
                                            <table class="contents" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;width:100%;font-size:14px;">
                                                <tr>
                                                    <td width="45%" class="" style="font-size:14px;text-align:left;padding-top:0px;padding-bottom:0px;padding-right:0px;padding-left:0px;width:45%;">
                                                        <p style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:14px;line-height:21px; color:#2e2e2e;font-weight: bold">{{ $segment['depTime'] }}</p>
                                                        <p style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:14px;line-height:21px; color:#202020;"><b>{{ $segment['departureCode'] }}</b> {{ $segment['departureCity'] }}</p>
                                                        <p style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:14px;line-height:21px; color:#686868;">{{ $segment['depDate'] }}</p>
                                                    </td>
                                                    <td class="" style="font-size:14px;text-align:left;padding-top:0px;padding-bottom:0px;padding-right:0px;padding-left:0px;" >
                                                        <p style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:14px;line-height:21px; color:#2e2e2e; font-weight: bold">{{ $segment['arrTime'] }}</p>
                                                        <p style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:14px;line-height:21px; color:#202020;"><b>{{ $segment['destinationCode'] }}</b> {{ $segment['destinationCity'] }}</p>
                                                        <p style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:14px;line-height:21px; color:#686868;">{{ $segment['arrDate'] }}</p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    @endforeach
                    <tr>
                        <td class="inner contents" style="text-align:left;padding-top:0px;padding-bottom:0px;padding-right:10px;padding-left:10px;width:100%;border-bottom-width:2px;border-bottom-style:solid;border-bottom-color:#eaebed;" >
                            &nbsp;
                        </td>
                    </tr>
                    <tr>
                        <td class="one-column" style="padding-top:0;padding-right:0;padding-left:0;text-align:left;" >
                            <table class="contents" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;width:100%;font-size:14px;">
                                <tr>
                                    <td class="inner contents" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;font-size:14px;" >
                                        <p class="h1" style="margin-bottom:0;margin-right:0;margin-left:0;line-height:18px;font-size:22px;font-weight:bold;margin-top:10px;" >@lang('confirmation.travelRestrictions')</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="inner contents" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;font-size:14px;" >
                                        @lang('confirmation.travelRestrictionsText')
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    @if(!empty($transfer))
                        <tr>
                            <td class="inner contents" style="text-align:left;padding-top:0px;padding-bottom:0px;padding-right:10px;padding-left:10px;width:100%;border-bottom-width:2px;border-bottom-style:solid;border-bottom-color:#eaebed;" >
                                &nbsp;
                            </td>
                        </tr>

                        <tr>
                            <td class="inner contents" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;font-size:14px;" >
                                <p class="h1" style="margin-bottom:0;margin-right:0;margin-left:0;line-height:18px;font-size:22px;font-weight:bold;margin-top:15px;" >Transportation Details</p>
                                @if(!empty($tripInfo['supplier']))
                                <p style="margin-right:0;margin-left:0;line-height:18px;font-size:15px;margin-bottom:0px;margin-top:0px;" >Supplier: <span style="color:#1790CC;">{{$tripInfo['supplier']}}</span></p>
                                @endif
                                <p class="h2-flights" style="margin-right:0;margin-left:0;line-height:18px;font-size:15px;margin-bottom:0px;margin-top:18px;font-weight:bold;" >@lang('confirmation.confirmationNumber'): <span style="color:#1790CC;">{{$transfer['bookingNumber']}}</span></p>
                            </td>
                        </tr>
                        @if(isset($transfer['tripInfo']))
                            @foreach($transfer['tripInfo'] as $tripInfo)
                                <tr>
                                    <td class="one-column with-thick-border" style="padding-top:0;padding-right:0;padding-left:0;text-align:left;border-bottom-width:2px;border-bottom-style:solid;border-bottom-color:#eaebed;padding-bottom:20px;" >
                                        <table class="contents" style="border-spacing:0;font-family:sans-serif, arial;color:#484848;border-collapse:collapse !important;width:100%;font-size:13px;" >
                                            <tr>
                                                <td colspan="2" class="inner with-border" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                                    <b>From Ariport to Hotel</b><br>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colspan="2" class="inner with-border" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                                    <b>{{$tripInfo['serviceName']}}</b><br>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="inner with-border" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                                    Pick up location:
                                                </td>
                                                <td class="inner with-border text-right" align="right" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;text-align:right;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                                    <b>{{$tripInfo['pickupInformation']['arr']['from']['description'] }}</b>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="inner with-border" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                                    Pick up date
                                                </td>
                                                <td class="inner with-border text-right" align="right" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;text-align:right;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                                    <b>{{$tripInfo['pickupInformation']['arr']['formatTime']}}</b>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="inner with-border" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                                    Drop off location
                                                </td>
                                                <td class="inner with-border text-right" align="right" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;text-align:right;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                                    <b>{{$tripInfo['pickupInformation']['arr']['to']['description'] }}</b>
                                                </td>
                                            </tr>

                                        </table>
                                    </td>
                                </tr>
                                @if(isset($transfer['holder']))
                                    <tr>
                                       <td class="one-column with-thick-border" style="padding-top:0;padding-right:0;padding-left:0;text-align:left;border-bottom-width:2px;border-bottom-style:solid;border-bottom-color:#eaebed;padding-bottom:20px;" >
                                           <table class="contents" style="border-spacing:0;font-family:sans-serif, arial;color:#484848;border-collapse:collapse !important;width:100%;font-size:13px;" >
                                               <tr>
                                                   <td colspan="2" class="inner with-border" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                                       <b>From Hotel  to Airport</b><br>
                                                   </td>
                                               </tr>
                                               <tr>
                                                   <td colspan="2" class="inner with-border" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                                       <b>{{$tripInfo['serviceName']}}</b><br>
                                                   </td>
                                               </tr>
                                               <tr>
                                                   <td class="inner with-border" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                                       Pick up location:
                                                   </td>
                                                   <td class="inner with-border text-right" align="right" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;text-align:right;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                                       <b>{{$tripInfo['pickupInformation']['dep']['from']['description'] }}</b>
                                                   </td>
                                               </tr>
                                               <tr>
                                                   <td class="inner with-border" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                                       Pick up date
                                                   </td>
                                                   <td class="inner with-border text-right" align="right" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;text-align:right;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                                       <b>{{$tripInfo['pickupInformation']['dep']['formatTime']}}</b>
                                                   </td>
                                               </tr>
                                               <tr>
                                                   <td class="inner with-border" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                                       Drop off location
                                                   </td>
                                                   <td class="inner with-border text-right" align="right" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;text-align:right;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                                       <b>{{$tripInfo['pickupInformation']['dep']['to']['description'] }}</b>
                                                   </td>
                                               </tr>
                                           </table>
                                       </td>
                                   </tr>
                                @endif
                            @endforeach
                        @endif
                    @endif
                    <tr>
                        <td class="inner contents" style="text-align:left;padding-top:0px;padding-bottom:0px;padding-right:10px;padding-left:10px;width:100%;border-bottom-width:2px;border-bottom-style:solid;border-bottom-color:#eaebed;" >
                            &nbsp;
                        </td>
                    </tr>
                    @if(isset($emailData['car']))
                        <tr>
                            <td class="inner contents" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;font-size:14px;" >
                                <p class="h1" style="margin-bottom:0;margin-right:0;margin-left:0;line-height:18px;font-size:22px;font-weight:bold;margin-top:15px;" >@lang('common.carDetails')</p>
                                <p class="h2-flights" style="margin-right:0;margin-left:0;line-height:18px;font-size:15px;margin-bottom:0px;margin-top:18px;font-weight:bold;" >@lang('confirmation.confirmationNumber'): <span style="color:#1790CC;">{{$emailData['car']['bookingNumber']}}</span></p>
                                <p style="margin-right:0;margin-left:0;line-height:18px;font-size:15px;margin-bottom:0px;margin-top:0px;" >@lang('confirmation.referenceNumber'): <span style="color:#1790CC;">{{$emailData['car']['referenceNumber']}}</span></p>
                            </td>
                        </tr>
                        <tr>
                            <td class="one-column with-thick-border" style="padding-top:0;padding-right:0;padding-left:0;text-align:left;border-bottom-width:2px;border-bottom-style:solid;border-bottom-color:#eaebed;padding-bottom:20px;">
                                <table class="contents" style="border-spacing:0;font-family:sans-serif, arial;color:#484848;border-collapse:collapse !important;width:100%;font-size:13px;">
                                    <tbody><tr>
                                        <td lass="inner with-border" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;">
                                            <b>{{$emailData['car']['name']}} or similar (Standard)</b><br>
                                        </td>
                                        <td class="inner with-border text-right" align="right" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;text-align:right;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;">
                                            <img src="https://travel-img-assets.s3-us-west-2.amazonaws.com/cars/vendors/{{strtolower($emailData['car']['vendor'])}}.jpg" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="inner with-border" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;">
                                            Pick Up
                                        </td>
                                        <td class="inner with-border text-right" align="right" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;text-align:right;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;">
                                            <b>{{$emailData['car']['pickup']['name']}} - {{$emailData['car']['pickup']['address']}}</b>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="inner" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;">
                                            Drop Off
                                        </td>
                                        <td class="inner text-right" align="right" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;text-align:right;">
                                            <b>{{$emailData['car']['dropoff']['name']}} - {{$emailData['car']['dropoff']['address']}}</b>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="inner with-border" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;">
                                            Pick up date
                                        </td>
                                        <td class="inner with-border text-right" align="right" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;text-align:right;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;">
                                            <b>{{$emailData['car']['pickupDateTime']}}</b>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="inner with-border" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;">
                                            Drop off date
                                        </td>
                                        <td class="inner with-border text-right" align="right" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;text-align:right;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;">
                                            <b>{{$emailData['car']['dropoffDateTime']}}</b>
                                        </td>
                                    </tr>
                                </tbody></table>
                            </td>
                        </tr>
                    @endif
                    @if($insurance)
                        <tr>
                            <td class="one-column" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;text-align:left;" >
                                <table class="contents" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;width:100%;font-size:14px;">
                                    <tbody>
                                        <tr>
                                            <td class="inner" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;font-size:14px;" >
                                                <p class="h1" style="margin-bottom:0;margin-right:0;margin-left:0;line-height:18px;font-size:22px;font-weight:bold;margin-top:15px;" >@lang('common.travelInsuranceDetails')</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="inner" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;font-size:14px;" >
                                                <p style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:14px;line-height:18px;">
                                                    <b>@lang('common.manulifePolicy') #
                                                    @if ($emailData['hasInsurance'])
                                                        @if($emailData['insurance']['bookingNumber'] === 'Pending')<span style="color:#FC571F;">@endif
                                                        {{ $emailData['insurance']['bookingNumber'] }}
                                                        @if($emailData['insurance']['bookingNumber'] === 'Pending')</span>@endif
                                                    @else
                                                        <span style="color:#1790CC;">@lang('common.declined')</span>
                                                    @endif
                                                    </b>
                                                </p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td class="one-column with-thick-border" style="padding-top:0;padding-right:0;padding-left:0;text-align:left;border-bottom-width:2px;border-bottom-style:solid;border-bottom-color:#eaebed;padding-bottom:20px;" >
                                <table width="100%" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;" >
                                    <tr>
                                        <td class="inner" style="text-align:left;vertical-align: middle;" >
                                           <img src="https://s3.amazonaws.com/redtag-ca/img/email/icon-alert.png" width="" border="0" alt="" style="border-width:0;height:auto;line-height:100%;outline-style:none;" >
                                        </td>
                                        <td class="inner" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;font-size:14px;" >
                                            <p class="" style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;line-height:18px;color:#1790CC;font-size:14px;" >
                                                @if($emailData['hasInsurance'])
                                                    @if($emailData['insurance']['bookingNumber'] !== 'Pending')
                                                        @lang('confirmation.insuranceMessage')
                                                    @else
                                                        @lang('confirmation.insuranceErrorMessage', ['phone' =>config('site.phone'), "email" => config('site.email')])
                                                    @endif
                                                @else
                                                    @lang('confirmation.insuranceDeclinedMessage', ['phone' =>config('site.phone'), "email" => config('site.email')])
                                                @endif
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    @endif
                @else
                    <tr>
                        <td class="one-column" style="padding-top:0;padding-right:0;padding-left:0;text-align:left;" >
                            <table class="contents" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;width:100%;font-size:14px;">
                                <tr>
                                    <td class="inner contents" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;font-size:14px;" >
                                        <p class="h1" style="margin-bottom:0;margin-right:0;margin-left:0;line-height:18px;font-size:22px;font-weight:bold;margin-top:10px;" >@lang('confirmation.travelRestrictions')</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="inner contents" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;font-size:14px;" >
                                        @lang('confirmation.travelRestrictionsText')
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td class="inner contents" style="text-align:left;padding-top:0px;padding-bottom:0px;padding-right:10px;padding-left:10px;width:100%;border-bottom-width:2px;border-bottom-style:solid;border-bottom-color:#eaebed;" >
                            &nbsp;
                        </td>
                    </tr>
                @endif
                @if(isset($emailData['choose']))
                    <tr>
                        <td class="inner contents" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;font-size:14px;" >
                            <p class="h1" style="margin-bottom:0;margin-right:0;margin-left:0;line-height:18px;font-size:22px;font-weight:bold;margin-top:15px;" >Choose Carbon Footprint</p>
                            <p class="h2-flights" style="margin-right:0;margin-left:0;line-height:18px;font-size:15px;margin-bottom:0px;margin-top:18px;font-weight:bold;" >@lang('confirmation.confirmationNumber'): <span style="color:#1790CC;">{{$emailData['choose']['choose']['billId']}}</span></p>
                            <p style="margin-right:0;margin-left:0;line-height:18px;font-size:15px;margin-bottom:0px;margin-top:0px;" >Order Number: <span style="color:#1790CC;">{{$emailData['choose']['choose']['orderId']}}</span></p>
                        </td>
                    </tr>
                    <tr>
                        <td class="one-column with-thick-border" style="padding-top:0;padding-right:0;padding-left:0;text-align:left;padding-bottom:20px;">
                            <table class="contents" style="border-spacing:0;font-family:sans-serif, arial;color:#484848;border-collapse:collapse !important;width:100%;font-size:13px;">
                                <tbody>
                                    <tr>
                                        <td class="inner" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;border-bottom-width:1px;">
                                            Carbon compensation (CO2e):
                                        </td>
                                        <td class="inner text-right" align="right" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;text-align:right;">
                                            <b>{{$emailData['choose']['item']['kilosCo2']}} kg</b>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                @endif
                <tr>
                    <td class="inner contents" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;font-size:14px;" >
                        <p class="h1" style="margin-bottom:0;margin-right:0;margin-left:0;line-height:18px;font-size:22px;font-weight:bold;margin-top:15px;" >@lang('confirmation.paymentSummary')</p>
                    </td>
                </tr>

                @if(!$emailData['isStandalone'])
                    <tr>
                        <td class="inner contents" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;font-size:14px;" >
                            <p class="h2" style="margin-top:5px;margin-right:0;margin-left:0;line-height:18px;font-size:18px;font-weight:bold;margin-bottom:0px;" >@lang(!empty($transfer)?'common.hotelFlightTransfer':'common.hotelFlight')</p>
                        </td>
                    </tr>
                    <tr>
                        <td class="one-column" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;text-align:left;" >
                            <table class="contents" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;width:100%;font-size:14px;">
                                <tbody>

                                    <tr>
                                        <td class="inner with-border" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;font-size:14px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                            {{ $emailData['passengerCount'] }} @lang('common.passengers') x ${{ number_format($emailData['payment']['basePer'], 2) }}:
                                        </td>
                                        <td class="inner with-border text-right" align="right" width="30%" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;font-size:14px;text-align:right;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;width:30%" >
                                            <b>${{ number_format($emailData['payment']['subTotal'], 2) }}</b>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="inner with-border" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;font-size:14px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                            {{ $emailData['passengerCount'] }} @lang('common.passengersTaxesFees') x ${{ number_format($emailData['payment']['taxesPer'], 2) }}:
                                        </td>
                                        <td class="inner with-border text-right" align="right" width="30%" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;font-size:14px;text-align:right;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;width:30%" >
                                            <b>${{ number_format($emailData['payment']['taxes'], 2) }}</b>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="inner" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;font-size:14px;" >
                                            @lang(!empty($transfer)?'common.hotelFlightTransfer':'common.hotelFlight') @lang('common.total') ({{$emailData['payment']['currency'] ?? 'CAD'}})
                                        </td>
                                        <td class="inner text-right" align="right" width="30%" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;font-size:14px;text-align:right;width:30%;" >
                                            <b>${{ number_format($emailData['payment']['total'], 2) }}</b>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    @if(!empty($hotel['extraFees']))
                        <tr>
                            <td class="one-column with-thick-border" style="padding-top:0;padding-right:0;padding-left:0;text-align:left;border-bottom-width:2px;border-bottom-style:solid;border-bottom-color:#eaebed;padding-bottom:20px;" >
                                <table width="100%" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;" >
                                    <tbody>
                                        <tr>
                                            <td class="inner" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;font-size:14px;" >
                                                <span class="blue" style="color:#1790CC;" >Extra fees to be paid at Hotel:</span>
                                            </td>
                                            <td class="inner text-right" align="right" width="30%" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;font-size:14px;text-align:right;width:30%;" >
                                                 <span class="blue" style="color:#1790CC;" ><b>{{number_format($hotel['extraFees'], 2)}}</b></span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    @endif
                    @if(!empty($emailData['coupon']))
                        <tr>
                            <td class="one-column with-thick-border" style="padding-top:0;padding-right:0;padding-left:0;text-align:left;border-bottom-width:2px;border-bottom-style:solid;border-bottom-color:#eaebed;padding-bottom:20px;" >
                                <table width="100%" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;" >
                                    <tbody>
                                        <tr>
                                            <td class="inner with-thicker-border" style="text-align:left;padding-top:10px;padding-right:10px;padding-left:10px;font-size:14px;border-bottom-width:5px;border-bottom-style:solid;border-bottom-color:#eaebed;padding-bottom:10px;" >
                                                Coupon({{$emailData['coupon']['code']}}):
                                            </td>
                                            <td class="inner with-thicker-border text-right" align="right" width="30%" style="padding-top:10px;padding-right:10px;padding-left:10px;font-size:14px;text-align:right;border-bottom-width:5px;border-bottom-style:solid;border-bottom-color:#eaebed;padding-bottom:10px;width:30%;" >
                                                <b>-${{number_format($emailData['coupon']['value'], 2)}}</b>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="inner" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;font-size:14px;" >
                                                <span class="blue" style="color:#1790CC;" >Total Amount After Coupon:</span>
                                            </td>
                                            <td class="inner text-right" align="right" width="30%" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;font-size:14px;text-align:right;width:30%;" >
                                                 <span class="blue" style="color:#1790CC;" ><b>{{number_format(max($emailData['payment']['total'] - $emailData['coupon']['value'], 0), 2)}}</b></span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    @endif
                    @if($insurance)
                        <tr>
                            <td class="inner contents" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;font-size:14px;" >
                                <p class="h2" style="margin-right:0;margin-left:0;line-height:18px;font-size:18px;font-weight:bold;margin-bottom:0px;margin-top:10px;" >@lang('common.travelInsurance')</p>
                            </td>
                        </tr>
                        <tr>
                            <td class="inner contents" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;font-size:12px;" >
                                <p style="margin-right:0;margin-left:0;line-height:18px;font-size:12px;font-weight:bold;margin-bottom:0px;margin-top:0px;" >@lang('common.manulifePolicy')#
                                    @if ($emailData['hasInsurance'])
                                        @if($emailData['insurance']['bookingNumber'] === 'Pending')<span style="color:#FC571F;">@endif
                                        {{ $emailData['insurance']['bookingNumber'] }}
                                        @if($emailData['insurance']['bookingNumber'] === 'Pending')</span>@endif
                                    @else
                                        <span style="color:#1790CC;">@lang('common.declined')</span>
                                    @endif
                                </p>
                            </td>
                        </tr>

                        <tr>
                            <td class="one-column" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;text-align:left;" >
                                <table class="contents" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;width:100%;font-size:14px;">
                                    <tbody>
                                        @if($emailData['hasInsurance'])
                                            @foreach(array_keys($emailData['insurance']['passengers']) as $passengerKey)
                                                <tr>
                                                    <td class="inner with-border" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;font-size:14px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                                        @lang('common.passenger') {{ $passengerKey }} ({{ $emailData['passengers'][$passengerKey - 1]['name'] }}) @lang('common.insurance'):
                                                    </td>
                                                    <td class="inner with-border text-right" align="right" width="30%" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;font-size:14px;text-align:right;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;width:30%" >
                                                         <b>${{ number_format($emailData['insurance']['passengers'][$passengerKey]['cost'], 2) }}</b>
                                                    </td>
                                                </tr>
                                            @endforeach
                                            <tr>
                                                <td class="inner" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;font-size:14px;" >
                                                    @lang('common.insurance') @lang('common.total') ({{$emailData['payment']['currency'] ?? 'CAD'}}):
                                                </td>
                                                <td class="inner text-right" align="right" width="30%" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;font-size:14px;text-align:right;width:30%;" >
                                                     <b>${{ number_format($emailData['insuranceTotal'], 2) }}</b>
                                                </td>
                                            </tr>
                                        @endif
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    @endif
                    @if(isset($emailData['choose']))
                        <tr>
                            <td class="inner contents" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;font-size:14px;" >
                                <p class="h2" style="margin-right:0;margin-left:0;line-height:18px;font-size:18px;font-weight:bold;margin-bottom:0px;margin-top:10px;" >Choose Carbon Footprint</p>
                            </td>
                        </tr>
                        <tr>
                            <td class="one-column" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;text-align:left;" >
                                <table class="contents" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;width:100%;font-size:14px;">
                                    <tbody>
                                        <tr>
                                            <td class="inner with-border" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;font-size:14px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                                Choose Carbon Footprint Total:
                                            </td>
                                            <td class="inner with-border text-right" align="right" width="30%" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;font-size:14px;text-align:right;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;width:30%" >
                                                 <b>${{ number_format($emailData['choose']['item']['price'], 2) }}</b>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    @endif
                @else
                    @if(!empty($hotel))
                        <tr>
                            <td class="one-column" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;text-align:left;" >
                                <table class="contents" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;width:100%;font-size:14px;">
                                    <tbody>
                                        <tr>
                                            <td class="inner with-border" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;font-size:14px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                                {{$emailData['hotel']['numOfRooms']}} @lang('common.rooms') X {{$emailData['trip']['duration']}} @lang('common.nights'):
                                            </td>
                                            <td class="inner with-border text-right" align="right" width="30%" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;font-size:14px;text-align:right;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;width:30%" >
                                                 <b>${{ number_format($emailData['payment']['subTotal'], 2) }}</b>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="inner " style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;font-size:14px;" >
                                                @lang('common.taxesFees'):
                                            </td>
                                            <td class="inner text-right" align="right" width="30%" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;font-size:14px;text-align:right;width:30%" >
                                                <b>${{ number_format(($emailData['payment']['taxes'] - ($hotel['salesTax'] ?? 0)), 2) }}</b>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colspan="2" class="with-border" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;">
                                                <p style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:10px;line-height:12px;" >
                                                    This charge includes estimated amounts the travel service provider (i.e. hotel, car rental company) pays for their taxes, and/or taxes that we pay, to taxing authorities on your booking (including but not limited to sales, occupancy, and value added tax). This amount may also include any amounts charged to us for resort fees, cleaning fees, and other fees and/or a fee we, the hotel supplier and/or the website you booked on, retain as part of the compensation for our and/or their services, which varies based on factors such as location, the amount, and how you booked. For more details, please see the Terms and Conditions.
                                                </p>
                                            </td>
                                        </tr>
                                        @if(!empty($hotel['salesTax']))
                                            <tr>
                                                <td class="inner with-border" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;font-size:14px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                                    Sales Tax:
                                                </td>
                                                <td class="inner with-border text-right" align="right" width="30%" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;font-size:14px;text-align:right;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;width:30%" >
                                                     <b>${{ number_format($hotel['salesTax'], 2) }}</b>
                                                </td>
                                            </tr>
                                        @endif
                                        @if(!empty($emailData['choose']))
                                            <tr>
                                                <td class="inner with-border" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;font-size:14px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                                    Choose Carbon Footprint Total:
                                                </td>
                                                <td class="inner with-border text-right" align="right" width="30%" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;font-size:14px;text-align:right;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;width:30%" >
                                                     <b>${{ number_format($emailData['choose']['item']['price'], 2) }}</b>
                                                </td>
                                            </tr>
                                        @endif
                                        <tr>
                                            <td class="inner" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;font-size:14px;" >
                                                @lang('common.total') ({{$emailData['payment']['currency'] ?? 'CAD'}}):
                                            </td>
                                            <td class="inner text-right" align="right" width="30%" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;font-size:14px;text-align:right;width:30%;" >
                                                 <b>${{ number_format(($emailData['payment']['total'] + (!empty($emailData['choose'])?$emailData['choose']['item']['price']:0)), 2) }}</b>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        @if(!empty($hotel['extraFees']))
                            <tr>
                                <td class="one-column with-thick-border" style="padding-top:0;padding-right:0;padding-left:0;text-align:left;border-bottom-width:2px;border-bottom-style:solid;border-bottom-color:#eaebed;padding-bottom:20px;" >
                                    <table width="100%" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;" >
                                        <tbody>
                                            <tr>
                                                <td class="inner" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;font-size:14px;" >
                                                    <span class="blue" style="color:#1790CC;" >Extra fees to ba paid at Hotel:</span>
                                                </td>
                                                <td class="inner text-right" align="right" width="30%" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;font-size:14px;text-align:right;width:30%;" >
                                                     <span class="blue" style="color:#1790CC;" ><b>{{number_format($hotel['extraFees'], 2)}}</b></span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        @endif
                    @endif
                    @if(!empty($activity))
                        <tr>
                            <td class="one-column" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;text-align:left;" >
                                <table class="contents" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;width:100%;font-size:14px;">
                                    <tbody>
                                        <tr>
                                            <td class="inner with-border" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;font-size:14px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                                Activity:
                                            </td>
                                            <td class="inner with-border text-right" align="right" width="30%" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;font-size:14px;text-align:right;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;width:30%" >
                                                 <b>${{ number_format($activity['totalAmount'],2) }}</b>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="inner" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;font-size:14px;" >
                                                @lang('common.total') ({{$emailData['payment']['currency'] ?? 'CAD'}}):
                                            </td>
                                            <td class="inner text-right" align="right" width="30%" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;font-size:14px;text-align:right;width:30%;" >
                                                 <b>${{ number_format($activity['totalAmount'], 2) }}</b>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    @endif
                    @if(!empty($emailData['coupon']))
                        <tr>
                            <td class="one-column with-thick-border" style="padding-top:0;padding-right:0;padding-left:0;text-align:left;border-bottom-width:2px;border-bottom-style:solid;border-bottom-color:#eaebed;padding-bottom:20px;" >
                                <table width="100%" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;" >
                                    <tbody>
                                        <tr>
                                            <td class="inner with-thicker-border" style="text-align:left;padding-top:10px;padding-right:10px;padding-left:10px;font-size:14px;border-bottom-width:5px;border-bottom-style:solid;border-bottom-color:#eaebed;padding-bottom:10px;" >
                                                Coupon({{$emailData['coupon']['code']}}):
                                            </td>
                                            <td class="inner with-thicker-border text-right" align="right" width="30%" style="padding-top:10px;padding-right:10px;padding-left:10px;font-size:14px;text-align:right;border-bottom-width:5px;border-bottom-style:solid;border-bottom-color:#eaebed;padding-bottom:10px;width:30%;" >
                                                <b>-${{number_format($emailData['coupon']['value'], 2)}}</b>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="inner" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;font-size:14px;" >
                                                <span class="blue" style="color:#1790CC;" >Total Amount After Coupon:</span>
                                            </td>
                                            <td class="inner text-right" align="right" width="30%" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;font-size:14px;text-align:right;width:30%;" >
                                                <span class="blue" style="color:#1790CC;" ><b>{{number_format(max($emailData['payment']['total'] - $emailData['coupon']['value'], 0), 2)}}</b></span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    @endif
                @endif
                @if(!empty($transfer))
                    <tr>
                        <td class="two-column with-thick-border" style="padding-top:0;padding-right:0;padding-left:0;text-align:left;font-size:0;border-bottom-width:2px;border-bottom-style:solid;border-bottom-color:#eaebed;padding-bottom:20px;" >
                            <!--[if (gte mso 9)|(IE)]>
                            <table class="contents" style="border-spacing:0;font-family:sans-serif, arial;color:#484848;border-collapse:collapse !important;width:100%;font-size:13px;" >
                            <tr>
                            <td width="50%" valign="top" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;text-align:left;" >
                            <![endif]-->
                            <div class="column" style="width:100%;max-width:300px;display:inline-block;vertical-align:top;" >
                                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing:0;font-family:sans-serif, arial;color:#484848;border-collapse:collapse !important;" >
                                    <tr>
                                        <td class="" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;text-align:left;" >
                                            <table class="contents" style="border-spacing:0;font-family:sans-serif, arial;color:#484848;border-collapse:collapse !important;width:100%;font-size:13px;" >
                                                <tr>
                                                     <td colspan="2" class="inner with-border" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                                        <table class="contents" cellpadding="0" cellspacing="0" border="0" style="border-spacing:0;font-family:sans-serif, arial;color:#484848;border-collapse:collapse !important;font-size:13px;" >
                                                            <tr>
                                                                <td class="" style="text-align:left;padding-top:0px;padding-bottom:0px;padding-right:0px;padding-left:0px;width:30%;" >
                                                                    Lead Driver Name:
                                                                </td>
                                                                <td class="" style="text-align:right;padding-top:0px;padding-bottom:0px;padding-right:0px;padding-left:0px;" >
                                                                    <b>{{$transfer['holder']['name']." ".$transfer['holder']['surname']  }}</b>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                               <tr>
                                                    <td class="inner show-border" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;" >
                                                        Driver contact phone:
                                                    </td>
                                                    <td class="inner show-border text-right" align="right" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;text-align:right;" >
                                                        <b>{{$transfer['holder']['phone'] }}</b>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="inner show-border" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;" >
                                                        Driver contact email:
                                                    </td>
                                                    <td class="inner show-border text-right" align="right" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;text-align:right;" >
                                                        <b>{{$transfer['holder']['email'] }}</b>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="inner show-border" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;" >
                                                        Car provider contact phone:
                                                    </td>
                                                    <td class="inner show-border text-right" align="right" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;text-align:right;" >
                                                        <b>{{$transfer['tripInfo'][0]['emergencyContact'] }}</b>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <!--[if (gte mso 9)|(IE)]>
                            </td>
                            </tr>
                            </table>
                            <![endif]-->
                        </td>
                    </tr>
                @endif
                @if(isset($emailData['payment']['petro']) && !empty($emailData['payment']['petro']['redeemDollarAmount']))
                    <tr>
                        <td class="one-column with-thick-border" style="padding-top:0;padding-right:0;padding-left:0;text-align:left;border-bottom-width:2px;border-bottom-style:solid;border-bottom-color:#eaebed;padding-bottom:20px;" >
                            <table width="100%" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;" >
                                <tbody>
                                    <tr>
                                        <td class="inner with-border" style="text-align:left;padding-top:10px;padding-right:10px;padding-left:10px;font-size:14px;padding-bottom:10px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                            @lang('confirmation.subTotal') ({{$emailData['payment']['currency'] ?? 'CAD'}}):
                                        </td>
                                        <td class="inner with-border text-right" align="right" width="30%" style="padding-top:10px;padding-right:10px;padding-left:10px;font-size:14px;text-align:right;padding-bottom:10px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;width:30%;" >
                                            <b>{{number_format($emailData['payment']['realTotal'], 2)}}</b>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td class="inner with-thicker-border" style="text-align:left;padding-top:10px;padding-right:10px;padding-left:10px;font-size:14px;border-bottom-width:5px;border-bottom-style:solid;border-bottom-color:#eaebed;padding-bottom:10px;" >
                                            @lang('confirmation.redeemedTravelRewards')({{number_format($emailData['payment']['petro']['redeem'], 0)}} Petro-Points):
                                        </td>
                                        <td class="inner with-thicker-border text-right" align="right" width="30%" style="padding-top:10px;padding-right:10px;padding-left:10px;font-size:14px;text-align:right;border-bottom-width:5px;border-bottom-style:solid;border-bottom-color:#eaebed;padding-bottom:10px;width:30%;" >
                                            <b>-{{number_format($emailData['payment']['petro']['redeemDollarAmount'], 2)}}</b>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="inner" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;font-size:14px;" >
                                            <span class="blue" style="color:#1790CC;" >Total Amount After Redeem Petro Points:</span>
                                        </td>
                                        <td class="inner text-right" align="right" width="30%" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;font-size:14px;text-align:right;width:30%;" >
                                             <span class="blue" style="color:#1790CC;" ><b>{{number_format($emailData['payment']['total'], 2)}}</b></span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                @endif
                <tr>
                    <td class="inner contents" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;font-size:14px;" >
                        <p class="h1" style="margin-bottom:0;margin-right:0;margin-left:0;line-height:18px;font-size:22px;font-weight:bold;margin-top:10px;" >@lang('confirmation.billingDetails')</p>
                    </td>
                </tr>
                @foreach($emailData['payment']['paymentCards'] as $card)
                    <tr>
                        <td class="inner contents" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;font-size:14px;" >
                            <p class="" style="margin-right:0;margin-left:0;line-height:18px;font-size:17px;margin-bottom:0px;margin-top:0px; font-weight: bold;" >@lang('common.creditCard') {{$loop->iteration}}</p>
                        </td>
                    </tr>
                    <tr>
                        <td class="two-column with-thick-border" style="padding-top:0;padding-right:0;padding-left:0;text-align:left;font-size:0;{{'border-bottom-width:'. ($loop->last ? '2px' : '0px')}};border-bottom-style:solid;border-bottom-color:#eaebed;padding-bottom:20px;" >
                            <!--[if (gte mso 9)|(IE)]>
                            <table class="contents" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;width:100%;font-size:14px;">
                            <tr>
                            <td width="50%" valign="top" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;text-align:left;" >
                            <![endif]-->
                            <div class="column" style="width:100%;max-width:298px;display:inline-block;vertical-align:top;" >
                                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;" >
                                    <tr>
                                        <td class="" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;text-align:left;" >
                                            <table class="contents" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;width:100%;font-size:14px;" >
                                                <tr>
                                                    <td colspan="2" class="inner with-border" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                                        <table class="contents" cellpadding="0" cellspacing="0" border="0" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;font-size:14px;" >
                                                            <tr>
                                                                <td class="" style="font-size:14px;text-align:left;padding-top:0px;padding-bottom:0px;padding-right:0px;padding-left:0px; width: 44%;" >
                                                                    @lang('common.creditCardHolder'):
                                                                </td>
                                                                <td class="" style="font-size:14px;text-align:right;padding-top:0px;padding-bottom:0px;padding-right:0px;padding-left:0px;" >
                                                                    <b>{{ $card['name'] }}</b>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                               <tr>
                                                    <td class="inner with-border " style="font-size:14px;text-align:left;padding-top:10px;padding-bottom:10px;padding-right:0px;padding-left:10px;  border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                                        @lang('common.creditCardNumber'):
                                                    </td>
                                                    <td class="inner with-border text-right" align="right" style="font-size:14px;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:0px;text-align:right;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                                        <b>{{ $card['cardMask'] }}</b>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="inner show-border" style="font-size:14px;text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                                        @lang('common.cardType'):
                                                    </td>
                                                    <td class="inner show-border text-right" align="right" style="font-size:14px;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;text-align:right;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                                        <b>{{ $card['cardType'] }}</b>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="inner show-border" style="font-size:14px;text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;" >
                                                        @lang('common.expiryDate'):
                                                    </td>
                                                    <td class="inner show-border text-right" align="right" style="font-size:14px;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;text-align:right;" >
                                                        <b>{{ $card['expiryDate'] }}</b>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <!--[if (gte mso 9)|(IE)]>
                            </td><td width="50%" valign="top" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;text-align:left;" >
                            <![endif]-->
                            @php
                                if($emailData['isStandalone']){
                                    if(!empty($car)){
                                        $product = 'Car';
                                    } elseif(!empty($activity)){
                                        $product = 'Activity';
                                    } else {
                                        $product = 'Hotel';
                                    }
                                }
                            @endphp
                            <div class="column" style="width:100%;max-width:298px;display:inline-block;vertical-align:top;" >
                                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;" >
                                    <tr>
                                        <td class="" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;text-align:left;" >
                                            <table class="contents" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;width:100%;font-size:14px;" >
                                                <tr>
                                                    <td class="inner with-border" style="font-size:14px;text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                                      @if(!$emailData['isStandalone'])@lang('common.vacationPackage')@else {{$product}} @endif <b>({{$emailData['payment']['currency'] ?? 'CAD'}})</b>
                                                    </td>
                                                    <td class="inner with-border" align="right" style="font-size:14px;text-align:right;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                                        <b>${{ number_format($card['amount'], 2) }}</b>
                                                    </td>
                                                </tr>
                                                @if($insurance)
                                                    @if(!$emailData['isStandalone'] && $loop->first)
                                                        <tr>
                                                            <td class="inner with-border hide-border" style="font-size:14px;text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                                                @lang('common.insurance'): <b>({{$emailData['payment']['currency'] ?? 'CAD'}})</b>
                                                            </td>
                                                            <td class="inner with-border hide-border text-right" align="right" style="font-size:14px;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;text-align:right;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                                                <b>
                                                                @if ($emailData['hasInsurance'])
                                                                    ${{ number_format($emailData['insurance']['total'], 2) }}
                                                                @else
                                                                    <span style="color:#1790CC;">@lang('common.declined')</span>
                                                                @endif
                                                                </b>

                                                            </td>
                                                        </tr>
                                                    @endif
                                                @endif
                                                @if(isset($emailData['choose']))
                                                    @if($loop->first)
                                                        <tr>
                                                            <td class="inner with-border hide-border" style="font-size:14px;text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                                                Carbon Footprint: <b>({{$emailData['choose']['currency']}})</b>
                                                            </td>
                                                            <td class="inner with-border hide-border text-right" align="right" style="font-size:14px;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;text-align:right;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                                                <b>
                                                                    ${{ number_format($emailData['choose']['item']['price'], 2) }}
                                                                </b>
                                                            </td>
                                                        </tr>
                                                    @endif
                                                @endif
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <!--[if (gte mso 9)|(IE)]>
                            </td>
                            </tr>
                            </table>
                            <![endif]-->
                        </td>
                    </tr>
                @endforeach
                @if(!empty($emailData['payment']['deposit']))
                    <tr>
                        <td style="font-size:14px;text-align:left;width:100%;padding:10px;">
                            <p style="font-size:17px;font-weight:bold;margin:5px 0 0 0;line-height:18px;line-height:18px;">
                                @lang('confirmation.refundableBalance')
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align:left;padding:0 0 20px 0;border-bottom:2px solid #EAEBED;">
                            <div style="color:#484848;vertical-align:top;display:inline-block;width:100%;max-width:298px;margin:0;padding:0;">
                                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="color:#484848;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;border-spacing:0;">
                                    <tbody>
                                        <tr>
                                            <td style="text-align:left;padding:0;">
                                                <table style="color:#484848;font-size:14px;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;width:100%;border-spacing:0;">
                                                    <tbody>
                                                        <tr>
                                                            <td style="font-size:14px;text-align:left;padding:10px;">Balance Due: </td>
                                                            <td align="right" style="font-size:14px;text-align:right;padding:10px;"><b><span style="color:#1790CC;">${{number_format($emailData['payment']['total'] - $emailData['payment']['deposit'], 2)}}</span></b> </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div style="color:#484848;vertical-align:top;display:inline-block;width:100%;max-width:298px;margin:0;padding:0;">
                                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="color:#484848;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;border-spacing:0;">
                                    <tbody>
                                        <tr>
                                            <td style="text-align:left;padding:0;">
                                                <table style="color:#484848;font-size:14px;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;width:100%;border-spacing:0;">
                                                    <tbody>
                                                        <tr>
                                                            <td style="font-size:14px;text-align:left;padding:10px;">Balance Due Date: </td>
                                                            <td align="right" style="font-size:14px;text-align:right;padding:10px;"><b>{{$emailData['payment']['balanceDueDate']}}</b> </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </td>
                    </tr>
                @endif
                <!--
                <tr>
                    <td class="inner contents" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;font-size:14px;" >
                        <p class="h2" style="margin-right:0;margin-left:0;line-height:18px;font-size:18px;font-weight:bold;margin-bottom:0px;margin-top:10px;" >Petro Points</p>
                    </td>
                </tr>
                <tr>
                    <td class="with-thick-border inner contents" style="text-align:left;padding-top:10px;padding-right:10px;padding-left:10px;width:100%;font-size:14px;border-bottom-width:2px;border-bottom-style:solid;border-bottom-color:#eaebed;padding-bottom:20px;" >
                        <p style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:14px;line-height:18px;" ><b>Card Number # 7069 12943 5578 923</b></p><br>
                        <p style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:14px;line-height:18px;" > Congratulations!<br>
                            You have earned 9,999 Petro-points on this purchase.<br>
                            Petro-Points Redeemed on this Purchase: 99,999 points = $99.99 Discount
                        </p>
                    </td>
                </tr>
                -->
                @if(!empty($emailData['hotel']['mandatory']))
                    <tr>
                        <td class="one-column with-thick-border" style="padding-top:0;padding-right:0;padding-left:0;text-align:left;border-bottom-width:2px;border-bottom-style:solid;border-bottom-color:#eaebed;padding-bottom:20px;" >
                            <table class="contents" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;width:100%;font-size:14px;">
                                <tr>
                                    <td class="inner contents" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;font-size:14px;" >
                                        <p class="h1" style="margin-bottom:0;margin-right:0;margin-left:0;line-height:18px;font-size:22px;font-weight:bold;margin-top:10px;" >@lang('confirmation.mandatoryInformation')</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="inner contents" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;font-size:14px;" >
                                            @foreach($emailData['hotel']['mandatory'] as $mandatory)
                                            <p style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:14px;line-height:18px;" >
                                                {{$mandatory['paragraph_0']}}
                                            </p>
                                            @endforeach
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                @endif
                @if(!empty($emailData['hotel']['checkInInstructions']))
                    <tr>
                        <td class="one-column with-thick-border" style="padding-top:0;padding-right:0;padding-left:0;text-align:left;border-bottom-width:2px;border-bottom-style:solid;border-bottom-color:#eaebed;padding-bottom:20px;" >
                            <table class="contents" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;width:100%;font-size:14px;">
                                <tr>
                                    <td class="inner contents" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;font-size:14px;" >
                                        <p class="h1" style="margin-bottom:0;margin-right:0;margin-left:0;line-height:18px;font-size:22px;font-weight:bold;margin-top:10px;" >Check-in Instructions</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="inner contents" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;font-size:14px;" >
                                        @foreach($emailData['hotel']['checkInInstructions'] as $checkIn)
                                        <p style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:14px;line-height:18px;" >
                                            {!!$checkIn['paragraph_0']!!}
                                        </p>
                                        @endforeach
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                @endif
                @if(!empty($emailData['hotel']['cancellationPolicy']) && $emailData['isStandalone'])
                    <tr>
                        <td class="one-column with-thick-border" style="padding-top:0;padding-right:0;padding-left:0;text-align:left;border-bottom-width:2px;border-bottom-style:solid;border-bottom-color:#eaebed;padding-bottom:20px;" >
                            <table class="contents" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;width:100%;font-size:14px;">
                                <tr>
                                    <td class="inner contents" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;font-size:14px;" >
                                        <p class="h1" style="margin-bottom:0;margin-right:0;margin-left:0;line-height:18px;font-size:22px;font-weight:bold;margin-top:10px;" >@lang('confirmation.cancellationPolicy')</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="inner contents" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;font-size:14px;" >
                                        @foreach($emailData['hotel']['cancellationPolicy'] as $cancellation)
                                        <p style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:14px;line-height:18px;" >
                                            {!!$cancellation['paragraph_0']!!}
                                        </p>
                                        @endforeach
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                @endif
                <tr>
                    <td class="inner contents" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;font-size:14px;" >
                        <p class="h1" style="margin-bottom:0;margin-right:0;margin-left:0;line-height:18px;font-size:22px;font-weight:bold;margin-top:10px;" >@lang("common.agencyDetails")</p>
                    </td>
                </tr>

                <tr>
                    <td class="two-column with-thick-border" style="padding-top:0;padding-right:0;padding-left:0;text-align:left;font-size:0;border-bottom-width:2px;border-bottom-style:solid;border-bottom-color:#eaebed;padding-bottom:20px;" >
                        <!--[if (gte mso 9)|(IE)]>
                        <table class="contents" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;width:100%;font-size:14px;">
                        <tr>
                        <td width="50%" valign="top" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;text-align:left;" >
                        <![endif]-->
                        <div class="column" style="width:100%;max-width:298px;display:inline-block;vertical-align:top;" >
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;" >
                                    <tr>
                                        <td class="" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;text-align:left;" >
                                            <table class="contents" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;width:100%;font-size:14px;" >
                                                <tr>
                                                    <td class="inner with-border" style="font-size:14px;text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid; width:45%;" >
                                                        @lang('common.companyName'):
                                                    </td>
                                                    <td class="inner with-border text-right" align="right" style="font-size:14px;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;text-align:right;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                                        <p style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:14px;line-height:18px;" ><b>{{config('site.name')}}</b></p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colspan="2" class="inner with-border" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                                        <table class="contents" cellpadding="0" cellspacing="0" border="0" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;font-size:14px;" >
                                                            <tr>
                                                                <td class="" style="font-size:14px;text-align:left;padding-top:0px;padding-bottom:0px;padding-right:0px;padding-left:0px;" >
                                                                    @lang('common.address'):
                                                                </td>
                                                                <td class="" style="font-size:14px;text-align:right;padding-top:0px;padding-bottom:0px;padding-right:0px;padding-left:0px;" >
                                                                   <p style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:14px;line-height:18px;" ><b>{{config('site.address')}}</b></p>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="inner with-border" style="font-size:14px;text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                                        @lang('common.city'):
                                                    </td>
                                                    <td class="inner with-border text-right" align="right" style="font-size:14px;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;text-align:right;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                                        <p style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:14px;line-height:18px;" ><b>{{config('site.city')}}</b></p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                            </table>
                        </div>
                        <!--[if (gte mso 9)|(IE)]>
                        </td><td width="50%" valign="top" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;text-align:left;" >
                        <![endif]-->
                        <div class="column" style="width:100%;max-width:298px;display:inline-block;vertical-align:top;" >
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;" >
                                    <tr>
                                        <td class="" style="font-size:14px;padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;text-align:left;" >
                                            <table class="contents" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;width:100%;font-size:14px;" >
                                                    <tr>
                                                        <td class="inner with-border" style="font-size:14px;text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                                            @lang('common.'.(config('site.site') === 'copolo' ? 'zip' : 'postalCode')):
                                                        </td>
                                                        <td class="inner with-border text-right" align="right" style="font-size:14px;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;text-align:right;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                                            <p style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:14px;line-height:18px;" ><b>{{config('site.postal')}}</b></p>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td colspan="2" class="inner with-border" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                                            <table class="contents" cellpadding="0" cellspacing="0" border="0" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;font-size:14px;" >
                                                                <tr>
                                                                    <td class="" style="font-size:14px;text-align:left;padding-top:0px;padding-bottom:0px;padding-right:0px;padding-left:0px;" >
                                                                        @lang('common.phoneNumber'):
                                                                    </td>
                                                                    <td class="" style="font-size:14px;text-align:right;padding-top:0px;padding-bottom:0px;padding-right:0px;padding-left:0px;" >
                                                                       <p style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:14px;line-height:18px;" ><b>{{config('site.phone')}}</b></p>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td class="inner with-border hide-border" style="font-size:14px;text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                                        	@lang('common.'.(config('site.site') === 'copolo' ? 'state' : 'province')):

                                                        </td>
                                                        <td class="inner with-border hide-border text-right" align="right" style="font-size:14px;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;text-align:right;border-bottom-width:1px;border-bottom-color:#eaebed;border-bottom-style:solid;" >
                                                            <p style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:14px;line-height:18px;" ><b>{{config('site.province')}}</b></p>
                                                        </td>
                                                    </tr>
                                                    <tr class="d-mob-none">
                                                        <td class="inner" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;">&nbsp;</td>
                                                        <td class="inner" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;">&nbsp;</td>
                                                    </tr>
                                            </table>
                                        </td>
                                    </tr>
                            </table>
                        </div>
                        <!--[if (gte mso 9)|(IE)]>
                        </td>
                        </tr>
                        </table>
                        <![endif]-->
                    </td>
                </tr>


                <!--
                <tr>
                    <td class="one-column with-thick-border" style="padding-top:0;padding-right:0;padding-left:0;text-align:left;border-bottom-width:2px;border-bottom-style:solid;border-bottom-color:#eaebed;padding-bottom:20px;" >
                        <table class="contents" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;width:100%;font-size:14px;">
                            <tbody>
                                <tr>
                                    <td class="inner contents banner-wrapper" style="text-align:left;width:100%;font-size:14px;padding-top:20px;padding-bottom:0;padding-right:10px;padding-left:10px;" >
                                        <img src="https://s3.amazonaws.com/redtag-ca/img/email/banner.jpg" width="100%" border="0" alt="" style="border-width:0;height:auto;line-height:100%;outline-style:none;text-decoration:none;font-family:sans-serif;font-size:12px;font-weight:normal;text-align:center;" >
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                -->


                <tr>
                    <td class="inner contents" style="text-align:left;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;width:100%;font-size:14px;" >
                        <p class="h1" style="margin-bottom:0;margin-right:0;margin-left:0;line-height:18px;font-size:22px;font-weight:bold;margin-top:10px;" ><span  style="color:#1790CC;" >Need help?</span></p>
                    </td>
                </tr>
                <tr>
                    <td class="with-thick-border inner contents" style="text-align:left;padding-top:10px;padding-right:10px;padding-left:10px;width:100%;font-size:14px;border-bottom-width:2px;border-bottom-style:solid;border-bottom-color:#eaebed;padding-bottom:20px;" >
                        <p style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:14px;line-height:18px;" >If you have any questions please contact us toll free at <b>{{config('site.phone')}}</b>, or email us at <b><a href="mailto:{{config('site.email')}}">{{config('site.email')}}</a></b></p>
                    </td>
                </tr>



                <tr>
                    <td class="one-column" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;text-align:left;" >
                        <table class="contents" style="border-spacing:0;font-family:omnes-pro,Calibri,Helvetica Neue,Helvetica,Arial,sans-serif;color:#484848;border-collapse:collapse !important;width:100%;font-size:14px;">
                            <tr>
                                <td class="inner contents footer-wrapper" style="text-align:left;width:100%;padding-top:30px;padding-bottom:30px;padding-right:10px;padding-left:10px;font-size:12px;" >
                                    <center>
                                        <p style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;font-size:14px;line-height:18px;" >{{config('site.address')}}, {{config('site.province')}} {{config('site.postal')}},   T {{config('site.phone')}}   F {{config('site.fax')}} </p><br>
                                        <img src="https://s3.amazonaws.com/redtag-ca/img/email/footer-copy.gif" width="" border="0" alt="" style="border-width:0;height:auto;line-height:100%;outline-style:none;text-decoration:none;font-family:sans-serif;font-size:12px;font-weight:normal;text-align:center;" >
                                    </center>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>


               <!-- *** agent view only *** -->
            </table>
            <!--[if (gte mso 9)|(IE)]>
            </td>
            </tr>
            </table>
            <![endif]-->
        </div>
    </center>
</html>
