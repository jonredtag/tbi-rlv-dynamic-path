import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-scroll';
import Lang, { priceFormat } from 'libraries/common/Lang';

const DetailFixedNav = (props) => {
    const { isOpen, packageTotal } = props;
    return (
        <div className={`d-none d-md-block py-3 bg-white w-100 fixed-scroll-header ${isOpen ? 'animate-in' : ''}`}>
            <div className="container">
                <div className="row gutter-10 justify-content-between align-items-center">
                    <div className="d-flex col-8 menu">
                        <Link className="nav-item px-2 px-lg-3 py-2" to="overview" smooth spy offset={-75} activeClass="active">{Lang.trans('dynamic.nav_overview')}</Link>
                        <Link className="nav-item px-2 px-lg-3 py-2" to="rooms" smooth spy offset={-75} activeClass="active">{Lang.trans('dynamic.nav_rooms')}</Link>
                        <Link className="nav-item px-2 px-lg-3 py-2" to="details" smooth spy offset={-75} activeClass="active">Details</Link>
                        <Link className="nav-item px-2 px-lg-3 py-2" to="maps" smooth spy offset={-75} activeClass="active">{Lang.trans('dynamic.nav_map')}</Link>
                        <Link className="nav-item px-2 px-lg-3 py-2" to="amenities" smooth spy offset={-75} activeClass="active">{Lang.trans('dynamic.amenities')}</Link>
                        <Link className="nav-item px-2 px-lg-3 py-2" to="policies" smooth spy offset={-75} activeClass="active">Policies</Link>
                        <Link className="nav-item px-2 px-lg-3 py-2" to="reviews" smooth spy offset={-75} activeClass="active">{Lang.trans('dynamic.nav_reviews')}</Link>
                    </div>
                    <div className="d-flex col-4 justify-content-end align-items-center">
                        <div className="d-lg-flex">
                            <del className="was-price pr-3 pr-lg-0 text-right align-self-center d-none">$890</del>
                            <div className="pr-3 pl-2 price h4 mb-0 font-weight-bold">{priceFormat(Math.floor(Math.max(packageTotal, 0)), 0)}</div>
                        </div>
                        <Link className="btn btn-primary btn-lg text-white" to="rooms" smooth spy offset={-75}>{Lang.trans('dynamic.view_rooms')}</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

DetailFixedNav.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    packageTotal: PropTypes.number.isRequired,
};

export default DetailFixedNav;
