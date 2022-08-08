/* global Uplift, tripInfo */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DynamicEngine from 'components/engines/dynamicEngine';
import BookingSteps from 'components/common/BookingSteps';
import Filters from 'components/widgets/searchFilters';
import SearchResults from 'components/widgets/searchResults';
import buildQueryString from 'helpers/buildQueryString';
import HotelResult from 'components/widgets/hotelResult';
import FiltersLoader from 'components/widgets/filtersLoader';
import HotelResultsLoader from 'components/widgets/hotelResultsLoader';
import Loader from 'components/common/Loader';
import Lang from 'libraries/common/Lang';
import errorModal from 'helpers/errorModal';
import SelectedHotel from 'components/hotels/selectedHotel';
import uniqueID from 'helpers/uniqueID';
import FlightDetailsSection from 'components/flights/search/FlightDetailsSection';
import Profile from 'components/widgets/profile';
import HotelResultsInMap from 'components/widgets/HotelResultsInMap';
import Modal from 'reactstrap/lib/Modal';

import ThemedStyleSheet from 'react-with-styles/lib/ThemedStyleSheet';
import cssInterface from 'react-with-styles-interface-css';
import RheostatDefaultTheme from 'rheostat/lib/themes/DefaultTheme';
import ReactDatesDefaultTheme from 'react-dates/lib/theme/DefaultTheme';

import { scroller, Element } from 'react-scroll';

ThemedStyleSheet.registerInterface(cssInterface);
ThemedStyleSheet.registerTheme({
    ...RheostatDefaultTheme,
    ...ReactDatesDefaultTheme,
});

class DynHotelSearch extends Component {
    constructor(props) {
        super(props);

        this.state = {
            watcher: { name: '', email: '', phone: '' },
            filterValues: { price: [0, 99999999] },
            page: 0,
            timer: null,
            results: [],
            resultPool: [],
            products: {},
            numberRecords: 0,
            filtersLoad: true,
            resultsLoad: true,
            loading: null,
            flightsData: {},
            showModal: false,
            mapToggler: false
        };

        this.filters = [
            {
                type: 'input',
                title: Lang.trans('dynamic.hotel_name'),
                code: 'name',
            },
            {
                type: 'toggle',
                title: Lang.trans('engine.stars'),
                isMulti: true,
                options: [
                    {
                        text: (
                            <div className="">
                                <span className="star-container mr-2">
                                    <svg
                                        className="first icon star"
                                        width="100%"
                                        height="100%"
                                        xmlns="http://www.w3.org/2000/svg"
                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                    >
                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-star" />
                                    </svg>
                                    <svg
                                        className="second icon star"
                                        width="100%"
                                        height="100%"
                                        xmlns="http://www.w3.org/2000/svg"
                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                    >
                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-star" />
                                    </svg>
                                    <svg
                                        className="third icon star"
                                        width="100%"
                                        height="100%"
                                        xmlns="http://www.w3.org/2000/svg"
                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                    >
                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-star" />
                                    </svg>
                                    <svg
                                        className="fourth icon star"
                                        width="100%"
                                        height="100%"
                                        xmlns="http://www.w3.org/2000/svg"
                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                    >
                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-star" />
                                    </svg>
                                    <svg
                                        className="fifth icon star"
                                        width="100%"
                                        height="100%"
                                        xmlns="http://www.w3.org/2000/svg"
                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                    >
                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-star" />
                                    </svg>
                                </span>
                                {Lang.trans('engine.stars')}
                            </div>
                        ),
                        value: '5',
                    },
                    {
                        text: (
                            <div className="">
                                <span className="star-container mr-2">
                                    <svg
                                        className="first icon star"
                                        width="100%"
                                        height="100%"
                                        xmlns="http://www.w3.org/2000/svg"
                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                    >
                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-star" />
                                    </svg>
                                    <svg
                                        className="second icon star"
                                        width="100%"
                                        height="100%"
                                        xmlns="http://www.w3.org/2000/svg"
                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                    >
                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-star" />
                                    </svg>
                                    <svg
                                        className="third icon star"
                                        width="100%"
                                        height="100%"
                                        xmlns="http://www.w3.org/2000/svg"
                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                    >
                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-star" />
                                    </svg>
                                    <svg
                                        className="fourth icon star"
                                        width="100%"
                                        height="100%"
                                        xmlns="http://www.w3.org/2000/svg"
                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                    >
                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-star" />
                                    </svg>
                                </span>
                                {Lang.trans('engine.stars')}
                            </div>
                        ),
                        value: '4',
                    },
                    {
                        text: (
                            <div className="">
                                <span className="star-container mr-2">
                                    <svg
                                        className="first icon star"
                                        width="100%"
                                        height="100%"
                                        xmlns="http://www.w3.org/2000/svg"
                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                    >
                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-star" />
                                    </svg>
                                    <svg
                                        className="second icon star"
                                        width="100%"
                                        height="100%"
                                        xmlns="http://www.w3.org/2000/svg"
                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                    >
                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-star" />
                                    </svg>
                                    <svg
                                        className="third icon star"
                                        width="100%"
                                        height="100%"
                                        xmlns="http://www.w3.org/2000/svg"
                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                    >
                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-star" />
                                    </svg>
                                </span>
                                {Lang.trans('engine.stars')}
                            </div>
                        ),
                        value: '3',
                    },
                    {
                        text: (
                            <div className="">
                                <span className="star-container mr-2">
                                    <svg
                                        className="first icon star"
                                        width="100%"
                                        height="100%"
                                        xmlns="http://www.w3.org/2000/svg"
                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                    >
                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-star" />
                                    </svg>
                                    <svg
                                        className="second icon star"
                                        width="100%"
                                        height="100%"
                                        xmlns="http://www.w3.org/2000/svg"
                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                    >
                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-star" />
                                    </svg>
                                </span>
                                {Lang.trans('engine.stars')}
                            </div>
                        ),
                        value: '2',
                    },
                    {
                        text: (
                            <div className="">
                                <span className="star-container mr-2">
                                    <svg
                                        className="first icon star"
                                        width="100%"
                                        height="100%"
                                        xmlns="http://www.w3.org/2000/svg"
                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                    >
                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-star" />
                                    </svg>
                                </span>
                                {Lang.trans('engine.stars')}
                            </div>
                        ),
                        value: '1',
                    },
                ],
                code: 'stars',
                className: 'text-left',
            },
            {
                type: 'buttonRow',
                title: Lang.trans('dynamic.nav_reviews'),
                isMulti: true,
                code: 'review',
                className: 'filter-btns-list-three',
                options: [
                    {
                        text: <div>Poor</div>,
                        value: 'Poor',
                    },
                    {
                        text: <div>Fair</div>,
                        value: 'Fair',
                    },
                    {
                        text: <div>Good</div>,
                        value: 'Good',
                    },
                    {
                        text: <div>Very Good</div>,
                        value: 'Very Good',
                    },
                    {
                        text: <div>Excellent</div>,
                        value: 'Excellent',
                    },
                ],
            },
            {
                type: 'slider',
                title: Lang.trans('common.price_range'),
                code: 'price',
                options: {
                    min: 0,
                    max: 99999999,
                },
            },
            {
                type: 'buttonRow',
                title: Lang.trans('dynamic.hotel_features'),
                code: 'feature',
                isMulti: true,
                className: 'filter-btns-list-two',
                options: [
                    {
                        text: (
                            <div>
                                <svg
                                    className="icon-md icon-box-icon mr-0"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                >
                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-wifi" />
                                </svg>
                                <p className="mb-0">{Lang.trans('amenities.wifi')}</p>
                            </div>
                        ),
                        value: 'WiFi',
                    },
                    {
                        text: (
                            <div>
                                <svg
                                    className="icon-md icon-box-icon mr-0"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                >
                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-car" />
                                </svg>
                                <p className="mb-0">{Lang.trans('amenities.free_parking')}</p>
                            </div>
                        ),
                        value: 'free parking',
                    },
                    /* {
                        text: (
                            <div>
                                <svg className="icon-md icon-box-icon mr-1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-plate" />
                                </svg>
                                <p className="mb-0">{Lang.trans('amenities.breakfast')}</p>
                            </div>
                        ),
                        value: 'breakfast',
                    }, */
                    {
                        text: (
                            <div>
                                <svg
                                    className="icon-md icon-box-icon mr-0"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                >
                                    <use xlinkHref="/img/icons/amenities-icon-defs.svg#icon-gym" />
                                </svg>
                                <p className="mb-0">{Lang.trans('amenities.fitness')}</p>
                            </div>
                        ),
                        value: 'fitness center',
                    },
                    {
                        text: (
                            <div>
                                <svg
                                    className="icon-md icon-box-icon mr-0"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                >
                                    <use xlinkHref="/img/icons/amenities-icon-defs.svg#icon-pool" />
                                </svg>
                                <p className="mb-0">{Lang.trans('amenities.pool')}</p>
                            </div>
                        ),
                        value: 'swimming pool',
                    },
                ],
            },
            {
                type: 'toggle',
                title: Lang.trans('dynamic.landmarks'),
                isMulti: false,
                code: 'poi',
                options: [],
            },
            {
                type: 'toggle',
                title: Lang.trans('dynamic.property_type'),
                isMulti: true,
                code: 'property_type',
                options: [],
            },
        ];

        this.filtersUpdate = this.filtersUpdate.bind(this);
        this.sortUpdate = this.sortUpdate.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.toggleFlightModal = this.toggleFlightModal.bind(this);
        this.toggleWishModal = this.toggleWishModal.bind(this);
        this.changeCoupon = this.changeCoupon.bind(this);
        this.processResponse = this.processResponse.bind(this);
        this.onLoadResultPool =  this.onLoadResultPool.bind(this);
        this.toggleMapButtonMobile = this.toggleMapButtonMobile.bind(this);
        // this.engineUpdate = this.engineUpdate.bind(this);
    }

    componentDidMount() {
        const url = `/api/hotel/search?sid=${this.props.sid}&isIncremental=${window.isIncremental}&bust=${uniqueID()}`;

        this.sendRequest({ url, callback: this.processResponse });
        this.discoverWatcher();
        this.getWishlist();
    }


    onLoadResultPool(filterValues) {
        const { timer } = this.state;
        const { sid } = this.props;
        const params = {
            sid,
            filters: JSON.stringify(filterValues),
        };

        const queryString = buildQueryString(params);
        const url = `/api/hotel/filter?${queryString}`;

        if (timer !== null) clearTimeout(timer);
        const that = this;
        const callback = (data) => {
            if (data.error !== undefined) {
                // this.setState({ sessionExpired: true });
                errorModal(data.error);
            } else {
                this.setState({
                    resultPool: data.hotels,
                });
                // Adobe Launch
                window.digitalData.page.impressions = this.formatImpressions(data.hotels);
                window.digitalData.page.attributes.searchResults = data.numberRecords;
                _satellite.track("hotel-product-impression", { productData: this.formatImpressions(data.hotels), searchType: 'refine' });
                // Adobe Launch
                if (typeof (Uplift) !== 'undefined') {
                    setTimeout(() => {
                        Uplift.Payments.load(tripInfo);
                    }, 200);
                }
            }
        };
        const newTimer = setTimeout(() => { that.sendRequest({ url, callback }); }, 250);

        this.setState({ timer: newTimer });
    }

    getWishlist() {
        const { parameters } = this.props;

        fetch(`/api/profile/getWatchListhotels?depdate=${parameters.depDate}&retdate=${parameters.retDate}`)
            .then((response) => response.json())
            .then((data) => {
                this.setState({ watchList: data });
            });
    }

    changeCoupon(code) {
        const { sid } = this.props;
        let url;

        if (code === '') {
            url = `/api/coupon/remove-coupon?sid=${sid}`;
        } else {
            // here is where the API request will be
            url = `/api/coupon/checkCode?sid=${sid}&couponCode=${code}`;
        }

        this.sendRequest({ url, callback: this.processResponse });

        this.setState({ couponCode: code });
    }

    formatImpressions(row) {
        const impressions = [];
        if (row) {
            row.forEach((rowObj) => {
                impressions.push({
                    productId: rowObj.id,
                    impressionType: 'standard',
                    discounted: 'na',
                    vendor: rowObj.vendor,
                });
            });
        }
        return impressions;
    }

    nextPage() {
        let { page } = this.state;
        page += 1;
        const url = `/api/hotel/paginate?sid=${this.props.sid}&page=${page}`;

        const callback = (data) => {
            if (data.error !== undefined) {
                // this.setState({ sessionExpired: true });
                errorModal(data.hotels.error);
            } else {
                const { results } = this.state;
                const newResults = [...results, ...data];
                this.setState({ results: newResults, page });
                if (typeof Uplift !== 'undefined') {
                    setTimeout(() => {
                        Uplift.Payments.load(tripInfo);
                    }, 200);
                }
                // Adobe Launch
                window.digitalData.page.impressions = window.digitalData.page.impressions.concat(
                    this.formatImpressions(data)
                );
                _satellite.track('hotel-product-impression', {
                    productData: this.formatImpressions(data),
                    searchType: 'nextresult',
                });
                // Adobe Launch
            }
        };

        this.sendRequest({ url, callback });
    }

    processResponse(data) {
        const stateUpdate = {};
        if (data.error !== undefined) {
            // this.setState({ sessionExpired: true });
            errorModal(data.error);
        } else {
            const { filterValues } = this.state;
            const { breadcrumbs } = this.props;
            const products = Object.keys(breadcrumbs);
            filterValues.price[0] = data.filters.priceRange.min;
            filterValues.price[1] = data.filters.priceRange.max;
            stateUpdate.filterValues = Object.assign({}, filterValues, data.filterValues);
            this.filters[3].options.min = data.filters.priceRange.min;
            this.filters[3].options.max = data.filters.priceRange.max;
            this.filters[5].options = data.filters.POIS;
            this.filters[6].options = data.filters.property_type;

            if(data.filters.meal_plan.length>0){
                this.filters[this.filters.length]={
                    type: 'toggle',
                    title: Lang.trans('dynamic.meal_plan'),
                    isMulti: true,
                    code: 'meal_plan',
                    options: [],
                };   
                this.filters[7].options = data.filters.meal_plan;
            }

            // Adobe Launch
            window.digitalData.page.impressions = this.formatImpressions(data.hotels);
            window.digitalData.page.attributes.searchResults = data.numberRecords;
            _satellite.track('hotel-product-impression', {
                productData: this.formatImpressions(data.hotels),
                searchType: 'start',
            });
            // Adobe Launch

            // Google Datalayer
            const googleData = {
                event: 'view_item_list',
                ecommerce: {
                    items: [],
                },
            };

            data.hotels.forEach((hotel, index) => {
                googleData.ecommerce.items.push({
                    item_name: hotel.name,
                    price: hotel.baseRate,
                    item_brand: '',
                    item_category: products.join(' + '),
                    index: index + 1,
                });
            });

            console.log(googleData);
            dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
            dataLayer.push(googleData);
            // Google Datalayer

            stateUpdate.results = data.hotels;
            stateUpdate.product = data.package;
            stateUpdate.numberRecords = data.numberRecords;
            stateUpdate.flightsData = { flight: data.flightProduct, extra: data.flightExtras };
            stateUpdate.nonStop = data.nonStop || {};
            stateUpdate.couponCode = data.coupon || '';
            stateUpdate.filtersLoad = false;
            stateUpdate.resultsLoad = false;
        }
        this.setState(stateUpdate);

        if (typeof Uplift !== 'undefined') {
            setTimeout(() => {
                Uplift.Payments.load(tripInfo);
            }, 200);
        }
    }

    discoverWatcher() {
        const key = localStorage.getItem('userKey');

        fetch(`/api/profile/discoverWatcher?key=${key}`)
            .then((response) => response.json())
            .then((watcher) => {
                this.setState({ watcher });
            });
    }

    filtersUpdate(filterValues) {
        const { timer } = this.state;
        const { sid } = this.props;

        const params = {
            sid,
            filters: JSON.stringify(filterValues),
        };
        scroller.scrollTo('sch_results', {
            duration: 500,
            delay: 150,
            smooth: 'easeInOutQuart',
            offset: -25,
        });

        const queryString = buildQueryString(params);
        const url = `/api/hotel/filter?${queryString}`;

        if (timer !== null) clearTimeout(timer);
        const that = this;
        const callback = (data) => {
            if (data.error !== undefined) {
                // this.setState({ sessionExpired: true });
                errorModal(data.error);
            } else {
                this.setState({
                    resultPool:data.hotels,
                    results: data.hotels.slice(0,20),
                    page: 0,
                    numberRecords: data.numberRecords,
                    resultsLoad: false,
                });
                // Adobe Launch
                window.digitalData.page.impressions = this.formatImpressions(data.hotels);
                window.digitalData.page.attributes.searchResults = data.numberRecords;
                _satellite.track('hotel-product-impression', {
                    productData: this.formatImpressions(data.hotels),
                    searchType: 'refine',
                });
                // Adobe Launch
                if (typeof Uplift !== 'undefined') {
                    setTimeout(() => {
                        Uplift.Payments.load(tripInfo);
                    }, 200);
                }
            }
        };
        const newTimer = setTimeout(() => {
            that.sendRequest({ url, callback });
            that.setState({ resultsLoad: true });
        }, 500);

        this.setState({ timer: newTimer, filterValues });
    }

    sortUpdate(event) {
        const select = event.target;

        const { filterValues, timer } = this.state;
        const { sid } = this.props;

        filterValues.sort = select.value;
        const params = {
            sid,
            filters: JSON.stringify(filterValues),
        };

        const queryString = buildQueryString(params);
        const url = `/api/hotel/filter?${queryString}`;

        if (timer !== null) clearTimeout(timer);
        const that = this;
        const callback = (data) => {
            if (data.error !== undefined) {
                // this.setState({ sessionExpired: true });
                errorModal(data.error);
            } else {
                this.setState({
                    results: data.hotels,
                    page: 0,
                    numberRecords: data.numberRecords,
                    resultsLoad: false,
                });
                if (typeof Uplift !== 'undefined') {
                    setTimeout(() => {
                        Uplift.Payments.load(tripInfo);
                    }, 200);
                }
            }
        };
        const newTimer = setTimeout(() => { that.sendRequest({ url, callback }); that.setState({ resultsLoad: true }); }, 250);

        this.setState({ timer: newTimer, filterValues });
    }

    toggleFlightModal() {
        const { showFlightModal } = this.state;

        this.setState({ showFlightModal: !showFlightModal });
    }

    toggleWishModal(hotelID = null) {
        const { showWishModal } = this.state;

        if (checkCookie('PassportUserToken') !== null) {
            this.setState({ showWishModal: !showWishModal, watchHotel: hotelID });
        } else {
            this.profile.current.toggleModal();
        }
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
            this.setState({ loading: false });
            console.log(`status: ${xhr.status}, statusText: ${xhr.statusText}`);
        };
        xhr.send();
    }

    toggleMapButtonMobile() {
        this.setState({ mapToggler: !this.state.mapToggler })
    }

    // engineUpdate(request) {
    //     const { sid } = this.props;

    //     const params = {
    //         request: JSON.stringify(request),
    //         sid,
    //         isIncremental: 'false',
    //         product: 'hotels',
    //     };

    //     const url = `/api/dynamic/update?${buildQueryString(params)}`;

    //     const callback = (data) => {
    //         if (data.error !== undefined) {
    //             // this.setState({ sessionExpired: true });
    //             errorModal(data.error);
    //         } else {
    //             const filterValues = { price: [0, 99999999] };
    //             filterValues.price[0] = data.filters.priceRange.min;
    //             filterValues.price[1] = data.filters.priceRange.max;
    //             this.filters[2].options.min = data.filters.priceRange.min;
    //             this.filters[2].options.max = data.filters.priceRange.max;
    //             this.setState({
    //                 results: data.hotels,
    //                 numberRecords: data.numberRecords,
    //                 filterValues,
    //                 filtersLoad: false,
    //             });
    //         }
    //     };

    //     this.sendRequest({ url, callback });
    //     this.setState({ filtersLoad: true });
    // }


    render() {
        const {
            filterValues,
            results,
            resultPool,
            numberRecords,
            filtersLoad,
            resultsLoad,
            loading,
            product,
            flightsData,
            showFlightModal,
            showWishModal,
            watchHotel,
            watchList,
            steps,
            nonStop,
            couponCode,
            watcher,
        } = this.state;
        const {
            sid,
            parameters,
            breadcrumbs,
            features,
            googleKey,
            profileConfig,
        } = this.props;

        const isStandalone = (parameters.selectedProducts.length === 1);
        const products = Object.keys(breadcrumbs);

        if (features.addon) {
            breadcrumbs.review = false;
        }

        const watchHotelData = watchHotel !== null ? results[watchHotel] : {};
        const resultProps = {
            loading,
            numberRecords,
            sid,
            products,
            travelDate: parameters.depDateHotel || parameters.depDate,
            numberOfPax: 0,
            isStandalone: (parameters.selectedProducts.length === 1),
            toggleFlightModal: this.toggleFlightModal,
            toggleWishModal: this.toggleWishModal,
            destination: parameters.destination,
            watchList,
        };

        if (!filtersLoad && !isStandalone) {
            const [depKey, retKey] = Object.keys(flightsData.flight);
            const depFlight = flightsData.flight[depKey];
            const depDate = new Date(depFlight.segments[0].legs[0].departure);
            const retFlight = flightsData.flight[retKey];
            const retDate = new Date(retFlight.segments[0].legs[0].departure);
            resultProps.flightData = {
                depDate: `${depDate.toDateString()}`,
                retDate: `${retDate.toDateString()}`,
                legStops: [
                    flightsData.flight[depKey].segments.length - 1,
                    flightsData.flight[retKey].segments.length - 1,
                ],
            };
        }

        parameters.occupancy.forEach((room) => {
            resultProps.numberOfPax += room.adults + room.children;
        });

        const extraContent = (
            <div className="row align-items-center justify-content-end px-3 mb-2">
                <div className="col-10 col-md-6 pl-0 pr-1 mt-md-1 mt-3 ">
                    <div className="row gutter-10 justify-content-end">
                        <div className="select-container px-0 input-chevron-down d-md-none">
                            <label htmlFor="sort_results" className="select-label mb-0 text-right align-self-center">
                                {Lang.trans('common.sort_by')}:
                            </label>
                            <div className="element-wrapper">
                                <div>
                                    <select
                                        id="sort_results"
                                        className="form-control select-component h-100 bg-transparent border-0 shadow-none pt-4 pl-3"
                                        onChange={this.sortUpdate}
                                        value={filterValues.sort || 'pri'}
                                    >
                                        <option value="pri">{Lang.trans('common.recommended')}</option>
                                        <option value="p_lh">{Lang.trans('common.price_low_high')}</option>
                                        <option value="p_hl">{Lang.trans('common.price_high_low')}</option>
                                        <option value="s_lh">{Lang.trans('common.rating_low_high')}</option>
                                        <option value="s_hl">{Lang.trans('common.rating_high_low')}</option>
                                        <option value="n_az">{Lang.trans('common.hotel_name_a_to_z')}</option>
                                        <option value="n_za">{Lang.trans('common.hotel_name_z_to_a')}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <label htmlFor="sort_results" className="col-3 mb-0 text-right align-self-center d-none d-md-block">
                            {Lang.trans('common.sort_by')}:
                        </label>
                        <div className="element-container col-8 px-0 input-chevron-down d-none d-md-block">
                            <select
                                id="sort_results"
                                className="form-control select-component h-100"
                                onChange={this.sortUpdate}
                                value={filterValues.sort || 'pri'}
                            >
                                <option value="pri">{Lang.trans('common.preferred')}</option>
                                <option value="p_lh">{Lang.trans('common.price_low_high')}</option>
                                <option value="p_hl">{Lang.trans('common.price_high_low')}</option>
                                <option value="s_lh">{Lang.trans('common.rating_low_high')}</option>
                                <option value="s_hl">{Lang.trans('common.rating_high_low')}</option>
                                <option value="n_az">{Lang.trans('common.hotel_name_a_to_z')}</option>
                                <option value="n_za">{Lang.trans('common.hotel_name_z_to_a')}</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        );

        const searchText = (
            <div className="h4 primary-color font-weight-bold mb-3 mt-3 mt-md-0">Search Results for &quot;{parameters.hotelSearch}&quot; in {parameters.destination.text}</div>
        );

        const hotelMap = (
            <HotelResultsInMap
                filters={this.filters}
                onChange={this.filtersUpdate}
                onLoadResultPool={this.onLoadResultPool}
                filterValues={filterValues}
                resultPool={resultPool}
                resultProps={resultProps}
                toggleMap={this.state.mapToggler}
                closeMap={this.toggleMapButtonMobile}
                googleKey={googleKey}
            />
        );

        const mapButton = (
            <button
                onClick={() => this.setState({ mapToggler: !this.state.mapToggler })}
                type="button"
                className="btn-map-view mt-md-0 mr-md-2 text-left text-xl-center mr-xl-0 mb-lg-3"
            >
                <img
                    className="w-100 map-image rounded-top d-none d-xl-block"
                    src="https://travel-img.s3.amazonaws.com/2019-10-23--15718614125067map-image.gif"
                    alt="show map"
                />
                <div className="btn-map-view-footer p-xl-2 ">
                    <svg
                        className="icon mr-1 mr-md-3 d-xl-none"
                        role="button"
                        title=""
                        width="100%"
                        height="100%"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                    >
                        <use xlinkHref="/img/icons/icon-defs.svg#icon-map-pin" />
                    </svg>
                    <span className="btn-text d-none d-md-inline">
                        {Lang.trans('dynamic.click_to_see_map')}
                    </span>
                    <span className="btn-text d-md-none">
                        View Map
                    </span>
                </div>
            </button>
        );

        return (
            <div>
                {(features !== undefined && profileConfig !== undefined && features.profile) && (
                    <>
                        <Profile element="pro_section" config={profileConfig} />
                        <Profile element="pro_section_mobile" config={profileConfig}/>
                    </>
                )}
                {hotelMap}
                <BookingSteps steps={breadcrumbs} active="hotel" />
                <DynamicEngine sid={sid} parameters={parameters} />
                <Loader position={loading ? 0 : 100} active={loading} interval={400} />
                <Element className="container hotel-search-results mt-md-4" name="sch_results">
                    {window.isIncremental && loading !== null && !loading && (
                        <SelectedHotel sid={sid} parameters={parameters} hotel={product} toggleFlightModal={this.toggleModal} />
                    )}
                    <div className="row">
                        {(filtersLoad && <FiltersLoader />) || (
                            <Filters
                                filters={this.filters}
                                onChange={this.filtersUpdate}
                                filterValues={filterValues}
                                numberRecords={numberRecords}
                                resultPool={resultPool}
                                resultProps={resultProps}
                                specialtyField={mapButton}
                                toggleMapButtonMobile={this.toggleMapButtonMobile}
                            />
                        )}
                        {(resultsLoad && <HotelResultsLoader />) || (
                            <>
                                <SearchResults
                                    results={results}
                                    resultProps={resultProps}
                                    ResultComponent={HotelResult}
                                    onPaginate={this.nextPage}
                                    numberRecords={numberRecords}
                                    specialtyField={(parameters.hotelSearch === '' ? extraContent : searchText)}
                                />
                                <Modal isOpen={showFlightModal} size="lg">
                                    <div className="modal-header modal-solid-header-bar">
                                        <h5 className="modal-title h4">
                                            <span className="header-icon modal-header-icon-large d-none d-md-inline">
                                                <svg
                                                    className="icon building"
                                                    width="100%"
                                                    height="100%"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                                >
                                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-plane-right" />
                                                </svg>
                                            </span>
                                            {Lang.trans('common.flight_details')}
                                            <button
                                                type="button"
                                                className="close close-lg pt-3"
                                                onClick={this.toggleFlightModal}
                                                aria-label="Close"
                                            >
                                                <span className="pt-md-1 d-inline-block" aria-hidden="true">
                                                    ×
                                                </span>
                                            </button>
                                        </h5>
                                    </div>
                                    <div className="modal-body flight-product-component p-0">
                                        <FlightDetailsSection
                                            device="desktop"
                                            flightdetails={flightsData.flight}
                                            extras={flightsData.extra}
                                        />
                                    </div>
                                </Modal>
                                {showWishModal && (
                                    <WatchListModal watcher={watcher} show={showWishModal} toggleModal={this.toggleWishModal} hotelData={watchHotelData} flightData={resultProps.flightData ?? {}} searchParameters={parameters} sid={sid} onSubmit={this.addWatchHotel} />
                                )}
                            </>
                        )}
                    </div>
                </Element>
            </div>
        );
    }
}

DynHotelSearch.propTypes = {
    sid: PropTypes.string.isRequired,
    parameters: PropTypes.instanceOf(Object).isRequired,
    breadcrumbs: PropTypes.instanceOf(Object).isRequired,
    features: PropTypes.instanceOf(Object).isRequired,
};

export default DynHotelSearch;
