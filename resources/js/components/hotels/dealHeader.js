import React from 'react';
import { Link } from 'react-scroll';
import PropTypes from 'prop-types';
import Stars from 'components/widgets/stars';
import SmsHotelDeal from 'components/widgets/SmsHotelDeal';
import AmenityIcons from 'libraries/common/AmenityIcons';
import AmenityTranslations from 'libraries/common/AmenityTranslations';
import Lang, { priceFormat } from 'libraries/common/Lang';

const HotelDealHeader = (props) => {
    const { hotel, isStandalone, hidePrice } = props;
    const numberAmenities = 4;
    const sliced = hotel.amenities.length > 0 ? hotel.amenities.slice(0, numberAmenities) : [];
    return (
        <div className="row pb-3 align-items-center justify-content-between title-and-price-container">
            <div className={`${hidePrice ? 'col-md-8' : 'col-md-8 col-lg-9`'} `}>
                <h1 className="mb-0 font-weight-bold main-title">{hotel.name}</h1>
                <div className="my-1 secondary-title secondary-color font-weight-bold">Nov 13, 2020 - Nov 16, 2020 ( Nights)</div>
                <div className="d-flex">
                    <span className="rating my-2 mr-2 no-wrap" title={`${hotel.rating} ${Lang.trans('engine.stars')}`}>
                        <Stars component="HotelDealHeader" rating={hotel.rating} />
                    </span>
                    <div className="d-flex align-items-center">
                        <div className="mr-2">|</div>
                        <svg className="icon mr-1" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                            <use xlinkHref="/img/icons/icon-defs.svg#icon-map-pin" />
                        </svg>
                        <span className="mt-1">{hotel.address}</span>
                    </div>
                </div>
                <div className="d-none d-md-inline-block mt-2 py-1">
                    <div className="d-flex flex-wrap align-items-center">
                        {sliced.map((amenity, amenityIndex) => (
                            <div key={`detailHeader-amenities-${amenityIndex}`} className="pr-4 amenity-item-title-section ellipsis py-2 d-flex align-items-center">
                                <svg className="info mr-1" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                    <use xlinkHref={AmenityIcons.get(amenity)} />
                                </svg>
                                {AmenityTranslations.get(amenity)}
                            </div>
                        ))}
                        <Link to="details" smooth spy className="border-0 d-inline-block see-amenities-btn py-2 text-secondary">{Lang.trans('buttons.see_all_details')}</Link>
                    </div>
                </div>
            </div>
            <div className={`${hidePrice ? 'col-md-4' : 'col-lg-3 col-md-4'} text-right`}>
                {!hidePrice && (
                    <>
                        <Link to="rooms" smooth spy className="btn btn-lg btn-primary text-white">{Lang.trans('dynamic.view_rooms')}</Link>
                    </>
                )}
                <SmsHotelDeal hotel={hotel} hidePrice={hidePrice} />
            </div>
        </div>
    );
};

HotelDealHeader.propTypes = {
    hotel: PropTypes.instanceOf(Object).isRequired,
    isStandalone: PropTypes.bool.isRequired,
    hidePrice: PropTypes.bool,
};

HotelDealHeader.defaultProps = {
    hidePrice: false,
};

export default HotelDealHeader;
