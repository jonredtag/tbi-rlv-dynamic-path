import React from 'react';
import { Link } from 'react-scroll';
import PropTypes from 'prop-types';
import TrustYouSummary from 'components/widgets/trustYouSummary';
import HsbcPoints from 'components/snippets/HsbcPoints';
import CibcPoints from 'components/snippets/CibcPoints';
import Lang, { priceFormat } from 'libraries/common/Lang';

const HotelDetailHeader = (props) => {
    const { hotel, isStandalone } = props;

    return (
        <div className="row pb-3 align-items-center justify-content-between title-and-price-container">
            <div className="col-lg-9 col-md-8 col-12">
                <span className="font-weight-bold my-2 h6 text-secondary " title="chart up">
                    <svg className="icon fill-secondary mr-1" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                        <use xlinkHref="/img/icons/icon-defs.svg#icon-chart-up" />
                    </svg>
                    <small className="text-secondary font-weight-bold">TRENDING HOTEL</small>
                </span>
                <h3 className="mb-0 font-weight-bold main-title primary-color">{hotel.name}</h3>
                <div className="d-flex align-items-center">
                    <span className="mt-1">{hotel.address}</span>
                </div>
                <div className="d-flex">
                    <span className="rating my-2" title="4.5 stars">
                        <svg className="first icon" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                            <use xlinkHref="/img/icons/icon-defs.svg#icon-star" />
                        </svg>
                        &nbsp;
                        {hotel.rating}
                    </span>
                    {hotel.review && (
                        <TrustYouSummary data={hotel.review} />
                    )}
                </div>
            </div>
            <div className="text-right col-lg-3 col-md-4 d-none d-md-block">
                { isStandalone && window.points === 'hsbc' &&  (
                        <HsbcPoints rate={ hotel.roomResults[0].rooms[0].rateTotal} />
                )}
                <div>
                    <h3 className="font-weight-bold primary-color mb-0">
                        {priceFormat(Math.floor(Math.max(isStandalone ? hotel.roomResults[0].rooms[0].rate : hotel.packageTotal, 0)), 0)}
                    </h3>
                </div>
                { isStandalone && window.points === 'cibc' &&  (
                        <CibcPoints rate={ hotel.roomResults[0].rooms[0].rateTotal} />
                )}
                <div className="mb-0">
                    {isStandalone ? Lang.trans('hotels.per_night') : Lang.trans(hotel.products.indexOf('transfer') === -1 ? 'dynamic.per_person_hotel_and_flight' : 'dynamic.per_person_hotel_and_flight_transfer')}
                </div>
                <Link to="rooms" smooth offset={-77} spy className="btn btn-lg btn-primary text-white">
                    Select Your Room
                </Link>
            </div>
        </div>
    );
};

HotelDetailHeader.propTypes = {
    hotel: PropTypes.instanceOf(Object).isRequired,
    isStandalone: PropTypes.bool.isRequired,
};

export default HotelDetailHeader;
