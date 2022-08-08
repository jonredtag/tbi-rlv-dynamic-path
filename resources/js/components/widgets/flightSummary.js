import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Lang from 'libraries/common/Lang';
import uniqueID from 'helpers/uniqueID';

import Collapse from 'reactstrap/lib/Collapse';

const FlightSummary = (props) => {
    const { sid, flightDetails, notes } = props;

    const [show, setShow] = useState(false);
    const [showReturn, setShowReturn] = useState(false);

    const [departureData, returnData] = flightDetails;
    const departureDepart = moment(departureData.departureDatetime);
    const departureArrival = moment(departureData.arrivalDatetime);
    const returnDepart = moment(returnData.departureDatetime);
    const returnArrival = moment(returnData.arrivalDatetime);
    let flightId = '';

    flightDetails.forEach((flightData, flightIndex) => {
        flightData.legs.forEach((flightLegs) => {
            flightId = flightId + flightLegs.carrierCode + flightLegs.flightNumber;
        });
        flightId += flightIndex;
    });
    return (
        <>
            <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-2 text-secondary">{Lang.trans('common.flight_details')}</h5>
                <a id="change_flight" className="text-dark font-weight-bold" href={`/flight/search?sid=${sid}`} data-productid={flightId}>{Lang.trans('dynamic.change_flight')}</a>
            </div>
            {
                // This is wear the test code starts
            }
            <div className="flight-product-component d-flex justify-content-around row m-0 gutter-10 border-0">
                <div className="col-12 p-0">
                    <h5 className="mt-3"><span className="flight-dot-divider">Departing Flight</span> {departureDepart.format('MMM DD, YYYY')}</h5>
                    <div className="flight-leg-section pb-1">
                        <div className="row gutter-10 flex-nowrap justify-content-between py-1">
                            <div className="align-items-start">
                                <img className="initial d-none d-sm-block loading flight-airline-logo" src={`https://travel-img-assets.s3-us-west-2.amazonaws.com/flights/carrier-48x48/${departureData.legs[0].carrierCode.toLowerCase()}.png`} alt={departureData.legs[0].carrier} />
                            </div>
                            <div className="">
                                <div className="align-items-center">
                                    <span className="font-weight-bold">{departureData.departureCode}</span>
                                    <span className="text-lowercase vacations-flight-time pl-2">{departureDepart.format('LT')}</span>
                                </div>
                                <div className="flight-date-time-section">
                                    <span className="text-dark font-weight-normal">{departureData.departureCity}</span>
                                    <span className="flight-date vacations-flight-date d-none">{departureDepart.format('MMM DD, YYYY')}</span>
                                </div>
                            </div>
                            <div className="float-right float-md-none mt-md-2 d-none mt-lg-0 ml-lg-2">
                                <div />
                            </div>
                            <div className="col-sm-1 col-2 text-center plane d-flex flex-column align-items-center">
                                <svg className="icon mt-1 mx-1" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-double-arrow" />
                                </svg>
                            </div>
                            {/* <div className="col-sm-1 col-2 text-center mt-2 plane d-flex flex-column align-items-center">
                                <svg className="icon mt-1 mx-1" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-double-arrow" />
                                </svg>
                                <small className="text-nowrap text-muted">{departureData.travelTime > 60 ? `${parseInt(departureData.travelTime / 60, 10)}h ` : ''}{departureData.travelTime % 60}m</small>
                                <small className="text-danger text-nowrap">{departureData.stops > 0 ? departureData.stops+' '+Lang.trans('flights.stop') : Lang.trans('flights.nonstop') }</small>
                            </div> */}
                            <div className="">
                                <div className="">
                                    <div className="align-items-center">
                                        <span className="font-weight-bold">{departureData.destinationCode}</span>
                                        <span className="text-lowercase vacations-flight-time pl-1">{departureArrival.format('LT')}</span>
                                    </div>
                                    <div className="flight-date-time-section">
                                        <span className="text-dark font-weight-normal">{departureData.destinationCity}</span>
                                        <span className="flight-date vacations-flight-date pr-0 d-none">{departureArrival.format('MMM DD, YYYY')}</span>
                                    </div>
                                </div>
                                {/* <div className=" d-inline-block ml-2" /> */}
                            </div>
                            <div className="">
                                <button type="button" className={`d-flex btn-unstyled ${show ? '' : 'collapsed'}`} onClick={() => { setShow(!show); }}>
                                    <svg className="icon rotate bg-light-blue-active" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-chevron-down" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="row gutter-10">
                            <div className="col-12">
                                <div className="row gutter-10 pt-2">
                                    <div className="col-lg-4 col-md-8 col-4 pl-0 d-none">
                                        <div className="mr-0 d-inline-block d-md-block d-lg-inline-block">
                                            <div className="d-flex align-items-center">
                                                <img className="initial d-none loading flight-airline-logo" src={`https://travel-img-assets.s3-us-west-2.amazonaws.com/flights/carrier-48x48/${departureData.legs[0].carrierCode.toLowerCase()}.png`} alt={departureData.legs[0].carrier} />
                                                <small className="flight-dot-divider ml-2">{departureData.legs[0].carrier}</small>
                                            </div>
                                            <small className="d-inline-block d-md-block" />
                                        </div>
                                    </div>
                                    <div id="mdl-flight-baggageinfo" className="d-md-block" />
                                    <div className="col-12">
                                        <div className="flight-airline-section d-inline-block align-top">
                                            <small className="flight-dot-divider">{departureData.legs[0].carrier}</small>
                                            <small className="flight-dot-divider">{Lang.trans('common.flight')} #{departureData.legs[0].flightNumber}</small>
                                            <small className="flight-dot-divider text-nowrap text-muted">{departureData.travelTime > 60 ? `${parseInt(departureData.travelTime / 60, 10)}h ` : ''}{departureData.travelTime % 60}m</small>
                                            <small className="flight-dot-divider text-danger text-nowrap">{departureData.stops > 0 ? `${departureData.stops} ${Lang.trans('flights.stop')}` : Lang.trans('flights.nonstop') }</small>
                                            <small className="d-inline-block">{departureData.class}</small>
                                            {/* <small className="d-inline-block text-secondary">
                                                    <a>Baggage Allowance</a>
                                                </small> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <small className="mt-2 d-none text-muted border-top pt-2">{Lang.trans('common.operated_by')}: {departureData.legs[0].operatedBy}</small>
                    </div>
                    <Collapse className="w-100" isOpen={show}>
                        <div>
                            <div className="pt-5">
                                {departureData.legs.map((leg) => (
                                    <div key={`${uniqueID()}`} className="d-flex align-items-center">
                                        <img className="flight-airline-logo-mobile-modal mr-2 align-self-start" src={`https://travel-img-assets.s3-us-west-2.amazonaws.com/flights/carrier-48x48/${leg.carrierCode.toLowerCase()}.png`} alt={leg.carrierCode} />
                                        <div className="ml-1 position-relative">
                                            <div className="flight-time-airport-section-container">
                                                <div className="flight-time-airport-section position-relative px-3">
                                                    <span className="flight-dot-divider">{moment(leg.departureDatetime).format('DD MMM hh:mm a')}</span>
                                                    {leg.departureName} ({leg.departureCode})
                                                </div>
                                                <div className="flight-travel-time flight-small-text pt-3 pb-3">{Lang.trans('dynamic.travel_time')}: {leg.duration > 60 ? `${parseInt(leg.duration / 60, 10)}h ` : ''}{leg.duration % 60}m</div>
                                            </div>
                                            <div className="ml-2 flight-time-airport-section mb-3 position-relative px-3">
                                                <span className="flight-dot-divider">{moment(leg.arrivalDatetime).format('DD MMM hh:mm a')}</span>
                                                {leg.destinationName} ({leg.destinationCode})
                                            </div>
                                            <div className="flight-small-text mb-3">
                                                <span className="flight-dot-divider">{moment(leg.departureDatetime).format('DD MMM, YYYY')}</span>
                                                <span className="flight-dot-divider d-none">
                                                    <img className="flight-airline-logo-mobile-modal mr-2 flex-shrink-0" src={`https://travel-img-assets.s3-us-west-2.amazonaws.com/flights/carrier-48x48/${leg.carrierCode.toLowerCase()}.png`} alt={leg.carrierCode} />
                                                    {leg.carrier}
                                                </span>
                                                <span className="flight-dot-divider">{Lang.trans('common.flight')} #{leg.flightNumber}</span>
                                                {/* <span className="flight-dot-divider" id="numberofbaggageinfo">* No free checked-in baggages</span> */}
                                                <span>{leg.class}</span>
                                            </div>
                                            {leg.operatedBy !== '' && (
                                                <div className="mb-4 class flight-small-text">{Lang.trans('common.operated_by')}: {leg.operatedBy}</div>
                                            )}
                                            {leg.layoverTime > 0 && (
                                                <div className="border-top border-bottom text-secondary pt-2 pb-2 mb-3">
                                                    <span className="flight-dot-divider">{leg.layoverTime >= 60 ? `${parseInt(leg.layoverTime / 60, 10)}h ` : ''}{leg.layoverTime % 60}m {Lang.trans('dynamic.layover')}</span>
                                                    <span className="flight-dot-divider">{leg.destinationName} ({leg.destinationCode})</span>
                                                    <svg className="icon fill-red" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-exclamation-triangle" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Collapse>
                    <div className="flight-leg-section pb-1">
                        <h5 className="mb-3"><span className="flight-dot-divider">Returning Flight</span> {returnDepart.format('MMM DD, YYYY')}</h5>
                        <div className="row gutter-10 flex-nowrap justify-content-between">
                            <div className="d-flex align-items-start">
                                <img className="initial d-none d-sm-block loading flight-airline-logo" src={`https://travel-img-assets.s3-us-west-2.amazonaws.com/flights/carrier-48x48/${departureData.legs[0].carrierCode.toLowerCase()}.png`} alt={departureData.legs[0].carrier} />
                            </div>
                            <div className="">
                                <div className="d-flex align-items-center">
                                    <span className="font-weight-bold">{returnData.departureCode}</span>
                                    <span className="text-lowercase vacations-flight-time pl-2">{returnDepart.format('hh:mmA')}</span>
                                </div>
                                <div className="flight-date-time-section">
                                    <span className="text-dark font-weight-normal">{returnData.departureCity}</span>
                                    <span className="flight-date vacations-flight-date d-none">{returnDepart.format('MMM DD, YYYY')}</span>
                                </div>
                            </div>
                            <div className="d-none float-right float-md-none mt-md-2 mt-lg-0 ml-lg-2">
                                <div />
                            </div>
                            <div className="col-sm-1 col-2 text-center plane d-flex flex-column align-items-center">
                                <svg className="icon mt-1 mx-1" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-double-arrow" />
                                </svg>
                            </div>
                            <div className="col-sm-1 col-2 text-center mt-2 plane d-none flex-column align-items-center">
                                <svg className="icon plane px-1 flight-sidebar-plane-icon" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-double-arrow" />
                                </svg>
                                <small className="text-nowrap text-muted">{returnData.travelTime > 60 ? `${parseInt(returnData.travelTime / 60, 10)}h ` : ''}{returnData.travelTime % 60}m</small>
                                <small className="text-danger text-nowrap">{returnData.stops > 0 ? `${returnData.stops} ${Lang.trans('flights.stop')}` : Lang.trans('flights.nonstop') }</small>
                            </div>
                            <div className="">
                                <div className="">
                                    <div className="d-flex justify-content-end align-items-center">
                                        <span className="font-weight-bold">{returnData.destinationCode}</span>
                                        <span className="text-lowercase vacations-flight-time pl-2">{returnArrival.format('hh:mmA')}</span>
                                    </div>
                                    <div className="flight-date-time-section">
                                        <span className="text-dark font-weight-normal">{returnData.destinationCity}</span>
                                        <span className="flight-date vacations-flight-date pr-0 d-none">{returnArrival.format('MMM DD, YYYY')}</span>
                                    </div>
                                </div>
                                <div className=" d-inline-block ml-2" />
                            </div>
                            <div className="">
                                <button type="button" className={`d-flex btn-unstyled ${showReturn ? '' : 'collapsed'}`} onClick={() => { setShowReturn(!showReturn); }}>
                                    <svg className="icon rotate bg-light-blue-active" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-chevron-down" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="row gutter-10">
                            <div className="col-12">
                                <div className="row gutter-10 pt-2">
                                    <div className="col-lg-5 col-md-8 col-4 d-none">
                                        <div className="mr-0 d-inline-block d-md-block d-lg-inline-block">
                                            <div className="d-flex align-items-center">
                                                <img className="initial d-none loading flight-airline-logo" src={`https://travel-img-assets.s3-us-west-2.amazonaws.com/flights/carrier-48x48/${returnData.legs[0].carrierCode.toLowerCase()}.png`} alt={returnData.legs[0].carrier} />
                                                <small className="flight-dot-divider">{returnData.legs[0].carrier}</small>
                                            </div>
                                            <small className="d-inline-block d-md-block" />
                                        </div>
                                    </div>
                                    <div id="mdl-flight-baggageinfo" className="d-md-block" />
                                    <div className="col-12">
                                        <div className="flight-airline-section d-inline-block align-top">
                                            <small className="flight-dot-divider">{returnData.legs[0].carrier}</small>
                                            <small className="flight-dot-divider">{Lang.trans('common.flight')} #{returnData.legs[0].flightNumber}</small>
                                            <small className="flight-dot-divider text-nowrap text-muted">{returnData.travelTime > 60 ? `${parseInt(returnData.travelTime / 60, 10)}h ` : ''}{returnData.travelTime % 60}m</small>
                                            <small className="flight-dot-divider text-danger text-nowrap">{returnData.stops > 0 ? returnData.stops +' '+Lang.trans('flights.stop') : Lang.trans('flights.nonstop') }</small>
                                            <small className="d-inline-block">{returnData.class}</small>
                                            {/* <small className="d-inline-block text-secondary">
                                                    <a>Baggage Allowance</a>
                                                </small> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <small className="mt-2 d-none text-muted border-top pt-2">{Lang.trans('common.operated_by')}: {returnData.legs[0].operatedBy}</small>
                    </div>
                </div>
                {notes.map((note, keynote) => (
                    <div className="mt-3 mb-0 alert alert-warning p-2 text-muted w-100" key={keynote}>
                        {note}
                    </div>
                ))}

                <Collapse className="w-100" isOpen={showReturn}>
                    <div>
                        <div className="pt-5">
                            {returnData.legs.map((leg) => (
                                <div key={`${uniqueID()}`} className="d-flex align-items-center">
                                    <img className="flight-airline-logo-mobile-modal mr-2 flex-shrink-0 align-self-start" src={`https://travel-img-assets.s3-us-west-2.amazonaws.com/flights/carrier-48x48/${leg.carrierCode.toLowerCase()}.png`} alt={leg.carrierCode} />
                                    <div className="ml-1 position-relative">
                                        <div className="flight-time-airport-section-container">
                                            <div className="flight-time-airport-section position-relative px-3">
                                                <span className="flight-dot-divider">{moment(leg.departureDatetime).format('DD MMM hh:mm a')}</span>
                                                {leg.departureName} ({leg.departureCode})
                                            </div>
                                            <div className="flight-travel-time flight-small-text pt-3 pb-3">{Lang.trans('dynamic.travel_time')}: {leg.duration > 60 ? `${parseInt(leg.duration / 60, 10)}h ` : ''}{leg.duration % 60}m</div>
                                        </div>
                                        <div className="ml-2 flight-time-airport-section mb-3 position-relative px-3">
                                            <span className="flight-dot-divider">{moment(leg.arrivalDatetime).format('DD MMM hh:mm a')}</span>
                                            {leg.destinationName} ({leg.destinationCode})
                                        </div>
                                        <div className="flight-small-text mb-3">
                                            <span className="flight-dot-divider">{moment(leg.departureDatetime).format('DD MMM, YYYY')}</span>
                                            <span className="flight-dot-divider d-none">
                                                <img className="flight-airline-logo-mobile-modal mr-2 flex-shrink-0" src={`https://travel-img-assets.s3-us-west-2.amazonaws.com/flights/carrier-48x48/${leg.carrierCode.toLowerCase()}.png`} alt={leg.carrierCode} />
                                                {leg.carrier}
                                            </span>
                                            <span className="flight-dot-divider">{Lang.trans('common.flight')} #{leg.flightNumber}</span>
                                            {/* <span className="flight-dot-divider" id="numberofbaggageinfo">* No free checked-in baggages</span> */}
                                            <span>{leg.class}</span>
                                        </div>
                                        {leg.operatedBy !== '' && (
                                            <div className="mb-4 class flight-small-text">{Lang.trans('common.operated_by')}: {leg.operatedBy}</div>
                                        )}
                                        {leg.layoverTime > 0 && (
                                            <div className="border-top border-bottom text-secondary pt-2 pb-2 mb-3">
                                                <span className="flight-dot-divider">{leg.layoverTime > 60 ? `${parseInt(leg.layoverTime / 60, 10)}h ` : ''}{leg.layoverTime % 60}m {Lang.trans('dynamic.layover')}</span>
                                                <span className="flight-dot-divider">{leg.destinationName} ({leg.destinationCode})</span>
                                                <svg className="icon fill-red" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-exclamation-triangle" />
                                                </svg>
                                            </div>
                                        )}

                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Collapse>
            </div>
        </>
    );
};

FlightSummary.propTypes = {
    sid: PropTypes.string.isRequired,
    flightDetails: PropTypes.instanceOf(Object).isRequired,
    notes: PropTypes.instanceOf(Array).isRequired,
};

export default FlightSummary;
