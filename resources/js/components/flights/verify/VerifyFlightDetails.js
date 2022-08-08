import React, { Component } from 'react';
import { render } from 'react-dom';
import Lang from 'libraries/common/Lang';
import { Collapse } from 'reactstrap';
import axios from 'axios';
import Helper from 'libraries/common/Helper';
import FlightDetailsSection from 'components/flights/search/FlightDetailsSection';
import ModalPriceDetail from 'components/flights/verify/ModalPriceDetail';
import WhyBookWithUs from 'components/common/WhyBookWithUs';
import Modal from 'libraries/common/Modal';
import Insurance from 'components/common/Insurance';


class VerifyFlightDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showFlightDetails: false,
            flightdetails: null,
            collapseBasePriceToggle: false,
            collapseTaxesFeesToggle: false,
        };
        this.verifiedData = this.props.verifiedData;
        this.flightsDetails = this.verifiedData.cartResult.products.flight;

        this.showpriceDetailsModal = this.showpriceDetailsModal.bind(this);

        this.UIModals = new Modal();
    }


    toggleflightDetails(itinerary, resultsID){


        if(this.state.showFlightDetails === true)
        {
            this.setState({showFlightDetails: false});
        }
        else
        {
            this.setState({flightdetailsLoaderStatus: true});
            const baseUrl = document.getElementById('BASEURL').value;
            axios.post(baseUrl+'search/getFlightDetails/', {
                params: {
                    resultsID: resultsID,
                    itinerary: itinerary,
                }
            }).then((response) => {
                this.setState({showFlightDetails: true, flightdetails: response.data, flightdetailsLoaderStatus: false});
            }).catch((error) => {

            });
        }
    }

    getPriceDetails(pricingInfo) {

        const priceDetails = Object.keys(pricingInfo.passengers).map((item, key) => {

                                var paxType = Lang.trans('customer.adult')+'s:';
                                if(item!='ADT')
                                {
                                    if(item == 'INF') paxType = Lang.trans('customer.infant')+' (s)';
                                    else paxType = Helper.capitalizeFirstLetter(Lang.trans('engine.child')+' (s)');
                                }

                                return (
                                    <div key={`flight-price-${key}`}>
                                        <div className="row gutter-10 pl-sm-4">
                                            <h6 className="col-12 mt-2">Base Price</h6>
                                            <div className="col-12">{paxType} {pricingInfo.passengers[item].quantity} x {Lang.priceFormat(`${pricingInfo.passengers[item].baseFare}`)}</div>
                                            <h6 className="col-12 mt-3">Taxes & Fees</h6>
                                            <div className="col-12">{paxType} {pricingInfo.passengers[item].quantity} x {Lang.priceFormat(`${pricingInfo.passengers[item].taxes}`)}</div>
                                        </div>
                                    </div>);
                            });

        return priceDetails;
    }

    showpriceDetailsModal()
    {
        this.UIModals.show('#mdl-price-details');
    }


    render() {

        const itinerariesList = Object.keys(this.flightsDetails.slices).map((itinerary, keyItinerary) => {

            var startSegment = this.flightsDetails.slices[itinerary].segments[0];
            var endSegment = this.flightsDetails.slices[itinerary].segments[this.flightsDetails.slices[itinerary].segments.length-1];

            var durationDetails = (typeof this.flightsDetails.slices[itinerary].durationDetails != "undefined") ? this.flightsDetails.slices[itinerary].durationDetails : '';
            var flightNumber = (typeof startSegment.flight.number != "undefined") ? startSegment.flight.number : 'N/A';
            var flightCarrier = (typeof startSegment.flight.carrier != "undefined") ? startSegment.flight.carrier : '';

            var operatingCarrier = (typeof startSegment.flight.operatingCarrier != "undefined" && typeof this.flightsDetails.extras.carriers[`${startSegment.flight.operatingCarrier}`] != "undefined" && startSegment.flight.operatingCarrier != "") ?  'Operated by: '+this.flightsDetails.extras.carriers[`${startSegment.flight.operatingCarrier}`].name : '';

            var stopsText = '';
            //console.log(this.flightsDetails.slices[itinerary].stopCount);
            if(this.flightsDetails.slices[itinerary].stopCount == 0)
                stopsText = Lang.trans('flights.nonstop');
            else if(this.flightsDetails.slices[itinerary].stopCount == 1)
                stopsText = this.flightsDetails.slices[itinerary].stopCount+" "+Lang.trans('flights.stop');
            else if(this.flightsDetails.slices[itinerary].stopCount > 1)
                stopsText = this.flightsDetails.slices[itinerary].stopCount+" "+Lang.trans('flights.stops');

            var showCabin = (this.props.searchParams.preferedClass!='undefined' && this.props.searchParams.preferedClass == 'Y') ? false : true;

            return  (
                        <div className="flight-leg-section pb-1" key={keyItinerary}>
                            <div className="row gutter-10">
                                <div className="col-12">
                                    <div className="row gutter-10 mb-2 flight-top-info">
                                        {/*<small className="col-12 mb-2">Depart</small>*/}
                                        <div className="col-lg-5 col-md-8 col-6 mb-3">
                                            <div className="mr-4 mr-md-0 d-inline-block d-md-block d-lg-inline-block">
                                                <div className="d-flex align-items-center">
                                                    <img src={`https://travel-img-assets.s3-us-west-2.amazonaws.com/flights/carrier-48x48/${flightCarrier.toLowerCase()}.png`} alt={flightCarrier} className="initial loading flight-airline-logo" data-was-processed="true"/>
                                                    <small className="ml-2">{ this.flightsDetails.extras.carriers[flightCarrier] != 'undefined' ?  this.flightsDetails.extras.carriers[flightCarrier].name : '' }</small>
                                                </div>
                                                <small className="d-inline-block d-md-block">Operated by {operatingCarrier}</small>
                                            </div>
                                        </div>
                                        <div className="col-lg-7 col-md-4 col-6 mb-3 text-right">
                                            <div className="flight-airline-section mr-2 mr-lg-0 ml-lg-2 d-inline-block align-top">
                                                <small className="flight-dot-divider">Flight #{flightNumber}</small>
                                                <small className="d-inline-block">Economy</small>
                                                <small className="d-inline-block text-secondary">Baggage Allowance</small>
                                            </div>
                                        </div>
                                    </div>
                                    {/*<div className="mr-4 mr-md-0 d-inline-block ">
                                        <img src={`${IMG_LOGOS}carriers/small/${flightCarrier}.jpg`} alt={flightCarrier} className="initial loading flight-airline-logo" data-was-processed="true" />
                                    </div>
                                    <div className="flight-airline-section mr-2 mr-lg-0 ml-lg-2 d-inline-block">
                                        <div className="d-inline-block d-sm-block">{ this.flightsDetails.extras.carriers[flightCarrier] != 'undefined' ?  this.flightsDetails.extras.carriers[flightCarrier].name : '' }</div>
                                        <div className="d-inline-block d-sm-block">Flight #{flightNumber}</div>
                                        <div className="d-md-none">{operatingCarrier}</div>
                                    </div>*/}
                                </div>
                                <div className="col-5 col-md first-flight-detail">
                                    <div className="d-inline-block p-0 w-100">
                                        <div className="d-flex align-items-center"><span className="flight-airport-code vacation-flight-airport-code mr-0">{startSegment.origin}</span><span className="flight-destination-city font-weight-normal ellipsis pl-sm-2 pl-3">{this.flightsDetails.extras.airports[startSegment.origin].city}{/*<sup className="flight-alert-overnight">(+2)</sup>*/}</span></div>
                                        <div className="flight-date-time-section"><span className="flight-date vacations-flight-date d-block font-weight-bold">{new Date(startSegment.legs[0].departure).toDateString().split(' ').slice(1).join(' ')}</span><span className="text-lowercase font-weight-bold vacations-flight-time">{startSegment.legs[0].departureTime}</span></div>
                                    </div>
                                    <div className="d-md-inline-block float-right float-md-none  d-md-block mt-md-2 d-lg-inline-block mt-lg-0 ml-lg-2">
                                        <div></div>
                                    </div>
                                </div>
                                <div className="col-sm-1 col-2 text-center mt-2 plane d-flex flex-column align-items-center">
                                    <svg className="icon plane px-1 flight-sidebar-plane-icon" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-plane-right" />
                                    </svg>
                                    <small className="text-nowrap text-muted">{ durationDetails.formattedDuration == 0 ? 'N/A' : durationDetails.formattedDuration }</small>

                                    {
                                        stopsText == "Non-stop" ?
                                           <small className="text-success text-nowrap">{stopsText}</small>
                                         : <small className="text-danger text-nowrap">{stopsText}</small>
                                    }
                                    {/*xlinkHref="//dev.secure-sunquest.ca/assets/global/img/icons/icon-defs.svg#icon-plane-right"*/}
                                </div>
                                <div className="col-5 col-md text-right">
                                    <div className="d-inline-block p-0 w-100">
                                        <div className="d-flex justify-content-end align-items-center"><span className="flight-destination-city mr-0 font-weight-normal ellipsis pr-3 pr-sm-2 order-2 order-sm-1">{this.flightsDetails.extras.airports[endSegment.destination].city}</span><span className="flight-airport-code vacation-flight-airport-code mr-0 pl-0 order-1 order-sm-2">{endSegment.destination}</span></div>
                                        <div className="flight-date-time-section"><span className="flight-date vacations-flight-date pr-0 d-block font-weight-bold">{new Date(endSegment.legs[endSegment.legs.length-1].arrival).toDateString().split(' ').slice(1).join(' ')}</span><span className="text-lowercase font-weight-bold vacations-flight-time">{endSegment.legs[endSegment.legs.length-1].arrivalTime}</span></div>
                                    </div>
                                    <div className=" d-inline-block ml-2"></div>
                                </div>
                                {/*<div className="col-12 col-md-4 col-lg-12 mb-3">
                                    <div className="d-inline-block col-8 p-0">
                                        <div className="ellipsis">
                                            <span className="flight-airport-code">{startSegment.origin}</span><span className="flight-destination-city">{this.flightsDetails.extras.airports[startSegment.origin].city}   </span>
                                        </div>
                                        <div className="flight-date-time-section">
                                            <span className="flight-date">{startSegment.legs[0].departureDate}</span>{startSegment.legs[0].departureTime}<sup className="flight-alert-overnight">(+2)</sup>
                                        </div>
                                    </div>
                                    <div className="d-inline-block  ml-2">
                                        <div>{ durationDetails.formattedDuration == 0 ? 'N/A' : durationDetails.formattedDuration }</div>
                                        <div>{stopsText}</div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-4 col-lg-12  mb-3">
                                    <div className="d-inline-block col-8 p-0">
                                        <div className="ellipsis">
                                            <span className="flight-airport-code">{endSegment.destination}</span><span className="flight-destination-city">{this.flightsDetails.extras.airports[endSegment.destination].city}</span>
                                        </div>
                                        <div className="flight-date-time-section">
                                            <span className="flight-date">{endSegment.legs[endSegment.legs.length-1].arrivalDate}</span>{endSegment.legs[endSegment.legs.length-1].arrivalTime}<sup className="flight-alert-overnight">{(this.flightsDetails.slices[itinerary].numberOfDays !='' && this.flightsDetails.slices[itinerary].numberOfDays > 0) ? '(+'+this.flightsDetails.slices[itinerary].numberOfDays+')' : ''}</sup>
                                        </div>
                                    </div>

                                </div>*/}
                            </div>

                            <div className=" flight-small-text">
                                {
                                    (operatingCarrier!='') ? (<span className="flight-dot-divider">{operatingCarrier}</span>) : ''
                                }
                            </div>

                            { keyItinerary==this.flightsDetails.slices.length && this.flightsDetails.slices[itinerary].notes && this.flightsDetails.slices[itinerary].notes.length > 0 && this.flightsDetails.slices[itinerary].notes.map((note, keynote) => (
                                    <div className="flight-alert pl-2" key={keynote}>
                                    {note}
                                    </div>
                            ))}

                            {
                                (keyItinerary==this.flightsDetails.slices.length) ? (<div className="d-flex justify-content-between">
                                    <div className="flight-alert pl-2">Not all segments are business class</div>
                                </div>) : ''
                            }

                            {
                                (this.verifiedData.cartResult.products.flight.API!='Softvoyage' && keyItinerary==this.flightsDetails.itineraries.length-1) ? (<div className="d-flex justify-content-between mt-3">

                                    <button className="flight-details-btn pl-2" onClick={()=>{this.toggleflightDetails(this.flightsDetails.itineraries, this.flightsDetails.resultId)}} id={"fltDetailsbtn-" + keyItinerary}>
                                        {this.state.showFlightDetails ? Lang.trans('dynamic.hide_flight_details') : Lang.trans('dynamic.show_flight_details')}
                                        {
                                            this.state.flightdetailsLoaderStatus? (
                                                <svg className="icon loader ani-pulse ml-2" role="" title="" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-spinner" />
                                                </svg>
                                                ) : (

                                                    this.state.showFlightDetails ? (
                                                        <svg className="icon ml-2" role="" title="" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                                            <use xlinkHref="/img/icons/icon-defs.svg#icon-chevron-up" />
                                                        </svg>
                                                        ) : (
                                                        <svg className="icon ml-2" role="" title="" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                                            <use xlinkHref="/img/icons/icon-defs.svg#icon-chevron-down" />
                                                        </svg>
                                                        )

                                                )
                                        }

                                    </button>

                                </div>) : ''
                            }

                        </div>
                    );

        });

        return (
            <div id="price-sidebar" className="col-12 col-lg-5 col-xl-4 order-lg-last collapse d-lg-inline-block show mt-3">
                    <div className="rounded-sm box-shadow bg-white">
                        <div className="p-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0 primary-color">Flight Details</h5>
                                <a className="btn-underline-link" href="#">Change Flight</a>
                            </div>
                            <div className="flight-product-component d-flex justify-content-around row m-0 gutter-10 border-0">
                                <div className="col-12 p-0">

                                    {itinerariesList}

                                </div>

                                <Collapse className="w-100" isOpen={this.state.showFlightDetails} >
                                {
                                    (this.state.flightdetails !=null) ?
                                     <FlightDetailsSection pagename="verify" preferedclassName={this.props.preferedClass} totalPrice={this.verifiedData.cartResult.products.flight.rateInfo.pricingInfo.total} flightdetails={this.state.flightdetails} extras={this.verifiedData.cartResult.products.flight.extras} /> : ''
                                }
                                </Collapse>

                            </div>
                        </div>


                        <input type="hidden" id="noOfTickets" value={(typeof this.verifiedData.cartResult.products.flight.noOfTickets != "undefined" && this.verifiedData.cartResult.products.flight.noOfTickets!='') ?  this.verifiedData.cartResult.products.flight.noOfTickets : 1}/>


                        <div className="bg-grey border-top p-3">
                            <div className="d-flex justify-content-between  mb-3">
                                <div className="d-flex align-items-center">
                                    <h5 className="m-0">{Lang.trans('common.price_summary')}</h5>
                                </div>
                            </div>
                        {/* New Component */}
                            <div>
                                <div className="d-flex justify-content-between primary-color">
                                    <div className="d-flex align-items-center justify-content-between w-100">
                                        <button className={`d-flex align-items-center primary-color btn-unstyled ${this.state.collapseBasePriceToggle ? 'tab-opened':'tab-closed'}`} onClick={(e)=>{ this.setState({collapseBasePriceToggle: !this.state.collapseBasePriceToggle})}}>
                                            <div className="mr-2 mt-2">
                                                <svg className="icon" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-chevron-down" />
                                                </svg>
                                            </div>
                                            <h6 className="m-0">Flight Price</h6>
                                        </button>
                                        <div className="d-flex align-items-center">
                                            <div>{Lang.priceFormat(`${this.flightsDetails.rateInfo.pricingInfo.total}`)}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className={`collapse ${this.state.collapseBasePriceToggle? 'show' : ''}`}>
                                    { this.getPriceDetails(this.flightsDetails.rateInfo.pricingInfo) }
                                    <button className="btn-underline-link text-right w-100" onClick={this.showpriceDetailsModal}>Full price breakdown</button>
                                </div>
                            </div>
                            <div>{/* Insurance Component */}
                                <div className="d-flex justify-content-between mt-2">
                                    <div className="d-flex align-items-center justify-content-between w-100 primary-color">
                                        <button className={`d-flex align-items-center primary-color btn-unstyled ${this.state.collapseTaxesFeesToggle ? 'tab-opened':'tab-closed'}`} onClick={(e)=>{ this.setState({collapseTaxesFeesToggle: !this.state.collapseTaxesFeesToggle})}}>
                                            <div className="mr-2 mt-2">
                                                <svg className="icon" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-chevron-down" />
                                                </svg>
                                            </div>
                                            <h6 className="m-0">Travel Insurance</h6>
                                        </button>
                                        <div className="d-flex align-items-center">
                                            <div id="insurance_total_div">$0</div>
                                        </div>
                                    </div>
                                </div>
                                <div className={`collapse ${this.state.collapseTaxesFeesToggle? 'show' : ''}`}>
                                    <div className="row gutter-10 pl-sm-4" id="insurancePriceBreakdown">
                                        <div className="col-12">All Inclusive Adults: 2 x $183.59</div>
                                        <div className="col-12">All Inclusive Children (Age 8): 2 x $153.59</div>
                                        <div className="col-12">All Inclusive Children (Age 2): 1 x $127.59</div>
                                    </div>
                                </div>
                            </div>{/* End Insurance Component */}
                        {/* End New Component */}
                            {<ModalPriceDetail pricingInfo={this.flightsDetails.rateInfo.pricingInfo}/>}
                            <div className="row gutter-10">

                                {/* this.getPriceDetails(this.flightsDetails.rateInfo.pricingInfo)*/ }




                                {/* SITE_KEY=='airmiles' && this.state.airmilesRedeemAmount>0 ?
                                        (<div className="row gutter-10 m-0 w-100">
                                            <div className="col-9">{Lang.trans('airmiles.airmiles_redeemed_amount')}</div>
                                            <div className="col-3 text-right">-${Helper.formatMoney(this.state.airmilesRedeemAmount,2)}</div>
                                            <div className="col-9">{Lang.trans('airmiles.airmiles_service_fee')}</div>
                                            <div className="col-3 text-right">${Helper.formatMoney(this.airmilesServiceFee,2)}</div>
                                        </div>): null
                                */}
                            </div>
                        </div>

                        <div className="border-top p-3">
                            <div className="d-flex justify-content-between">
                                <div className="d-flex align-items-center">
                                    <h5 className="h4">{Lang.trans('common.total_price')}</h5>
                                </div>
                                <h5 id="flight_total_price" className="primary-color h4">C{Lang.priceFormat(`${this.flightsDetails.rateInfo.pricingInfo.total}`)}</h5>
                            </div>
                            <div className="text-right">
                                <div>There are <span className="text-danger">3 seats left</span></div>
                            </div>

                        </div>
                    </div>

                    <WhyBookWithUs />
            </div>
        );
    }


}

export default VerifyFlightDetails;
