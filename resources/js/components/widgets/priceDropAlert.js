import React from 'react';
import PropTypes from 'prop-types';
import Lang, { priceFormat } from 'libraries/common/Lang';

const PriceDropAlert = (props) => {
    const { paymentInformation } = props;

    const hotelOnly = Object.prototype.hasOwnProperty.call(paymentInformation, 'hotel') && !Object.prototype.hasOwnProperty.call(paymentInformation, 'flight')
                        ? true : false;

    return ((paymentInformation.cost.priceChange < -10 && (
        <div className="alert alert-success mt-2 mt-lg-0">
            <h5>{Lang.trans('dynamic.great_news')}</h5>
            <p className="m-0">{Lang.trans('dynamic.the_price_dropped_from')}
                <strong>{priceFormat(paymentInformation.cost.costPer - paymentInformation.cost.priceChange)}</strong>
                &nbsp;{Lang.trans('common.to')}&nbsp;
                <strong>{priceFormat(paymentInformation.cost.costPer)}</strong> {hotelOnly ? 'per night' : Lang.trans('common.per_adult')}.
            </p>
        </div>
    ))
        || (paymentInformation.cost.priceChange > 10 && (
            <div className="alert alert-warning mt-2 mt-lg-0">
                <h5>{Lang.trans('dynamic.price_change')}</h5>
                <p className="m-0">{Lang.trans('dynamic.the_price_increased')}
                    <strong>{priceFormat(paymentInformation.cost.costPer - paymentInformation.cost.priceChange)}</strong>
                    &nbsp;{Lang.trans('common.to')}&nbsp;
                    <strong>{priceFormat(paymentInformation.cost.costPer)}</strong> {hotelOnly ? 'per night' : Lang.trans('common.per_adult')}.
                </p>
            </div>
        ))
    );
};

PriceDropAlert.propTypes = {
    paymentInformation: PropTypes.instanceOf(Object).isRequried,
};

export default PriceDropAlert;
