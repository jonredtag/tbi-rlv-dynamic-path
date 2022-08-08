import React from 'react';
import PropTypes from 'prop-types';
import numberFormat from 'helpers/numberFormat';
import { Link } from 'react-scroll';
import Lang from 'libraries/common/Lang';

const DetailMapCTA = (props) => {
    const { hotel } = props;

    const length = Math.min(hotel.landmarks.length, 4);
    const POIs = [];
    for (let i = 0; i < length; i++) {
        POIs.push(hotel.landmarks[i]);
    }

    return (
        <div className="d-block col-md-5 h-100 mt-2">
            <div className="row h-50 gutter-10 pt-2">
                <div className="col-12 h-100 d-block position-relative flex-grow-1 see-map-button-image p-0">
                    <Link className="click-map-text h3 mb-0 text-white position-absolute w-100 h-100 d-flex align-items-center justify-content-center" to="maps" smooth spy offset={-75}>
                        <div className="map-text d-flex align-items-center">
                            View in a map
                        </div>
                    </Link>
                    <img className="image-map w-100 rounded" src="https://travel-img.s3.amazonaws.com/2019-10-23--15718614125067map-image.gif" alt="" />
                </div>
                <span className="py-2 primary-color">{hotel.address}</span>
                <div className="row h-50 gutter-10 pt-2">
                    <h4 className="mb-2 font-weight-bold primary-color">Things To Do In This Area</h4>
                    <div className="col-12">
                        {POIs.map((POI) => (
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <svg className="icon mr-1" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-map-pin" />
                                    </svg>
                                    <span className="mt-1">{POI.name}</span>
                                </div>
                                <span className="mt-1">{numberFormat({ value: POI.distance })} mile</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

DetailMapCTA.propTypes = {
    hotel: PropTypes.instanceOf(Object).isRequired,
};

export default DetailMapCTA;
