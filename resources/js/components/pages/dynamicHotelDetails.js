/* global Uplift, tripInfo */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DynamicEngine from 'components/engines/dynamicEngine';
import BookingSteps from 'components/common/BookingSteps';
import DetailFixedNav from 'components/hotels/detailFixedNav';
import DetailHeader from 'components/hotels/detailHeader';
import DetailGallery from 'components/hotels/detailGallery';
import DetailAmenities from 'components/hotels/detailAmenities';
import DetailsBlurb from 'components/hotels/detailBlurb';
import DetailPolicies from 'components/hotels/detailPolicies';
import MapCTA from 'components/hotels/detailMapCTA';
import TrustYouReviewSummary from 'components/hotels/trustYouReviewSummary';
import HotelDetails from 'components/hotels/detailHotelDetails';
import DetailRoomResults from 'components/hotels/detailRoomResults';
import MapSection from 'components/hotels/detailMapSection';
import Reviews from 'components/hotels/reviews';
import HotelDetailsOverviewLoader from 'components/widgets/hotelDetailsOverviewLoader';
import errorModal from 'helpers/errorModal';
import Loader from 'components/common/Loader';
import Profile from 'components/widgets/profile';
import customModal from 'helpers/customModal';
import FlightDetailsSection from 'components/flights/search/FlightDetailsSection';
import Modal from 'reactstrap/lib/Modal';
import Lang, { priceFormat } from 'libraries/common/Lang';
import { Element } from 'react-scroll';

import 'react-dates/initialize';

class DynHotelDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            results: null,
            fixedRoomVisible: true,
            loaded: false,
            loading: false,
            showFixedNav: false,
            showModal: false,
            flightsData: {},
        };
        this.onRoomSelect = this.onRoomSelect.bind(this);
        this.listenToScroll = this.listenToScroll.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.roomsContainer = React.createRef();
    }

    componentDidMount() {
        const { sid, hotel, googleKey } = this.props;
        const url = `/api/hotel/details?hotel=${hotel}&sid=${sid}`;

        window.addEventListener('scroll', this.listenToScroll);
        this.setState({ loading: true });

        const promise = fetch(url);
        promise
            .then((response) => response.json())
            .then((data) => {
                if (data.error !== undefined) {
                    errorModal(data.error);
                } else {
                    const basicValid = data !== null && Object.keys(data.roomResults).length > 0;
                    if (!basicValid) {
                        const roomError = {
                            code: 'r-01',
                            message: 'No rooms available, please select another hotel.',
                            buttons: [
                                {
                                    text: 'OK',
                                    type: 'secondary',
                                    onClick: () => {
                                        window.history.back();
                                    },
                                },
                            ],
                        };
                        customModal(roomError);
                    }
                    import('modules/urgency');
                    this.setState({
                        loaded: true,
                        results: data,
                        loading: false,
                    });
                    if (typeof Uplift !== 'undefined' && !isRefundablePath) {
                        setTimeout(() => {
                             Uplift.Payments.load(tripInfo);
                        }, 200);
                    }

                    // Google Datalayer
                    const googleData = {
                        event: 'view_item_list',
                        ecommerce: {
                            items: [
                                {
                                    item_name: data.name,
                                    price: hotel.pacakgeTotal,
                                    item_brand: '',
                                    item_category: 'hotel',
                                    index: 1,
                                },
                            ],
                        },
                    };

                    data.hotels.forEach((hotel, index) => {
                        googleData.ecommerce.items.push();
                    });

                    console.log(googleData);
                    dataLayer.push({ ecommerce: null });  // Clear the previous ecommerce object.
                    dataLayer.push(googleData);
                    // Google Datalayer
                }
            });
        promise.catch(() => {
            this.setState({ loading: false });
        });
    }

    onRoomSelect(room) {
        const { sid, hotel } = this.props;
        const url = '/api/hotel/add';

        fetch(url, {
            method: 'POST',
            body: JSON.stringify({ sid, hotel, room }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error !== undefined) {
                    errorModal(data.error);
                } else {
                    // good! let's forward to flights
                    const baseUrl = data;
                    window.location.href = `${baseUrl}?sid=${sid}${isRefundablePath ? '&=refundable=1' : ''}`;
                }
            });

        return false;
    }

    listenToScroll() {
        const { fixedRoomVisible: fixedValue, showFixedNav: fixedNav } = this.state;
        const stateUpdate = {};
        if (this.roomsContainer.current !== null) {
            const {
                offsetTop,
                offsetHeight,
            } = this.roomsContainer.current.childBindings.domNode;
            const roomsBottom = offsetTop + offsetHeight;
            const roomsTop = offsetTop;
            const that = this;
            const roomHeight = 450;
            const scrollTop = window.pageYOffset; // scrollY is not supported by IE11
            setTimeout(() => {
                let fixedRoomVisible = false;
                // show the fixed room bar again - if we have scrolled up beyond threshold after clicking rooms button
                if (
                    roomsTop !== 0 &&
                    roomsBottom !== 0 &&
                    (scrollTop < roomsTop - roomHeight || scrollTop > roomsBottom)
                ) {
                    fixedRoomVisible = true;
                }
                if (fixedValue !== fixedRoomVisible) {
                    stateUpdate.fixedRoomVisible = fixedRoomVisible;
                }

                let showFixedNav = false;
                if (scrollTop > 215) {
                    showFixedNav = true;
                }
                if (showFixedNav !== fixedNav) {
                    stateUpdate.showFixedNav = showFixedNav;
                }

                if (Object.keys(stateUpdate).length > 0) {
                    that.setState(stateUpdate);
                }
            }, 2);
        }
    }

    toggleModal() {
        const { showModal } = this.state;

        this.setState({ showModal: !showModal });
    }

    render() {
        const {
            results,
            loading,
            fixedRoomVisible,
            loaded,
            showFixedNav,
            showModal,
        } = this.state;
        const {
            sid,
            parameters,
            breadcrumbs,
            features,
            googleKey,
            profileConfig,
        } = this.props;

        const products = Object.keys(breadcrumbs);

        if (features.addon) {
            breadcrumbs.review = false;
        }

        const basicValid = results !== null && Object.keys(results.roomResults).length > 0;
        // const validResponse = (!loading && basicValid);
        const validLoaded = loaded && basicValid;
        const isStandalone = parameters.selectedProducts.length === 1;
        return (
            <div>
                <Element name="top" />
                {(features !== undefined && profileConfig !== undefined && features.profile) && (
                    <>
                        <Profile element="pro_section" config={profileConfig}/>
                        <Profile element="pro_section_mobile" config={profileConfig}/>
                    </>
                )}
                <BookingSteps steps={breadcrumbs} active="htlDetails" />
                {validLoaded && (
                    <DetailFixedNav
                        isOpen={showFixedNav}
                        packageTotal={
                            isStandalone
                                ? results.roomResults[0].rooms[0].rate
                                : results.packageTotal
                        }
                    />
                )}
                <DynamicEngine sid={sid} parameters={parameters} />
                <Loader position={loading ? 0 : 100} active={loading} />
                {loading && (
                    <div className="container">
                        <HotelDetailsOverviewLoader />
                    </div>
                )}
                {!validLoaded && !loading && (
                    <div className="container mt-3">
                        <div className="alert alert-danger">No rooms available.</div>
                    </div>
                )}
                {validLoaded && (
                    <>
                        <Element className="container border rounded box-shadow px-3 my-4 bg-white" name="overview">
                            {results.flashMessage !== undefined && (
                                <div className="mt-4">
                                    <div className="col alert alert-warning">
                                        {results.flashMessage}
                                    </div>
                                </div>
                            )}
                            <div className="mt-4">
                                <DetailHeader hotel={results} products={products} isStandalone={isStandalone} />
                            </div>
                            <div className="pb-5 border-bottom">
                                <DetailGallery hotel={results} />
                            </div>
                            <div className="pb-3" id="overview">
                                <div className="row gutter-10 m-0">
                                    <DetailsBlurb hotel={results} />
                                    <MapCTA hotel={results} />
                                </div>
                                {results && results.reviews 
                                    && !Object.prototype.hasOwnProperty.call(results.reviews,'error') && (
                                    <TrustYouReviewSummary data={results.reviews} />
                                )}
                            </div>
                        </Element>
                        <Element name="rooms" ref={this.roomsContainer}>
                            <DetailRoomResults
                                parameters={parameters}
                                products={products}
                                fixedRoomVisible={fixedRoomVisible}
                                hotel={results}
                                isStandalone={isStandalone}
                                toggleFlightModal={this.toggleModal}
                                onSelect={this.onRoomSelect}
                            />
                        </Element>
                        <div className="container border rounded box-shadow px-3 py-4 my-4 bg-white" id="details">
                            <HotelDetails expand hotel={results} />
                            <Element name="maps">
                                <MapSection googleKey={googleKey} hotel={results} />
                            </Element>
                        </div>
                        {results.allAmenities.length > 0 && (
                            <div className="container border rounded box-shadow px-3 py-4 my-4 bg-white " id="amenities">
                                <DetailAmenities hotel={results} />
                            </div>
                        )}
                        {results.policies.length > 0 && (
                            <div className="container border rounded box-shadow px-3 py-4 my-4 bg-white " id="policies">
                                <DetailPolicies policies={results.policies} />
                            </div>
                        )}
                        {window.Locale === 'en' && results.reviews && results.reviews.trustyouID !== undefined && (
                            <div className="container border rounded box-shadow px-3 py-4 my-4 bg-white" id="reviews">
                                <Reviews id={results.reviews.trustyouID} />
                            </div>
                        )}
                        <Modal isOpen={showModal} size="lg">
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
                                        onClick={this.toggleModal}
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
                                    flightdetails={results.flightProduct}
                                    extras={results.flightExtras}
                                />
                            </div>
                        </Modal>
                    </>
                )}
            </div>
        );
    }
}

DynHotelDetails.propTypes = {
    sid: PropTypes.string.isRequired,
    parameters: PropTypes.instanceOf(Object).isRequired,
    hotel: PropTypes.string.isRequired,
    features: PropTypes.instanceOf(Object).isRequired,
    breadcrumbs: PropTypes.instanceOf(Object).isRequired,
};

export default DynHotelDetails;
