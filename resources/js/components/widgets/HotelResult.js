import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Stars from 'components/widgets/stars';
import BookWithConfidence from 'components/widgets/bookWithConfidence';
import Lang, { priceFormat } from 'libraries/common/Lang';
import AmenityIcons from 'libraries/common/AmenityIcons';
import AmenityTranslations from 'libraries/common/AmenityTranslations';
// import numberFormat from 'helpers/numberFormat';
import AirmilesPoints from 'components/snippets/airmilesPoints';
import HsbcPoints from 'components/snippets/HsbcPoints';
import PetroPoints from 'components/snippets/petroPoints';
import CibcPoints from 'components/snippets/CibcPoints';
import ShowUpLift from 'components/common/ShowUpLift';
import ChooseFootprint from 'components/snippets/chooseFootprint';
import moment from 'moment';
import UncontrolledPopover from 'reactstrap/lib/UncontrolledPopover';
import PopoverBody from 'reactstrap/lib/PopoverBody';
import TrustYouSummary from 'components/widgets/trustYouSummary';
import TopicReview from 'components/snippets/topicReview';

import TabContent from 'reactstrap/lib/TabContent';
import TabPane from 'reactstrap/lib/TabPane';
import Tooltip from 'reactstrap/lib/Tooltip';

const HotelResult = (props) => {
    const {
        result,
        sid,
        numberOfPax,
        isStandalone,
        toggleFlightModal,
        toggleWishModal,
        travelDate,
        flightData,
    } = props;

    const [activeTab, setTab] = useState(0);
    const [tootlTipIsOpen, setTootlTipIsOpen] = useState(false);

    const imageOutput = result.image !== null && result.image !== '' ? result.image : 'https://travel-img.s3.amazonaws.com/2020-07-14--15947010820462no-photo.png';

    return (
        <>
            <div className="product-component-container">
                <div className="product-component">
                    <div className="row gutter-10 m-0">
                        <div className="col-12 col-md px-0 px-md-4 py-md-4 product-img-container h-100 flex-lg-275">
                            <img
                                className="product-img w-100 rounded-md"
                                src={imageOutput}
                                alt={result.name}
                            />
                            <div className="d-none d-md-flex mt-2">
                                {result.nearby !== '' && (
                                    <div className="my-2 d-flex">
                                        <div className="align-self-center">
                                            <svg
                                                className="icon-md mr-2"
                                                width="100%"
                                                height="100%"
                                                xmlns="http://www.w3.org/2000/svg"
                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                            >
                                                <use xlinkHref="/img/icons/icon-defs.svg#icon-map-pin" />
                                            </svg>
                                        </div>
                                        <div>{result.nearby}</div>
                                    </div>
                                )}
                            </div>
                            { isRefundablePath && (
                                <BookWithConfidence />
                            )}
                        </div>
                        <div className="col-12 col-md product-title-container flex-md-65 flex-lg-70 flex-xl-66">
                            <div className="row gutter-10">
                                <div className="ccol-12 col-sm-7 col-lg-8 px-0 pl-2 pr-md-2  ">
                                    <div className="content-wrapper">
                                        <div className="d-flex">
                                            <div className="d-flex flex-column title-star-container">
                                                <div>
                                                    <a
                                                        id={`hotel-name-${props.index}`}
                                                        className="product-title d-block mt-3 hotel-search-result font-weight-bold"
                                                        href={`/hotel/details/${result.id}?sid=${sid}${isRefundablePath ? '&refundable=1' : ''}`}
                                                        data-productid={result.id}
                                                    >
                                                        {result.name}
                                                    </a>
                                                    <Tooltip placement="top" isOpen={tootlTipIsOpen} target={`hotel-name-${props.index}`} toggle={() => setTootlTipIsOpen(prevState => !prevState)}>
                                                        {result.name}
                                                    </Tooltip>
                                                </div>
                                                <div className="d-flex flex-row flex-sm-row flex-md-column flex-lg-row">
                                                    <span
                                                        className="rating align-self-sm-center align-self-md-start align-self-lg-center d-inline-block mt-2 mb-3 m-sm-0"
                                                        title={`${result.rating} stars`}
                                                    >
                                                        <Stars
                                                            component={`HotelResult-${result.id}`}
                                                            rating={result.rating}
                                                        />
                                                    </span>
                                                    {result.reviews && (
                                                        <TrustYouSummary data={result.reviews} />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {moment().add(4, 'd').isBefore(travelDate) && isStandalone && (
                                            <div className="promo-free-cancellation font-weight-bold my-2 d-none d-md-block">
                                                <svg className="icon-check icon mr-1" title="">
                                                    <use
                                                        xmlnsXlink="http://www.w3.org/2000/svg"
                                                        xlinkHref="/img/icons/icon-defs.svg#icon-check"
                                                    />
                                                </svg>
                                                <span>Free Cancellation Available</span>
                                            </div>
                                        )}
                                        <div className="d-md-none mt-2">
                                            {result.nearby !== '' && (
                                                <div className="my-2 d-flex">
                                                    <div>
                                                        <svg
                                                            className="icon mr-2"
                                                            width="100%"
                                                            height="100%"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            xmlnsXlink="http://www.w3.org/1999/xlink"
                                                        >
                                                            <use xlinkHref="/img/icons/icon-defs.svg#icon-map-pin" />
                                                        </svg>
                                                    </div>
                                                    <div>{result.nearby}</div>
                                                </div>
                                            )}
                                        </div>
                                        {moment().add(4, 'd').isBefore(travelDate) && isStandalone && (
                                            <div className="promo-free-cancellation font-weight-bold my-2 py-1 px-2 color-pop d-md-none rounded-sm text-dark d-inline-block">
                                                <span>Free Cancellation </span>
                                            </div>
                                        )}
                                        {!isStandalone && (
                                            <div className="my-3">
                                                <button
                                                    type="button"
                                                    className="btn-unstyled  d-block mb-2"
                                                    onClick={toggleFlightModal}
                                                >
                                                    <svg
                                                        className="icon mr-2"
                                                        width="100%"
                                                        height="100%"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                                    >
                                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-plane-ascend-right" />
                                                    </svg>
                                                    <span className="text-underline">
                                                        {flightData.depDate}
                                                    </span>
                                                    {(flightData.legStops[0] !== 0 && (
                                                        <span className="red-text ml-1">
                                                            <small>({flightData.legStops[0]} Stop(s))</small>
                                                        </span>
                                                    )) || (
                                                        <span className="green-text ml-1">
                                                            <small>(Non-stop)</small>
                                                        </span>
                                                    )}
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn-unstyled d-block mb-2"
                                                    onClick={toggleFlightModal}
                                                >
                                                    <svg
                                                        className="icon mr-2"
                                                        width="100%"
                                                        height="100%"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                                    >
                                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-plane-ascend-left" />
                                                    </svg>
                                                    <span className="text-underline">
                                                        {flightData.retDate}
                                                    </span>
                                                    {(flightData.legStops[1] !== 0 && (
                                                        <span className="red-text ml-1">
                                                            <small>({flightData.legStops[1]} Stop(s))</small>
                                                        </span>
                                                    )) || (
                                                        <span className="green-text ml-1">
                                                            <small>(Non-stop)</small>
                                                        </span>
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                        <div
                                            id={`hotel-amenities-${result.id}`}
                                            className="amenities-preview-list flex-wrap mb-0 mt-2 d-none d-md-block"
                                        >
                                            {result.amenities.map((amenity, index) => (
                                                <svg key={index} className="icon-md mr-2" title="">
                                                    <use
                                                        xmlnsXlink="http://www.w3.org/2000/svg"
                                                        xlinkHref={AmenityIcons.get(amenity)}
                                                    />
                                                </svg>
                                            ))}
                                        </div>
                                        <UncontrolledPopover
                                            trigger="hover"
                                            placement="bottom"
                                            target={`hotel-amenities-${result.id}`}
                                        >
                                            <PopoverBody>
                                                {result.amenities.map((amenity,index) => (
                                                    <div key={`PopoverBody-${index}`}>
                                                        <svg className="icon-md mr-2" title="">
                                                            <use
                                                                xmlnsXlink="http://www.w3.org/2000/svg"
                                                                xlinkHref={AmenityIcons.get(amenity)}
                                                            />
                                                        </svg>
                                                        <span>{AmenityTranslations.get(amenity)}</span>
                                                    </div>
                                                ))}
                                            </PopoverBody>
                                        </UncontrolledPopover>
                                        {isStandalone && (
                                            <div className="border-md-top d-flex pt-md-2 pt-lg-3 mt-md-3">
                                                <ChooseFootprint sid={sid} />
                                            </div>
                                        )}
                                        {result.rate < 0 && (
                                            <div className="alert alert-warning mt-2 px-1 py-2">
                                                You coupon value exceeds the cost
                                            </div>
                                        )}
                                        {window.points === 'airmiles' && !isStandalone && (
                                            <div className="col-12 col-sm-7 col-lg-5 mt-1 p-0">
                                                <AirmilesPoints rate={result.baseRate} />
                                            </div>
                                        )}
                                        {window.points === 'petro' && (
                                            <PetroPoints rate={result.baseRate} />
                                        )}

                                        { isRefundablePath && (
                                            <div className="row mt-1">
                                                <span className="d-flex col-lg-6 mr-0 my-1">
                                                    <svg className="icon mr-1" title="">
                                                        <use
                                                            xmlnsXlink="http://www.w3.org/2000/svg"
                                                            xlinkHref="/img/icons/icon-defs.svg#icon-checkmark-thin"
                                                        />
                                                    </svg>
                                                    <span><small>Only $50 Deposit</small></span>
                                                </span>
                                                <span className="d-flex col-lg-6 mr-0 my-1">
                                                    <svg className="icon mr-1" title="">
                                                        <use
                                                            xmlnsXlink="http://www.w3.org/2000/svg"
                                                            xlinkHref="/img/icons/icon-defs.svg#icon-checkmark-thin"
                                                        />
                                                    </svg>
                                                    <span><small>Flexible cancellation options</small></span>
                                                </span>
                                                <span className="d-flex col-lg-6 mr-0 my-1">
                                                    <svg className="icon mr-1" title="">
                                                        <use
                                                            xmlnsXlink="http://www.w3.org/2000/svg"
                                                            xlinkHref="/img/icons/icon-defs.svg#icon-checkmark-thin"
                                                        />
                                                    </svg>
                                                    <span><small>FREE Check-in baggage</small></span>
                                                </span>
                                                <span className="d-flex col-lg-6 mr-0 my-1">
                                                    <svg className="icon mr-1" title="">
                                                        <use
                                                            xmlnsXlink="http://www.w3.org/2000/svg"
                                                            xlinkHref="/img/icons/icon-defs.svg#icon-checkmark-thin"
                                                        />
                                                    </svg>
                                                    <span><small>FREE Seat Selection</small></span>
                                                </span>
                                                <span className="d-flex col-lg-6 mr-0 my-1">
                                                    <svg className="icon mr-1" title="">
                                                        <use
                                                            xmlnsXlink="http://www.w3.org/2000/svg"
                                                            xlinkHref="/img/icons/icon-defs.svg#icon-checkmark-thin"
                                                        />
                                                    </svg>
                                                    <span><small>Price Drop Protection</small></span>
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="col-12 col-sm-5 col-md price-container mt-sm-3 px-md-2 pr-2 border-md-0">
                                    <div className="d-flex justify-content-end d-sm-inline-block mt-2 pb-sm-2 align-items-center">
                                        {window.points === 'hsbc' && isStandalone && (
                                            <HsbcPoints rate={result.baseRate} />
                                        )}
                                        {window.points === 'airmiles' && !isStandalone && (
                                            <AirmilesPoints rate={result.baseRate} />
                                        )}
                                        {result.was && (
                                            <div className="discount-section mb-2 mb-md-1">
                                                <span className="was-price">Was $1,269 </span>
                                                <span className="save-price">Save $370 </span>
                                            </div>
                                        )}
                                        {result.promotion !== '' && (
                                            <small className="text-danger d-none d-md-block my-2">
                                                {result.promotion}
                                            </small>
                                        )}
                                        <div>
                                            <div>
                                                <span className="price-text hotel-search-result">
                                                    {priceFormat(Math.max(Math.floor(result.rate), 0), 0)}
                                                </span>
                                                <span className="tax-include-text">
                                                    <span className="d-inline d-sm-none d-md-inline ml-1"> {!isStandalone ? 'PP' : 'PN'}</span>
                                                </span>
                                            </div>
                                            <span className="d-none d-sm-block d-md-none border-bottom pb-1"> {!isStandalone ? 'Per Person' : 'Per Night'}</span>
                                            <div className="tax-include-text mt-1 mt-md-0 mb-md-2 mb-3">
                                                {(!isStandalone && (
                                                    <>
                                                        {result.discount > 0 && (
                                                            <span className="text-line-through">
                                                                {priceFormat(Math.max(result.preDiscount, 0), 0)}{' '}
                                                                {Lang.trans('common.per_guest')}
                                                            </span>
                                                        )}
                                                        <div className="d-md-none">per person</div>
                                                        <div className="mt-1">
                                                            {Lang.trans('common.includes_taxes')}
                                                        </div>
                                                    </>
                                                )) || (
                                                    <>
                                                        {result.discount > 0 && (
                                                            <span className="text-line-through">
                                                                {priceFormat(Math.max(result.preDiscount, 0), 0)}{' '}
                                                                {Lang.trans('hotels.for_nights', {
                                                                    duration: result.duration,
                                                                })}
                                                            </span>
                                                        )}
                                                        <div className="primary-color">
                                                            {priceFormat(Math.max(result.costPerRoom, 0), 0)}{' '}
                                                            {Lang.trans('hotels.for_nights', {
                                                                duration: result.duration,
                                                            })}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        {window.points === 'cibc' && isStandalone && (
                                            <CibcPoints rate={result.baseRate} />
                                        )}
                                        <div className="d-inline-block ml-3 ml-md-0">
                                            <a
                                                href={`/hotel/details/${result.id}?sid=${sid}${isRefundablePath ? '&refundable=1' : ''}`}
                                                className="btn btn-primary btn-lg hotel-search-result"
                                                data-productid={result.id}
                                            >
                                                {Lang.trans(isRefundablePath ? 'common.reserve' : 'buttons.continue')}
                                                <svg
                                                    className="icon ml-1 d-none d-md-inline"
                                                    title=""
                                                    width="100%"
                                                    height="100%"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                                >
                                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-triangle-right" />
                                                </svg>
                                            </a>
                                            {result.discount > 0 && (
                                                <div className="primary-color p-2 border-dashed font-weight-bold mt-2">
                                                    Coupon Applied
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {UPLIFT_FEATURE && !isRefundablePath && (
                                        <ShowUpLift
                                            type="1"
                                            numberOfPax={isStandalone ? 1 : numberOfPax}
                                            price={isStandalone ? result.costPerRoom : result.rate}
                                        />
                                    )}
                                    {typeof IS_DEVELOPMENT !== 'undefined' && (
                                        <>
                                            {result.breakdown && (
                                                <div className="mb-2">
                                                    <small className="bg-grey p-1">
                                                        H = ${parseFloat(result.breakdown.hotel, 10).toFixed(2)}
                                                    </small>{' '}
                                                    <small className="bg-grey p-1">
                                                        F = $
                                                        {parseFloat(result.breakdown.flight, 10).toFixed(2)}
                                                    </small>
                                                    {Object.prototype.hasOwnProperty.call(result.breakdown, 'transfer') && (
                                                        <small className="bg-grey p-1">
                                                            T = $
                                                            {parseFloat(result.breakdown.transfer, 10).toFixed(2)}
                                                        </small>
                                                    )}
                                                </div>
                                            )}
                                            <div className="mb-2 d-none d-md-block">
                                                <small className="bg-grey p-1">
                                                    VendorCode:{result.vendor}
                                                </small>
                                            </div>
                                        </>
                                    )}
                                </div>
                                { result.topics.length > 0 && (
                                    <TabContent className="col-12 pr-md-4 mb-2 mb-md-4" activeTab={activeTab}>
                                        <div className="my-2">
                                            {result.topics.map((topicItem, index) => (
                                                <button key={`setTabBtn-${index}`} type="button" className={`key-words border-0 text-nowrap d-inline-block mt-2 mr-2 px-3 py-2 ${index === activeTab ? 'active' : ''}`} onClick={() => { setTab(index); }}>{topicItem.name}</button>
                                            ))}
                                        </div>
                                        {result.topics.map((item, index) => (
                                            <TabPane tabId={index} className="review-section max-h-100 max-h-md-200 p-3">
                                                <TopicReview topic={item} />
                                            </TabPane>
                                        ))}
                                    </TabContent>
                                )}
                            </div>
                        </div>
                        <div className="col-12 d-md-none">
                            {result.amenities !== "" && (
                                <div
                                    id={`hotel-amenities-${result.id}`}
                                    className="amenities-preview-list flex-wrap mb-0 mt-2 mx-2 border-top py-2"
                                >
                                    {result.amenities.map((amenity,index) => (
                                        <svg key={`svg-${index}`} className="icon-md mr-2" title="">
                                            <use
                                                xmlnsXlink="http://www.w3.org/2000/svg"
                                                xlinkHref={AmenityIcons.get(amenity)}
                                            />
                                        </svg>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

HotelResult.propTypes = {
    result: PropTypes.instanceOf(Object).isRequired,
    sid: PropTypes.string.isRequired,
    numberOfPax: PropTypes.number.isRequired,
    isStandalone: PropTypes.bool.isRequired,
    toggleFlightModal: PropTypes.func.isRequired,
    toggleWishModal: PropTypes.func.isRequired,
    travelDate: PropTypes.string.isRequired,
    flightData: PropTypes.instanceOf(Object).isRequired,
};

HotelResult.defaultProps = {
    flightData: {},
};

export default HotelResult;
