import React, { createRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import BookingSteps from 'components/common/BookingSteps';
import TravellerInformation from 'components/widgets/travellerInformation';
import SidebarLoader from 'components/widgets/sidebarLoader';
import ActivityLoader from 'components/widgets/activityLoader';
import PriceDropAlert from 'components/widgets/priceDropAlert';
import HotelSummary from 'components/widgets/hotelSummary';
import FlightSummary from 'components/widgets/flightSummary';

import PriceSummary from 'components/widgets/priceSummary';
import TransferOptions from 'components/widgets/transferOptions';
import ActivityOptions from 'components/widgets/activityOptions';
import TransferSummary from 'components/widgets/transferSummary';
import ActivitySummary from 'components/widgets/activitySummary';

import WhyBook from 'components/widgets/whyBook';
import ErrorText from 'components/snippets/errorText';
import uniqueID from 'helpers/uniqueID';
import Lang, { priceFormat } from 'libraries/common/Lang';
import moment from 'moment';
import errorModal from 'helpers/errorModal';
import customModal from 'helpers/customModal';
import Collapse from 'reactstrap/lib/Collapse';
import { findDOMNode } from 'react-dom';

const Review = (props) => {
    const {
        sid,
        tripInformation,
        parameters,
        breadcrumbs,
        features,
    } = props;

    const [showPriceDetails, setShowPriceDetails] = useState(false);
    const [verifyInformation, setVerifyInformation] = useState(null);
    const [addonOpts, setAddonOpts] = useState(null);
    const [addonInformation, setAddonInformation] = useState(null);
    const [selectAddonOpts, setSelectAddonOpt] = useState({ transfer: [], activity: [] });

    const products = Object.keys(breadcrumbs);

    if (features.addon) {
        breadcrumbs.review = false;
    }

    useEffect(() => {
        const verify = fetch(`/api/checkout/validation?sid=${sid}`);
        verify
            .then((response) => response.json())
            .then((verifyInfor) => {
                if (!Object.prototype.hasOwnProperty.call(verifyInfor, 'error')) {
                    setVerifyInformation(verifyInfor);
                } else if (verifyInfor.error.code === 'V1') {
                    customModal({
                        message: verifyInfor.error.message,
                        buttons: [
                            {
                                text: 'Change product',
                                onClick: () => {
                                    window.location.href = `${verifyInfor.error.route}?sid=${sid}`;
                                },
                                type: 'secondary',
                            },
                        ],
                    });
                } else {
                    errorModal(verifyInfor.error);
                }
            });
    }, []);

    useEffect(() => {
        if (verifyInformation) {
            fetch(`/api/addon/search?sid=${sid}&numRecords=4`)
                .then((response) => response.json())
                .then((result) => {


                    if (!Object.prototype.hasOwnProperty.call(result, 'error')) {
                        if (Object.prototype.hasOwnProperty.call(result, 'transfer') &&
                            Object.prototype.hasOwnProperty.call(result.transfer, 'error')) {
                            errorModal(result.transfer.error);
                            return;
                        }
                        if (Object.prototype.hasOwnProperty.call(result, 'activity') &&
                            Object.prototype.hasOwnProperty.call(result.activity, 'error')) {
                            errorModal(result.activity.error);
                            return;
                        }
                        // console.log(result);
                        setAddonOpts(result);
                        let selectTransferOps = [];
                        let selectActivityOps = [];
                        if (Object.prototype.hasOwnProperty.call(verifyInformation, 'addon')) {
                            setAddonInformation(verifyInformation.addon);
                            if (Object.prototype.hasOwnProperty.call(verifyInformation.addon, 'transfer')) {
                                selectTransferOps = Object.keys(verifyInformation.addon.transfer.results);
                            }
                            if (Object.prototype.hasOwnProperty.call(verifyInformation.addon, 'activity')) {
                                selectActivityOps = Object.keys(verifyInformation.addon.activity.results);
                            }
                        }
                        setSelectAddonOpt({ transfer: selectTransferOps, activity: selectActivityOps });
                    } else {
                        errorModal(result.error);
                    }
                });
        }
    }, [verifyInformation]);


    const filter = (filterValues, product = 'activity') => {
        const params = {
            sid,
            page: 0,
            filters: JSON.stringify(filterValues),
            product,
        };

        fetch('/api/addon/filter', {
            method: 'POST',
            body: JSON.stringify(params),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((result) => {
                if (!Object.prototype.hasOwnProperty.call(result, 'error')) {
                    // console.log(result);
                    addonOpts[product].list = result.list;
                    addonOpts[product].totalResults = result.totalResults
                    setAddonOpts({ ...addonOpts });
                } else {
                    errorModal(result.error);
                }
            });
    };

    const paginate = (page, product) => {
        fetch('/api/addon/paginate', {
            method: 'POST',
            body: JSON.stringify({ sid, page, product, numRecords:4 }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((result) => {
                if (!Object.prototype.hasOwnProperty.call(result, 'error')) {
                    // console.log(result);
                    addonOpts[product].list = result.list;
                    setAddonOpts({ ...addonOpts });
                } else {
                    errorModal(result.error);
                }
            });
    };

    const toggleShowPriceDetails = () => {
        setShowPriceDetails(showPriceDetails);
    };

    const onAddOpt = (type, id) => {
        selectAddonOpts[type].push(`${id}`);
        setSelectAddonOpt({ ...selectAddonOpts });
        const url = '/api/addon/add';
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                sid,
                type,
                id,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error !== undefined) {
                    errorModal(data.error);
                } else {
                    console.log(data);
                    setAddonInformation({ ...addonInformation, ...data });
                }
            });
    };

    const onRemoveOpt = (type, id) => {
        const findIndex = selectAddonOpts[type].findIndex((item) => item === `${id}`);
        if (findIndex !== -1) {
            selectAddonOpts[type].splice(findIndex, 1);
            setSelectAddonOpt({ ...selectAddonOpts });
        }
        const url = '/api/addon/remove';
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({ sid, type, id }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error !== undefined) {
                    errorModal(data.error);
                } else {
                    console.log(data);
                    setAddonInformation({ ...addonInformation, ...data });
                }
            });
    };


    const continuePurchase = () => {
        window.location = `/checkout/?sid=${sid}`;
    };

    return (
        <>
            <BookingSteps steps={breadcrumbs} active="review" />
            <div className="container pl-md-0 pr-md-0">
                <div className="row">
                    <div className="container border-bottom d-lg-none pl-md-0 pr-md-0 pt-2 pb-2 d-flex justify-content-between">
                        <div className="payment-mobile-price">
                            {verifyInformation && `Total C${priceFormat(verifyInformation.cost.total)}`}
                        </div>
                        <button type="button" className="btn-underline-link" onClick={toggleShowPriceDetails}>
                            <span className="open-details">{Lang.trans('common.confirm_details')}</span>
                            <span className="close-details d-none">Close Details</span>
                        </button>
                    </div>
                    <Collapse
                        isOpen={showPriceDetails}
                        id="price-sidebar"
                        className="col-12 col-lg-5 col-xl-4 order-lg-last d-lg-inline-block mt-3"
                    >
                        <div className="d-none d-lg-block">
                            {verifyInformation && <PriceDropAlert paymentInformation={verifyInformation.cost} />}
                        </div>
                        {(verifyInformation && (
                            <div className="rounded-sm box-shadow bg-white">
                                <div className="p-3">
                                    <HotelSummary
                                        sid={sid}
                                        hotelDetails={verifyInformation.hotel}
                                        isStandalone={false}
                                        customHotelDates={parameters.customHotelDates}
                                    />

                                    <FlightSummary
                                        sid={sid}
                                        flightDetails={verifyInformation.flight}
                                        notes={verifyInformation.notes.flights || []}
                                    />
                                </div>
                                {addonOpts &&
                                    Object.prototype.hasOwnProperty.call(addonOpts, 'transfer') &&
                                    Object.prototype.hasOwnProperty.call(addonOpts.transfer, 'list') &&
                                    addonOpts.transfer.list.length > 0 && (
                                    <TransferSummary
                                        step="review"
                                        removeOpt={onRemoveOpt}
                                        selectedList={
                                            addonInformation &&
                                            Object.prototype.hasOwnProperty.call(addonInformation, 'transfer')
                                                ? addonInformation.transfer
                                                : { results: [] }
                                        }
                                    />
                                )}
                                {addonOpts &&
                                    Object.prototype.hasOwnProperty.call(addonOpts, 'activity') &&
                                    Object.prototype.hasOwnProperty.call(addonOpts.activity, 'list') &&
                                    addonOpts.activity.list.length > 0 && (
                                    <ActivitySummary
                                        step="review"
                                        removeOpt={onRemoveOpt}
                                        selectedList={
                                            addonInformation &&
                                            Object.prototype.hasOwnProperty.call(addonInformation, 'activity')
                                                ? addonInformation.activity
                                                : { results: [] }
                                        }
                                    />
                                )}
                                <PriceSummary
                                    products={products}
                                    membershipAccountRedeemAmount={0}
                                    packageInformation={verifyInformation.cost}
                                    discounts={0}
                                    coupon={{}}
                                    insuranceInformation={null}
                                    addonInformation={addonInformation}
                                    isStandalone={false}
                                />
                            </div>
                        )) || <SidebarLoader />}
                    </Collapse>
                    <div className="col-12 col-lg-7 col-xl-8 pt-3 order-lg-first payment-form-section payment-form">
                        {!addonOpts && <ActivityLoader />}
                        {addonOpts &&
                            Object.prototype.hasOwnProperty.call(addonOpts, 'transfer') &&
                            Object.prototype.hasOwnProperty.call(addonOpts.transfer, 'list') &&
                            addonOpts.transfer.list.length > 0 && (
                            <TransferOptions
                                removeOpt={onRemoveOpt}
                                addOpt={onAddOpt}
                                totalResults={addonOpts.transfer.totalResults}
                                paginate={paginate}
                                options={addonOpts.transfer.list}
                                selectOpts={selectAddonOpts.transfer}
                                totalPax={tripInformation.passengers.adults + tripInformation.passengers.children}
                            />
                        )}

                        {addonOpts &&
                            Object.prototype.hasOwnProperty.call(addonOpts, 'activity') &&
                            Object.prototype.hasOwnProperty.call(addonOpts.activity, 'list') && (
                            <ActivityOptions
                                removeOpt={onRemoveOpt}
                                totalResults={addonOpts.activity.totalResults}
                                filterActivity={filter}
                                paginate={paginate}
                                addOpt={onAddOpt}
                                options={addonOpts.activity.list}
                                selectOpts={selectAddonOpts.activity}
                                sid={sid}
                            />
                        )}

                        {addonOpts && (
                            <button
                                type="button"
                                className="btn btn-lg p-3 btn-primary col-12 col-md-6 col-xl-5"
                                onClick={continuePurchase}
                            >
                                Continue Booking
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

Review.propTypes = {
    sid: PropTypes.string.isRequired,
    tripInformation: PropTypes.instanceOf(Object).isRequired,
    parameters: PropTypes.instanceOf(Object).isRequired,
    breadcrumbs: PropTypes.instanceOf(Object).isRequired,
    features: PropTypes.instanceOf(Object).isRequired,
};

export default Review;
