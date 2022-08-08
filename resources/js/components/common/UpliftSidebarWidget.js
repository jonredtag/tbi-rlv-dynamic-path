import React, { Component } from 'react';
import Helper from 'libraries/common/Helper';
import Lang, { priceFormat } from 'libraries/common/Lang';

const UpliftSidebarWidget = (props) => {
    const { mobile, minDepositOnly,showUpliftSidebar,minDepositAmount,dueDate,totalAmount,numerOfPax,watchedParams } = props;

    return (
        <div className={mobile? 'row border rounded mb-3 mx-0 p-3 color-pop d-lg-none': 'row border rounded mb-3 mx-0 p-3 color-pop d-none d-lg-block'} >
            <h5 className='primary-color'>
                {Lang.trans('common.package_qaulifies')}
            </h5>

            {minDepositOnly ? (
                <>
                    <div className='col-12 border rounded my-1 bg-white'>
                        <div className=' h-100 py-2'>
                            <div className='row  mx-0'>
                                <div className='col-3 col-sm-2 col-lg-3 pl-0'>
                                    <img
                                        className='w-100'
                                        src='https://redtag-ca.s3.amazonaws.com/img/logos/logo-bwc.svg'
                                    />
                                </div>
                                <div className='col-9 align-self-center bwc-color'>
                                    <h6 className='font-weight-bold ml-0 mb-1'>
                                        {Lang.trans('common.only_50')}
                                    </h6>
                                    <h6 className='font-weight-bold ml-0 mb-1'>
                                        {Lang.trans('payments_vacations.deposit')}
                                    </h6>
                                </div>
                            </div>
                        </div>
                    </div>
                    {false && (
                        <div className="mt-2 bg-white border rounded">
                            <button type="button" className="btn-watch-list rounded  py-2 px-3 px-md-1 px-lg-2 align-middle w-100 d-flex justify-content-center" onClick={watchedParams.toggle} disabled={watchedParams.isWatched}>
                                <svg
                                        className="icon-lg mr-2"
                                        title=""
                                        width="100%"
                                        height="100%"
                                        xmlns="http://www.w3.org/2000/svg"
                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                >
                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-eye-plus" />
                                </svg>
                                <span className="text-left font-weight-500 h6 mb-0 align-self-center">{Lang.trans(watchedParams.isWatched ? 'common.added_watchlist' : 'common.add_watchlist')}</span>
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <>
                    <div className='col-12 border rounded my-1 bg-white'>
                        <div className=' h-100 py-2'>
                            <h6 className='font-weight-bold'>
                                {Lang.trans('payments_vacations.pay_in_full_amount')}{' '}
                                {priceFormat(`${totalAmount}`)}
                            </h6>
                        </div>
                    </div>
                    <div
                        className={` ${showUpliftSidebar} col-12 border rounded my-1 bg-white`}
                    >
                        <div className=' h-100 py-2'>
                            <h6 className='font-weight-bold h6'>
                                {Lang.trans('uplift.radio_pay_monthly')}
                                <span className=' font-weight-bold h6 monthly-price-container mb-0'>
                                    <span className=''
                                        data-up-price-value={totalAmount*100} 
                                        data-up-price-type="total"
                                        data-up-price-model="total"
                                        data-up-comparison-type=""
                                        data-up-taxes-included="true"
                                    >
                                    <span className="up-from-or-text ml-1">{Lang.trans('uplift.from')}</span>                                
                                       <div className="d-inline-block ml-1">
                                           <span className="up-from-currency" data-up-from-currency="">$</span>
                                           <span className="" data-up-from-currency-unit-major=""></span>
                                           <span className=" up-from-per-month">/{Lang.trans('uplift.month')}</span>
                                           <svg className="icon ml-1 " role="" title="" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                               <use xlinkHref={`${IMG_ICONS}icon-defs.svg#icon-info-circle`} />
                                           </svg>
                                       </div> 
                                    </span>
                                </span>
                            </h6>
                            <p className='ml-0 mb-0'>{Lang.trans('common.powered_by')}{' '} 
                                <img
                                    className='uplift-logo-2'
                                    src='https://s3-us-west-2.amazonaws.com/travel-img-assets/logos/uplift.svg'
                                />
                            </p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default UpliftSidebarWidget;
