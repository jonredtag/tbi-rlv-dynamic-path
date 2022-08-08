import React from 'react';
import PropTypes from 'prop-types';
import Lang from 'libraries/common/Lang';
import Icons from 'libraries/common/Icons';

const ShowUpLift = (props) => {
    const divStyle = {
        display: 'none',
    };
    const {prodType, price, type, isStandalone }  = props;
    return (
        <div className={`btn-unstyled my-2 pt-2 mx-auto border-md-top d-inline-block uplift-click ${type === 1 ? '' : 'border-md-0'}`}>
            <div className="monthly-price-container pb-1" style={divStyle}
                data-up-price-value={price * 100}
                data-up-comparison-type=""
                data-up-price-type={isStandalone && prodType =='hotel'?'hotel_option':'total'}
                data-up-price-model={isStandalone && prodType =='hotel'?'avg_per_night':'per_person'} 
                data-up-taxes-included={true} 
               >
                <span className="d-inline-block mt-1 up-from-or-text align-top mr-1">{Lang.trans('engine.or')} {Lang.trans('uplift.from')}</span>
                <div className="d-block d-sm-inline-block">
                    <div className="d-inline-block border-bottom d-inline-block bd-blue">
                        <span className="monthly-price up-from-currency" data-up-from-currency="">$</span>
                        <span className="monthly-price" data-up-from-currency-unit-major=""></span>
                        <span className="align-top d-inline-block mt-1 up-from-per-month">/{Lang.trans('uplift.month')}</span>
                    </div>
                    <svg className="icon mt-2 align-top position-relative" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                        <use xlinkHref={Icons.path('info-circle')} />
                    </svg>
                </div>
                <span data-up-promo="zero-percent" style={divStyle}>
                    {Lang.trans('uplift.free_payment_msg')}
                </span>
            </div>
        </div>
    );
};

ShowUpLift.propTypes = {
    price: PropTypes.number,
    prodType: PropTypes.string.isRequired,
};

ShowUpLift.defaultProps = {
    price: 0,
    prodType:'hotel'
};

export default ShowUpLift;
