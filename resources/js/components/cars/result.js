import React, { useState } from 'react';
import Lang, { priceFormat } from 'libraries/common/Lang';
import PropTypes from 'prop-types';
import UncontrolledTooltip from 'reactstrap/lib/UncontrolledTooltip';
import Collapse from 'reactstrap/lib/Collapse';
import ShowUpLift from 'components/common/ShowUpLift';
import ChooseFootprint from 'components/snippets/chooseFootprint';

const CarResult = (props) => {
    const {
        result,
        onFilterCategory,
        fetchTerms,
        onSelect,
        numberOfPax,
    } = props;

    const [moreDetailsOpen, toggleMoreDetails] = useState(false);
    const [priceOptionOpen, togglePriceOption] = useState(false);
    // const query = QueryToObject(window.location.href);

    const mainIncluded = (result.sippOptions !== undefined && result.sippOptions.length > 0) ? result.sippOptions : [];

    return (
        <div className="product-component-container border-top border-md-0">
            <div className="product-component dealElement py-2 px-3 px-md-0 border-0">
                <div className="row gutter-10 m-0">
                    <div className="product-img-container">
                    <button type="button" onClick={() => onFilterCategory(result.class)} className="d-block my-3 py-1 px-2 mx-auto car-class">{result.class}</button>
                        <img alt="" className="product-img px-3 float-none" src={result.image} />
                        <button type="button" className="d-block mt-md-3 mb-3 mx-auto text-underline btn-unstyled product-terms" onClick={() => { fetchTerms(result); }}>{Lang.trans('terms.terms_and_conditions_cap')}</button>
                    </div>
                    <div className="col-12 col-md product-title-container px-0 pl-md-2 pr-md-4">
                        <div className="content-wrapper">
                            <div className="d-flex flex-wrap align-items-center">
                                <h1 className="product-title d-block mt-1 mr-2">{result.name}</h1>
                                <div className="d-flex">
                                    <span className="mr-2 text-nowrap or-similar">{Lang.trans('cars.or_similar')}</span>
                                    <img alt="" className="d-block mt-2 py-1 btn-unstyled vendor-logo" src={`https://travel-img-assets.s3-us-west-2.amazonaws.com/cars/vendors/${result.vendor.toLowerCase().replace(' ', '-')}.jpg`} />
                                </div>
                            </div>
                            <div className="d-flex mt-2 pb-2 d-lg-none border-md-bottom">
                                <div className="mt-2 text-center">
                                    <svg className="icon car-details-icon" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-car-seat" />
                                    </svg>
                                    <div className="mt-1 car-detail-text">{result.passengers}{/* {Lang.trans('cars.seat')}*/}</div>
                                </div>
                                <div className="mt-2 ml-3 text-center">
                                    <svg className="icon car-details-icon" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-car-door-right" />
                                    </svg>
                                    <div className="mt-1 car-detail-text">{result.doors}</div>
                                </div>
                                {result.luggage && (
                                    <div className="mt-2 ml-3 text-center">
                                        <svg className="icon car-details-icon" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                            <use xlinkHref="/img/icons/icon-defs.svg#icon-luggage" />
                                        </svg>
                                        <div className="mt-1 car-detail-text">{result.luggage}</div>
                                    </div>
                                )}
                                <div className="mt-2 ml-3 text-center">
                                    <svg className="icon car-details-icon" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-transmission-left" />
                                    </svg>
                                    <div className="mt-1 car-detail-text">{(result.transmission.toLowerCase().indexOf('auto') > -1) ? 'Automatic' : Lang.trans('cars.manual')}</div>
                                </div>
                                <div className="mt-2 ml-3 text-center">
                                    <svg className="icon car-details-icon" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-snow-flakes" />
                                    </svg>
                                    <div className="mt-1 car-detail-text">A/C</div>
                                </div>
                                <div className="mt-2 ml-3 text-center">
                                    <svg className="icon car-details-icon" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-unlimited" />
                                    </svg>
                                    <div className="mt-1 car-detail-text">Unlimited</div>
                                </div>
                            </div>
                            <div className="border-bottom border-top d-md-none">
                                <button type="button" onClick={() => { toggleMoreDetails(!moreDetailsOpen); }} className={`btn-unstyled py-3 ${(moreDetailsOpen) ? '' : 'collapsed'}`}>
                                    <span className="text-closed text-secondary">See Details</span>
                                    <span className="text-open text-secondary">Close Details</span>
                                    <svg className="icon rotate ml-2">
                                        <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="/img/icons/icon-defs.svg#icon-chevron-down" />
                                    </svg>
                                </button>
                            </div>
                            <Collapse className="d-md-block" isOpen={moreDetailsOpen}>
                                <div className="mt-4 border-bottom pb-3 d-lg-flex d-none">
                                    <div className="mt-2 text-center d-flex align-items-center">
                                        <button type="button" aria-label="car-seat" id={`car-seat-tooltip-${result.resultId}`} className="btn-unstyled">
                                            <svg className="icon car-details-icon mr-2" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                                <use xlinkHref="/img/icons/icon-defs.svg#icon-car-seat" />
                                            </svg>
                                        </button>
                                        <div className="mt-1 car-detail-text">{result.passengers} {/*{Lang.trans('cars.seat')}*/}</div>
                                        <UncontrolledTooltip autohide={false} placement="top" target={`car-seat-tooltip-${result.resultId}`}>
                                            { window.Locale === 'en' && <span>{result.passengers} passenger</span> }
                                            { window.Locale === 'fr' && <span>{result.passengers} passagers</span> }
                                        </UncontrolledTooltip>
                                    </div>
                                    <div className="mt-2 ml-3 text-center d-flex align-items-center">
                                        <button type="button" aria-label="car-door" id={`car-door-tooltip-${result.resultId}`} className="btn-unstyled">
                                            <svg className="icon car-details-icon mr-2" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                                <use xlinkHref="/img/icons/icon-defs.svg#icon-car-door-right" />
                                            </svg>
                                        </button>
                                        <div className="mt-1 car-detail-text">{result.doors}</div>
                                        <UncontrolledTooltip autohide={false} placement="top" target={`car-door-tooltip-${result.resultId}`}>
                                            { window.Locale === 'en' && <span>{result.doors} doors</span> }
                                            { window.Locale === 'fr' && <span>{result.doors} portes</span> }
                                        </UncontrolledTooltip>
                                    </div>
                                    {result.luggage && (
                                        <div className="mt-2 ml-3 text-center d-flex align-items-center">
                                            <button type="button" aria-label="car-luggage" id={`car-luggage-tooltip-${result.resultId}`} className="btn-unstyled">
                                                <svg className="icon car-details-icon mr-2" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-luggage" />
                                                </svg>
                                            </button>
                                            <div className="mt-1 car-detail-text">{result.luggage}</div>
                                            <UncontrolledTooltip autohide={false} placement="top" target={`car-luggage-tooltip-${result.resultId}`}>
                                                { window.Locale === 'en' && <span>{result.luggage} lugguage</span> }
                                                { window.Locale === 'fr' && <span>{result.luggage} bagages</span> }
                                            </UncontrolledTooltip>
                                        </div>
                                    )}
                                    <div className="mt-2 ml-3 text-center d-flex align-items-center">
                                        <button type="button" aria-label="car-transmission" id={`car-transmission-tooltip-${result.resultId}`} className="btn-unstyled">
                                            <svg className="icon car-details-icon mr-2" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                                <use xlinkHref="/img/icons/icon-defs.svg#icon-transmission-left" />
                                            </svg>
                                        </button>
                                        <div className="mt-1 car-detail-text">{(result.transmission.toLowerCase().indexOf('auto') > -1) ? 'Automatic' : Lang.trans('cars.manual')}</div>
                                        <UncontrolledTooltip autohide={false} placement="top" target={`car-transmission-tooltip-${result.resultId}`}>
                                            { window.Locale === 'en' && <span>{(result.transmission.toLowerCase().indexOf('auto') > -1) ? 'Automatic' : Lang.trans('cars.manual')}</span> }
                                            { window.Locale === 'fr' && <span>{(result.transmission.toLowerCase().indexOf('auto') > -1) ? 'Automatic' : Lang.trans('cars.manual')}</span> }
                                        </UncontrolledTooltip>
                                    </div>
                                    <div className="mt-2 ml-3 text-center d-flex align-items-center">
                                        <button type="button" aria-label="car-aircondition" id={`car-aircondition-tooltip-${result.resultId}`} className="btn-unstyled">
                                            <svg className="icon car-details-icon mr-2" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                                <use xlinkHref="/img/icons/icon-defs.svg#icon-snow-flakes" />
                                            </svg>
                                        </button>
                                        <div className="mt-1 car-detail-text">A/C</div>
                                        <UncontrolledTooltip autohide={false} placement="top" target={`car-aircondition-tooltip-${result.resultId}`}>
                                            { window.Locale === 'en' && <span>Air Conditioner</span> }
                                            { window.Locale === 'fr' && <span>Climatisation</span> }
                                        </UncontrolledTooltip>
                                    </div>
                                    <div className="mt-2 ml-3 text-center d-flex align-items-center">
                                        <button type="button" aria-label="car-unlimited" id={`car-unlimited-tooltip-${result.resultId}`} className="btn-unstyled">
                                            <svg className="icon car-details-icon mr-2" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                                <use xlinkHref="/img/icons/icon-defs.svg#icon-unlimited" />
                                            </svg>
                                        </button>
                                        <div className="mt-1 car-detail-text">Unlimited</div>
                                        <UncontrolledTooltip autohide={false} placement="top" target={`car-unlimited-tooltip-${result.resultId}`}>
                                            { window.Locale === 'en' && <span>Unlimited</span> }
                                            { window.Locale === 'fr' && <span>Illimité</span> }
                                        </UncontrolledTooltip>
                                    </div>
                                </div>
                                <div className="d-flex flex-wrap border-bottom align-items-center py-3">
                                    <div className="row w-100">
                                        <div className="col-12 col-md d-flex">
                                            <div className="pick-drop-title font-weight-bold d-none">
                                                <svg className="icon chevron" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-map-pin" />
                                                </svg> {Lang.trans('cars.pickup_address')}
                                            </div>
                                            <svg className="icon icon-md mr-1 chevron" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                                <use xlinkHref="/img/icons/icon-defs.svg#icon-map-pin" />
                                            </svg>
                                            <span className="d-block mb-1 border-0 smaller-text">
                                                <span><strong>{result.pickup.name}</strong> {result.pickup.address}, {result.pickup.row.CountryName}</span>
                                            </span>
                                        </div>
                                        <div className="col-12 col-md pt-2 pt-md-0 d-flex">
                                            <div className="pick-drop-title font-weight-bold d-none">
                                                <svg className="icon chevron" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-map-pin" />
                                                </svg> {Lang.trans('cars.dropoff_address')}
                                            </div>
                                            <svg className="icon icon-md mr-1 chevron" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                                <use xlinkHref="/img/icons/icon-defs.svg#icon-map-pin" />
                                            </svg>
                                            <span className="d-block mb-1 border-0 smaller-text">
                                                <span><strong>{result.dropoff.name}</strong> {result.dropoff.address}, {result.dropoff.row.CountryName}</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {mainIncluded.length > 0 && (
                                    <div className="row mt-3">
                                        {mainIncluded.map((inc, i) => (
                                            <span key={`included-${i}-${result.resultId}`} className="smaller-text border-0 d-flex col-lg-6 mr-0 my-1">
                                                <svg className="icon mr-1 fill-green" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-checkmark-round" />
                                                </svg>
                                                <span className="green-text">
                                                    {inc}
                                                </span>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </Collapse> { /* end mobile only collapsible content */ }
                            <div className="border-md-top pt-1 mt-1 pt-md-2 pt-lg-3 mt-md-3">
                                <ChooseFootprint />
                            </div>
                        </div>{ /* end content-wrapper */}
                    </div>{ /* end col-12 col-md product-title-container px-0 pl-md-2 pr-md-4 */}
                    <div className="col-12 col-md price-container mt-1 mt-md-3 px-md-2 px-0 text-left text-md-center border-0">
                        <div className="basic-rate-price-module row gutter-10 align-items-center">
                            <div className="col-6 col-md-12">
                                <button type="button" className="price w-100 text-left text-md-center pl-0">
                                    {result.rates[0].rate >= 0 ? '+' : '-'} {priceFormat(Math.abs(result.rates[0].rate), 0)}
                                    <svg className="icon ml-1 align-baseline d-md-none" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-triangle-right}" />
                                    </svg>
                                </button>
                                <button type="button" id={`rate-info-static-0-${result.resultId}`} className="btn-unstyled modal-btn mb-1 text-left text-md-center w-100">
                                    <span className="flight-details">{result.rates[0].rateDescription}</span>
                                    <svg className="icon chevron" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-question-mark" />
                                    </svg>
                                </button>
                                {result.dropfeeIncluded === 'Y' && <div className="smaller-text pt-2 pb-3">({Lang.trans('cars.includes_one_way_fee')})</div>}
                            </div>
                            <UncontrolledTooltip autohide={false} placement="left" target={`rate-info-static-0-${result.resultId}`}>
                                <div className="text-left row p-1">
                                    <div className="col-6">
                                        <strong>{Lang.trans('common.included')}</strong><br />
                                        {result.rates[0].rateIncluded.map((inc, i) => (<div key={`rate-info-static-0-${result.resultId}-included-${i}`}>{inc}</div>))}
                                    </div>
                                    <div className="col-6">
                                        <strong>{Lang.trans('common.not_included')}</strong><br />
                                        {result.rates[0].rateExcluded.map((inc, i) => (<div key={`rate-info-static-0-${result.resultId}-excluded-${i}`}>{inc}</div>))}
                                    </div>
                                </div>
                            </UncontrolledTooltip>
                            <div className="d-md-inline-block col-6 col-md-12 text-md-center text-right">
                                <button type="button" onClick={() => onSelect(result.resultId, 0)} className="btn btn-primary btn-lg px-1 font-weight-bold button-main">
                                    {Lang.trans('buttons.select')}
                                    <svg className="icon ml-1" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-triangle-right" />
                                    </svg>
                                </button>
                            </div>
                            {UPLIFT_FEATURE && <ShowUpLift type="1" numberOfPax={numberOfPax} price={result.ratePerPerson} /> }
                        </div>
                        {result.rates[1] && (
                            <div className="more-options-section-tmp ">
                                <Collapse isOpen={priceOptionOpen}>
                                    <div className="mt-3 row align-items-center">
                                        <div className="col-6 col-md-12">
                                            <button type="button" className="price w-100 text-left text-md-center pl-0">
                                                {result.rates[1].rate >= 0 ? '+' : '-'} {priceFormat(Math.abs(result.rates[1].rate), 0)}
                                                <svg className="icon ml-1 align-baseline d-md-none " width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-triangle-right" />
                                                </svg>
                                            </button>
                                            <button type="button" id={`rate-info-static-1-${result.resultId}`} className="btn-unstyled modal-btn mb-1 text-left text-md-center w-100">
                                                <svg className="icon chevron" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-question-mark" />
                                                </svg>
                                                <span className="flight-details">{result.rates[1].rateDescription}</span>
                                            </button>
                                        </div>
                                        <UncontrolledTooltip autohide={false} placement="left" target={`rate-info-static-1-${result.resultId}`}>
                                            <div className="text-left row p-1">
                                                <div className="col-6">
                                                    <strong>{Lang.trans('common.included')}</strong><br />
                                                    {result.rates[1].rateIncluded.map((inc, i) => (<div key={`rate-info-static-1-${result.resultId}-included-${i}`}>{inc}</div>))}
                                                </div>
                                                <div className="col-6">
                                                    <strong>{Lang.trans('common.not_included')}</strong><br />
                                                    {result.rates[1].rateExcluded.map((inc, i) => (<div key={`rate-info-static-1-${result.resultId}-excluded-${i}`}>{inc}</div>))}
                                                </div>
                                            </div>
                                        </UncontrolledTooltip>
                                        <div className="d-md-inline-block col-6 col-md-12 text-right text-md-center">
                                            <button type="button" aria-label="Continue Inclusive" className="btn btn-primary btn-lg px-1 font-weight-bold button-main" onClick={() => onSelect(result.resultId, 1)}>
                                                {Lang.trans('buttons.select')}
                                                <svg className="icon ml-1 " width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-triangle-right" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </Collapse>
                                <button type="button" aria-expanded="true" className={`expand-details ${priceOptionOpen ? '' : 'collapsed'} btn-unstyled py-3`} onClick={() => { togglePriceOption(!priceOptionOpen); }}>
                                    <span className="text-closed text-secondary">More Options</span>
                                    <span className="text-open text-secondary">Close Options</span>
                                    <svg className="icon rotate ml-2" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-chevron-down" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>{ /*  end col-12 col-md price-container mt-1 mt-md-3 px-md-2 pr-0 text-left text-md-center */}
                </div>{ /*  end row gutter-10 m-0 */}
            </div>{ /*  end product-component dealElement */}
        </div>
    );
};

CarResult.propTypes = {
    onFilterCategory: PropTypes.func.isRequired,
    result: PropTypes.instanceOf(Object).isRequired,
    fetchTerms: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    numberOfPax: PropTypes.number.isRequired,
};

export default CarResult;
