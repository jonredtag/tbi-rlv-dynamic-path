/* global Uplift, tripInfo */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import DynamicEngine from 'components/engines/dynamicEngine';
import BookingSteps from 'components/common/BookingSteps';
import Filters from 'components/widgets/searchFilters';
import SearchResults from 'components/widgets/searchResults';
import buildQueryString from 'helpers/buildQueryString';
import ActivityResult from 'components/widgets/activityResult';
import FiltersLoader from 'components/widgets/filtersLoader';
import HotelResultsLoader from 'components/widgets/hotelResultsLoader';
import Profile from 'components/widgets/profile';
import Loader from 'components/common/Loader';
import Lang, { priceFormat } from 'libraries/common/Lang';
import errorModal from 'helpers/errorModal';
import uniqueID from 'helpers/uniqueID';
import ThemedStyleSheet from 'react-with-styles/lib/ThemedStyleSheet';
import cssInterface from 'react-with-styles-interface-css';
import RheostatDefaultTheme from 'rheostat/lib/themes/DefaultTheme';
import ReactDatesDefaultTheme from 'react-dates/lib/theme/DefaultTheme';

ThemedStyleSheet.registerInterface(cssInterface);
ThemedStyleSheet.registerTheme({
    ...RheostatDefaultTheme,
    ...ReactDatesDefaultTheme,
});

const DynActivitySearch = (props) => {
    const [state, setState] = useState({
        filterValues: { price: [0, 999] },
        page: 0,
        timer: null,
        results: [],
        numberRecords: 0,
        filtersLoad: true,
        resultsLoad: true,
        loading: null,
        showModal: false,
    });

    const filters = [
        {
            type: 'input',
            title: 'Search For activity',
            code: 'name',
        },
        {
            type: 'buttonRow',
            title: 'Categories',
            isMulti: true,
            code: 'category',
            className: 'filter-btns-list-three',
            options: [
                {
                    text: <div>Sightseeing, tours and museums</div>,
                    value: '1',
                },
                {
                    text: <div>General admission and city pass</div>,
                    value: '2', // check
                },
                {
                    text: <div>Wildlife, zoo and aquarium</div>,
                    value: '3',
                },
                {
                    text: <div>Air, helicopter and balloons</div>,
                    value: '4',
                },
                {
                    text: <div>Outdoor activities and adventure</div>,
                    value: '5',
                },
                {
                    text: <div>Theme and water parks</div>,
                    value: '6',
                },
                {
                    text: <div>Cruises and water sports</div>,
                    value: '7',
                },                             
            ],
        },
       
        {
            type: 'buttonRow',
            title: 'Duration',
            isMulti: true,
            code: 'duration',
            className: 'filter-btns-list-three',
            options: [
                {
                    text: <div>Flexible</div>,
                    value: '202',
                },
                {
                    text: <div>Full day</div>,
                    value: '201',
                },
                {
                    text: <div>Half-day morning</div>,
                    value: '200',
                },
                {
                    text: <div>Half-day afternoon</div>,
                    value: '205',
                },
                {
                    text: <div>Multi-day</div>,
                    value: '204',
                },
            ],
        },
        {
            type: 'buttonRow',
            title: 'Recommended For',
            isMulti: true,
            code: 'recommended',
            className: 'filter-btns-list-three',
            options: [
                {
                    text: <div>Families</div>,
                    value: '101',
                },
                {
                    text: <div>Adult only</div>,
                    value: '103',
                },
                {
                    text: <div>Couples</div>,
                    value: '102',
                },
                {
                    text: <div>Senior</div>,
                    value: '105',
                },
                {
                    text: <div>Youth</div>,
                    value: '104',
                },
            ],
        },
        /*
        {
            type: 'buttonRow',
            title: 'Theme',
            isMulti: true,
            code: 'theme',
            className: 'filter-btns-list-three',
            options: [
                {
                    text: <div>Nature</div>,
                    value: '301',
                },
                {
                    text: <div>Culture & Sights</div>,
                    value: '300',
                },
                {
                    text: <div>Food & Drink</div>,
                    value: '304',
                },
                {
                    text: <div>Collection</div>,
                    value: '717',
                },                             
            ],
        },
        */
        {
            type: 'slider',
            title: Lang.trans('common.price_range'),
            code: 'price',
            options: {
                min: 0,
                max: 999,
            },
        },
    ];

    const processResponse = (data) => {
        const stateUpdate = {};
        if (data.error !== undefined) {
            // setState({ sessionExpired: true });
            errorModal(data.error);
        } else {
            const { filterValues } = state;
            // stateUpdate.filterValues = Object.assign({}, filterValues, data.filterValues);

            // Adobe Launch
            /*
            window.digitalData.page.impressions = formatImpressions(data.hotels);
            window.digitalData.page.attributes.searchResults = data.numberRecords;
            _satellite.track('hotel-product-impression', {
                productData: formatImpressions(data.hotels),
                searchType: 'start',
            });
            */
            // Adobe Launch

            stateUpdate.results = data.list;
            stateUpdate.numberRecords = data.totalResults;
            stateUpdate.filtersLoad = false;
            stateUpdate.resultsLoad = false;
        }
        const newState = { ...state, ...stateUpdate };
        setState(newState);

        if (typeof Uplift !== 'undefined') {
            setTimeout(() => {
                Uplift.Payments.update(tripInfo, () => {});
            }, 200);
        }
    };

    const sendRequest = ({ url, callback }) => {
        if (state.loading === true) {
            state.gatewayRequest.abort();
        }

        const xhr = new XMLHttpRequest();
        setState({ ...state, loading: true, gatewayRequest: xhr });
        xhr.open('GET', url);

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                const data = JSON.parse(xhr.response);
                callback(data);
            } else {
                console.log(`status: ${xhr.status}, statusText: ${xhr.statusText}`);
                setState({ ...state, loading: false });
            }
        };
        xhr.onerror = () => {
            setState({ ...state, loading: false });
            console.log(`status: ${xhr.status}, statusText: ${xhr.statusText}`);
        };
        xhr.send();
    };

    useEffect(() => {
        const url = `/api/activity/search?sid=${props.sid}&bust=${uniqueID()}`;
        sendRequest({ url, callback: processResponse });
    }, []);

    const formatImpressions = (row) => {
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
    };

    const nextPage = () => {
        let { page } = state;
        page += 1;
        const url = `/api/activity/paginate?sid=${props.sid}&page=${page}`;

        const callback = (data) => {
            if (data.error !== undefined) {
                // setState({ sessionExpired: true });
                errorModal(data.hotels.error);
            } else {
                const { results } = state;
                const newResults = [...results, ...data.list];
                setState({ ...state, results: newResults, page });
                if (typeof Uplift !== 'undefined') {
                    setTimeout(() => {
                        Uplift.Payments.update(tripInfo, () => {});
                    }, 200);
                }
                // Adobe Launch
                window.digitalData.page.impressions = window.digitalData.page.impressions.concat(
                    formatImpressions(data)
                );
                _satellite.track('hotel-product-impression', {
                    productData: formatImpressions(data),
                    searchType: 'nextresult',
                });
                // Adobe Launch
            }
        };
        sendRequest({ url, callback });
    };

    const filtersUpdate = (filterValues) => {
        const { timer } = state;
        const { sid } = props;
        const params = {
            sid,
            page: 0,
            filters: JSON.stringify(filterValues),
        };

        const queryString = buildQueryString(params);
        const url = `/api/activity/filter?${queryString}`;

        if (timer !== null) clearTimeout(timer);
        const callback = (data) => {
            if (data.error !== undefined) {
                // setState({ sessionExpired: true });
                errorModal(data.error);
            } else {
                setState({
                    ...state,
                    results: data.list,
                    page: 0,
                    numberRecords: data.totalResults,
                    resultsLoad: false,
                });
                // Adobe Launch
                window.digitalData.page.impressions = formatImpressions(data.hotels);
                window.digitalData.page.attributes.searchResults = data.numberRecords;
                _satellite.track('hotel-product-impression', {
                    productData: formatImpressions(data.hotels),
                    searchType: 'refine',
                });
                // Adobe Launch
                if (typeof Uplift !== 'undefined') {
                    setTimeout(() => {
                        Uplift.Payments.update(tripInfo, () => {});
                    }, 200);
                }
            }
        };
        const newTimer = setTimeout(() => {
            sendRequest({ url, callback });
            setState({ ...state, resultsLoad: true });
        }, 250);

        state.filterValues = filterValues;
        setState({ ...state, timer: newTimer });
    };

    const { filterValues, results, numberRecords, filtersLoad, resultsLoad, loading } = state;
    const {
        sid,
        parameters,
        breadcrumbs,
        features,
        profileConfig,
    } = props;

    const resultProps = {
        loading,
        numberRecords,
        sid,
        travelDate: parameters.depDateHotel || parameters.depDate,
    };

    return (
        <div>
            {features.profile && (<Profile element="pro_section" config={profileConfig} />)}
            {features.profile && (<Profile element="pro_section_mobile" config={profileConfig} />)}
            <BookingSteps steps={breadcrumbs} active='activity' />
            <DynamicEngine sid={sid} parameters={parameters} />
            <Loader position={loading ? 0 : 100} active={loading} interval={400} />
            <div className="container mt-md-4">
                <div className="row">
                    {(filtersLoad && <FiltersLoader />) || (
                        <Filters
                            filters={filters}
                            onChange={filtersUpdate}
                            filterValues={filterValues}
                            numberRecords={numberRecords}
                        />
                    )}
                    {(resultsLoad && <HotelResultsLoader />) || (
                        <SearchResults
                            results={results}
                            resultProps={resultProps}
                            ResultComponent={ActivityResult}
                            onPaginate={nextPage}
                            specialtyField={null}
                            numberRecords={numberRecords}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

DynActivitySearch.propTypes = {
    sid: PropTypes.string.isRequired,
    parameters: PropTypes.instanceOf(Object).isRequired,
    breadcrumbs: PropTypes.instanceOf(Object).isRequired,
};

export default DynActivitySearch;
