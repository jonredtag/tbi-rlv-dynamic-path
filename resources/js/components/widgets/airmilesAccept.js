import React from 'react';
import PropTypes from 'prop-types';
import ErrorText from 'components/snippets/errorText';
import Lang from 'libraries/common/Lang';

const AirmilesAccept = (props) => {
    const {
        baseRate,
        cardNumber,
        onChange,
        errors,
    } = props;

    const cardUpdate = (event) => {
        const { target } = event;

        const newPaymentInformation = {
            airmiles: target.value,
        };

        onChange(newPaymentInformation, 'airmiles.airmiles');
    };

    const errorKeys = Object.keys(errors);
    return (
        <div className="rounded-sm p-3 mb-3 box-shadow bg-white">
            <div className="d-flex justify-content-between points-section">
                <div className="d-flex align-items-center primary-color">
                    <div className="mr-2 d-none"><img className="points-logo" src="https://s3.amazonaws.com/redtag-ca/img/airmiles/airmiles-logo.png" alt="" data-was-processed="true" /></div>
                    <h5 className="m-0 font-weight-bold">{Lang.trans('airmiles.airmiles_information')}</h5>
                </div>
            </div>
            <div className="mt-3">
                <div className="points-section">
                    <div className="row mb-3 pl-3">
                        {errorKeys.length > 0 && (
                            <div className="error-container w-100 mb-2 mr-3">
                                {errorKeys.map((key) => (<ErrorText key={errors[key].id} error={errors[key]} />))}
                            </div>
                        )}
                        <h6 id="show_petro_points" className="pr-1 d-flex align-items-center">
                            <div>
                                {Lang.trans('airmiles.airmiles_earn_1')}
                                <span className="primary-color">
                                    <span> {Math.floor(baseRate / 20)} </span>
                                </span>
                                {Lang.trans('airmiles.airmiles_earn_2')}
                            </div>
                        </h6>
                    </div>
                    <div className="row mb-3 custom-form-element">
                        <div className="col-12"><label htmlFor="loyaltyNumber">{Lang.trans('airmiles.airmiles_number')}</label>
                            <div className="row gutter-10">
                                <div className="col-12">
                                    <input type="text" id="loyaltyNumber" className="form-control numbersonly" placeholder={Lang.trans('airmiles.airmiles_number_placeholder')} value={cardNumber} onChange={cardUpdate} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

AirmilesAccept.propTypes = {
    baseRate: PropTypes.number.isRequired,
    cardNumber: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    errors: PropTypes.instanceOf(Object),
};

AirmilesAccept.defaultProps = {
    errors: {},
};

export default AirmilesAccept;
