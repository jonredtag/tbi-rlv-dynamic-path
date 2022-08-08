import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Collapse from 'reactstrap/lib/Collapse';
import Tooltip from 'reactstrap/lib/Tooltip';
import Helper from 'libraries/common/Helper';
import Formatter from 'helpers/formatter';
import Lang, { priceFormat } from 'libraries/common/Lang';

const PriceSummary = (props) => {
    const {
        packageInformation,
        insuranceInformation,
        isStandalone,
        discounts,
        addonInformation,
        redeemAmount,
        pointsConvertRate,
        coupon,
        chooseInformation,
        discountDueDate,
        products,
        showUpliftSidebar
    } = props;

    const [priceIsOpen, setPriceOpen] = useState(true);
    const [tooltipOpen, setTooltipOpen] = useState(false);

    const toggleTooltip = () => setTooltipOpen(!tooltipOpen);

    const hasCoupon = Object.keys(coupon).length > 0 && coupon.error === undefined;
    const discountRate = hasCoupon ? coupon.costs.value : 0;
    const totalAmount = Math.max(packageInformation.total + discountRate - discounts, 0)
        + (insuranceInformation ? insuranceInformation.total : 0)
        + (addonInformation && Object.prototype.hasOwnProperty.call(addonInformation, 'totalAmount') ? addonInformation.totalAmount : 0)
        + (chooseInformation !== null ? chooseInformation.price : 0);

    let totalChargeFromCard = totalAmount;
    if (redeemAmount > 0) {
        totalChargeFromCard -= redeemAmount;
    }
    const activityItems = addonInformation && Object.prototype.hasOwnProperty.call(addonInformation, 'activity') ? Object.values(addonInformation.activity.results) : [];

    return (
        <>
            <div className="border-top p-3 price-summary">
                <div className="d-flex justify-content-between mb-3">
                    <button
                        type="button"
                        className={`d-flex align-items-center justify-content-between btn-unstyled w-100
                            ${priceIsOpen ? '' : 'collapsed'}`}
                        onClick={() => {
                            setPriceOpen(!priceIsOpen);
                        }}
                    >
                        <h5 className="font-weight-bold">{Lang.trans('common.price_summary')}</h5>
                        {/* <div className=""> */}
                        <svg className="icon rotate bg-light-blue-active" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                            <use xlinkHref="/img/icons/icon-defs.svg#icon-chevron-down" />
                        </svg>
                        {/* </div> */}
                    </button>
                </div>
                <Collapse isOpen={priceIsOpen}>
                    {(!isStandalone && (
                        <>
                            <div>
                                <div className="d-flex justify-content-between">
                                    <div className="d-flex align-items-center justify-content-between w-100">
                                        <h6 className="font-weight-bold">{products && products.map((product) => Lang.trans(`product.${product}`)).join(' + ')}</h6>
                                        <div className="d-flex align-items-center">
                                            {packageInformation.priceChange !== 0 && (
                                                <div className="text-dark pr-2">
                                                    <del>
                                                        {priceFormat(packageInformation.priceChange * packageInformation.travellers * -1 + packageInformation.total)}
                                                    </del>
                                                </div>
                                            )}
                                            <div className="font-weight-bold">{priceFormat(packageInformation.total)}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row gutter-10">
                                    <h6 className="col-12 mt-2">
                                        {Lang.trans('payments_vacations.base_price_payment')}
                                    </h6>
                                    <div className="col-12">
                                        {Lang.trans('common.avg_passenger')}:{' '}
                                        {priceFormat(packageInformation.costPer)}
                                    </div>
                                    <h6 className="col-12 mt-3">
                                        {Lang.trans('payments_vacations.taxes_and_fees_payment')}
                                    </h6>
                                    <div className="col-12">
                                        {Lang.trans('common.avg_passenger')}:{' '}
                                        {priceFormat(packageInformation.taxes)}
                                    </div>
                                </div>
                                {addonInformation && Object.prototype.hasOwnProperty.call(addonInformation, 'transfer') && (
                                    <div>
                                        <div className="d-flex justify-content-between mt-2">
                                            <div className="d-flex align-items-center justify-content-between w-100">
                                                <h6 className="font-weight-bold">Transfer Total</h6>
                                                <div className="d-flex align-items-center">
                                                    <div className="font-weight-bold">{priceFormat(addonInformation.transfer.fare)}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {addonInformation && Object.prototype.hasOwnProperty.call(addonInformation, 'activity') && (
                                    <div>
                                        <div className="d-flex justify-content-between mt-2">
                                            <div className="d-flex align-items-center justify-content-between w-100">
                                                <h6 className="font-weight-bold">Activity Total</h6>
                                                <div className="d-flex align-items-center">
                                                    <div className="font-weight-bold">{priceFormat(addonInformation.activity.fare)}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {insuranceInformation && (
                                <div>
                                    <div className="d-flex justify-content-between mt-2">
                                        <div className="d-flex align-items-center justify-content-between w-100">
                                            <h6 className="font-weight-bold">{Lang.trans('payments_vacations.travel_insurance_payment')}</h6>
                                            <div className="d-flex align-items-center">
                                                <div className="font-weight-bold">{priceFormat(insuranceInformation.total)}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row gutter-10">
                                        {insuranceInformation.plans.map((plan) => (
                                            <div className="col-12">
                                                {plan.text}: {plan.numberPassengers} x{' '}
                                                {priceFormat(plan.costPer)}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )) || (activityItems.length > 0 ? (
                        <div>
                            {activityItems.map((item) => {
                                const { key, paxCount, paxAmounts } = item;
                                return paxAmounts.map((pax, paxIndex) => {
                                    const { age, paxType, amount } = pax;
                                    const count = paxCount[paxIndex];
                                    if (count) {
                                        let paxTypeShow = 'Adult';
                                        if (paxType === 'adult' && count > 1) {
                                            paxTypeShow = 'Adults';
                                        } else if (paxType === 'child') {
                                            if (count > 1) {
                                                paxTypeShow = 'Children';
                                            } else {
                                                paxTypeShow = 'Child';
                                            }
                                        }

                                        return (
                                            <div className="d-flex justify-content-between mt-2">
                                                <div key={`${key}-price-${paxIndex}`} className="d-flex align-items-center justify-content-between w-100">
                                                    <h6 className="m-0">
                                                        {`${paxTypeShow} ${paxType === 'child' ? `(Age ${age})` : ''}:`}  {`${count} x ${priceFormat(amount)}`}
                                                    </h6>
                                                    <div className="d-flex align-items-center">
                                                        <div>{priceFormat(count * amount)}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                });
                            })}
                        </div>
                    ) : (
                        <>
                            <div>
                                <div className="d-flex justify-content-between mt-2">
                                    <div className="d-flex align-items-center justify-content-between w-100">
                                        <h6 className="m-0">Avg nightly rate</h6>
                                        <div className="d-flex align-items-center">
                                            <div>{priceFormat(packageInformation.costPer)}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="d-flex justify-content-between mt-2">
                                    <div className="d-flex align-items-center justify-content-between w-100">
                                        <h6 className="m-0">
                                            {packageInformation.numRooms} Rooms X{' '}
                                            {packageInformation.numNights} Nights
                                        </h6>
                                        <div className="d-flex align-items-center">
                                            <div>{priceFormat(packageInformation.baseRate)}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="d-flex justify-content-between mt-2">
                                    <div className="d-flex align-items-center justify-content-between w-100">
                                        <h6 className="m-0 d-flex align-items-center ">
                                            Taxes & Fees
                                            <svg id="taxFees" className="icon pl-1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                                <use xlinkHref="/img/icons/icon-defs.svg#icon-exclamation-circle" />
                                            </svg>
                                        </h6>
                                        <Tooltip target="taxFees" isOpen={tooltipOpen} toggle={toggleTooltip}>
                                            This charge includes estimated amounts the travel service provider (i.e. hotel, car rental company) pays for their taxes, and/or taxes that we pay, to taxing authorities on your booking (including but not limited to sales, occupancy, and value added tax). This amount may also include any amounts charged to us for resort fees, cleaning fees, and other fees and/or a fee we, the hotel supplier and/or the website you booked on, retain as part of the compensation for our and/or their services, which varies based on factors such as location, the amount, and how you booked. For more details, please see the Terms and Conditions.
                                        </Tooltip>
                                        <div className="d-flex align-items-center">
                                            <div>{priceFormat(packageInformation.taxes - packageInformation.salesTax)}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {packageInformation.salesTax > 0 && (
                                <div>
                                    <div className="d-flex justify-content-between mt-2">
                                        <div className="d-flex align-items-center justify-content-between w-100">
                                            <h6 className="m-0 d-flex align-items-center ">
                                                Sales Tax
                                            </h6>
                                            <div className="d-flex align-items-center">
                                                <div>{priceFormat(packageInformation.salesTax)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            { redeemAmount > 0 && (
                                <div>
                                    <div className="d-flex justify-content-between mt-2">
                                        <div className="d-flex align-items-center justify-content-between w-100">
                                            <h6 className="m-0">{SITE_KEY === 'cibc' ? 'Cibc Points' : (SITE_KEY === 'hsbc' ? 'Hsbc Points' : '')} </h6>
                                            <div className="d-flex align-items-center">
                                                <div>-{priceFormat(redeemAmount)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ))}
                    {chooseInformation !== null && (
                        <div>
                            <div className="d-flex justify-content-between mt-2">
                                <div className="d-flex align-items-center justify-content-between w-100">
                                    <h6 className="font-weight-bold">Carbon Footprint Offset</h6>
                                    <div className="d-flex align-items-center">
                                        <div className="font-weight-bold">{priceFormat(chooseInformation.price)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {hasCoupon && (
                        <div>
                            <div className="d-flex justify-content-between">
                                <div className="d-flex align-items-center justify-content-between w-100">
                                    <h6 className="font-weight-bold">Coupon {coupon.code}</h6>
                                    <div className="d-flex align-items-center">
                                        <div className="font-weight-bold">{priceFormat(coupon.costs.value)}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="row gutter-10">
                                <div className="col-12">
                                    {Lang.trans('common.avg_passenger')}:{' '}
                                    {priceFormat(coupon.costs.fare)}
                                </div>
                            </div>
                        </div>
                    )}
                </Collapse>
                <div className="row gutter-10 mt-3" />
            </div>
            <div className="p-3">
                <div className="total-price px-3 py-2 mb-2">
                    <div className="d-flex justify-content-between">
                        <div className="d-flex align-items-center">
                            <h5 className="h4">{Lang.trans('common.total_price')}</h5>
                        </div>
                        <h5 className="primary-color h4">
                            {redeemAmount === 0 && (
                                <strong>{priceFormat(totalAmount)}</strong>
                            )}
                            {redeemAmount > 0 && (
                                <strong>
                                    {Helper.number_format(redeemAmount * pointsConvertRate)}{' '}
                                    Points + C
                                    {priceFormat(Math.max(0, packageInformation.total + insuranceInformation.total - discounts - redeemAmount))}
                                </strong>
                            )}
                        </h5>
                    </div>
                    <div className="text-right">All prices are in {APP_CURRENCY}</div>
                    {packageInformation.priceChange - discounts < -10 && (
                        <div className="text-right">
                            <del>
                                {Lang.trans('common.was')}{' '}
                                {priceFormat((packageInformation.priceChange - discounts) * packageInformation.travellers * -1 + packageInformation.total)}
                            </del>
                            <span> {Lang.trans('common.book_now_and')} </span>
                            <span className="text-secondary">
                                <b>
                                    <span className="text-uppercase">
                                        {Lang.trans('common.save')}
                                    </span>{' '}
                                    {priceFormat(packageInformation.priceChange * packageInformation.travellers * -1 + discounts)}
                                </b>
                            </span>
                        </div>
                    )}
                </div>
                {packageInformation.extraFees && (
                    <div className="py-2 px-3" style={{ backgroundColor: "whitesmoke" }}>
                        <div className="d-flex justify-content-between">
                            <p className="mb-0">Extra fees due at property</p>
                            <div>
                                <p className="mb-0">Approx <strong>{priceFormat(packageInformation.extraFees)}*</strong></p>
                            </div>
                        </div>
                        <div>
                            <small>The fees listed here are charged by the hotel either upon check-in or check-out.</small>
                        </div>
                    </div>
                )}
                <div className="d-flex">
                    <div className="text-white d-inline-block ml-auto best-price-guaranteed px-2 mt-1 mb-3">
                        <b>
                            {Lang.trans('payments_vacations.best_price_guaranteed_payment')}
                        </b>
                    </div>
                </div>
                <div className={`${showUpliftSidebar} d-flex justify-content-between monthly-price-container border-0 mb-1 align-items-center`}>
                    <div className="align-item-bottom">{Lang.trans('uplift.radio_pay_monthly')}</div>
                    <div
                        className="monthly-price-container text-left"
                        data-up-price-value={totalAmount * 100}
                        data-up-price-type="total"
                        data-up-comparison-type=""
                        data-up-price-model="total"
                        data-up-taxes-included="true"
                    >
                        <span className="d-inline-block up-from-or-text align-top mr-1">
                            {Lang.trans('uplift.from')}
                        </span>
                        <div className="d-inline-block">
                            <span
                                className="monthly-price up-from-currency"
                                data-up-from-currency=""
                            >
                                $
                            </span>
                            <span className="border-bottom bd-blue">
                                <span
                                    className="monthly-price"
                                    data-up-from-currency-unit-major=""
                                />
                                <span className="align-top up-from-per-month">/mo</span>
                            </span>
                            <svg
                                className="icon mt-1 ml-1 align-top"
                                width="100%"
                                height="100%"
                                xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                            >
                                <use xlinkHref="/img/icons/icon-defs.svg#icon-info-circle" />
                            </svg>
                        </div>
                    </div>
                </div>
                {packageInformation.deposit && (
                    <>
                        <div className="row">
                            <div className="col-8">
                                <div className="m-0">Deposit Paid at Booking</div>
                            </div>
                            <div className="col-4">
                                {priceFormat(packageInformation.deposit + insuranceInformation.total)}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-8">
                                <div className="m-0">Amount Due by {discountDueDate}</div>
                            </div>
                            <div className="col-4">
                                {priceFormat(packageInformation.total - packageInformation.deposit)}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

PriceSummary.propTypes = {
    packageInformation: PropTypes.instanceOf(Object).isRequired,
    insuranceInformation: PropTypes.instanceOf(Object).isRequired,
    redeemAmount: PropTypes.number,
    isStandalone: PropTypes.bool.isRequired,
    discounts: PropTypes.number,
    coupon: PropTypes.instanceOf(Object),
    chooseInformation: PropTypes.instanceOf(Object),
    addonInformation: PropTypes.instanceOf(Object).isRequired,
    products: PropTypes.instanceOf(Array).isRequired,
};

PriceSummary.defaultProps = {
    discounts: 0,
    redeemAmount: 0,
    coupon: {},
    chooseInformation: null,
};

export default PriceSummary;
