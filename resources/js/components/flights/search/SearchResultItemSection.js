import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { render } from 'react-dom';
import Lang, { priceFormat } from 'libraries/common/Lang';
import Loader from 'components/common/Loader';
import ModalFlightAcOptions from 'components/flights/search/ModalFlightAcOptions';
import FlightsTooltip from 'components/flights/common/FlightsTooltip';
import NewReturnDestination from 'components/flights/common/NewReturnDestination';
import ArriveNewDay from 'components/flights/common/ArriveNewDay';
import FlightDetailsSection from 'components/flights/search/FlightDetailsSection';
import Formatter from 'helpers/formatter';
import uniqueID from 'helpers/uniqueID';
import Collapse from 'reactstrap/lib/Collapse';
import Modal from 'reactstrap/lib/Modal';
import ModalBody from 'reactstrap/lib/ModalBody';
import AirmilesPoints from 'components/snippets/airmilesPoints';
import PetroPoints from 'components/snippets/petroPoints';
import ShowUpLift from 'components/common/ShowUpLift';
import ChooseFootprint from 'components/snippets/chooseFootprint';
import Modalobj from 'modules/modal';


class SearchResultItemSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            click: false,
            showFlightDetails: false,
            showMobileFlightDetails: false,
            flightdetails: null,
            flightdetailsLoaderStatus: false,
            loopkey: props.index,
            modalOpen: false,
            searchParams: {},
            preferedClass: JSON.parse('{"Y":"economy","S":"premium economy","C":"business","J":"premium business","F":"first","P":"premium first"}'),
        };

        this.handleSelectDepartureReturn = this.handleSelectDepartureReturn.bind(this);
        this.buildfarefamily = this.buildfarefamily.bind(this);
        this.buildfarefamilyDetails = this.buildfarefamilyDetails.bind(this);
        this.toggleflightDetails = this.toggleflightDetails.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.windowResize = this.windowResize.bind(this);
        this.verifyBaseUrl = 'http://localhost';
    }


    componentDidMount() {
        window.addEventListener('resize', this.windowResize);
        this.windowResize();
    }

    windowResize() {
        if (window.innerWidth > 767) {
            this.setState(state => ({ modalOpen: false }));
        }
    }

    toggleModal() {
        this.setState(state => ({ modalOpen: !state.modalOpen }));
    }

    handleFilterResults(newFilterValues) {
        this.props.onFilterChange(newFilterValues);
    }

    clickFlight(){
        this.setState({ click: true });
    }

    renderMobileFlightDetails(list) {
        const { flightdetails } = this.state;
        const { onSelect, isIncremental, sid } = this.props;
        const { extras } = this.props.data;
        if (flightdetails === null) {
            return (<div className="alert alert-warning">Failed to fetch Flight Details</div>);
        }

        const carriers = [];
        const segmentKeys = Object.keys(flightdetails);
        // departureDate of first segment first leg
        const departureDate = flightdetails[segmentKeys[0]].segments[0].legs[0].departureDate;
        // departureDate of last segment first leg
        const returnDate = flightdetails[segmentKeys[segmentKeys.length - 1]].segments[0].legs[0].departureDate;

        const segmentsList = segmentKeys.map((itinerary, keyItinerary) => {
            const origin = flightdetails[itinerary].segments[0].origin;
            const destination = flightdetails[itinerary].segments[flightdetails[itinerary].segments.length-1].destination;
            const flightCarrierOrigin = flightdetails[itinerary].segments[0].flight.carrier.toLowerCase();
            const logoOrigin = `https://travel-img-assets.s3-us-west-2.amazonaws.com/flights/carrier-48x48/${flightCarrierOrigin}.png`;
            carriers.push(<img key={`carrier_logo_${this.state.loopkey}_${keyItinerary}`} className="flight-airline-logo-mobile-modal mr-2 flex-shrink-0" src={logoOrigin} alt={flightCarrierOrigin} />);

            return <div key={`mobile_iata_segment_${this.state.loopkey}_${keyItinerary}`} className="h1 mb-0 text-center font-weight-bold">{ origin } - { destination }</div>
        });
        return (
            <div>
                <div className="py-4 bg-white">
                    <div className="d-flex align-items-center justify-content-center mb-1">
                        { carriers }
                    </div>
                    <>{ segmentsList }</>
                    <div className="text-center text-muted">{ departureDate } - { returnDate }</div>

                </div>
                <div className="text-center py-3 border-top bg-white">
                    <ChooseFootprint sid={sid} flightID={segmentKeys} />
                </div>
                <div className="p-3 text-center bg-white border-top border-bottom d-flex align-items-center">
                    <div className="col-6 text-nowrap"><strong className="h3">{ isIncremental && ((list.priceInfo.rate >= 0) ? '+' : '-')} {priceFormat(Math.floor(Math.abs(list.priceInfo.rate)), 0)}</strong></div>
                    <div className="col-6">
                        <button
                            type="button"
                            className="text-nowrap btn btn-primary btn-lg vac_modalBtn d-block mx-auto add-cart"
                            data-productid={list.itineraries.join('')}
                            onClick={() => onSelect(list)}
                        >{Lang.trans('flights.select_flight')}</button>
                    </div>
                </div>
                <FlightDetailsSection device="mobile" pagename="verify" preferedclassName={this.state.preferedClass} totalPrice={list.priceInfo.rate} flightdetails={flightdetails} extras={extras} />
            </div>
        );
    }

    toggleflightDetails(itinerary) {
        if (this.state.showFlightDetails === true) {
            this.setState({ showFlightDetails: !this.state.showFlightDetails });
        } else {
            this.setState({ flightdetailsLoaderStatus: true });

            const promise = fetch(`/api/flight/details?itinerary=${itinerary}&sid=${this.props.sid}`);
            promise.then((response) => response.text())
                .then((response) => {
                    this.setState({ showFlightDetails: true, flightdetails: JSON.parse(response), flightdetailsLoaderStatus: false });
                    if (window.innerWidth < 768) {
                        this.setState({ showMobileFlightDetails: true });
                    }
                });

        }
    }

    handleSelectDepartureReturn(e) {
        const { value, textContent, checked } = e.currentTarget;
        const { filterValues } = this.props;
        var splitVal = value.split("-");

        const newFilterValues = Object.assign({}, filterValues);
        if (splitVal[0] == 'dep' && checked) {
            newFilterValues.outboundSegmentKey = splitVal[1];
            newFilterValues.inboundSegmentKey = null;
        } else if (splitVal[0] == 'ret' && checked) {
            newFilterValues.outboundSegmentKey = null;
            newFilterValues.inboundSegmentKey = splitVal[1];
        } else {
            newFilterValues.outboundSegmentKey = null;
            newFilterValues.inboundSegmentKey = null;
        }
        this.handleFilterResults(newFilterValues);
    }

    buildfarefamilyDetails(acOptionPriceIndexes, farefamilyname, farefamilyDetails, loopkey, keyItinerary)
    {
        const { extras } = this.props.data;
        if (keyItinerary == 0)
        {
            acOptionPriceIndexes[`priceOut-${loopkey}`] = farefamilyDetails.rate;
            var price = parseFloat(acOptionPriceIndexes[`priceIn-${loopkey}`]) + parseFloat(farefamilyDetails.rate);
            price = price.toFixed(2);
            document.getElementById('price_'+loopkey).innerHTML = Lang.priceFormat(Formatter.money(price,0)+':0');
            document.getElementById('acFamilyOut_'+loopkey).value = farefamilyDetails.id;
        }

        if (keyItinerary == 1)
        {
            acOptionPriceIndexes[`priceIn-${loopkey}`] = farefamilyDetails.rate;
            var price = parseFloat(acOptionPriceIndexes[`priceOut-${loopkey}`]) + parseFloat(farefamilyDetails.rate);
            price = price.toFixed(2);
            document.getElementById('price_'+loopkey).innerHTML = Lang.priceFormat(Formatter.money(price,0)+':0');
            document.getElementById('acFamilyIn_'+loopkey).value = farefamilyDetails.id;
        }

        document.getElementById("btn-"+keyItinerary+'-'+farefamilyname).classList.add("active");

        const AcOptionsBody = document.getElementById('mdl-flight-acoptionsbody');
        var fareFamilyDetails = (extras.fareFamilyDetails !== undefined && extras.fareFamilyDetails[farefamilyname] !== undefined) ? extras.fareFamilyDetails[farefamilyname] : null;
        render(<ModalFlightAcOptions farefamily={farefamilyname} fareFamilyDetails={fareFamilyDetails} />, AcOptionsBody);
    }

    buildfarefamily(acOptionPriceIndexes, fareFamily, loopkey, keyItinerary) {

        const fareFamilyList = Object.keys(fareFamily.fareFamily).map((eachfareFamily, keyfareFamily) => {
            var dynamicClass = '';
            if (keyItinerary == 0 &&  acOptionPriceIndexes[`idOut-${loopkey}`]==fareFamily.fareFamily[eachfareFamily].id) dynamicClass = 'active';
            if (keyItinerary == 1 &&  acOptionPriceIndexes[`idIn-${loopkey}`]==fareFamily.fareFamily[eachfareFamily].id) dynamicClass = 'active';

            return (<button key={`${uniqueID()}`} className={`p-0 naked-btn air-canada-fare-options-btn mb-1 ${dynamicClass}`} id={`btn-${keyItinerary}-${eachfareFamily}`} onClick={()=>{this.buildfarefamilyDetails(acOptionPriceIndexes, eachfareFamily, fareFamily.fareFamily[eachfareFamily], loopkey, keyItinerary)}} key={`passengers-${keyfareFamily}`}><span className="d-inline-block fare-amount">{eachfareFamily} ${Formatter.money(fareFamily.fareFamily[eachfareFamily].saleTotal.amount,0)}</span></button>);
        });

        return fareFamilyList;
    }

    setAcOptionDefaultPrice(fareFamily, loopkey, keyItinerary) {
        var acOptionPriceIndexes = this.state.acOptionPriceIndex;
        var firstKey = Object.keys(fareFamily.fareFamily)[0];

        if (keyItinerary === 0) acOptionPriceIndexes['priceOut_'+loopkey] = fareFamily.fareFamily[Object.keys(fareFamily.fareFamily)[0]].saleTotal.amount;
        if (keyItinerary === 1) acOptionPriceIndexes['priceIn_'+loopkey] = fareFamily.fareFamily[Object.keys(fareFamily.fareFamily)[0]].saleTotal.amount;

        /* var acOptionPriceIndexes = this.state.acOptionPriceIndex;
        const fareFamilyList = Object.keys(fareFamily.fareFamily).map((eachfareFamily, keyfareFamily) => {

            if (keyItinerary === 0 && keyfareFamily === 0)
                acOptionPriceIndexes['priceOut_'+loopkey] = fareFamily.fareFamily[eachfareFamily].saleTotal.amount;

            if (keyItinerary==1 && keyfareFamily === 0)
                acOptionPriceIndexes['priceIn_'+loopkey] = fareFamily.fareFamily[eachfareFamily].saleTotal.amount;

        }); */
        // this.setState({acOptionPriceIndex: acOptionPriceIndexes});
    }

    render() {
        // const list = this.props.list;
        const list = this.props.result;
        const {
            filterValues,
            onSelect,
            parameters,
            isIncremental,
            data,
            sid,
        } = this.props;
        const { extras } = data;
        const numberOfPax = parseInt(parameters.occupancy[0].adults + parameters.occupancy[0].children);

        const acOptionPriceIndexes = {};

        const itinerariesList = [];
        itinerariesList.slices = [];
        itinerariesList.slicesDetails = [];
        itinerariesList.slicesMobile = [];
        itinerariesList.slicesBusinessClassAlert = [];

        const cabins = [];
        const notes = [];
        list.itineraries.map((itinerary, keyItinerary) => {
            const itinerarySlices = list.flightSummaries[`${itinerary}`];
            if (itinerarySlices.cabins !== undefined && itinerarySlices.cabins.length > 0) {
                const cabin = itinerarySlices.cabins[0];
                cabins.push(cabin);
            }

            const destinationDetails = (itinerarySlices.destinationDetails !== undefined) ? itinerarySlices.destinationDetails : '';
            const originDetails = (itinerarySlices.originDetails !== undefined) ? itinerarySlices.originDetails : '';
            const durationDetails = (itinerarySlices.durationDetails !== undefined) ? itinerarySlices.durationDetails : '';
            const flightNumber = (itinerarySlices.flightNumber !== undefined) ? itinerarySlices.flightNumber : 'N/A';
            const flightCarrier = (itinerarySlices.flightCarrier !== undefined) ? itinerarySlices.flightCarrier : '';

            const origin = (originDetails !== ' ') ? originDetails.origin : '';
            const destination = (destinationDetails !== ' ') ? destinationDetails.destination : '';
            //const logo = IMG_LOGOS+'carriers/small/'+flightCarrier+'.jpg';
            const logo = `https://travel-img-assets.s3-us-west-2.amazonaws.com/flights/carrier-48x48/${flightCarrier.toLowerCase()}.png`;
            let stopsText = '';
            const numberOfStops = itinerarySlices.stopCount;
            let numberOfStopsArr = [];
            if (numberOfStops > 0) {
                for (let i = 0; i < numberOfStops; i++) {
                    numberOfStopsArr.push(<div key={`stop-${itinerary}-${keyItinerary}-${i}`} className="flex-shrink-0 flight-stop-mobile bg-white" />);
                }
                numberOfStopsArr = (
                    <div key={`stop-container-${itinerary}`} className="d-flex justify-content-around mt-n1 mx-2">
                        {numberOfStopsArr}
                    </div>
                );
            }
            const destinationDateReadable = new Date(itinerarySlices.destinationDetails.arrival).toDateString();
            if (itinerarySlices.stopCount === 0) {
                stopsText = Lang.trans('flights.nonstop');
            } else if (itinerarySlices.stopCount === 1) {
                stopsText = `${itinerarySlices.stopCount} ${Lang.trans('flights.stop')}`;
            } else {
                stopsText = `${itinerarySlices.stopCount} ${Lang.trans('flights.stops')}`;
            }

            let selectDeptext = Lang.trans('flights.show_only_this_departure');
            let selectRetText = Lang.trans('flights.show_only_this_return');
            let checkedStatus = false;

            let selectDepClassName = "";
            if (keyItinerary === 0) selectDepClassName = "selectDep";
            else selectDepClassName = "selectRet";

            if (filterValues.outboundSegmentKey !== null && filterValues.outboundSegmentKey !== undefined) {            
                selectDeptext = Lang.trans('flights.unselect_this_departure');
                // if (keyItinerary!=0) selectDepClassName+= " hide";
                if (keyItinerary === 0) checkedStatus = true;
            }

            if (filterValues.inboundSegmentKey !== null && filterValues.inboundSegmentKey !== undefined) {                
                selectRetText = Lang.trans('flights.unselect_this_return');
                // if (keyItinerary === 0) selectDepClassName+= " hide";
                if (keyItinerary !== 0) checkedStatus = true;
            }
            // if (keyItinerary === 0 && list.api === 'AIRCANADA')
            // {
            //     acOptionPriceIndexes[`idOut-${this.state.loopkey}`] = list.priceInfo.fareFamily[`${itinerary}`].fareFamily[Object.keys(list.priceInfo.fareFamily[`${itinerary}`].fareFamily)[0]].id;
            //     acOptionPriceIndexes[`priceOut-${this.state.loopkey}`] = list.priceInfo.fareFamily[`${itinerary}`].fareFamily[Object.keys(list.priceInfo.fareFamily[`${itinerary}`].fareFamily)[0]].saleTotal.amount;
            // }
            // if (keyItinerary==1 && list.api === 'AIRCANADA')
            // {
            //     acOptionPriceIndexes[`idIn-${this.state.loopkey}`] = list.priceInfo.fareFamily[`${itinerary}`].fareFamily[Object.keys(list.priceInfo.fareFamily[`${itinerary}`].fareFamily)[0]].id;
            //     acOptionPriceIndexes[`priceIn-${this.state.loopkey}`] = list.priceInfo.fareFamily[`${itinerary}`].fareFamily[Object.keys(list.priceInfo.fareFamily[`${itinerary}`].fareFamily)[0]].saleTotal.amount;
            // }
            let flightNumberArr, flightNumberDep, flightNumberRet, originDeparture, destinationReturn, originDepartureCityCode, destinationReturnCityCode;
            flightNumberArr = Object.keys(list.flightSummaries).slice().reverse();
            //console.log(flightNumberArr);
            const airportCodesArr = [];
            for (var i = flightNumberArr.length - 1; i >= 0; i--) {
                flightNumberDep = flightNumberArr[i];
                flightNumberRet = flightNumberArr[i];

                originDeparture = list.flightSummaries[flightNumberDep].originDetails.origin;
                destinationReturn = list.flightSummaries[flightNumberRet].destinationDetails.destination;

                airportCodesArr.push(originDeparture,destinationReturn);
            }
            originDepartureCityCode = airportCodesArr[0];
            destinationReturnCityCode = airportCodesArr[airportCodesArr.length - 1];
            const legChecked = checkedStatus ? 'flight-leg-checked' : '';

            // console.log(keyItinerary, (airportCodesArr.length/2)-1, originDepartureCityCode, destinationReturnCityCode);
            itinerariesList['slices'].push((
                <div className="flight-leg-section-container h-100" key={itinerary}>
                    <div className={`flight-leg-section d-none d-md-flex border-top h-100 justify-content-center flex-column ${legChecked}`}>
                        <div className="d-md-flex justify-content-between gutter-10 align-items-center w-100">
                            <div className="col-4 d-flex flex-nowrap align-items-center">
                                {
                                    list.itineraries.length === 2 ? (
                                        <FlightsTooltip fid={`flight-select-btn-${this.state.loopkey}-${keyItinerary}`} flightToolTip depToolTipText={selectDeptext} retToolTipText={selectRetText} itin={keyItinerary} divClassName={`styled-checkbox theme-3 flight-select-leg-btn ${selectDepClassName}`} inputChecked={checkedStatus} inputType="checkbox" id="" inputOnChange={this.handleSelectDepartureReturn} inputClassName="filternoofstops w-100 h-100" inputValue={keyItinerary === 0 ? `dep-${itinerary}` : `ret-${itinerary}`} />
                                    ) : null
                                }
                                <div className="mr-4 mr-md-1 d-inline-block d-md-block d-lg-inline-block">
                                    <img src={logo} alt={flightCarrier} className="initial loading flight-airline-logo" />
                                </div>

                                <div className="flight-airline-section mr-2 mr-lg-0 ml-lg-2 d-inline-block ellipsis">
                                    <div className="ellipsis">
                                        { extras.carriers[flightCarrier] !== undefined ? extras.carriers[flightCarrier].name : '' }
                                    </div>
                                    <div className="">Flight #{flightNumber}</div>
                                    <div className="d-md-none"></div>
                                </div>
                            </div>
                            <div className="d-flex col-md-5 col-lg-5">
                                <div className="d-inline-block col-7 pr-3 p-0">
                                    <div className="ellipsis">
                                        {keyItinerary == 0 && originDepartureCityCode != destinationReturnCityCode ? (
                                            <>
                                                <span className="flight-airport-code new-location" id={`new-orig-location-${this.state.loopkey}-${keyItinerary}`}><NewReturnDestination keyItinerary={keyItinerary} nlid={`new-orig-location-${this.state.loopkey}-${keyItinerary}`}/>{origin}</span>
                                                <b>{originDetails.departureTime}</b>
                                            </>
                                        ) : (
                                            <>
                                                <span className="flight-airport-code" id={`${this.state.loopkey}-${keyItinerary}`}>{origin}</span>
                                                <b>{originDetails.departureTime}</b>
                                            </>
                                        )}
                                    </div>
                                    <div className="flight-date-time-section">
                                        {extras.airports[origin].city}<sup className="flight-alert-overnight" />
                                    </div>
                                </div>
                                <div>
                                    <div>{ durationDetails.formattedDuration === 0 ? 'N/A' : durationDetails.formattedDuration }</div>
                                    <div className="text-center">
                                        {stopsText === 'Non-stop' ? (
                                            <small className="text-success">{stopsText}</small>
                                        ) : (
                                            <small className="text-danger">{stopsText}</small>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="d-inline-block col-6 col-md-12 p-0">
                                    <div className="ellipsis">
                                        {keyItinerary == (airportCodesArr.length/2)-1 && originDepartureCityCode != destinationReturnCityCode ? (
                                            <>
                                                <span className="flight-airport-code new-location" id={`new-dest-location-${this.state.loopkey}-${keyItinerary}`}><NewReturnDestination keyItinerary={keyItinerary} nlid={`new-dest-location-${this.state.loopkey}-${keyItinerary}`}/>{destination}</span>
                                                <b>{destinationDetails.arrivalTime}<sup id={`new-day-${this.state.loopkey}-${keyItinerary}`} className="flight-alert-overnight">{(itinerarySlices.numberOfDays !='' && itinerarySlices.numberOfDays > 0) ? '(+'+itinerarySlices.numberOfDays+')' : ''}<ArriveNewDay fid={`new-day-${this.state.loopkey}-${keyItinerary}`} arrivalDate={destinationDateReadable} /></sup></b>
                                            </>
                                        ) : (
                                            <>
                                                <span className="flight-airport-code" id={`${this.state.loopkey}-${keyItinerary}`}>{destination}</span>
                                                <b>{destinationDetails.arrivalTime}<sup id={`new-day-${this.state.loopkey}-${keyItinerary}`} className="flight-alert-overnight">{(itinerarySlices.numberOfDays !='' && itinerarySlices.numberOfDays > 0) ? '(+'+itinerarySlices.numberOfDays+')' : ''}<ArriveNewDay fid={`new-day-${this.state.loopkey}-${keyItinerary}`} arrivalDate={destinationDateReadable} /></sup></b>
                                            </>
                                        )}
                                    </div>
                                    <div className="flight-date-time-section">
                                        {extras.airports[destination].city}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {list.api === 'AIRCANADA' ? (
                            <div className="link-list-scroll-x d-flex flex-wrap no-wrap justify-content-start mt-3 air-canada-fare-options">
                                {this.buildfarefamily(acOptionPriceIndexes, list.priceInfo.fareFamily[`${itinerary}`], this.state.loopkey, keyItinerary)}
                            </div>
                        ) : ''}
                    </div>
                </div>
            ));

            if (list.api !== 'Softvoyage' && (list.itineraries.length - 1) === keyItinerary) {
                itinerariesList['slicesDetails'].push((
                    <button
                        key={`slicedetailsNotcharter_${itinerary}`}
                        type="button"
                        id={"fltDetailsbtn-" + keyItinerary}
                        className="flight-details-btn pl-md-3"
                        data-productid={list.itineraries.join('')}
                        onClick={() => { this.toggleflightDetails(list.itineraries); }}
                    >
                        {this.state.showFlightDetails ? Lang.trans('dynamic.hide_flight_details') : Lang.trans('dynamic.show_flight_details')}
                        {this.state.flightdetailsLoaderStatus ? (
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
                        )}
                    </button>
                ));
            }

            if (list.api === 'Softvoyage' && (list.itineraries.length-1) == keyItinerary) {
                itinerariesList['slicesDetails'].push(
                    <button key={`slicedetailscharter_${itinerary}`} className="alert alert-warning text-muted ml-3 my-2 flight-details-btn p-2">* Select this flight to verify full flight details</button>
                );
            }

            itinerariesList['slicesMobile'].push(
                <div className={`d-flex align-items-center ${legChecked}`}>
                    <div key={`slicedetails_${itinerary}`} className="d-flex ml-2 w-100 d-md-none align-items-center py-2">
                        <img src={logo} alt={flightCarrier} className="initial loading mb-2 flight-airline-logo-mobile mr-2 flex-shrink-0" />
                        <div className="text-right text-nowrap time-and-airport-code-departure">
                            <div className="font-weight-bold departure time-mobile">{originDetails.departureTime}</div>
                            {
                                keyItinerary === 0 && originDepartureCityCode != destinationReturnCityCode ? (
                                    <div className="small-font-size-mobile d-inline-block airport-code-mobile new-location">{origin}</div>
                                ) : <div className="small-font-size-mobile d-inline-block airport-code-mobile">{origin}</div>
                            }

                        </div>
                        <div className="text-center mt-2 trip-duration-container-mobile">
                            <div className="flight-line-mobile bg-dark mx-3" />
                            {numberOfStopsArr}
                            <div className="extra-small-font-size-mobile mt-2 text-muted">{ durationDetails.formattedDuration == 0 ? 'N/A' : durationDetails.formattedDuration }</div>
                        </div>
                        <div className="time-and-airport-code-arrival">
                            <div className="text-nowrap">
                                <span className="font-weight-bold arrival time-mobile">{destinationDetails.arrivalTime}</span> <sup className="flight-alert-overnight">{(itinerarySlices.numberOfDays !='' && itinerarySlices.numberOfDays > 0) ? '(+'+itinerarySlices.numberOfDays+')' : ''}</sup>
                            </div>
                            {
                                keyItinerary === (airportCodesArr.length / 2) - 1 && originDepartureCityCode !== destinationReturnCityCode ? (
                                    <div className="small-font-size-mobile airport-code-mobile d-inline-block new-location">{destination}</div>
                                ) : <div className="small-font-size-mobile d-inline-block airport-code-mobile">{destination}</div>
                            }

                        </div>
                    </div>
                </div>
            );

            if (itinerarySlices.notes !== undefined && itinerarySlices.notes.length > 0 && notes.indexOf(itinerarySlices.notes[0]) === -1) {
                itinerariesList['slicesBusinessClassAlert'].push(
                    itinerarySlices.notes.map((note, keynote) => (
                        <div className="ml-3 my-2 alert alert-warning flight-details-btn p-2 text-muted" key={keynote}>
                            {note}
                        </div>
                    ))
                );
                notes.push(itinerarySlices.notes[0]);
            }

            return itinerariesList;
        });

        // let acfamilyout = '';
        // let acfamilyin = '';
        // if ((list.priceInfo.fareFamily !== undefined) && (list.priceInfo.fareFamily[outbound] !== undefined))
        // {
        //     acfamilyout = list.priceInfo.fareFamily[outbound].fareFamily[Object.keys(list.priceInfo.fareFamily[outbound].fareFamily)[0]].id;
        //     if (inbound!=null && (list.priceInfo.fareFamily[inbound] !== undefined))
        //     {
        //         acfamilyin = list.priceInfo.fareFamily[inbound].fareFamily[Object.keys(list.priceInfo.fareFamily[inbound].fareFamily)[0]].id;
        //     }
        // }

        return (
            <div className={"flight-product-component position-relative box-shadow d-flex justify-content-around row mx-0 gutter-10  py-2 px-2 p-md-0 border-0" + (list.display === 0 ? '' : '')}>
                <div className="col-9 px-0 d-none d-md-block border-bottom">
                    <div className="d-flex h-100 flex-column justify-content-center">
                        {itinerariesList['slices']}
                    </div>
                </div>
                <div id="mdl-flight-acoptionsbody" className="d-none d-md-block">
                </div>
                <div className="col-3 text-center py-2 px-0 border-bottom d-md-flex flex-column justify-content-center flight-price-button-container d-none border-left">
                    {window.points === 'airmiles' && (<AirmilesPoints rate={list.priceInfo.baseRate} />)}
                    {window.points === 'petro' && (<PetroPoints rate={list.priceInfo.baseRate} />)}
                  {/*  {!isIncremental && (
                        <div className='d-flex icon-dynamic-container mb-2 justify-content-end justify-content-md-center  mt-2 mt-md-0 '>
                            <div className=''>
                                <svg className='icon-dynamic icon-lg' title=''>
                                    <use
                                        xmlnsXlink='http://www.w3.org/2000/svg'
                                        xlinkHref='/img/icons/icon-defs.svg#icon-plane-right'
                                    />
                                </svg>
                            </div>
                            <div className="icon-dynamic-plus position-relative">
                                <svg className="icon-dynamic icon-lg" title="">
                                    <use xmlnsXlink="http://www.w3.org/2000/svg" xlinkHref="/img/icons/icon-defs.svg#icon-car" />
                                </svg>
                            </div>
                        </div>
                    )}*/}

                    <div className="flight-alert mb-2 d-none d-md-block">{ (list.availableSeats !== undefined && list.availableSeats !== '' && list.availableSeats !== 0 && list.availableSeats < 6) ?  `${list.availableSeats} ${Lang.trans('dynamic.seats_left')}` : '' }
                    </div>
                    {list.priceInfo.rateTotalPerPerson < 0 && (
                        <div className="alert alert-warning">Your coupon exceeds the cost of the this package by {priceFormat(Math.abs(list.priceInfo.rateTotalPerPerson), 0)} per person</div>
                    )}
                    <div className="flight-price-total price" id={`price_${this.state.loopkey}`}> {isIncremental && ((list.priceInfo.rate >= 0) ? '+' : '-')} {priceFormat(Math.floor(Math.abs(list.priceInfo.rate)), 0)}</div>
                    <div className="flight-round-trip-text d-none d-md-block">{Lang.trans('common.per_person')}</div>
                    <div className="flight-round-trip-text mb-2 d-none d-md-block text-lowercase">{Lang.trans('engine_flights.round_trip')}</div>
                    <div>
                        <button
                            type="button"
                            className="btn btn-primary btn-lg mx-auto d-block add-cart"
                            disabled={this.state.click}
                            data-productid={list.itineraries.join('')}
                            onClick={() => onSelect(list)}
                        >
                            {Lang.trans('buttons.continue')}
                            { this.state.click ? (
                                <svg className="icon ani-pulse ml-1" role="" title="" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-spinner" />
                                </svg>
                            ) : SITE_KEY === 'airmiles' ? ""
                                : SITE_KEY === 'itravel' ? (
                                    <svg className="icon ml-1" role="" title="" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-chevron-right" />
                                    </svg>
                            ) : (
                                <svg className="icon ml-1" role="" title="" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-triangle-right" />
                                </svg>
                            )}
                        </button>
                        { UPLIFT_FEATURE &&  <ShowUpLift type="1" isStandalone={false}  prodType="flight"  price={list.priceInfo.rateTotalPerPerson} /> }
                    </div>
                </div>
                <Modal className="d-block d-md-none flight-details flight-details-mobile-modal flight-details-modal" size="lg" isOpen={this.state.modalOpen} toggle={this.toggleModal}>
                    <div className="modal-header modal-solid-header-bar">
                        <h5 className="modal-title h4"><span className="header-icon modal-header-icon-large d-none d-md-inline"><svg className="icon building" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><use xlinkHref="//dev.secure-sunquest.ca/assets/global/img/icons/icon-defs.svg#icon-plane-right" /></svg></span>{Lang.trans('common.flight_details')}<button type="button" className="close close-lg pt-3" onClick={this.toggleModal} aria-label="Close"><span className="pt-md-1 d-inline-block" aria-hidden="true">×</span></button></h5>
                    </div>
                    <ModalBody>
                        <div className="modal-body flight-product-component row bg-transparent border-0">
                            <div className="w-100">
                                { this.state.showMobileFlightDetails ? this.renderMobileFlightDetails(list) : <div className="alert alert-warning">Loading Flight Details</div> }
                            </div>
                        </div>
                        <Loader position={this.state.flightdetailsLoaderStatus ? 0 : 100} active={this.state.flightdetailsLoaderStatus} />
                    </ModalBody>
                </Modal>

                <button type="button" onClick={() =>{ this.toggleflightDetails(list.itineraries); this.toggleModal(); } } className={`d-md-none btn-unstyled modal-btn mr-3 text-left align-items-center row w-100 ${(window.points != ''?'pt-4':'')}`}>
                    <div className="col-10 pr-0">
                        {itinerariesList['slicesMobile']}
                    </div>
                    <div className="col-2 text-center pb-2 px-0 border-md-bottom d-flex flex-column justify-content-center flight-price-button-container" >
                        <div className="flight-alert text-nowrap mb-2">{ (list.availableSeats !== undefined && list.availableSeats !== '' && list.availableSeats !== 0 && list.availableSeats < 6) ?  `${list.availableSeats} ${Lang.trans('dynamic.seats_left')}` : '' }
                        </div>
                        {list.priceInfo.rateTotalPerPerson < 0 && (
                            <div className="alert alert-warning">Your coupon exceeds the cost of the this package by {priceFormat(Math.abs(list.priceInfo.rateTotalPerPerson), 0)} per person</div>
                        )}
                        <div className="flight-price-total" id={`price_${this.state.loopkey}`}>{priceFormat(Math.floor(list.priceInfo.rate), 0)}</div>
                        <div className="per-person-mobile"><span className="d-block">{Lang.trans('common.per_person')}</span><span className="text-lowercase">{Lang.trans('engine_flights.round_trip')}</span></div>

                        { UPLIFT_FEATURE && <ShowUpLift type="1" numberOfPax={numberOfPax} price={list.priceInfo.rateTotalPerPerson} /> }
                    </div>
                    {window.points === 'airmiles' && (<AirmilesPoints rate={list.priceInfo.baseRate} />)}
                </button>
                <div className="d-md-flex justify-content-between w-100 d-none py-1">
                    {itinerariesList['slicesDetails']}
                    {itinerariesList['slicesBusinessClassAlert']}
                    <ChooseFootprint sid={sid} flightID={list.itineraries} />
                </div>
                <Collapse id={"flightDetails-" + list.itineraries.join('')} className="w-100" isOpen={this.state.showFlightDetails} >
                    {this.state.flightdetails !== null && <div id="flightDetails" className="collapse show w-100 d-none d-md-block"><FlightDetailsSection device="desktop" pagename="verify" preferedclassName={this.state.preferedClass} totalPrice={list.priceInfo.rate} flightdetails={this.state.flightdetails} extras={extras} /></div>}
                </Collapse>
            </div>
        );
    }
}

SearchResultItemSection.propTypes = {
    data: PropTypes.instanceOf(Object).isRequired,
    sid: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
    onFilterChange: PropTypes.func.isRequired,
    filterValues: PropTypes.instanceOf(Object).isRequired,
    parameters: PropTypes.instanceOf(Object).isRequired,
    isIncremental: PropTypes.bool.isRequired,
    result: PropTypes.instanceOf(Object).isRequired,
};

export default SearchResultItemSection;
