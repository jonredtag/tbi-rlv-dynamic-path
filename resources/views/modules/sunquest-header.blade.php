<header class="main-header">
    <div id="nav-backdrop" class="nav-backdrop not-visible d-md-none "></div>
    <div id="filter-backdrop" class="results-filters-backdrop not-visible d-xl-none"></div>
    <div class="container">
        <div class="row justify-content-between pb-2">
            <a href="//www.sunquest.ca">
            <img src="https://sunquest-vacations.s3.ca-central-1.amazonaws.com/img/branding/logo-sunquest.svg" alt=" Logo" class="logo loading mb-0" data-was-processed="true">
            </a>
            <div class="main-header-info row  ">
                <div class="col-12 col-md-6 main-header-login text-md-right d-none d-md-block ">                    
                    
                </div>
                <div class="col-md-6 text-md-right pr-0">
                    <a href="tel:1-877-485-6060" class="phone-number d-md-none">1-877-485-6060</a>
                    <div class="phone-number d-none d-md-block">1-877-485-6060</div>
                    <div class="d-none d-md-block operation-time"><span>@lang('common.sunquest_mon_to_fri_hours')</span><span>@lang('common.sunquest_sat_to_sun_hours')</span></div>
                </div>
            </div>
            <button id="hamburger" class="navbar-toggler d-md-none " type="button" aria-expanded="false" aria-label="Toggle navigation">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
        </div>
    </div>
    <section id="navbar-mobile" role="navigation" class="navbar">
        <div class="nav navbar-nav container justify-content-between" role="menubar">
            <a class="nav-link nav-border-bottom" href="//www.sunquest.ca" role="menuitem">
                <svg class="icon d-md-none " role="" title="">
                    <use xmlns:xlink="http://www.w3.org/2000/svg" xlink:href="/img/icons/icon-defs.svg#icon-home"></use>
                </svg>
                <span class="nav-title">@lang('common.home')</span>
                <svg class="icon-arrow d-md-none " role="" title="">
                    <use xmlns:xlink="http://www.w3.org/2000/svg" xlink:href="/img/icons/icon-defs.svg#icon-chevron-right"></use>
                </svg>
            </a>
            <a class="nav-link nav-border-bottom" href="//www.sunquest.ca/flight-deals" role="menuitem">
                <svg class="icon d-md-none " role="" title="">
                    <use xmlns:xlink="http://www.w3.org/2000/svg" xlink:href="/img/icons/icon-defs.svg#icon-plane-right"></use>
                </svg>
                <span class="nav-title">@lang('common.flights')</span>
                <svg class="icon-arrow d-md-none " role="" title="">
                    <use xmlns:xlink="http://www.w3.org/2000/svg" xlink:href="/img/icons/icon-defs.svg#icon-chevron-right"></use>
                </svg>
            </a>
            <a class="nav-link nav-border-bottom" href="//www.sunquest.ca/vacations-deals" role="menuitem">
                <svg class="icon d-md-none " role="" title="">
                    <use xmlns:xlink="http://www.w3.org/2000/svg" xlink:href="/img/icons/icon-defs.svg#icon-palm-trees"></use>
                </svg>
                <span class="nav-title">@lang('common.vacations')</span>
                <svg class="icon-arrow d-md-none " role="" title="">
                    <use xmlns:xlink="http://www.w3.org/2000/svg" xlink:href="/img/icons/icon-defs.svg#icon-chevron-right"></use>
                </svg>
            </a>
           {{--  <a class="nav-link nav-border-bottom" href="/flight-hotel" role="menuitem">
                <svg class="icon d-md-none " role="" title="">
                    <use xmlns:xlink="http://www.w3.org/2000/svg" xlink:href="/img/icons/icon-defs.svg#icon-palm-trees"></use>
                </svg>
                <span class="nav-title">@lang('common.flight_hotel')</span>
                <svg class="icon-arrow d-md-none " role="" title="">
                    <use xmlns:xlink="http://www.w3.org/2000/svg" xlink:href="/img/icons/icon-defs.svg#icon-chevron-right"></use>
                </svg>
            </a> --}}
            <a class="nav-link nav-border-bottom" href="//www.sunquest.ca/hotels" role="menuitem">
                <svg class="icon d-md-none " role="" title="">
                    <use xmlns:xlink="http://www.w3.org/2000/svg" xlink:href="/img/icons/icon-defs.svg#icon-bed"></use>
                </svg>
                <span class="nav-title">@lang('common.hotels')</span>
                <svg class="icon-arrow d-md-none " role="" title="">
                    <use xmlns:xlink="http://www.w3.org/2000/svg" xlink:href="/img/icons/icon-defs.svg#icon-chevron-right"></use>
                </svg>
            </a>
            <a class="nav-link nav-border-bottom" href="//www.sunquest.ca/cruises" role="menuitem">
                <svg class="icon d-md-none " role="" title="">
                    <use xmlns:xlink="http://www.w3.org/2000/svg" xlink:href="/img/icons/icon-defs.svg#icon-ship"></use>
                </svg>
                <span class="nav-title">@lang('common.cruises')</span>
                <svg class="icon-arrow d-md-none " role="" title="">
                    <use xmlns:xlink="http://www.w3.org/2000/svg" xlink:href="/img/icons/icon-defs.svg#icon-chevron-right"></use>
                </svg>
            </a>
            <a class="nav-link nav-border-bottom" href="www.sunquestc.ca/cars-rentals" role="menuitem">
                <svg class="icon d-md-none " role="" title="">
                    <use xmlns:xlink="http://www.w3.org/2000/svg" xlink:href="/img/icons/icon-defs.svg#icon-car"></use>
                </svg>
                <span class="nav-title">@lang('common.cars')</span>
                <svg class="icon-arrow d-md-none " role="" title="">
                    <use xmlns:xlink="http://www.w3.org/2000/svg" xlink:href="/img/icons/icon-defs.svg#icon-chevron-right"></use>
                </svg>
            </a>
            <a class="nav-link d-none d-md-inline-block " href="//www.sunquest.ca/last-minute-deals " role="menuitem">
                <svg class="icon d-md-none " role="" title="">
                    <use xmlns:xlink="http://www.w3.org/2000/svg" xlink:href="/img/icons/icon-defs.svg#icon-cruise"></use>
                </svg>
                <span class="nav-title">@lang('common.deals')</span>
                <svg class="icon-arrow d-md-none " role="" title="">
                    <use xmlns:xlink="http://www.w3.org/2000/svg" xlink:href="/img/icons/icon-defs.svg#icon-chevron-right"></use>
                </svg>
            </a>
            <a class="nav-link nav-call-button d-md-none  mb-3" href="tel:1-877-485-6060" role="menuitem">
                <svg class="icon d-md-none " role="" title="">
                    <use xmlns:xlink="http://www.w3.org/2000/svg" xlink:href="/img/icons/icon-defs.svg#icon-phone"></use>
                </svg>
                <span class="nav-title">@lang('common.call_us')</span>
                <svg class="icon-arrow d-md-none " role="" title="">
                    <use xmlns:xlink="http://www.w3.org/2000/svg" xlink:href="/img/icons/icon-defs.svg#icon-chevron-right"></use>
                </svg>
            </a>                       
        </div>
    </section>
</header>