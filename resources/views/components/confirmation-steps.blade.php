<section class="breadcrumb-backend d-none d-md-block">
    <div class="container">
        <nav class="breadcrumb justify-content-end ">
            <div class="float-right">
                <ol class="results-steps">
                    @if(isset($breadcrumbs['hotels']))
                    <li class="completed">
                        @lang('common.hotel_selection')
                        <svg class="icon check" role="" title="">
                            <use xmlns:xlink="http://www.w3.org/2000/svg" xlink:href="/img/icons/icon-defs.svg#icon-check"></use>
                        </svg>
                    </li>
                    <li class="completed">
                        @lang('common.hotel_details')
                        <svg class="icon check" role="" title="">
                            <use xmlns:xlink="http://www.w3.org/2000/svg" xlink:href="/img/icons/icon-defs.svg#icon-check"></use>
                        </svg>
                    </li>
                    @endif
                    @if(isset($breadcrumbs['flights']))
                    <li class="completed">
                        @lang('common.flight_selection')
                        <svg class="icon check" role="" title="">
                            <use xmlns:xlink="http://www.w3.org/2000/svg" xlink:href="/img/icons/icon-defs.svg#icon-check"></use>
                        </svg>
                    </li>
                    @endif
                    @if(isset($breadcrumbs['cars']))
                    <li class="completed">
                        @lang('common.cars_section')
                        <svg class="icon check" role="" title="">
                            <use xmlns:xlink="http://www.w3.org/2000/svg" xlink:href="/img/icons/icon-defs.svg#icon-check"></use>
                        </svg>
                    </li>
                    @endif
                    <li class="completed">
                        @lang('common.booking')
                        <svg class="icon check" role="" title="">
                            <use xmlns:xlink="http://www.w3.org/2000/svg" xlink:href="/img/icons/icon-defs.svg#icon-check"></use>
                        </svg>
                    </li>
                    <li class="active">
                        Confirmation
                        <svg class="icon check" role="" title="">
                            <use xmlns:xlink="http://www.w3.org/2000/svg" xlink:href="/img/icons/icon-defs.svg#icon-check"></use>
                        </svg>
                    </li>
                </ol>
            </div>
        </nav>
    </div>
</section>
