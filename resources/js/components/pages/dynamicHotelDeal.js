/* global Uplift, tripInfo */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DynamicEngine from 'components/engines/dynamicEngine';
import BookingSteps from 'components/common/BookingSteps';
import DetailFixedNav from 'components/hotels/detailFixedNav';
import HotelDealHeader from 'components/hotels/dealHeader';
import DetailGallery from 'components/hotels/detailGallery';
import DetailBlurb from 'components/hotels/detailBlurb';
import ReviewBlurb from 'components/hotels/detailReviewBlurb';
import MapCTA from 'components/hotels/detailMapCTA';
import DetailRoomResults from 'components/hotels/detailRoomResults';
import MapSection from 'components/hotels/detailMapSection';
import Reviews from 'components/hotels/reviews';
import HotelDetailsOverviewLoader from 'components/widgets/hotelDetailsOverviewLoader';
import errorModal from 'helpers/errorModal';
import Loader from 'components/common/Loader';
import customModal from 'helpers/customModal';
import FlightDetailsSection from 'components/flights/search/FlightDetailsSection';
import Modal from 'reactstrap/lib/Modal';
import Lang from 'libraries/common/Lang';

import {
    Element,
} from 'react-scroll';

import 'react-dates/initialize';

class DynHotelDeal extends Component {
    constructor(props) {
        super(props);

        const { parameters } = props;

        this.state = {
            hidePrice: parameters.status !== 'accepted',
            results: JSON.parse(props.details),
            fixedRoomVisible: true,
            parameters,
            loaded: true,
            loading: false,
            showFixedNav: false,
            showModal: false,
            flightsData: {},
            steps: [
                {
                    visible: true,
                    status: 'completed',
                },
                {
                    visible: true,
                    status: 'active',
                },
                {
                    visible: true,
                    status: 'default',
                },
                {
                    visible: true,
                    status: 'default',
                },
                {
                    visible: true,
                    status: 'default',
                },
            ],
        };
        this.onRoomSelect = this.onRoomSelect.bind(this);
        this.listenToScroll = this.listenToScroll.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.roomsContainer = React.createRef();
    }

    onRoomSelect(room) {
        const { sid, parameters } = this.props;
        const url = '/api/hotel/add';

        fetch(url, {
            method: 'POST',
            body: JSON.stringify({ sid, hotel: parameters.hotelID, room }),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => response.json()).then((data) => {
            if (data.error !== undefined) {
                errorModal(data.error);
            } else {
                // good! let's forward to flights
                const baseUrl = data;
                window.location.href = `${baseUrl}?sid=${sid}`;
            }
        });

        return false;
    }

    listenToScroll() {
        const { fixedRoomVisible: fixedValue, showFixedNav: fixedNav } = this.state;
        const stateUpdate = {};
        if (this.roomsContainer.current !== null) {
            const { offsetTop, offsetHeight } = this.roomsContainer.current.childBindings.domNode;
            const roomsBottom = offsetTop + offsetHeight;
            const roomsTop = offsetTop;
            const that = this;
            const roomHeight = 450;
            const scrollTop = window.pageYOffset; // scrollY is not supported by IE11
            setTimeout(() => {
                let fixedRoomVisible = false;
                // show the fixed room bar again - if we have scrolled up beyond threshold after clicking rooms button
                if (roomsTop !== 0 && roomsBottom !== 0 && (scrollTop < (roomsTop - roomHeight) || scrollTop > roomsBottom)) {
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
            parameters,
            loading,
            fixedRoomVisible,
            loaded,
            showFixedNav,
            showModal,
            steps,
            hidePrice,
        } = this.state;


        const basicValid = results !== null && results.roomResults.length > 0;
        const validLoaded = (loaded && basicValid);
        const isStandalone = (parameters.selectedProducts.length === 1);
        return (
            <div>
                <Element name="top" />
                <BookingSteps steps={steps} isStandalone={isStandalone} />
                { validLoaded && <DetailFixedNav isOpen={showFixedNav} packageTotal={isStandalone ? results.roomResults[0].rate : 200} /> }
                <Loader position={loading ? 0 : 100} active={loading} />
                { loading && <div className="container"><HotelDetailsOverviewLoader /></div> }
                { (!validLoaded && !loading) && (
                    <div className="container mt-3">
                        <div className="alert alert-danger">No rooms available.</div>
                    </div>
                )}
                { validLoaded && (
                    <>
                        <Element className="container" name="overview">
                            <div className="mt-4">
                                <HotelDealHeader hotel={results} hidePrice={hidePrice} isStandalone={isStandalone} />
                            </div>
                            <div className="mt-2">
                                <DetailGallery hotel={results} />
                            </div>
                            <div className="mt-2 my-md-4">
                                <div className="row gutter-10">
                                    <div className="col-md-8">
                                        <DetailBlurb expand={false} hotel={results} />
                                    </div>
                                    <div className="col-md-4 d-flex flex-column">
                                    {window.Locale  === 'en' &&
                                        <ReviewBlurb reviews={results.reviews} />
                                    }
                                        <MapCTA />
                                    </div>
                                </div>
                            </div>
                        </Element>
                        {!hidePrice &&
                            <Element name="rooms" ref={this.roomsContainer}>
                                <DetailRoomResults hidePrice={hidePrice} parameters={parameters} fixedRoomVisible={fixedRoomVisible} hotel={results} onSelect={this.onRoomSelect} isStandalone={isStandalone} toggleFlightModal={this.toggleModal} />
                            </Element>
                        }
                        <div className="container">
                            <div className="my-5">
                                <Element name="maps">
                                    <MapSection hotel={results} />
                                </Element>
                            </div>
                            {window.Locale  === 'en' &&
                                <div className="my-5">
                                    <Element name="reviews">
                                        <Reviews reviews={results.reviews} />
                                    </Element>
                                </div>
                            }

                            <div className="mt-md-5 pt-md-5">
                                <Element name="details">
                                    <DetailBlurb expand hotel={results} />
                                </Element>
                            </div>
                        </div>
                    </>
                )}
            </div>
        );
    }
}

DynHotelDeal.propTypes = {
    parameters: PropTypes.instanceOf(Object).isRequired,
    details: PropTypes.string.isRequired,
    sid: PropTypes.string.isRequired,
};

export default DynHotelDeal;
