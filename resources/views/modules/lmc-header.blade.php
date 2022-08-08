<header class="main-header border-md-bottom">
    <div id="nav-backdrop" class="nav-backdrop not-visible d-md-none "></div>
    <div class="container">
        <div class="d-flex justify-content-between align-items-center">
            <a href="//www.lastminuteclub.com">
                <img src="https://lastminuteclub.s3.us-east-2.amazonaws.com/img/branding/lastminuteclub-logo.svg" alt="last minute club Logo" class="logo" />
            </a>
            @if(isset($currencyCode))
            <div id="cur_selectorElement" class="position-relative cur_selectorElement">
                <div class="btn-unstyled d-flex">
                    <img class="icon-md mr-2 align-self-center" src="https://travel-img-assets.s3-us-west-2.amazonaws.com/icons/icon-{{$currencyCode === 'CAD' ? 'canada' : 'united-states'}}-flag.svg" alt="">
                    <span class="font-weight-bold">{{$currencyCode}}</span>
                </div>
            </div>
            @endif
            <button id="hamburger" class="navbar-toggler d-none " type="button" aria-expanded="false" aria-label="Toggle navigation">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
        </div>
    </div>
    <section id="navbar-mobile" role="navigation" class="navbar navbar-out  ">
        <div class="nav navbar-nav container justify-content-between d-none" role="menubar">
            <a class="nav-link nav-border-bottom active " href="https://www.redtag.ca" role="menuitem">
                <svg class="icon d-md-none " role="" title="">
                    <use xmlns:xlink="http://www.w3.org/2000/svg" xlink:href="/img/icons/icon-defs.svg#icon-palm-trees"></use>
                </svg>
                <span class="nav-title">@lang('common.home')</span>
                <svg class="icon-arrow d-md-none " role="" title="">
                    <use xmlns:xlink="http://www.w3.org/2000/svg" xlink:href="/img/icons/icon-defs.svg#icon-chevron-right"></use>
                </svg>
            </a>
            <a class="nav-link nav-border-bottom " href="https://www.redtag.ca/vacation-packages.php" role="menuitem">
                <svg class="icon d-md-none " role="" title="">
                    <use xmlns:xlink="http://www.w3.org/2000/svg" xlink:href="/img/icons/icon-defs.svg#icon-palm-trees"></use>
                </svg>
                <span class="nav-title">@lang('common.vacations')</span>
                <svg class="icon-arrow d-md-none " role="" title="">
                    <use xmlns:xlink="http://www.w3.org/2000/svg" xlink:href="/img/icons/icon-defs.svg#icon-chevron-right"></use>
                </svg>
            </a>
            <a class="nav-link nav-border-bottom " href="https://www.redtag.ca/flights.php" role="menuitem">
                <svg class="icon d-md-none " role="" title="">
                    <use xmlns:xlink="http://www.w3.org/2000/svg" xlink:href="/img/icons/icon-defs.svg#icon-plane-right"></use>
                </svg>
                <span class="nav-title">@lang('common.flights')</span>
                <svg class="icon-arrow d-md-none " role="" title="">
                    <use xmlns:xlink="http://www.w3.org/2000/svg" xlink:href="/img/icons/icon-defs.svg#icon-chevron-right"></use>
                </svg>
            </a>
            <a class="nav-link nav-border-bottom" href="https://www.redtag.ca/hotels.php" target="_blank" role="menuitem">
                <svg class="icon d-md-none " role="" title="">
                    <use xmlns:xlink="http://www.w3.org/2000/svg" xlink:href="/img/icons/icon-defs.svg#icon-bed"></use>
                </svg>
                <span class="nav-title">@lang('common.hotels')</span>
                <svg class="icon-arrow d-md-none " role="" title="">
                    <use xmlns:xlink="http://www.w3.org/2000/svg" xlink:href="/img/icons/icon-defs.svg#icon-chevron-right"></use>
                </svg>
            </a>
            <a class="nav-link nav-border-bottom " href="https://www.redtag.ca/car-rental.php" role="menuitem">
                <svg class="icon d-md-none " role="" title="">
                    <use xmlns:xlink="http://www.w3.org/2000/svg" xlink:href="/img/icons/icon-defs.svg#icon-car"></use>
                </svg>
                <span class="nav-title">@lang('common.car_rentals')</span>
                <svg class="icon-arrow d-md-none " role="" title="">
                    <use xmlns:xlink="http://www.w3.org/2000/svg" xlink:href="/img/icons/icon-defs.svg#icon-chevron-right"></use>
                </svg>
            </a>
            <a class="nav-link nav-border-bottom" href="https://www.redtag.ca/deals.php" role="menuitem">
                <svg class="icon tag d-md-none " role="" title="">
                    <use xmlns:xlink="http://www.w3.org/2000/svg" xlink:href="/img/icons/icon-defs.svg#icon-tag"></use>
                </svg>
                <span class="nav-title">@lang('common.last_minute')</span>
                <svg class="icon-arrow d-md-none " role="" title="">
                    <use xmlns:xlink="http://www.w3.org/2000/svg" xlink:href="/img/icons/icon-defs.svg#icon-chevron-right"></use>
                </svg>
            </a>
            <a class="nav-link nav-border-bottom" href="https://www.redtag.ca/cruises.php" role="menuitem">
                <svg class="icon d-md-none " role="" title="">
                    <use xmlns:xlink="http://www.w3.org/2000/svg" xlink:href="/img/icons/icon-defs.svg#icon-cruise"></use>
                </svg>
                <span class="nav-title">@lang('common.cruises')</span>
                <svg class="icon-arrow d-md-none " role="" title="">
                    <use xmlns:xlink="http://www.w3.org/2000/svg" xlink:href="/img/icons/icon-defs.svg#icon-chevron-right"></use>
                </svg>
            </a>
            <a class="nav-link d-none d-md-inline-block replaced-hidden-sm-down " href="https://www.redtag.ca/las-vegas-vacations.php" role="menuitem">
                <span class="nav-title">@lang('common.las_vegas')</span>
            </a>
            <a class="nav-link d-none d-lg-inline-block replaced-hidden-sm-down " href="https://www.redtag.ca/group-vacations" role="menuitem">
                <span class="nav-title">@lang('common.groups')</span>
            </a>
            <a class="nav-link" href="//air-miles/intro.php" role="menuitem">
                <img class="icon d-md-none" src="https://s3.amazonaws.com/redtag-ca/img/airmiles/airmiles-logo-blk-wht.png" data-was-processed="true">
                <span class="nav-title">Air Miles <sup class="text-lowercase">@lang('common.air_miles_copyright_symbol')</sup></span>
            </a>
            <a class="nav-link nav-call-button d-md-none " href="tel:18665733824" role="menuitem">
                <svg class="icon d-md-none " role="" title="">
                    <use xmlns:xlink="http://www.w3.org/2000/svg" xlink:href="/img/icons/icon-defs.svg#icon-phone"></use>
                </svg>
                <span class="nav-title">@lang('common.call_us')</span>
                <svg class="icon-arrow d-md-none " role="" title="">
                    <use xmlns:xlink="http://www.w3.org/2000/svg" xlink:href="/img/icons/icon-defs.svg#icon-chevron-right"></use>
                </svg>
            </a>
            <a class="nav-link d-md-none nav-border-bottom" href="https://www.redtag.ca/newsletter" role="menuitem">
                <svg class="icon d-md-none " role="" title="">
                    <use xmlns:xlink="http://www.w3.org/2000/svg" xlink:href="/img/icons/icon-defs.svg#icon-mail"></use>
                </svg>
                <span class="nav-title">@lang('common.newsletter')</span>
                <svg class="icon-arrow d-md-none " role="" title="">
                    <use xmlns:xlink="http://www.w3.org/2000/svg" xlink:href="/img/icons/icon-defs.svg#icon-chevron-right"></use>
                </svg>
            </a>
        </div>
    </section>
</header>
