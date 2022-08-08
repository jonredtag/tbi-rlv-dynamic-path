import React from 'react';
import PropTypes from 'prop-types';

const AmenityList = (props) => {
    const { hotel } = props;

    const cols = 4;

    let count = 0;
    const amentityLists = [];
    // this is used to balance the columns from left to right
    for (let i = 0; i < cols; i++) {
        const roughCount = (hotel.allAmenities.length - count) / (cols - i);
        const length = Math.ceil(roughCount);
        if (length) {
            amentityLists[i] = [];
            for (let a = 0; a < length; a++) {
                amentityLists[i].push(hotel.allAmenities[count]);
                count += 1;
            }
        }
    }
    return (
        <>
            <h5 className="mb-4 font-weight-bold">Amenities</h5>
            <div className="row">
                {amentityLists.map((amenities) => (
                    <div className="col-12 col-md-6 col-lg-3 mb-2">
                        <ul className="list-unstyled">
                            {amenities.map((amenity) => (
                                <li className="d-flex mb-1">
                                    <div>
                                        <svg className="mr-1 white-check-bg-green" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                            <use xlinkHref="/img/icons/icon-defs.svg#icon-checkmark-round" />
                                        </svg>
                                    </div>
                                    {amenity}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </>
    );
};

AmenityList.propTypes = {
    hotel: PropTypes.instanceOf(Object).isRequired,
};

export default AmenityList;
