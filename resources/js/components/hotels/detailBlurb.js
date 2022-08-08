import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-scroll';
import amenityIcons from 'libraries/common/AmenityIcons';
import amenityTranslations from 'libraries/common/AmenityTranslations';

const DetailsBlurb = (props) => {
    const { hotel } = props;

    return (
        <div className="col-12 col-md-7 h-100 ">
            {hotel.propertyDescription !== '' && (
                <div className="description-preview border-bottom mr-3">
                    <div className="py-3 pr-3">
                        <h5 className="mb-2 font-weight-bold primary-color">About This Hotel</h5>
                        <div className="overflow-hide" dangerouslySetInnerHTML={{ __html: hotel.propertyDescription }} />
                        <Link className="text-dark d-inline-block text-decoration-none mt-1 border-bottom" to="details" smooth spy offset={-75}>
                            Read More
                        </Link>
                    </div>
                </div>
            )}
            {hotel.amenities.length > 0 && (
                <div className="py-3 pr-3 border-bottom mr-3">
                    <h5 className="mb-2 font-weight-bold primary-color">Popular Amenities</h5>
                    <div className="d-inline-block">
                        <div className="d-flex flex-wrap align-items-center">
                            {hotel.amenities.map((amenity, index) => (
                                <div key={`ame_${index}`} className="pr-4 amenity-item-title-section ellipsis py-2 d-flex align-items-center">
                                    <svg className="info mr-1" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                        <use xlinkHref={amenityIcons.get(amenity)} />
                                    </svg>
                                    {amenityTranslations.get(amenity)}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {hotel.reviews && !Object.prototype.hasOwnProperty.call(hotel.reviews,'error') && Object.keys(hotel.reviews.cleanliness).length > 0 && (
                <div className="pt-3 pr-3">
                    <h5 className="mb-2 font-weight-bold primary-color">Cleaning and Safety Practies</h5>
                    <div className="d-inline-block">
                        <div className="d-flex flex-wrap align-items-center">
                            <div className="pr-4 amenity-item-title-section ellipsis py-2 d-flex">
                                <svg className="info mr-1" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-sports-activities" />
                                </svg>
                                <span>Health Safety <br /> {hotel.reviews.cleanliness.healthSafety} / 5 </span>
                            </div>
                            <div className="pr-4 amenity-item-title-section ellipsis py-2 d-flex">
                                <svg className="info mr-1" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-spa" />
                                </svg><span>Cleanliness <br /> {hotel.reviews.cleanliness.cleanliness} / 5</span>
                            </div>
                            {hotel.reviews.cleanliness.covid && (
                                <div className="pr-4 amenity-item-title-section ellipsis py-2 d-flex">
                                    <svg className="info mr-1" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-snow-flake" />
                                    </svg><span>COVID-19 <br /> {hotel.reviews.cleanliness.covid} / 5</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

DetailsBlurb.propTypes = {
    hotel: PropTypes.instanceOf(Object).isRequired,
};

export default DetailsBlurb;
