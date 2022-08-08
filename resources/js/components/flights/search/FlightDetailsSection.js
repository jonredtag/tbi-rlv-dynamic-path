import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Collapse from 'reactstrap/lib/Collapse';
import moment from 'moment';

import Lang from 'libraries/common/Lang';

class FlightDetailsSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            segmentDetailsBySlice: null,
            selectedTabId: null,
            collapseService: false,
        };
    }

    componentDidMount() {
        if (this.props.device !== 'mobile') this.getSegmentDetailsBySlice(Object.keys(this.props.flightdetails)[0], this.props.extras);
    }

    getSegmentDetailsBySlice(sliceId, extras) {
        if (this.props.device !== 'mobile') {
            this.setState({ segmentDetailsBySlice: 'Loading Details...' });
        }
        const { flightdetails } = this.props;

        const originCityName = extras.airports[flightdetails[sliceId].segments[0].origin].city;
        const destinationCityName = extras.airports[flightdetails[sliceId].segments[flightdetails[sliceId].segments.length - 1].destination].city;

        const totalDuration = flightdetails[sliceId].duration;
        const totalDurationHours = Math.floor(totalDuration / 60);
        const totalDurationMinutes = Math.floor(totalDuration % 60);

        let baggageQuantity = null;
        const segmentsDetails = (
            <>
                {flightdetails[sliceId].segments.map((segment, keysegment) => {
                    const freeBaggageQuantity = parseInt(segment.freeBaggageQuantity, 10);
                    if (baggageQuantity === null || freeBaggageQuantity < baggageQuantity) {
                        baggageQuantity = freeBaggageQuantity;
                    }

                    const { operatingCarrier = '' } = segment.flight;
                    return segment.legs.map((leg, keyleg) => {
                        const cabin = (leg.cabin !== undefined) ? leg.cabin : 'unknown cabin type';
                        const legDuration = leg.duration;
                        const legDeparture = moment(leg.departure, 'YYYY-MM-DD HH:mm:ss');
                        const legArrival = moment(leg.arrival, 'YYYY-MM-DD HH:mm:ss');
                        let legDurationHours = 0;
                        let legDurationMinutes = 0;
                        legDurationHours = Math.floor(legDuration / 60);
                        legDurationMinutes = Math.floor(legDuration % 60);

                        const eachLegExtraInfo = [];
                        if (leg.layoverTime !== undefined) {
                            eachLegExtraInfo.push(`${leg.layoverTime} layover`);
                        }
                        if (leg.layoverStop !== undefined && extras.airports[leg.layoverStop] !== undefined) {
                            eachLegExtraInfo.push(`${extras.airports[leg.layoverStop].name} (${leg.layoverStop})`);
                        }

                        return (
                            <div key={keyleg}>
                                {
                                    (keysegment === 0) ? (
                                        <h6 className="mb-3 d-flex justify-content-between">
                                        <span>
                                            <span className="flight-dot-divider">
                                                {`${originCityName} to ${destinationCityName}`}
                                                <svg className="icon icon-plane-right mx-2 d-none" role="img" title="">
                                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-plane-right" />
                                                </svg>
                                            </span>
                                            {moment.utc(leg.departure).format('ddd, DD MMM')}</span>
                                            {Lang.trans('dynamic.travel_time')}: {totalDurationHours}h {totalDurationMinutes}m
                                        </h6>
                                    ) : ''
                                }
                                <div className="d-flex justify-content-between">
                                   <div className="d-flex align-items-center">
                                       <img className="flight-airline-logo-mobile-modal mr-2 mb-5 flex-shrink-0" src={`https://travel-img-assets.s3-us-west-2.amazonaws.com/flights/carrier-48x48/${segment.flight.carrier.toLowerCase()}.png`} alt={segment.flight.carrier.toLowerCase()} />
                                        <div>
                                            <div>
                                                <div className="ml-1 flight-time-airport-section-container position-relative">
                                                    <div className="flight-time-airport-section position-relative px-3">
                                                        <span className="flight-dot-divider">{legDeparture.format('MMM DD')} {extras.airports[segment.origin].name}</span>
                                                        ({segment.origin})
                                                    </div>
                                                    <div className="flight-travel-time flight-small-text pt-3 pb-3">
                                                        <span className="flight-dot-divider">{Lang.trans('dynamic.travel_time')}: {legDurationHours}h {legDurationMinutes}</span>
                                                    </div>
                                                </div>
                                                <div className="ml-2 flight-time-airport-section mb-3 position-relative px-3">
                                                    <span className="flight-dot-divider">{legArrival.format('MMM DD')}</span>
                                                        {extras.airports[segment.destination].name} ({segment.destination})
                                                </div>
                                            </div>
                                             <div className="ml-4 flight-small-text mb-3">
                                                <span className="flight-dot-divider">{Object.prototype.hasOwnProperty.call(extras.carriers, segment.flight.carrier) ? extras.carriers[segment.flight.carrier].name : segment.flight.carrier}</span><span className="flight-dot-divider">{Lang.trans('common.flight')} #{segment.flight.number}</span><span>{cabin}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* <div className="">
                                        <div className="border rounded box-shadow color-pop">
                                            <button aria-expanded="" className="btn-unstyled d-flex justify-content-between p-3 w-100">
                                                <div>
                                                    <svg className="icon-md intro-color mx-2" role="" title="">
                                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-wifi"></use>
                                                    </svg>
                                                    <svg className="icon-md intro-color mx-2" role="" title="">
                                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-plug"></use>
                                                    </svg>
                                                    <svg className="icon-md intro-color mx-2" role="" title="">
                                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-black-video"></use>
                                                    </svg>
                                                    <svg className="icon-md intro-color mx-2" role="" title="">
                                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-seat"></use>
                                                    </svg>
                                                </div>
                                                <svg className="icon-sm intro-color mx-2 rotate" role="" title="">
                                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-chevron-down"></use>
                                                </svg>
                                            </button>
                                            <div className="collapse show">
                                                <div className="px-3 pb-3">
                                                    <div className="mt-2 d-flex text-center">
                                                        <svg className="icon-md intro-color mx-2" role="" title="">
                                                            <use xlinkHref="/img/icons/icon-defs.svg#icon-wifi"></use>
                                                        </svg>
                                                        <span className="text-left">Wi-Fi</span>
                                                    </div>
                                                    <div className="mt-2 d-flex text-center">
                                                        <svg className="icon-md intro-color mx-2" role="" title="">
                                                            <use xlinkHref="/img/icons/icon-defs.svg#icon-plug"></use>
                                                        </svg>
                                                        <span className="text-left">In-Seat Power &amp; USB Outlets</span>
                                                    </div>
                                                    <div className="mt-2 d-flex text-center">
                                                        <svg className="icon-md intro-color mx-2" role="" title="">
                                                            <use xlinkHref="/img/icons/icon-defs.svg#icon-black-video"></use>
                                                        </svg>
                                                        <span className="text-left">In-Seat Video Player</span>
                                                    </div>
                                                    <div className="mt-2 d-flex text-center">
                                                        <svg className="icon-md intro-color mx-2" role="" title="">
                                                            <use xlinkHref="/img/icons/icon-defs.svg#icon-seat"></use>
                                                        </svg>
                                                        <span className="text-left">Lie-flat Seat</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}
                                </div>
                                {/*<div className="flight-small-text mb-3">
                                    <span className="flight-dot-divider">{legDeparture.format('ll')}</span>
                                    <span className="flight-dot-divider">
                                        <img className="flight-airline-logo-mobile-modal flex-shrink-0" src={`https://travel-img-assets.s3-us-west-2.amazonaws.com/flights/carrier-48x48/${segment.flight.carrier.toLowerCase()}.png`} alt={segment.flight.carrier.toLowerCase()} />
                                    </span>
                                    <span className="flight-dot-divider">{Object.prototype.hasOwnProperty.call(extras.carriers, segment.flight.carrier) ? extras.carriers[segment.flight.carrier].name : segment.flight.carrier}</span><span className="flight-dot-divider">{Lang.trans('common.flight')} #{segment.flight.number}</span><span>{cabin}</span>
                                </div>
                                <div className="ml-1 flight-time-airport-section-container position-relative">
                                    <div className="flight-time-airport-section position-relative px-3">
                                        <span className="flight-dot-divider">{legDeparture.format('LT')}</span>
                                        {extras.airports[segment.origin].name} ({segment.origin})
                                    </div>
                                    <div className="flight-travel-time flight-small-text pt-3 pb-3">{Lang.trans('dynamic.travel_time')}: {legDurationHours}h {legDurationMinutes}</div>
                                </div>
                                <div className="ml-2 flight-time-airport-section mb-3 position-relative px-3">
                                    <span className="flight-dot-divider">{legArrival.format('LT')}</span>
                                    {extras.airports[segment.destination].name} ({segment.destination})
                                </div>*/}
                                <div className="mb-4 ml-4 class flight-small-text">
                                    {/*<span className="flight-dot-divider">{cabin}</span>*/}
                                    {(operatingCarrier !== '' && operatingCarrier !== segment.flight.carrier) && (
                                        <>
                                            {extras.carriers[operatingCarrier] !== undefined ? extras.carriers[operatingCarrier].name : operatingCarrier}
                                        </>
                                    )}
                                </div>
                                {
                                    (eachLegExtraInfo && eachLegExtraInfo.length > 0) ? (
                                        <div className="border-top border-bottom text-secondary pt-2 pb-2 mb-3">
                                            { (leg.changeOfAirport !== undefined && leg.changeOfAirport) && <span className="flight-dot-divider font-weight-bold">Change of airport</span>}
                                            { eachLegExtraInfo.map((extraInfo, keyextraInfo) => (
                                                <span className="flight-dot-divider" key={keyextraInfo}>{extraInfo}</span>

                                            ))}
                                            <svg className="icon " role="img" title="">
                                                <use xlinkHref="/img/icons/icon-defs.svg#icon-exclamation-triangle" />
                                            </svg>
                                        </div>
                                    ) : null
                                }
                                <hr />
                            </div>
                        );
                    });
                })}

                <div className="mb-3">{(typeof isRefundablePath !== 'undefined' && isRefundablePath) ? '1 Free checked-in bag (23kg)' : `${baggageQuantity > 0 ? baggageQuantity : 'No'} free checked-in baggage(s)`}  </div>
            </>
        );

        // this.setState({segmentDetailsBySlice: segmentsDetails, selectedTabId: sliceId});

        if (this.props.device !== 'mobile') this.setState({ segmentDetailsBySlice: segmentsDetails, selectedTabId: sliceId });
        else return segmentsDetails;
    }

    render() {
        const {
            flightdetails,
            extras,
            device,
        } = this.props;

        // const totalPax = parseInt(extras.searchParam.adults, 10) + parseInt(extras.searchParam.child, 10) + parseInt(extras.searchParam.infant, 10);

        const segmentsList = Object.keys(flightdetails).map((itinerary, keyItinerary) => {
            const { origin } = flightdetails[itinerary].segments[0];
            const { destination } = flightdetails[itinerary].segments[flightdetails[itinerary].segments.length - 1];

            return (

                (device === 'mobile') ? (
                    <div className="pt-4 mt-2" key={keyItinerary}>
                        <div className="h5 mb-1 text-center font-weight-bold">{origin} - {destination}</div>
                        {/*<div className=" pb-2 text-center text-muted">Monday, Oct 7 - 1 stop - 7h</div>*/}
                        <div className="bg-white p-3">
                            <div className="">
                                {this.getSegmentDetailsBySlice(itinerary, extras)}
                            </div>
                        </div>
                    </div>
                ) : (
                    <li className="nav-item text-left flex-grow-1" key={keyItinerary}>
                        <a
                            className={`p-4 nav-item-anchor ${(this.state.selectedTabId === itinerary ? 'active' : '')}`}
                            data-toggle=""
                            role="tab"
                            aria-controls=""
                            aria-selected="false"
                            onClick={() => { this.getSegmentDetailsBySlice(itinerary, extras); }}
                        >
                            <span className="">
                                <div className="mb-1 nav-title"> {keyItinerary === 0 ? 'Departure' : 'Return'} Flight</div>
                                {/* {<strong>{origin}</strong> 10:35 PM}
                                {<svg className="icon icon-chevron-right mb-1 mx-1" role="img" title="">
                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-double-arrow" />
                                </svg>}
                                {<strong>{destination}</strong> 10:35 AM} */}
                            </span>
                        </a>
                    </li>
                )

            );
        });

        return device === 'mobile' ? segmentsList : (
            <div>
                <div>
                    <nav className="pt-3 text-left list-unstyled nav-tabs tabs-highlight-bottom d-flex" role="tablist">
                        {segmentsList}
                    </nav>
                </div>
                <div className="px-3 pl-lg-3 pt-5">
                    {this.state.segmentDetailsBySlice}
                </div>
            </div>
        );
    }
}

FlightDetailsSection.propTypes = {
    flightdetails: PropTypes.instanceOf(Object).isRequired,
    device: PropTypes.string.isRequired,
    extras: PropTypes.instanceOf(Object).isRequired,
};

export default FlightDetailsSection;
