import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-scroll';
import Lang, { priceFormat } from 'libraries/common/Lang';

const FixedRoomResult = (props) => {
    const {
        packageTotal,
        fixedRoomVisible,
        isStandalone,
    } = props;

    if (!fixedRoomVisible) {
        return null;
    }

    return (
        <div className="fixed-hotel-price-mobile animate-in w-100 py-2 px-3 d-md-none">
            <div className="row gutter-10">
                <div className="background-color w-100 d-flex align-items-center justify-space-between py-1 rounded">
                    <div className="col-4 text-white">
                        {/* <small><del>${hotel.packageTotal}</del></small> */}
                        <div className="price h3 mb-0">
                            <b>{priceFormat(Math.floor(packageTotal), 0)}</b>
                        </div>
                        <small>{isStandalone ? Lang.trans('hotels.per_night') : Lang.trans('common.per_person')}</small>
                    </div>
                    <div className="col-8 text-right">
                        <Link type="button" to="rooms" smooth offset={-75} className="btn btn-lg btn-primary text-white">
                            {Lang.trans('dynamic.choose_room')}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

FixedRoomResult.propTypes = {
    packageTotal: PropTypes.number.isRequired,
    fixedRoomVisible: PropTypes.bool.isRequired,
    isStandalone: PropTypes.bool.isRequired,
};

export default FixedRoomResult;
