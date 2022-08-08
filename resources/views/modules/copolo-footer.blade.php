<footer class="footer-secondary mt-5  payment border-top bg-white">
     <div class="container">
         <div class="d-md-flex text-center text-md-left pt-3 pb-3 border-bottom align-items-center">
             <div class="col-12 col-md-2 col-lg-2 pl-md-0 mb-2">
                 <a href="/">
                     <img height="50" src="https://copolo.s3.us-west-2.amazonaws.com/img/branding/logo-copolo.svg" alt="copolo Logo" class="logo w-100 loading" data-was-processed="true">
                 </a>
             </div>
             <div class="col-md-6 col-lg-4 col-xl-5 text-center text-md-left">
                <small>© <?=date('Y')?> copolo.com</small>
                <small class="d-block">535 Fifth Avenue, 14th Floor, New York, NY 10017</small>
            </div>
            <div class="text-center text-md-right text-lg-left mt-3 mt-md-0 ml-auto">
                 <div class="d-sm-inline-block pr-4 pr-md-0 pr-lg-4 pr-lg-3  mr-md-0 mr-lg-2 text-sm-right ml-sm-5 ml-md-0 align-top">
                     <div>
                         <svg class="icon mr-1 " role="img" title="">
                             <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/img/icons/icon-defs.svg#icon-phone"></use>
                         </svg>@lang('common.footer_contact_sales'):
                     </div>
                     <div>
                        1-888-313-5489
                     </div>
                 </div>
                 <div class="d-sm-inline-block text-sm-right mt-3 mt-sm-0">
                    <div>
                        <svg class="icon mr-1 " role="img" title="">
                            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/img/icons/icon-defs.svg#icon-clock"></use>
                        </svg>@lang('common.mon_to_fri_hours')
                    </div>
                    <div>@lang('common.sat_to_sun_hours')</div>
                    <?php if(date('Y-m-d') <= '2022-02-21') { ?>
                        <div><strong> @lang('common.day_closed')</strong></div>
                    <?php } ?>
                 </div>
            </div>
         </div>
         <div class="row justify-content-between pt-3 pb-3">
                <div class="col-md-6 col-lg-8 text-center text-md-left text-muted">
                    <small>H.I.S. International Tours(NY)– d.b.a. © <?=date('Y')?> copolo.com, Inc. is not responsible for content on external Web sites. 2021 HIS International Tours(NY), Inc. All rights reserved. CST# 2017288-40</small>
                </div>
         </div>
     </div>
</footer>
<!-- Adobe Launch -->
<script src="https://assets.adobedtm.com/cf6231cb8197/1adc5961e312/launch-3ffddd5c23dd.min.js" async></script>