<header class="main-header">
    <div id="nav-backdrop" class="nav-backdrop not-visible d-md-none "></div>
    <div class="container d-md-none">
        <div class="d-flex justify-content-between align-items-center">
            <a href="https://www.redtag.ca">
                <img src="https://travel-img-assets.s3.us-west-2.amazonaws.com/logos/logo-hsbc-red.png" alt="HSBC logo" class="header-logo" />
            </a>
            <a class="header-phone-number-mobile d-none" href="tel:18665733824">@lang('common.150_agents') | 1-866-573-3824</a>
            <button id="hamburger" class="navbar-toggler d-md-none " type="button" aria-expanded="false" aria-label="Toggle navigation">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
        </div>
    </div>

        <div class="mt-3 mt-md-0 border-bottom pb-2">
            <div class="container">
                <div class="row justify-content-between m-0 align-items-center">
                   <div class="header-text-sm-81 d-none d-md-block">
                        <a href="/">
                            <img src="https://travel-img-assets.s3.us-west-2.amazonaws.com/logos/logo-hsbc-red.png" alt="HSBC logo" class="header-logo loading" data-was-processed="true" />
                        </a>
                    </div>
                    <div class="justify-content-md-end">
                        <div class="d-flex flex-wrap justify-content-md-end">
                            <div class="d-flex flex-wrap justify-content-md-end align-items-md-center">
                                <div class="d-flex align-items-center card-text mb-2 mb-md-0 mr-lg-3 mr-xl-4 mr-md-1">
                                    <span class="d-md-none">hi,&nbsp;</span>
                                    <span class="member-name ellipsis d-inline-block">Tom<span class="d-md-none">!</span></span>
                                    <div class="blue-card rounded d-inline-block">@lang('confirmation.cardColorBlue')</div>
                                </div>
                                <div class="d-inline-block pl-md-2 header-tooltips ml-md-2 ml-lg-0 mt-1">
                                    <div class="tooltip-wrapper tooltipParent">
                                        <div class="tooltip tooltip-top tooltip-50 tooltip-sm-150 hide cash-miles-tooltip">
                                            <div id="account-popover" class="popover popover-bottom menu-popover fade in">
                                                <h3 class="title">@lang('confirmation.useTowards')</h3>
                                                <p class="popover-text"><b>@lang('confirmation.useTowards')</b></p>
                                                <p class="popover-text">* Terms and Conditions apply. <a href="/terms.php">Click here</a> for full details.':'* Des modalités s’appliquent.</p>
                                                <a class="btn btn-primary btn-lg btn-block" href="https://www.hsbc.ca/arrow/EarnRatio" target="blank">Learn about Balance Preference</a>
                                            </div>
                                        </div>
                                        @if(isset($user))
                                        <div id="account-link " class="d-flex">
                                            <div>
                                                <svg class="icon-lg" role="" title="">
                                                    <use xmlns:xlink="http://www.w3.org/2000/svg" xlink:href="/img/icons/icon-defs.svg#icon-money-bag"></use>
                                                </svg>
                                            </div>
                                            <div class="mt-n1 mt-md-0 d-md-flex align-items-center">
                                                <span class="dream-miles point-number ellipsis d-md-inline-block mb-1 mb-md-0">
                                                    {{ ucfirst($user['firstName'])." ".ucfirst($user['lastName']) }} </span>
                                                <svg class="icon icon-chevron-down ml-1 grey-lg d-none d-md-inline-block" role="" title="">
                                                    <use xmlns:xlink="http://www.w3.org/2000/svg" xlink:href="/img/icons/icon-defs.svg#icon-chevron-down"></use>
                                                </svg>
                                                <div class="points-text d-md-none mt-n2 mt-md-0 ml-md-1">
                                                    <svg class="icon icon-chevron-down grey-lg ml-1 d-md-none" role="" title="">
                                                        <use xmlns:xlink="http://www.w3.org/2000/svg" xlink:href="/img/icons/icon-defs.svg#icon-chevron-down"></use>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                        @endif
                                    </div>
                                </div>
                                <div class="float-right d-none d-md-block grey-links end-links pl-2 ml-3 mt-1">
                                    <a href="/fr/flights.php" target="_self"> Français </a>

                                    <a href="/logout.php" class="ml-md-3 ml-4">Sign out</a>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        @if(isset($user))

        <div class="py-md-3 py-2 px-0 points-value-bar text-white h5 font-weight-light mb-0">
            <div class="container d-flex align-items-center justify-content-md-center justify-content-between position-relative">
                <div>
                    <span class="d-md-inline-block d-none highlight-dream-miles font-weight-normal">You have <span class="font-weight-500">{{ number_format($user['points'])}} Points</span> to use towards your flight, hotel and car rental.</span>
                    <span class="d-md-none d-inline-block h6 mb-0 font-weight-light">You have <span class="font-weight-500"> Points</span> to use towards your flight, hotel and car rental.</span>
                </div>
                <div class="d-flex airmiles-header-tooltips align-items-center ml-2">
                    <div class="tooltip-wrapper tooltipParent text-dark">
                        <div class="tooltip tooltip-top how-dream-miles-tooltip hide">
                            <div id="account-popover" class="popover popover-bottom menu-popover fade in">
                                <h3 class="title">@lang('confirmation.useTowards')</h3>
                                <p class="popover-text"><b>@lang('confirmation.useTowards')</b></p>
                                <p class="popover-text">Terms and conditions apply. <a href="/terms.php">Click here</a> for full details see.</p>

                                <a href="/how-it-works.php" class="btn btn-primary btn-lg btn-block">How it Works</a>
                            </div>
                        </div>
                        <div id="account-link">
                            <svg class="icon icon-question-mark ml-1" role="" title="">
                                <use xmlns:xlink="http://www.w3.org/2000/svg" xlink:href="/img/icons/icon-defs.svg#icon-question-mark"></use>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        @endif
    <section id="navbar-mobile" role="navigation" class="navbar navbar-out border-bottom">
        <div class="nav navbar-nav container justify-content-between" role="menubar">
            <a class="nav-link nav-border-bottom" href="https://www.redtag.ca" role="menuitem">
                <svg class="icon d-md-none " role="" title="">
                    <use xmlns:xlink="http://www.w3.org/2000/svg" xlink:href="/img/icons/icon-defs.svg#icon-home"></use>
                </svg>
                <span class="nav-title">@lang('common.home')</span>
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
            <a class="nav-link nav-border-bottom active" href="https://www.redtag.ca/hotels.php" target="_blank" role="menuitem">
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
                <span class="nav-title">@lang('common.cars')</span>
                <svg class="icon-arrow d-md-none " role="" title="">
                    <use xmlns:xlink="http://www.w3.org/2000/svg" xlink:href="/img/icons/icon-defs.svg#icon-chevron-right"></use>
                </svg>
            </a>
            <a class="nav-link nav-border-bottom" href="https://www.redtag.ca/cruises.php" role="menuitem">
                <svg class="icon d-md-none " role="" title="">
                    <use xmlns:xlink="http://www.w3.org/2000/svg" xlink:href="/img/icons/icon-defs.svg#icon-info"></use>
                </svg>
                <span class="nav-title">@lang('common.program_deatils')</span>
                <svg class="icon-arrow d-md-none " role="" title="">
                    <use xmlns:xlink="http://www.w3.org/2000/svg" xlink:href="/img/icons/icon-defs.svg#icon-chevron-right"></use>
                </svg>
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
        </div>
    </section>
</header>
