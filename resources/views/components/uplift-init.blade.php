<script type="text/javascript">
    var UPLIFT_API_KEY = '<?=config('site.uplift_api_key')?>';
    function UpliftLibInit(){
        (function(u,p,l,i,f,t,b,j){u['UpLiftPlatformObject']=f;u[f]=u[f]||function() {
        (u[f].q=u[f].q||[]).push(arguments)},u[f].l=1*new Date();b=p.createElement(l),
        j=p.getElementsByTagName(l)[0];b.async=1;b.src=i+'?id='+t;
        j.parentNode.insertBefore(b,j);var o=window.location.host.match(/[\w-]+\.\w{2,3}(:\d+)?$/);
        if(o)o=o[0];u[f]('create',t,o)})(window,document,'script','//cdn.Uplift-platform.com/a/up.js',
        'up','<?=config('site.uplift_id')?>');
    }
</script>    
