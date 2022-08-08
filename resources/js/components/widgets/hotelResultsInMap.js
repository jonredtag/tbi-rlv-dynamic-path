/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import GoogleMapReact from 'google-map-react';
import AriaModal from 'react-aria-modal';
import Marker from 'components/snippets/MapMarker';
import HotelResult from 'components/widgets/hotelResult';
import Lang from 'libraries/common/Lang';
import MapFilter from './mapFilters';

const HotelResultsInMap = (props) => {
    const { filters, filterValues, onChange, onLoadResultPool, resultPool, resultProps, toggleMap, closeMap, googleKey } = props;

    const isFirstRender = useRef();
    const [mapState, setMapState] = useState({
        showModalFilter: false,
        isLoading: false,
    });
    const [showMap, setShowMap] = useState(false);
    const [hotelIndexSelected, setHotelIndexSelected] = useState(null);
    const [markers, setMarkers] = useState([]);
    const { destination } = resultProps;
    const center = { lat: parseFloat(destination.latitude), lng: parseFloat(destination.longitude) };

    const showHotelnfo = (e, params) => {
        const { hotelIndex } = params;
        e.preventDefault();
        setHotelIndexSelected(hotelIndex);
    };
    const onClickCloseHotel = () => {
        setHotelIndexSelected(null);
    };

    const onMapFilterChange = (value) => {
        setMapState({ ...mapState, isLoading: true });
        onChange(value);
    };

    const onClickShowFilterModal = () => {
        setMapState({ ...mapState, showModalFilter: true });
    };
    const onClickCloseFilterModal = (e) => {
        e.preventDefault();
        setMapState({ ...mapState, showModalFilter: false });
    };

    const onClickCloseMapModal = () => {
        setShowMap(false);
        setHotelIndexSelected(null);
    };

    const onClickShowMapModal = (e) => {
        e.preventDefault();
        setShowMap(true);
        onLoadResultPool({ ...filterValues, numRecordsReturn: '5000' });
    };

    useEffect(() => {
        if(toggleMap === true) {
            console.log("testing 123 123")
            onLoadResultPool({ ...filterValues, numRecordsReturn: '5000' });
        }
    }, [toggleMap])

    const buildMapMarkers = () => {
        // console.log("building markers");
        const markerArr =
            resultPool &&
            resultPool.map((item, index) => (
                <Marker
                    key={`map-htl-${item.id}`}
                    lat={item.latitude}
                    lng={item.longitude}
                    name={item.name}
                    rate={item.rate}
                    extraClass={`${index === hotelIndexSelected ? 'map-marker-pin-currency-selected' : ''}`}
                    params={{ hotelIndex: item.id }}
                    clickDo={showHotelnfo}
                />
            ));
        setMarkers(markerArr);
    };

    useEffect(() => {
        isFirstRender.current = false;
        console.log("this is happening first")
    });

    useEffect(() => {
        if (!isFirstRender.current) {
            if (showMap) {
                console.log("this is happening second")
                document.body.classList.add('modal-open');
            } else {
                document.body.classList.remove('modal-open');
            }
        }
    }, [showMap]);

    useEffect(() => {
        setShowMap(props.outsideButtonTrigger)
    }, [props.outsideButtonTrigger])

    useEffect(() => {
        if (!isFirstRender.current) {
            buildMapMarkers();
            const { isLoading } = mapState;
            if (isLoading) {
                setMapState({ ...mapState, isLoading: false });
            }
        }
    }, [resultPool, hotelIndexSelected]);

    const { showModalFilter, isLoading } = mapState;

    const hotelSelected = resultPool.find((hotel) => hotel.id === hotelIndexSelected);

    return (
        <>
            {/* <button
                onClick={(e) => onClickShowMapModal(e)}
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
            </button> */}
            {toggleMap && (
                <div className="map-dialog-fullscreen">
                    <div className="h-100 position-relative d-flex flex-column w-100 bg-white">
                        <div className="d-flex justify-content-between p-2">
                            <button className="btn-unstyled" type="button" onClick={() => closeMap()}>
                                <span className="">
                                    <svg
                                        className="icon mr-2"
                                        role="button"
                                        title=""
                                        width="100%"
                                        height="100%"
                                        xmlns="http://www.w3.org/2000/svg"
                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                    >
                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-close" />
                                    </svg>
                                    <span className="h6">{`${destination.text} ${destination.text2}`}</span>
                                </span>
                            </button>
                            <button type="button" className="btn-unstyled d-flex" onClick={onClickShowFilterModal}>
                                <svg
                                    className="icon-md mr-3"
                                    width="100%"
                                    height="100%"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                >
                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-filter-bar" />
                                </svg>
                                <span className="h6 mb-0">Filters</span>
                            </button>
                        </div>
                        <div
                            style={{ height: '100%', width: '100%', padding: '0px' }}
                            className="modal-main"
                            id="mdl-content"
                        >
                            <GoogleMapReact
                                bootstrapURLKeys={{ key: googleKey }}
                                defaultZoom={10}
                                defaultCenter={center}
                                options={(maps) => ({
                                    zoomControl: true,
                                    fullscreenControl: false,
                                    zoomControlOptions: {
                                        position: maps.ControlPosition.TOP_RIGHT,
                                    },
                                })}
                            >
                                {markers}
                            </GoogleMapReact>
                        </div>
                        {hotelSelected && (
                            <div className="map-selected-product-container">
                                <div className="d-flex justify-content-center px-2">
                                    <div className="position-relative map-selected-product-component">
                                        <button onClick={() => onClickCloseHotel()} className="btn-map-close" type="button">
                                            <svg
                                                className="icon"
                                                role="button"
                                                title=""
                                                width="100%"
                                                height="100%"
                                                xmlns="http://www.w3.org/2000/svg"
                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                            >
                                                <use xlinkHref="/img/icons/icon-defs.svg#icon-close" />
                                            </svg>
                                        </button>
                                        <HotelResult
                                            key="ht-map-show"
                                            result={hotelSelected}
                                            {...resultProps}
                                            index="ht-map-show"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {showModalFilter && (
                <AriaModal
                    onExit={onClickCloseFilterModal}
                    titleId="modal-flt-title"
                    aria-modal="true"
                    initialFocus="#mdl-flt-content"
                    aria-describedby="mdl-flt-content"
                    dialogClass="modal-lg"
                    dialogStyle={{ marginTop: '0px', width: '500px' }}
                    alert={false}
                >
                    <div className="modal-content modal">
                        <div id="modal-flt-title" className="modal-header">
                            <button className="btn-unstyled" type="button" onClick={onClickCloseFilterModal}>
                                <svg
                                    className="icon mr-3 "
                                    role="button"
                                    title=""
                                    width="100%"
                                    height="100%"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                >
                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-close" />
                                </svg>
                                <span className="h6">Filters</span>
                            </button>
                            {isLoading && (
                                <svg
                                    className="icon"
                                    title=""
                                    width="100%"
                                    height="100%"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                >
                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-spinner" />
                                </svg>
                            )}
                        </div>
                        <div
                            style={{
                                maxHeight: '800px',
                                width: '100%',
                                padding: '0px',
                                overflowY: 'scroll',
                            }}
                            className="modal-main"
                            id="mdl-flt-content"
                        >
                            <MapFilter
                                filters={filters}
                                onChange={onMapFilterChange}
                                filterValues={{ ...filterValues, numRecordsReturn: '5000' }}
                                filterKeyPrefix="modal"
                            />
                        </div>
                    </div>
                </AriaModal>
            )}
        </>
    );
};

HotelResultsInMap.propTypes = {
    filters: PropTypes.instanceOf(Array).isRequired,
    filterValues: PropTypes.instanceOf(Object).isRequired,
    resultPool: PropTypes.instanceOf(Object).isRequired,
    resultProps: PropTypes.instanceOf(Object).isRequired,
    onChange: PropTypes.func.isRequired,
    onLoadResultPool: PropTypes.func.isRequired,
    destination: PropTypes.instanceOf(Object).isRequired,
};

HotelResultsInMap.defaultProps = {
    destination: {},
};

export default HotelResultsInMap;
