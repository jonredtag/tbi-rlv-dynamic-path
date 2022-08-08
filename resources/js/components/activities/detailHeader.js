import React from 'react';
import { Link } from 'react-scroll';
import PropTypes from 'prop-types';
import Helper from 'libraries/common/Helper';
import Stars from 'components/widgets/stars';
import AmenityIcons from 'libraries/common/AmenityIcons';
import AmenityTranslations from 'libraries/common/AmenityTranslations';
import Lang, { priceFormat } from 'libraries/common/Lang';

const DetailHeader = (props) => {
    const { activity } = props;
    return (
        <div className="row pb-3 align-items-center justify-content-between title-and-price-container">
            <div className="col-12">
                <h1 className="mb-0 font-weight-bold main-title">{activity.name}</h1>
                <div className="d-flex">
                    <div className="d-flex align-items-center">
                        <svg
                            className="icon mr-1"
                            width="100%"
                            height="100%"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                        >
                            <use xlinkHref="/img/icons/icon-defs.svg#icon-map-pin" />
                        </svg>
                        <span className="mt-1">{activity.location?activity.location.addr:null}</span>
                    </div>
                </div>

                <div className="d-none d-md-inline-block mt-2 py-1">
                    <div className="d-flex flex-wrap align-items-center">
                        <Link
                            to="details"
                            smooth
                            spy
                            className="border-0 d-inline-block see-amenities-btn py-2 text-secondary"
                        >
                            {Lang.trans('buttons.see_all_details')}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

DetailHeader.propTypes = {
    activity: PropTypes.instanceOf(Object).isRequired,
};

export default DetailHeader;
