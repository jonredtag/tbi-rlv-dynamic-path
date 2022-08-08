@if(isset($accertifyUniqueID) && !empty($accertifyUniqueID))
            <script>
            try {
                //Client generates a unique transaction id.
                //I recommend doing this server-side. E.g., do it in your web tier app logic.
                //here we create a tid based on a random number
                var d = new Date().getTime();
                var tid = '{{ $accertifyUniqueID }}';

                var sid = '{{ config('accertify.authtokensid') }}';                       //Your site key. every one is unique to account & environment. verify from credentials document.
                var cUrl = '{{ config('accertify.authtokencurl') }}';
                var _cc = window._cc = window._cc || [];
                _cc.push(['ci',
                {
                    'sid': sid,
                    'tid': tid
                }]);
                _cc.push(['st', 500]);          //a timeout for the asynchronous collections. does not apply to synchronous categories. remove if experiencing collisions.
                //_cc.push(['cf', 990199]);     //do not hard-code CF flag unless necessary to override server's setting
                _cc.push(["sf", function() {
                    //optional callback, to let you know that InAuth received the collected data and transaction id.
                    console.log("Transaction successfully submitted. It is SAFE to use this tx id : \n" + tid);
                }]);
                _cc.push(['run', cUrl]);

                //fetch InAuth's collector; it will run and submit asynchronously as soon as it's loaded
                //this function can be written as an html <script> tag, so long as all arguments are present
                (function() {
                    var c = document.createElement('script');
                    c.type = 'text/javascript';
                    c.async = false;
                    c.src = cUrl + '/cc.js?sid=' + sid + '&ts=' + (new Date()).getTime(); //fetch collector, pass a timestamp
                    var s = document.getElementsByTagName('script')[0];
                    s.parentNode.insertBefore(c, s);
                })();
            } catch (e) {//error handling as necessary
            }
            </script>        
@endif