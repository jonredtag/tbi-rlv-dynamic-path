
import React from 'react';
import PropTypes from 'prop-types';
import Lang from 'libraries/common/Lang';
import PriceDetailsSection from 'components/flights/verify/PriceDetailsSection';

const ModalPriceDetail = (props) => {
    const { pricingInfo } = props;

    return (
        <div className="modal fade xx flight-details" id="mdl-price-details"> {/*<!-- show -->*/}
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header modal-solid-header-bar" >
                        <h5 className="modal-title h4 ">
                            <span className="header-icon modal-header-icon-large  d-none d-md-inline">
                                <svg className="icon building" data-dismiss="modal" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-plane-right" />
                                </svg>
                            </span>
                            {Lang.trans('common.price_details')}
                            <button type="button" className="close close-lg" data-dismiss="modal" aria-label="Close">
                                 <span aria-hidden="true">×</span>
                            </button>
                        </h5>
                    </div>

                    <div className="container">
                        <div className="row gutter-10 py-4">
                            <PriceDetailsSection pricingInfo={pricingInfo}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalPriceDetail;

