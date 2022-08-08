@php
$product = '';
if(isset($searchParameters))
$product = (strpos($searchParameters['selectedProducts'], 'F') !== false ? 'Flight + ' : '').'Hotel';
@endphp

<!DOCTYPE html>
<html lang="en">
<head>

@if(env('GTM'))

        <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','{{ env('GTMID') }}');</script>
    <!-- End Google Tag Manager -->

@endif


    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, minimum-scale=1">
    <title>{{$pageTitle}} || {{$product}}</title>
    @include('modules.'.config('site.site').'-head')
    <link rel="stylesheet" href="/css/styles.css?{{ config('app.asset_version') }}">
    <script type="text/javascript">
        var Locale = '{{ App::getLocale() }}';
        var points = '{{config('site.pts_provider')}}';
        var UPLIFT_FEATURE = {{config('site.multi_payment') ? 'true' : 'false'}};
        @if(config('app.env') !== 'production')
        var IS_DEVELOPMENT = true;
        @endif
        var HOTEL_ONLY_PATH = false;
        var site = '{{ config('site.name') }}';
        var SITE_KEY = '{{ config('site.site') }}';
        var CIBC_POINTS_INCR = 100;
        var APP_CURRENCY = '{{ config('app.currency') }}';
    </script>
    @if(config('accertify.enabled'))
        @include('components.header-accertify')
    @endif
</head>
<body>

@if(env('GTM'))
    <!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id={{ env('GTMID') }}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->

@endif

    <div id="app" data-page="{{ $page ?? 'default' }}">
        @include('modules.'.config('site.site').'-header')
        @yield('content')
        @include('modules.'.config('site.site').'-footer')
        <div class="modal modal-promo fade" id="mdl_bwc" tabindex="-1" role="dialog" aria-hidden="false">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content pb-5">
                    <div class=" modal-header border-0">
                        <button type="button" class="close theme-2 btn-unstyled mt-3 mr-3" aria-label="Close" data-dismiss="modal">
                            <span class="mb-1" aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <img class="w-100" src="https://travel-img.s3.amazonaws.com/2021-11-25--1637879511633800013_CPL-Black-Friday---Popup2.jpg" alt="">
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="mdl_custom" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header modal-solid-header-bar">
                        <h5 id="mdl_title" class="modal-title h4">
                            Error
                        </h5>
                        <button type="button" class="close close-lg pt-3 btn-unstyled" aria-label="Close" data-dismiss="modal">
                            <span class="pt-md-1 d-inline-block" aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div id="mdl_message" class="pb-4 pt-1 err-message">This is some text for the error message.</div>
                        <div id="mdl_buttons" class="justify-content-center">
                            <button type="button" class="col-3" data-dismiss="modal" aria-label="Close">Solid</button>
                            <button type="button" class="col-3" data-dismiss="modal" aria-label="Close">border</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="mdl_sessionTimeout" class="modal fade in modal-session-timeout">
            <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div class="modal-content ">
                    <div class="modal-header modal-solid-header-bar">
                        <h2 class="modal-title ">
                            <span class="header-icon header-icon-large d-none d-md-inline">
                        
                            </span>
                            <div class="header-text">@lang('common.session_timeout')</div>
                        </h2>
                    </div>
                    <div class="modal-main">
 
                        <div class="modal-intro">@lang('common.session_has_expired').</div>
                        <form id="ses_exiredForm" action="/" method="post">
                            @csrf
                            <input type="hidden" name="sid" value="{{$sid ?? ''}}">
                            <input id="ses_reqestData" type="hidden" name="request" value='{!!json_encode($searchParameters ?? [])!!}' />
                            <button type="submit" class="btn btn-primary btn-lg modal-button">
                                @lang('common.refresh_page')
                            </button>
                        </form>
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <script type="text/javascript" src="/js/app.js?{{ config('app.asset_version') }}"></script>
        
    </div>
</body>
</html>
