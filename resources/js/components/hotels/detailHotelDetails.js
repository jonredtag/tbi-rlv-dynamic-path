import React from 'react';
import PropTypes from 'prop-types';
import AmenityIcons from 'libraries/common/AmenityIcons';
import AmenityTranslations from 'libraries/common/AmenityTranslations';
import Lang from 'libraries/common/Lang';
import { Link } from 'react-scroll';

const HotelDetails = (props) => {
    const { hotel } = props;
    const amenities = hotel.allAmenities;

    return (
        <div className="row">
            <div className="col-12">
                <div className="description-preview d-flex order-1 order-md-0">
                    <div className="pb-3">
                        <h5 className="mb-2 font-weight-bold">{Lang.trans('dynamic.about_this_hotel')}</h5>
                        <div dangerouslySetInnerHTML={{ __html: hotel.propertyDescription }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

HotelDetails.propTypes = {
    hotel: PropTypes.instanceOf(Object).isRequired,
};

export default HotelDetails;
