import React from 'react';
import PropTypes from 'prop-types';

const RoomsHeader = (props) => {
    const { isStandalone, showTotal, toggleFullRate } = props;
    return (
        <>
            <h5 className="font-weight-bold">Choose Your Room</h5>
            <div className="row">
                <div className="col-12 col-sm-6 col-xl-9 col-md-8 my-2">
                    {/* <button className="btn btn-filter mx-2 mt-2 mt-md-0">Breakfast (0)</button>
                    <button className="btn btn-filter mx-2 mt-2 mt-md-0">2 Beds (0)</button>
                    <button className="btn btn-filter mx-2 mt-2 mt-md-0">Free Cancellation</button>
                    <button className="btn btn-filter mx-2 mt-2 mt-lg-0">1 Double Bed (4)</button>
                    <button className="btn btn-filter mx-2 mt-2 mt-xl-0">Multiple Beds (4)</button> */}
                </div>
                {isStandalone && (
                    <div className="col-12 col-sm-6 col-xl-3 col-md-4 mt-2">
                        <div className="row">
                            <div className="col-12 col-lg-9 d-flex justify-content-sm-end justify-content-xs-start">
                                <div className="text-capitalize d-inline-block align-self-end">
                                    <div className="d-flex justify-content-sm-end justify-content-xs-start">Show total Price</div>
                                    <div>(including taxes and fees)</div>
                                </div>
                            </div>
                            <div className="col-12 col-lg-3 pl-xs-3 pl-sm-0 d-flex justify-content-sm-end justify-content-lg-start justify-content-xs-start">
                                <label className="switch mb-0 align-self-center">
                                    <input type="checkbox" value="false" checked={showTotal} onChange={toggleFullRate} />
                                    <span className="slider round ml-lg-0" />
                                </label>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {/* <div className="collapse">
                <div className="row">
                    <div className="col-12 col-sm-6 col-xl-9 col-md-8 my-2">
                        <button className="btn btn-filter mx-2 mt-2 mt-md-0">Breakfast (0)</button>
                        <button className="btn btn-filter mx-2 mt-2 mt-md-0">2 Beds (0)</button>
                        <button className="btn btn-filter mx-2 mt-2 mt-md-0">Free Cancellation</button>
                        <button className="btn btn-filter mx-2 mt-2 mt-lg-0">1 Double Bed (4)</button>
                        <button className="btn btn-filter mx-2 mt-2 mt-xl-0">Multiple Beds (4)</button>
                    </div>
                </div>
            </div>
            <div className="text-left mx-2 mt-3 mt-md-0">
                <button className="btn-unstyled primary-color font-weight-bold collapsed">
                    <span className="text-closed">More Options</span>
                    <span className="text-open">Less Options</span>
                    <svg className="icon-sm rotate" role="" title="">
                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/img/icons/icon-defs.svg#icon-chevron-down"></use>
                    </svg>
                </button>
            </div> */}
        </>
    );
};

RoomsHeader.propTypes = {
    isStandalone: PropTypes.bool.isRequired,
    showTotal: PropTypes.bool.isRequired,
    toggleFullRate: PropTypes.func.isRequired,
};

export default RoomsHeader;
