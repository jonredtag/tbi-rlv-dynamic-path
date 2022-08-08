import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Collapse from 'reactstrap/lib/Collapse';
import Lang, { priceFormat } from 'libraries/common/Lang';
import moment from 'moment';

const SelectedFlight = (props) => {
    const {
        sid,
        flightData,
        toggleModal,
        rate,
        products,
    } = props;

    const [isOpen, toggleCollapse] = useState(false);
    return (
        <>
            <button type="button" onClick={() => { toggleCollapse(!isOpen); }} className="btn-unstyled d-md-none primary-color py-2 mt-2 ">
                <span className="text-closed">Veiw selected flight details</span>
                <span className="text-open">Hide flight details</span>
                <svg className="icon rotate ml-1" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                    <use xlinkHref="/img/icons/icon-defs.svg#icon-chevron-down" />
                </svg>
            </button>
            <Collapse className="d-md-block show" isOpen={isOpen}>
                <div className="border box-shadow rounded mb-3 mt-3 mt-md-0 dynamic-information-box py-lg-4 d-md-block">
                    <div className="container">
                        <div className="row no-gutters py-2">
                            <div className="col-12 col-md-9">
                                <div className="container p-0">
                                    <div className="row no-gutters">
                                        <div className="col-12 flight-product-component border-0 bg-transparent ">
                                            <div className="row ">
                                                {Object.keys(flightData.flight).map((flight, index) => {
                                                    const originFlight = flightData.flight[flight].segments[0];
                                                    const originDate = moment(originFlight.legs[0].departure);
                                                    const destinationFlight = flightData.flight[flight].segments[flightData.flight[flight].segments.length - 1];
                                                    const destinationDate = moment(destinationFlight.legs[0].arrival);
                                                    return (
                                                        <div className={`col-6 col-lg-auto ${index === 0 ? 'pr-lg-4 border-lg-right' : ''}`}>
                                                            <div className="d-none d-lg-inline-block">
                                                                <img
                                                                    className="flight-airline-logo rounded-circle border mr-2"
                                                                    src={`https://travel-img-assets.s3-us-west-2.amazonaws.com/flights/carrier-48x48/${originFlight.flight.carrier.toLowerCase()}.png`}
                                                                    alt=""
                                                                />
                                                            </div>
                                                            <div className="d-inline-block">
                                                                <div className="h6 mb-1 primary-color">{flightData.extras.carriers[originFlight.flight.carrier].name}</div>
                                                                <div className="d-inline-block">
                                                                    <span className="flight-airport-code" id="0-0">{originFlight.origin}</span>
                                                                    <b>{originDate.format('h:mm a')}</b>
                                                                </div>
                                                                <div className="d-inline-block">
                                                                    <svg className="icon info align-middle mx-1" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-chevron-right" />
                                                                    </svg>
                                                                </div>
                                                                <div className="d-inline-block">
                                                                    <span className="flight-airport-code" id="0-0">{destinationFlight.destination}</span>
                                                                    <b>{destinationDate.format('h:mm a')}</b>
                                                                </div>
                                                                <div className="flight-airline-section">{originDate.format('ddd, MMM DD')}</div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12  col-md-3 text-md-right mt-3 mt-md-0">
                                <div className="h6">{products.map((product) => Lang.trans(`product.${product}`)).join(' + ')}</div>
                                <div><span className="h6 mb-0 primary-color">Package Price: {priceFormat(rate)}</span></div>
                                <div>
                                    <a href={`/flight/search?sid=${sid}`}>Change Flight</a><span className="mx-2 d-md-none d-lg-inline-block">|</span>
                                    <button type="button" className="btn btn-unstyled primary-color" onClick={toggleModal}>Flight Details</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Collapse>
        </>
    );
};

SelectedFlight.propTypes = {
    sid: PropTypes.string.isRequired,
    flightData: PropTypes.instanceOf(Object).isRequired,
    toggleModal: PropTypes.func.isRequired,
    rate: PropTypes.string.isRequired,
    products: PropTypes.instanceOf(Array).isRequired,
};

export default SelectedFlight;
