import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DynamicEngine from 'components/engines/dynamicEngine';
import BookingSteps from 'components/common/BookingSteps';
import Filters from 'components/widgets/searchFilters';
import SearchResults from 'components/widgets/searchResults';
import buildQueryString from 'helpers/buildQueryString';
import CarResult from 'components/cars/result';
import FiltersLoader from 'components/widgets/filtersLoader';
import HotelResultsLoader from 'components/widgets/hotelResultsLoader';
import Loader from 'components/common/Loader';
import Lang from 'libraries/common/Lang';
import errorModal from 'helpers/errorModal';
import SelectedFlight from 'components/flights/common/selectedFlight';
import SelectedHotel from 'components/hotels/selectedHotel';
import SelectedHotelFlight from 'components/widgets/selectedHotelFlight';
import FlightDetailsSection from 'components/flights/search/FlightDetailsSection';
import CarsGrid from 'components/cars/productGrid';
import CarsGridLoader from 'components/cars/productGridLoader';
import Profile from 'components/widgets/profile';

import ThemedStyleSheet from 'react-with-styles/lib/ThemedStyleSheet';
import cssInterface from 'react-with-styles-interface-css';
// import RheostatDefaultTheme from 'rheostat/lib/themes/DefaultTheme';
import ReactDatesDefaultTheme from 'react-dates/lib/theme/DefaultTheme';

import Modal from 'reactstrap/lib/Modal';
import ModalHeader from 'reactstrap/lib/ModalHeader';
import ModalBody from 'reactstrap/lib/ModalBody';
import ModalFooter from 'reactstrap/lib/ModalFooter';
import TabContent from 'reactstrap/lib/TabContent';
import TabPane from 'reactstrap/lib/TabPane';

ThemedStyleSheet.registerInterface(cssInterface);
ThemedStyleSheet.registerTheme({
    // ...RheostatDefaultTheme,
    ...ReactDatesDefaultTheme,
});

class DynCarSearch extends Component {
    constructor(props) {
        super(props);

        this.state = {
            page: 0,
            timer: null,
            results: [],
            product: {},
            numberRecords: 0,
            filtersLoad: true,
            resultsLoad: true,
            loading: null,
            showFlightModal: false,
            grid: {},
            gridShow: false,
            filterValues: {},
            terms: [],
            redbook: [],
            termsModalOpen: false,
            activeTermsTab: 'redbook',
        };

        this.filters = [
            {
                type: 'buttonRow',
                title: Lang.trans('carFilters.car_operator'),
                code: 'operator',
                isMulti: true,
                className: 'filter-btns-list-two',
                options: [],
            },
            {
                type: 'toggle',
                title: Lang.trans('carFilters.car_class'),
                isMulti: true,
                code: 'category',
                className: 'text-left',
                options: [],
            },
            {
                type: 'toggle',
                title: Lang.trans('carFilters.transmission'),
                isMulti: true,
                code: 'transmission',
                className: 'text-left',
                options: [],
            },
            {
                type: 'toggle',
                title: Lang.trans('carFilters.preferred_car_size'),
                isMulti: true,
                code: 'size',
                className: 'text-left',
                options: [],
            },
        ];

        this.nextPage = this.nextPage.bind(this);
        this.filtersUpdate = this.filtersUpdate.bind(this);
        this.sortUpdate = this.sortUpdate.bind(this);
        this.toggleGrid = this.toggleGrid.bind(this);
        this.gridFilter = this.gridFilter.bind(this);
        this.categoryFilter = this.categoryFilter.bind(this);
        this.setActiveTermsTab = this.setActiveTermsTab.bind(this);
        this.fetchTerms = this.fetchTerms.bind(this);
        this.toggleTermsModal = this.toggleTermsModal.bind(this);
        this.toggleFlightModal = this.toggleFlightModal.bind(this);
        this.submit = this.submit.bind(this);
    }

    componentDidMount() {
        const url = `/api/car/search?sid=${this.props.sid}`;

        const callback = (data) => {
            const stateUpdate = {
                filtersLoad: false,
                resultsLoad: false,
            };
            if (data.error !== undefined) {
                // this.setState({ sessionExpired: true });
                errorModal(data.error);
            } else {
                const { filterValues } = this.state;
                data.filters.operator.forEach((operator) => {
                    this.filters[0].options.push({
                        text: (<img className="rounded bg-white client-logo d-block w-auto" src={`https://travel-img-assets.s3-us-west-2.amazonaws.com/cars/vendors/${operator.toLowerCase().replace(' ', '-')}.jpg`} />),
                        value: operator,
                    });
                });
                data.filters.category.forEach((category) => {
                    this.filters[1].options.push({
                        text: category,
                        value: category,
                    });
                });
                data.filters.transmission.forEach((transmission) => {
                    this.filters[2].options.push({
                        text: transmission,
                        value: transmission,
                    });
                });
                data.filters.size.forEach((size) => {
                    this.filters[3].options.push({
                        text: size,
                        value: size,
                    });
                });
                stateUpdate.filterValues = Object.assign({}, filterValues, data.filterValues);
                stateUpdate.filterData = data.filters;
                stateUpdate.results = data.cars;
                stateUpdate.product = data.package;
                stateUpdate.numberRecords = data.numberRecords;
                stateUpdate.grid = data.grid;
            }
            this.setState(stateUpdate);

            if (typeof (Uplift) !== 'undefined') {
                setTimeout(() => {
                    Uplift.Payments.update(tripInfo, () => {});
                }, 200);
            }
        };
        this.sendRequest({ url, callback });
    }

    setActiveTermsTab(activeTermsTab) {
        this.setState({ activeTermsTab });
    }

    fetchTerms(result) {
        const { terms } = this.state;

        if (terms.length === 0) {
            const { sid } = this.props;
            const params = {
                resultId: result.resultId,
                inclusive: result.rateInclusive,
                sid,
            };

            const queryString = buildQueryString(params);
            const url = `/api/car/terms?${queryString}`;

            const callback = (data) => {
                this.setState({ terms: data.terms, redbook: data.redbook });
            };

            this.sendRequest({ url, callback });
        }
        this.setState({ termsModalOpen: true });
    }

    toggleTermsModal() {
        const { termsModalOpen } = this.state;
        const toggled = !termsModalOpen;

        const updateState = {
            termsModalOpen: toggled,
        };

        if (!toggled) {
            updateState.terms = [];
            updateState.redbook = [];
        }

        this.setState(() => (updateState));
    }

    toggleFlightModal() {
        const { showFlightModal } = this.state;

        this.setState({ showFlightModal: !showFlightModal });
    }

    nextPage() {
        let { page } = this.state;
        page += 1;
        const url = `/api/car/paginate?sid=${this.props.sid}&page=${page}`;

        const callback = (data) => {
            if (data.error !== undefined) {
                // this.setState({ sessionExpired: true });
                errorModal(data.hotels.error);
            } else {
                const { results } = this.state;
                const newResults = [...results, ...data];
                this.setState({ results: newResults, page });
                if (typeof (Uplift) !== 'undefined') {
                    setTimeout(() => {
                        Uplift.Payments.update(tripInfo, () => {});
                    }, 200);
                }
            }
        };

        this.sendRequest({ url, callback });
    }

    gridFilter(vendor, category) {
        const { filterValues } = this.state;
        const newFilterValues = Object.assign({}, filterValues);

        if (vendor !== null) {
            newFilterValues.operator = [vendor];
        } else {
            newFilterValues.operator = [];
        }

        if (category !== null) {
            newFilterValues.category = [category];
        } else {
            newFilterValues.category = [];
        }

        this.filtersUpdate(newFilterValues);
    }

    toggleGrid() {
        this.setState({ gridShow: !this.state.gridShow });
    }

    categoryFilter(category) {
        const { filterValues } = this.state;
        const newFilterValues = Object.assign({}, filterValues);
        let update = false;

        if (newFilterValues.category === undefined) {
            newFilterValues.category = [category];

            update = true;
        } else {
            const index = newFilterValues.category.findIndex((categoryValue) => {

                return category === categoryValue;
            });

            if (index === -1) {
                newFilterValues.category.push(category);

                update = true;
            } else {
                newFilterValues.category = [...filterValues.category.slice(0, index), ...filterValues.category.slice(index + 1)];

                update = true;
            }
        }

        if (update) {
            this.filtersUpdate(newFilterValues);
        }
    }

    filtersUpdate(filterValues) {
        const { timer } = this.state;
        const { sid } = this.props;

        const params = {
            sid,
            filters: JSON.stringify(filterValues),
        };

        const queryString = buildQueryString(params);
        const url = `/api/car/filter?${queryString}`;

        if (timer !== null) clearTimeout(timer);
        const that = this;
        const callback = (data) => {
            if (data.error !== undefined) {
                // this.setState({ sessionExpired: true });
                errorModal(data.error);
            } else {
                this.setState({
                    results: data.cars,
                    page: 0,
                    numberRecords: data.numberRecords,
                    resultsLoad: false,
                });
                if (typeof (Uplift) !== 'undefined') {
                    setTimeout(() => {
                        Uplift.Payments.update(tripInfo, () => {});
                    }, 200);
                }
            }
        };
        const newTimer = setTimeout(() => { that.sendRequest({ url, callback }); that.setState({ resultsLoad: true }); }, 250);

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
        const url = `/api/car/filter?${queryString}`;

        if (timer !== null) clearTimeout(timer);
        const that = this;
        const callback = (data) => {
            if (data.error !== undefined) {
                // this.setState({ sessionExpired: true });
                errorModal(data.error);
            } else {
                this.setState({
                    results: data.cars,
                    page: 0,
                    numberRecords: data.numberRecords,
                    resultsLoad: false,
                });
                // if (typeof (Uplift) !== 'undefined') {
                //     setTimeout(() => {
                //         Uplift.Payments.update(tripInfo, () => {});
                //     }, 200);
                // }
            }
        };
        const newTimer = setTimeout(() => { that.sendRequest({ url, callback }); that.setState({ resultsLoad: true }); }, 250);

        this.setState({ timer: newTimer, filterValues });
    }

    submit(resultId, rateIndex) {
        const { sid } = this.props;
        const params = {
            resultId,
            rateIndex,
            sid,
        };

        const queryString = buildQueryString(params);
        const url = `/api/car/add?${queryString}`;

        const callback = (data) => {
            if (data.error !== undefined) {
                errorModal(data.error);
            } else {
                window.location.href = `${data}?sid=${sid}`;
            }
        };

        this.sendRequest({ url, callback, action: 'POST' });
    }

    sendRequest({ url, callback, action = 'GET' }) {
        if (this.state.loading === true) {
            this.state.gatewayRequest.abort();
        }

        const xhr = new XMLHttpRequest();
        this.setState({ loading: true, gatewayRequest: xhr });
        xhr.open(action, url);

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

    render() {
        const {
            filterValues,
            results,
            numberRecords,
            filtersLoad,
            resultsLoad,
            loading,
            product,
            showFlightModal,
            grid,
            gridShow,
            filterData,
            // steps,
            terms,
            redbook,
            termsModalOpen,
            activeTermsTab,
        } = this.state;
        const {
            sid,
            parameters,
            breadcrumbs,
            features,
            profileConfig,
        } = this.props;

        const products = Object.keys(breadcrumbs);

        if (features.addon) {
            breadcrumbs.review = false;
        }

        const resultProps = {
            loading,
            numberRecords,
            sid,
            numberOfPax: 0,
            isStandalone: (parameters.selectedProducts.length === 1),
            onFilterCategory: this.categoryFilter,
            onSelect: this.submit,
            fetchTerms: this.fetchTerms,
        };

        parameters.occupancy.forEach((room) => {
            resultProps.numberOfPax += room.adults + room.children;
        });

        const sortBy = (
            <div className="row align-items-center justify-content-end px-3 mb-2">
                <label htmlFor="sort_results" className="mr-2 mb-0">{Lang.trans('common.sort_by')}:</label>
                <div className="element-container col-md-3 col-sm-5 col-8 px-0 my-md-1 my-3 input-chevron-down">
                    <select id="sort_results" className="form-control select-component" onChange={this.sortUpdate} value={filterValues.sort || 'pri'}>
                        <option value="price">{Lang.trans('cars.filter_price')}</option>
                        <option value="vend">{Lang.trans('cars.filter_vendor')}</option>
                        <option value="size">{Lang.trans('cars.filter_size')}</option>
                    </select>
                </div>
            </div>
        );
        return (
            <div>
                {(features !== undefined && profileConfig !== undefined && features.profile) && (
                    <>
                        <Profile element="pro_section" config={profileConfig}/>
                        <Profile element="pro_section_mobile" config={profileConfig}/>
                    </>
                )}
                <BookingSteps steps={breadcrumbs} active="car" />
                <DynamicEngine sid={sid} parameters={parameters} />
                <Loader position={loading ? 0 : 100} active={loading} interval={400} />
                <div className="container cars-deal-cards mt-md-4">
                    {loading !== null && !loading && (
                        <SelectedHotelFlight sid={sid} parameters={parameters} hotel={product.hotel} rate={product.rate} products={products} flightData={product.flightData} toggleModal={this.toggleFlightModal} />
                    )}
                    {(Object.keys(grid).length > 0 && (
                        <CarsGrid grid={grid} vendors={filterData.operator} filters={filterValues} onSelect={this.gridFilter} open={gridShow} toggle={this.toggleGrid} />
                    )) || (
                        <CarsGridLoader />
                    )}
                    <div className="row">
                        {(filtersLoad && (
                            <FiltersLoader />
                        )) || (
                            <Filters
                                filters={this.filters}
                                onChange={this.filtersUpdate}
                                filterValues={filterValues}
                                numberRecords={numberRecords}
                            />
                        )}
                        {(resultsLoad && (
                            <HotelResultsLoader />
                        )) || (
                            <>
                                <SearchResults
                                    results={results}
                                    resultProps={resultProps}
                                    ResultComponent={CarResult}
                                    onPaginate={this.nextPage}
                                    numberRecords={numberRecords}
                                    specialtyField={sortBy}
                                />
                                <Modal isOpen={showFlightModal} size="lg" toggle={this.toggleFlightModal}>
                                    <div className="modal-header modal-solid-header-bar">
                                        <h5 className="modal-title h4">
                                            <span className="header-icon modal-header-icon-large d-none d-md-inline">
                                                <svg className="icon building" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-plane-right" />
                                                </svg>
                                            </span>
                                            {Lang.trans('common.flight_details')}
                                            <button type="button" className="close close-lg pt-3" onClick={this.toggleFlightModal} aria-label="Close">
                                                <span className="pt-md-1 d-inline-block" aria-hidden="true">×</span>
                                            </button>
                                        </h5>
                                    </div>
                                    <div className="modal-body flight-product-component p-0">
                                        <FlightDetailsSection device="desktop" flightdetails={product.flightData.flight} extras={product.flightData.extras} />
                                    </div>
                                </Modal>
                                <Modal size="lg" isOpen={termsModalOpen} toggle={this.toggleTermsModal}>
                                    <ModalHeader className="modal-header modal-solid-header-bar" toggle={this.toggleTermsModal}><span className="h5">{Lang.trans('terms.terms_and_conditions').toUpperCase()}</span></ModalHeader>
                                    <ModalBody>
                                        <div className="d-flex mb-2">
                                            <button type="button" key="redbook-modal-btn" onClick={() => this.setActiveTermsTab('redbook')} className={`mx-1 rounded btn ${activeTermsTab === 'redbook' ? 'btn-secondary' : 'btn-default'}`}>
                                                {Lang.trans('cars.local_fees_and_info')}
                                                {redbook.length === 0 && (
                                                    <svg className="icon ani-pulse ml-1" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-spinner" />
                                                    </svg>
                                                )}
                                            </button>
                                            <button type="button" key="terms-tab-btn-terms" onClick={() => this.setActiveTermsTab('terms')} className={`mx-1 rounded btn ${activeTermsTab === 'terms' ? 'btn-secondary' : 'btn-default'}`}>
                                                Terms
                                                {terms.length === 0 && (
                                                    <svg className="icon ani-pulse ml-1" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-spinner" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                        <TabContent activeTab={activeTermsTab}>
                                            <TabPane key="terms-tabpane-terms" tabId="terms">
                                                <div dangerouslySetInnerHTML={{ __html: terms }} />
                                            </TabPane>
                                            <TabPane tabId="redbook">
                                                <div className="p-2">
                                                    {(redbook !== null && redbook.length > 0) && (
                                                        redbook.map((tab) => (
                                                            tab.items.map((item, i) => {
                                                                if (item.description === '<p>   </p>') {
                                                                    return null;
                                                                }
                                                                return (
                                                                    <div key={`redbook-item-${i}`} className="row gutter-10 justify-content-between mb-3 border-bottom py-2">
                                                                        <div className="col-12">
                                                                            <h6 className="m-0">{item.name}</h6>
                                                                            <div className="">
                                                                                <div dangerouslySetInnerHTML={{ __html: item.description }} />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })
                                                        ))
                                                    )}
                                                </div>
                                            </TabPane>
                                        </TabContent>
                                    </ModalBody>
                                    <ModalFooter>
                                        <button type="button" className="btn-secondary btn-lg" onClick={this.toggleTermsModal}>Close</button>
                                    </ModalFooter>
                                </Modal>
                            </>

                        )}
                    </div>
                </div>
            </div>
        );
    }
}

DynCarSearch.propTypes = {
    sid: PropTypes.string.isRequired,
    parameters: PropTypes.instanceOf(Object).isRequired,
    breadcrumbs: PropTypes.instanceOf(Object).isRequired,
};

export default DynCarSearch;
