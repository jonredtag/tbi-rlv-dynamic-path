/* global Uplift, tripInfo */
import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import DynamicEngine from 'components/engines/dynamicEngine';
import BookingSteps from 'components/common/BookingSteps';
import Filters from 'components/widgets/searchFilters';
import SearchResults from 'components/widgets/searchResults';
import buildQueryString from 'helpers/buildQueryString';
import FlightResult from 'components/flights/search/SearchResultItemSection';
import SearchDump from 'components/flights/search/SearchDump';
import SearchDumpFilter from 'components/flights/search/SearchDumpFilter';
import Modal from 'reactstrap/lib/Modal';
import ModalBody from 'reactstrap/lib/ModalBody';
import SelectedProducts from 'components/widgets/selectedHotelFlight';
import Profile from 'components/widgets/profile';
import errorModal from 'helpers/errorModal';
import Loader from 'components/common/Loader';
import ThemedStyleSheet from 'react-with-styles/lib/ThemedStyleSheet';
import cssInterface from 'react-with-styles-interface-css';
import RheostatDefaultTheme from 'rheostat/lib/themes/DefaultTheme';
import ReactDatesDefaultTheme from 'react-dates/lib/theme/DefaultTheme';

import Lang, { priceFormat } from 'libraries/common/Lang';
import AriaModal from 'react-aria-modal';
import { scroller, Element } from 'react-scroll';

ThemedStyleSheet.registerInterface(cssInterface);
ThemedStyleSheet.registerTheme({
    ...RheostatDefaultTheme,
    ...ReactDatesDefaultTheme,
});

class DynFlightSearch extends Component {
    constructor(props) {
        super(props);

        this.timeFilterOptions = [
            {
                text1: Lang.trans('engine_cars.early_morning'),
                text2: '12:00 am - 04:59 am',
                value: '00:00-04:59',
            },
            {
                text1: Lang.trans('engine_cars.morning'),
                text2: '05:00 am - 11:59 am',
                value: '05:00-11:59',
            },
            {
                text1: Lang.trans('engine_cars.afternoon'),
                text2: '12:00 pm - 17:59 pm',
                value: '12:00-17:59',
            },
            {
                text1: Lang.trans('engine_cars.evening'),
                text2: '6:00 pm - 11:59 pm',
                value: '18:00-23:59',
            },
        ];

        this.state = {
            outStopPrices: [],
            inStopPrices: [],
            sid: props.sid,
            selectedHotel: null,
            filterValues: {
                price: [0, 999999],
                duration: [0, 999999],
                minPrice: null,
                maxPrice: null,
                noOfStops: [],
                destinationAirports: [],
                originAirports: [],
                departureTimes: [],
                inboundDepartureTimes: [],
                arrivalTimes: [],
                inboundArrivalTimes: [],
                carriers: [],
                setFilter: false,
                outboundSegmentKey: null,
                inboundSegmentKey: null,
            },
            page: 0,
            timer: null,
            filterData: {},
            loading: false,
            searchResults: {},
            results: [],
            numberRecords: 0,
            filtering: false,
            init: false,
            error: null,
            showErrorModal: false,
            loading: false,
            isModelOpen: false,
            flightData: {},
        };

        let departureText = '';
        if( props.parameters.departure.category=="airport"){
            const TempdepartureText = props.parameters.departure.text2;
            const departurearr = TempdepartureText.split(',');
            departureText = departurearr[0];            
        }else{
            departureText = props.parameters.departure.text;
        }
        const destinationText = props.parameters.destination.text;
        
        this.filters = [
            {
                type: 'slider',
                title: Lang.trans('common.price_range'),
                code: 'price',
                options: {
                    min: 0,
                    max: 99999,
                },
            },
            {
                type: 'checkbox',
                title: Lang.trans('dynamic.number_of_stops_outbound'),
                code: 'noOfStopsOut',
                isMulti: true,
                className: 'text-left',
                options: [],
            },
            {
                type: 'checkbox',
                title: Lang.trans('dynamic.number_of_stops_inbound'),
                code: 'noOfStopsIn',
                isMulti: true,
                className: 'text-left',
                options: [],
            },
            {
                type: 'checkbox',
                title: Lang.trans('dynamic.airlines'),
                code: 'carriers',
                isMulti: true,
                className: 'text-left',
                options: [],
            },
            {
                type: 'slider',
                title: Lang.trans('dynamic.travel_time'),
                code: 'duration',
                formatValue: (v) => `${Math.floor(v / 60)}h ${Math.floor(v % 60)}m`,
                options: {
                    min: 0,
                    max: 99999,
                },
            },
            {
                type: 'checkbox',
                title: `${Lang.trans('dynamic.departure_time')} in ${departureText}`,
                // title: Lang.trans('dynamic.outbound_departure_time'),
                code: 'departureTimes',
                isMulti: true,
                className: 'text-left',
                options: this.timeFilterOptions,
            },
            {
                type: 'checkbox',
                title: `${Lang.trans('dynamic.arrival_time')} in ${destinationText}`,
                // title: Lang.trans('dynamic.outbound_arrival_time'),
                code: 'arrivalTimes',
                className: 'text-left',
                isMulti: true,
                options: this.timeFilterOptions,
            },
            {
                type: 'checkbox',
                title: `${Lang.trans('dynamic.departure_time')} in ${destinationText}`,
                // title: Lang.trans('dynamic.inbound_departure_time'),
                code: 'inboundDepartureTimes',
                isMulti: true,
                className: 'text-left',
                options: this.timeFilterOptions,
            },
            {
                type: 'checkbox',
                title: `${Lang.trans('dynamic.arrival_time')} in ${departureText}`, 
                // title: Lang.trans('dynamic.inbound_arrival_time'),
                code: 'inboundArrivalTimes',
                className: 'text-left',
                isMulti: true,
                options: this.timeFilterOptions,
            },           
           
        ];

        this.profile = createRef();

        this.filtersUpdate = this.filtersUpdate.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.handleCheckboxFilter = this.handleCheckboxFilter.bind(this);
        this.toggleErrorModal = this.toggleErrorModal.bind(this);
        this.setDirectFlight = this.setDirectFlight.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.flightAdd = this.flightAdd.bind(this);
    }

    componentDidMount() {
        const { isIncremental } = this.props;
        const url = `/api/flight/search?sid=${this.state.sid}&isIncremental=${isIncremental}`;

        const callback = (data) => {
            if (Object.prototype.hasOwnProperty.call(data, 'error')) {
                errorModal(data.error);
                return;
            }

            const { filterValues } = this.state;
            // const { minPrice, maxPrice } = data.flightResults.extras.filters.price;
            const { minDuration, maxDuration } = data.flightResults.extras.filters.duration;
            const newFilterValues = Object.assign({}, filterValues,data.filterValues);
            const { filters, carriers } = data.flightResults.extras;

            const results = (data.flightResults !== undefined && data.flightResults.rows !== undefined && data.flightResults.rows.length) ? data.flightResults.rows : [];
            const full = (data.flightResults !== undefined && data.flightResults.full !== undefined && data.flightResults.full.length) ? data.flightResults.full : [];
            const outStopPrices = {};
            const inStopPrices = {};
            const carrierPrices = {};
            let minPrice = 300000;
            let maxPrice = 0;
            full.forEach(row => {
                Object.keys(filters.stops).forEach(stopkey => {
                    const stopParts = stopkey.split('-');
                    if (row.flightSummaries[row.itineraries[0]].stopCount == stopParts[0]) {
                        if (!Object.prototype.hasOwnProperty.call(outStopPrices, stopParts[0]) || outStopPrices[stopParts[0]] > row.priceInfo.rate) {
                            outStopPrices[stopParts[0]] = row.priceInfo.rate;
                        }
                    }
                    if (row.flightSummaries[row.itineraries[1]].stopCount == stopParts[1]) {
                        if (!Object.prototype.hasOwnProperty.call(inStopPrices, stopParts[1]) || inStopPrices[stopParts[1]] > row.priceInfo.rate) {
                            inStopPrices[stopParts[1]] = row.priceInfo.rate;
                        }
                    }
                });
                Object.keys(carriers).forEach(carrier => {
                    row.itineraries.forEach(itin => {
                        if (row.flightSummaries[itin].flightCarrier == carrier) {
                            if (!Object.prototype.hasOwnProperty.call(carrierPrices, carrier) || carrierPrices[carrier] > row.priceInfo.rate) {
                                carrierPrices[carrier] = row.priceInfo.rate;
                            }
                        }
                    });
                });
                if (row.priceInfo.rate < minPrice) {
                    minPrice = row.priceInfo.rate;
                }
                if (row.priceInfo.rate > maxPrice) {
                    maxPrice = row.priceInfo.rate;
                }
            });

            if (minPrice !== maxPrice) {
                this.filters[0].hidden = false;
                // put price in filters
                newFilterValues.price[0] = minPrice;
                newFilterValues.price[1] = maxPrice;
                this.filters[0].options.min = minPrice;
                this.filters[0].options.max = maxPrice;
            } else {
                this.filters[0].hidden = true;
            }
            if (minDuration !== maxDuration) {
                this.filters[4].hidden = false;
                // put duration in filters
                newFilterValues.duration[0] = minDuration;
                newFilterValues.duration[1] = maxDuration;
                this.filters[4].options.min = minDuration;
                this.filters[4].options.max = maxDuration;
            } else {
                this.filters[4].hidden = true;
            }
            if (Object.keys(filters.stops).length > 1) {
                this.filters[1].hidden = false;
                this.filters[2].hidden = false;
                const outs = [];
                const ins = [];
                // put stops in filters
                Object.keys(filters.stops).forEach((stopkey) => {
                    const stopParts = stopkey.split('-');
                    const outStops = stopParts[0];
                    const inStops = stopParts[1];
                    if (outs.indexOf(outStops) === -1) {
                        this.filters[1].options.push({ text1: (outStops > 0 ? `${outStops} stops` : 'Non-stop'), value: outStops });
                    }
                    if (ins.indexOf(inStops) === -1) {
                        this.filters[2].options.push({ text1: (inStops > 0 ? `${inStops} stops` : 'Non-stop'), value: inStops });
                    }
                    outs.push(outStops);
                    ins.push(inStops);
                });
            } else {
                this.filters[1].hidden = true;
                this.filters[2].hidden = true;
            }
            if (Object.keys(filters.carriers).length > 1) {
                this.filters[3].hidden = false;
                // put carriers in filters
                Object.keys(filters.carriers).forEach((airline) => {
                    const price = `${(isIncremental === true ? (carrierPrices[airline] >= 0 ? '+' : '-') : '')} ${priceFormat(Math.abs(carrierPrices[airline]), 0)}`;
                    this.filters[3].options.push({ text1: (Object.prototype.hasOwnProperty.call(carriers, airline) ? carriers[airline].name : airline), text3: `${Lang.trans('engine.from')}: ${price}`, value: airline });
                });
            } else {
                this.filters[3].hidden = true;
            }

            const flightResults = (data.flightResults !== undefined) ? data.flightResults : {};
            const stateUpdate = {
                results,
                init: true,
                filterValues: newFilterValues,
                searchResults: flightResults,
                selectedHotel: data.package || null,
                filterData: data.filters,
                numberRecords: data.flightResults.numberRecords,
            };

            if (data.nonStop) {
                stateUpdate.nonStop = data.nonStop;
            }

            this.setState(stateUpdate);

            if (typeof (Uplift) !== 'undefined') {
                setTimeout(() => {
                    Uplift.Payments.load(tripInfo);
                }, 200);
            }
            // Adobe Launch
            window.digitalData.page.impressions = this.formatImpressions(data.flightResults.rows);
            window.digitalData.page.attributes.searchResults = data.flightResults.numberRecords;
            _satellite.track("hotel-product-impression", { productData: this.formatImpressions(data.flightResults.rows), searchType: 'start' });
            // Adobe Launch

            // Google Datalayer
            const googleData = {
                event: 'view_item_list',
                ecommerce: {
                    items: [],
                },
            };

            full.forEach((flight, index) => {
                googleData.ecommerce.items.push({
                    item_name: flight.itineraries.join('|'),
                    price: flight.priceInfo.baseRate + flight.priceInfo.taxes,
                    item_brand: '',
                    item_category: 'flight',
                    index: index + 1,
                });
            });

            console.log(googleData);
            dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
            dataLayer.push(googleData);
            // Google Datalayer
        };

        this.sendRequest({ url, callback });
    }

    formatImpressions(row) {
        const impressions = [];
        if (row) {
            row.forEach((rowObj) => {
                impressions.push({
                    productId: rowObj.itineraries.join(''),
                    impressionType: 'standard',
                    discounted: 'na',
                });
            });
        }
        return impressions;
    }

    toggleErrorModal() {
        this.setState({ showErrorModal: !this.state.showErrorModal });
    }

    formatDuration(v) {
        const dh = Math.floor(v / 60);
        const dm = Math.floor(v % 60);
        return `${dh}h ${dm}m`;
    }

    handleCheckboxFilter(filterInfo) {
        const { filterValues } = this.state;
        const newFilterValues = Object.assign({}, filterValues);
        newFilterValues.outboundSegmentKey = filterInfo.outboundSegmentKey;
        newFilterValues.inboundSegmentKey = filterInfo.inboundSegmentKey;
        this.setState({ filterValues: newFilterValues }, () => {
            this.filtersUpdate(newFilterValues);
        });
    }

    nextPage() {
        const { results, filterValues, sid } = this.state;
        const newFilterValues = Object.assign({}, filterValues);
        // when paging - reset the leg selections and start fresh
        newFilterValues.outboundSegmentKey = null;
        newFilterValues.inboundSegmentKey = null;
        let { page } = this.state;
        page += 1;
        // const url = `/api/hotel/paginate?sid=${this.state.sid}&page=${page}`;
        const url = `/api/flight/paginate?sid=${sid}&page=${page}`;

        fetch(url).then((response) => response.json()).then((data) => {
            if (data.error !== undefined) {
                errorModal(data.error);
            } else {
                const newResults = [...results, ...data];
                this.setState({
                    results: newResults,
                    page,
                    filterValues: newFilterValues,
                });
                if (typeof (Uplift) !== 'undefined') {
                    setTimeout(() => {
                        Uplift.Payments.load(tripInfo);
                    }, 200);
                }
                // Adobe Launch
                const mergeData = window.digitalData.page.impressions.concat(this.formatImpressions(data));
                window.digitalData.page.impressions = mergeData;
                _satellite.track("hotel-product-impression", { productData: this.formatImpressions(data), searchType: 'nextresult' });
                // Adobe Launch
            }
        });
    }

    filtersUpdate(filterValues) {
        const { timer, sid } = this.state;
        const { isIncremental } = this.props;
        const params = {
            sid,
            filters: JSON.stringify(filterValues),
            isIncremental,
        };
        this.setState({ filtering: true });
        scroller.scrollTo('sch_results', {
            duration: 500,
            delay: 150,
            smooth: 'easeInOutQuart',
            offset: -15,
        });

        const queryString = buildQueryString(params);
        const url = `/api/flight/filter?${queryString}`;

        if (timer !== null) clearTimeout(timer);
        const that = this;
        const callback = (data) => {
            if (data.flights.error !== undefined) {
                errorModal(data.flights.error);
            } else {
                this.setState({
                    filtering: false,
                    results: data.flights,
                    page: 0,
                    numberRecords: data.numberRecords,
                });
                if (typeof (Uplift) !== 'undefined') {
                    setTimeout(() => {
                        Uplift.Payments.load(tripInfo);
                    }, 200);
                }
                // Adobe Launch
                window.digitalData.page.impressions = this.formatImpressions(data.flights);
                window.digitalData.page.attributes.searchResults = data.numberRecords;
                _satellite.track("hotel-product-impression", { productData: this.formatImpressions(data.flights), searchType: 'refine' });
                // Adobe Launch
            }
        };
        const newTimer = setTimeout(() => { that.sendRequest({ url, callback }); }, 500);

        this.setState({ timer: newTimer, filterValues });
    }

    setDirectFlight() {
        const { filterValues } = this.state;

        const newFilters = Object.assign({}, filterValues);

        newFilters.noOfStopsOut = ['0'];
        newFilters.noOfStopsIn = ['0'];

        this.filtersUpdate(newFilters);
    }

    sendRequest({ url, callback }) {
        if (this.state.loading === true) {
            this.state.gatewayRequest.abort();
        }

        const xhr = new XMLHttpRequest();
        this.setState({ loading: true, gatewayRequest: xhr });
        xhr.open('GET', url);

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                const data = JSON.parse(xhr.response);
                callback(data);
            } else {
                console.log(`status: ${xhr.status}, statusText: ${xhr.statusText}`);
            }
            this.setState({ loading: false });
        };
        xhr.onerror = () => {
            console.log(`status: ${xhr.status}, statusText: ${xhr.statusText}`);
            this.setState({ loading: false });
        };
        xhr.send();
    }

    handleRedirection(flightData,status) {
        this.updateState({isModelOpen:false});
        this.flightAdd(flightData,status);
    }

    updateState(obj) {
        this.setState(obj);
    }

    flightAdd(flight,wantsToGoWithNewDate=false){
        const { sid } = this.state;
        let url = `/api/flight/add/${flight.id}?sid=${sid}`;
        if(wantsToGoWithNewDate){
           url += `&wantsToGoWithNewDate=${wantsToGoWithNewDate}`; 
        }
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({ sid }),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => response.json()).then((data) => {
            if (data.error !== undefined) {
                errorModal(data.error);
            } else {
                const baseUrl = data;
                const nextUrl = `${baseUrl}?sid=${sid}`;
                window.location.href = nextUrl;
            }
        });
    }

    onSelect(flight) {
        const { sid } = this.state;
        const url = `/api/flight/add/${flight.id}?sid=${sid}`;
        fetch(`${url}&checkflightarrival=1`, {
            method: 'POST',
            body: JSON.stringify({ sid }),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => response.json()).then((res) => {
            if (res.error !== undefined) {
                errorModal(res.error);
            } else {
                if(res){
                    this.updateState({isModelOpen:true,flightData:flight});
                }else{
                    this.flightAdd(flight,res);
                }
            }
        });        
    }

    render() {
        const {
            filterValues,
            searchResults,
            selectedHotel,
            results,
            numberRecords,
            loading,
            filtering,
            init,
            showErrorModal,
            error,
            nonStop = null,
            isModelOpen,
            flightData,
        } = this.state;

        const {
            parameters,
            isIncremental,
            breadcrumbs,
            sid,
            features,
            profileConfig,
        } = this.props;

        const products = Object.keys(breadcrumbs);

        if (features.addon) {
            breadcrumbs.review = false;
        }

        const resultProps = {
            data: searchResults,
            sid,
            onSelect: this.onSelect,
            onFilterChange: this.handleCheckboxFilter,
            filterValues,
            parameters,
            isIncremental,
        };
        const isStandalone = false;
        const specialtyField = nonStop !== null ? (
            <div className="border rounded mb-3 mt-3 mt-md-0 py-lg-3 h6 bg-white p-2 d-flex flex-column flex-sm-row justify-content-between">
                <div className="d-flex align-items-center">
                    <svg className="icon-md  mr-3 " width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                        <use xlinkHref="/img/icons/icon-defs.svg#icon-plane-right" />
                    </svg>Non-stop flights from an additional<span className="primary-color ml-2">{priceFormat(nonStop.fare)}</span>
                </div>
                <button type="button" className="btn btn-primary-outline rounded  d-block d-md-inline-block  mt-3 mt-sm-0" onClick={this.setDirectFlight}>Select</button>
            </div>
        ) : '';

        return (
            <div>
                {(features !== undefined && profileConfig !== undefined && features.profile) && (
                    <>
                        <Profile element="pro_section" config={profileConfig} ref={this.profile} />
                        <Profile element="pro_section_mobile" config={profileConfig}/>
                    </>
                )}
                <BookingSteps steps={breadcrumbs} active="flight" />
                <DynamicEngine sid={sid} parameters={parameters} />
                <Loader position={loading ? 0 : 100} active={loading} />
                <Element name="sch_results" className="container mt-3">
                    {(selectedHotel !== null) && (
                        <SelectedProducts sid={sid} parameters={parameters} hotel={selectedHotel.hotel} rate={selectedHotel.rate} products={products} />
                    )}
                    <div className="row">
                        { init && <Filters loading={loading} filters={this.filters} onChange={this.filtersUpdate} filterValues={filterValues} numberRecords={numberRecords} /> }
                        { !loading && (
                            <SearchResults
                                showSigninOptions
                                results={results}
                                resultProps={resultProps}
                                profileRef={this.profile}
                                ResultComponent={FlightResult}
                                onPaginate={this.nextPage}
                                numberRecords={numberRecords}
                                specialtyField={specialtyField}
                            />
                        )}
                        { !init && <SearchDumpFilter /> }
                        { loading && <SearchDump /> }
                    </div>
                </Element>
                <Modal className="d-block d-md-none flight-details flight-details-mobile-modal flight-details-modal" size="lg" isOpen={showErrorModal} toggle={this.toggleErrorModal}>
                    <div className="modal-header modal-solid-header-bar">
                        <h5 className="modal-title h4">
                            <span className="header-icon modal-header-icon-large d-none d-md-inline">
                                <svg className="icon building" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-plane-right" />
                                </svg>
                            </span>
                            Error
                            <button type="button" className="close close-lg pt-3" onClick={this.toggleErrorModal} aria-label="Close">
                                <span className="pt-md-1 d-inline-block" aria-hidden="true">×</span>
                            </button>
                        </h5>
                    </div>
                    <ModalBody>
                        <div className="modal-body flight-product-component row bg-transparent border-0">
                            <div className="w-100">
                                <div className="alert alert-warning">{(error !== null) ? error.message : ''}</div>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                
                {isModelOpen 
                ? 
                <AriaModal
                    onExit={() => this.updateState({isModelOpen:false})}
                    aria-describedby="mdl-ccm-content"
                    titleId="mdl-ccm-title"
                    aria-labelledby="mdl-ccm-title"
                    dialogStyle={{ width: '1000px' }}
                    aria-modal="true"
                    verticallyCenter
                >
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content modal">
                            <div className="modal-header">
                                <h4 className="modal-title">
                                    <div className="header-text">
                                        <h4 className="modal-title" id="mdl-title">
                                            Confirm Checkin and Checkout dates.
                                        </h4>
                                    </div>
                                </h4>
                                <button
                                    type="button"
                                    onClick={() => this.updateState({isModelOpen:false})}
                                    className="close close-lg pt-3 p-0 pr-3"
                                    aria-label="Close"
                                >
                                    <span className="pt-md-1 d-inline-block" aria-hidden="true">
                                        ×
                                    </span>
                                </button>
                            </div>
                            <div className="modal-main p-4" id="mdl-content">
                                <div className="content">
                                    <div className="row">                                        
                                        <div className="col-md-12 mb-3">
                                            <div className="element-wrapper">
                                                Do you want continue with the original checkin and checkout dates ?
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <button className="btn btn-warning btn-lg text-white font-weight-500 rounded-sm border-0 mx-1" onClick={() => { this.handleRedirection(flightData,true); }}>Reselect Hotel</button>
                                            <button className="btn btn-primary btn-lg text-white font-weight-500 rounded-sm mx-1" onClick={() => { this.handleRedirection(flightData,false); }}>Continue</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </AriaModal>
                : null}

            </div>
        );
    }
}

DynFlightSearch.propTypes = {
    sid: PropTypes.string.isRequired,
    isIncremental: PropTypes.bool.isRequired,
    parameters: PropTypes.instanceOf(Object).isRequired,
    breadcrumbs: PropTypes.instanceOf(Object).isRequired,
    features: PropTypes.instanceOf(Object).isRequired,
};

export default DynFlightSearch;
