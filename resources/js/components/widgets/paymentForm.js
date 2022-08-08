import React from 'react';
import PropTypes from 'prop-types';
import MaskedInput from 'react-input-mask';
import ErrorText from 'components/snippets/errorText';
import numberFormat from 'helpers/numberFormat';
import Lang from 'libraries/common/Lang';

const PaymentForm = (props) => {
    const {
        paymentInformation,
        onUpdate,
        cost,
        errors,
    } = props;

    const provinces = [
        { value: 'AB', text: 'Alberta' },
        { value: 'BC', text: 'British Columbia' },
        { value: 'MB', text: 'Manitoba' },
        { value: 'NB', text: 'New Brunswick' },
        { value: 'NL', text: 'Newfoundland and Labrador' },
        { value: 'NT', text: 'Northwest Territories' },
        { value: 'NS', text: 'Nova Scotia' },
        { value: 'NU', text: 'Nunavut' },
        { value: 'ON', text: 'Ontario' },
        { value: 'PE', text: 'Prince Edward Island' },
        { value: 'QC', text: 'Quebec' },
        { value: 'SK', text: 'Saskatchewan' },
        { value: 'YT', text: 'Yukon Territory' },
    ];

    const states = [
        { value: 'AK', text: 'Alaska' },
        { value: 'AL', text: 'Alabama' },
        { value: 'AR', text: 'Arkansas' },
        { value: 'AS', text: 'American Samoa' },
        { value: 'AZ', text: 'Arizona' },
        { value: 'CA', text: 'California' },
        { value: 'CO', text: 'Colorado' },
        { value: 'CT', text: 'Connecticut' },
        { value: 'DC', text: 'District of Columbia' },
        { value: 'DE', text: 'Delaware' },
        { value: 'FL', text: 'Florida' },
        { value: 'GA', text: 'Georgia' },
        { value: 'GU', text: 'Guam' },
        { value: 'HI', text: 'Hawaii' },
        { value: 'IA', text: 'Iowa' },
        { value: 'ID', text: 'Idaho' },
        { value: 'IL', text: 'Illinois' },
        { value: 'IN', text: 'Indiana' },
        { value: 'KS', text: 'Kansas' },
        { value: 'KY', text: 'Kentucky' },
        { value: 'LA', text: 'Louisiana' },
        { value: 'MA', text: 'Massachusetts' },
        { value: 'MD', text: 'Maryland' },
        { value: 'ME', text: 'Maine' },
        { value: 'MI', text: 'Michigan' },
        { value: 'MN', text: 'Minnesota' },
        { value: 'MO', text: 'Missouri' },
        { value: 'MS', text: 'Mississippi' },
        { value: 'MT', text: 'Montana' },
        { value: 'NC', text: 'North Carolina' },
        { value: 'ND', text: 'North Dakota' },
        { value: 'NE', text: 'Nebraska' },
        { value: 'NH', text: 'New Hampshire' },
        { value: 'NJ', text: 'New Jersey' },
        { value: 'NM', text: 'New Mexico' },
        { value: 'NV', text: 'Nevada' },
        { value: 'NY', text: 'New York' },
        { value: 'OH', text: 'Ohio' },
        { value: 'OK', text: 'Oklahoma' },
        { value: 'OR', text: 'Oregon' },
        { value: 'PA', text: 'Pennsylvania' },
        { value: 'PR', text: 'Puerto Rico' },
        { value: 'RI', text: 'Rhode Island' },
        { value: 'SC', text: 'South Carolina' },
        { value: 'SD', text: 'South Dakota' },
        { value: 'TN', text: 'Tennessee' },
        { value: 'TX', text: 'Texas' },
        { value: 'UT', text: 'Utah' },
        { value: 'VA', text: 'Virginia' },
        { value: 'VI', text: 'Virgin Islands' },
        { value: 'VT', text: 'Vermont' },
        { value: 'WA', text: 'Washington' },
        { value: 'WI', text: 'Wisconsin' },
        { value: 'WV', text: 'West Virginia' },
        { value: 'WY', text: 'Wyoming' },
    ];

    const creditMask = paymentInformation.card[0] === '3' ? '9999-9999-9999-999' : '9999-9999-9999-9999';

    const updatePayment = (field, event) => {
        const newPaymentInformation = {};

        if (newPaymentInformation[field] !== event.target.value) {
            newPaymentInformation[field] = event.target.value;

            onUpdate(newPaymentInformation, `payment.${field}`);
        }
    };

    const errorKeys = Object.keys(errors);

    return (
        <section className="rounded-sm p-3 mb-3 box-shadow bg-white">
            <div className="d-flex justify-content-between">
                <div className="d-flex align-items-center primary-color">
                    <div className="mr-2 mt-2">
                        <svg className="icon-md" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                            <use xlinkHref="/img/icons/icon-defs.svg#icon-dollar-sign-circle" />
                        </svg>
                    </div>
                    <h5 className="m-0">{Lang.trans('billing.payment_information')}</h5>
                </div>
                <div className="text-right">
                    <span className="mr-1">{Lang.trans('billing.secured_by')}</span>
                    <a className="mr-2" target="_blank" rel="noopener noreferrer nofollow" href="https://www.mcafeesecure.com/RatingVerify?ref=www.redtag.ca">
                        <img className="mcafee" src="//images.scanalert.com/meter/www.redtag.ca/13.gif" />
                    </a>
                </div>
            </div>
            <div>
                {errorKeys.length > 0 && (
                    <div className="error-container w-100 mb-2">
                        {errorKeys.map((key) => (<ErrorText key={errors[key].id} error={errors[key]} />))}
                    </div>
                )}
                <div className="mb-3">
                    <div className="payment-section-sub-header "><strong>{Lang.trans('billing.credit_card')}</strong></div>
                    <div className="d-md-inline-block">{Lang.trans('billing.amount_to_be_charged')}</div>
                    <div className="d-md-inline-block mt-3 mt-lg-0">
                        <div className="ml-lg-3 mr-2 d-inline-block">
                            <strong>C$</strong>
                        </div>
                        <div className="d-inline-block">
                            <span className="react-numeric-input form-control">
                                {numberFormat({ value: cost })}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="row gutter-10 custom-form-element">
                    <div className="col-12 col-lg-6">
                        <div className="row gutter-10">
                            <div className="col-12 mb-3 mb-lg-2">
                                <label htmlFor="card-holder-0">
                                    {Lang.trans('billing.ccName')}
                                    <span className="asterix">*</span>
                                </label>
                                <div className="element-container">
                                    <div>
                                        <input
                                            type="text"
                                            id="card-holder-0"
                                            className={`form-control ${errorKeys.includes('holder') ? 'error-highlight' : ''}`}
                                            placeholder="e.g. Thomas James Smith"
                                            value={paymentInformation.holder}
                                            onChange={updatePayment.bind(null, 'holder')}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 mb-3 mb-lg-2">
                                <label htmlFor="billing_cc_number-0">
                                    {Lang.trans('billing.ccNumber')}
                                    <span className="asterix">*</span>
                                </label>
                                <div className="element-container">
                                    <MaskedInput
                                        type="text"
                                        id="billing_cc_number-0"
                                        className={`form-control ${errorKeys.includes('card') ? 'error-highlight' : ''}`}
                                        placeholder="1111-1111-1111-1111"
                                        mask={creditMask}
                                        value={paymentInformation.card}
                                        onChange={updatePayment.bind(null, 'card')}
                                    />
                                </div>
                            </div>
                            <div className="col-6 mb-3 mb-lg-2">
                                <label htmlFor="billing-expiry-0">
                                    {Lang.trans('billing.ccExpiry')}
                                    <span className="asterix">*</span>
                                </label>
                                <div className="element-container">
                                    <MaskedInput
                                        type="text"
                                        id="billing-expiry-0"
                                        className={`form-control ${errorKeys.includes('expiry') ? 'error-highlight' : ''}`}
                                        mask="99/9999"
                                        name="expiry"
                                        placeholder="mm/yyyy"
                                        value={paymentInformation.expiry}
                                        onChange={updatePayment.bind(null, 'expiry')}
                                    />
                                </div>
                            </div>
                            <div className="col-6">
                                <label htmlFor="card-cvv-0">
                                    {Lang.trans('billing.ccCVV')}
                                    <span className="asterix">*</span>
                                </label>
                                <div className="element-container">
                                    <div>
                                        <input
                                            type="number"
                                            id="card-cvv-0"
                                            className={`form-control ${errorKeys.includes('security') ? 'error-highlight' : ''}`}
                                            placeholder="123"
                                            value={paymentInformation.security}
                                            onChange={updatePayment.bind(null, 'security')}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="row gutter-10">
                            <div className="col-12 mb-3 mb-lg-2">
                                <label htmlFor="billing-addr-0">
                                    {Lang.trans('billing.address')}
                                    <span className="asterix">*</span>
                                </label>
                                <div className="element-container">
                                    <div>
                                        <input
                                            type="text"
                                            id="billing-addr-0"
                                            className={`form-control ${errorKeys.includes('address') ? 'error-highlight' : ''}`}
                                            placeholder=""
                                            value={paymentInformation.address}
                                            onChange={updatePayment.bind(null, 'address')}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-md-6 mb-3 mb-lg-2">
                                <label htmlFor="billing-city-0">
                                    {Lang.trans('billing.city')}
                                    <span className="asterix">*</span>
                                </label>
                                <div className="element-container">
                                    <div>
                                        <input
                                            type="text"
                                            id="billing-city-0"
                                            className={`form-control ${errorKeys.includes('city') ? 'error-highlight' : ''}`}
                                            placeholder=""
                                            value={paymentInformation.city}
                                            onChange={updatePayment.bind(null, 'city')}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-md-6 mb-3 mb-lg-2">
                                <label htmlFor="billing-country-0">
                                    {Lang.trans('billing.country')}
                                    <span className="asterix">*</span>
                                </label>
                                <div className="element-container input-chevron-down">
                                    <div>
                                        <select
                                            id="billing-country-0"
                                            className={`form-control default-select ${errorKeys.includes('country') ? 'error-highlight' : ''}`}
                                            value={paymentInformation.country}
                                            onChange={updatePayment.bind(null, 'country')}
                                        >
                                            <option value="CA">Canada</option>
                                            <option value="US">United States</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-6 mb-3 mb-lg-2">
                                <label htmlFor="billing-province-0">
                                    {Lang.trans('billing.province')}
                                    <span className="asterix">*</span>
                                </label>
                                <div className="element-container input-chevron-down">
                                    <select
                                        id="billing-province-0"
                                        className={`form-control default-select ${errorKeys.includes('province') ? 'error-highlight' : ''}`}
                                        value={paymentInformation.province}
                                        onChange={updatePayment.bind(null, 'province')}
                                    >
                                        <option value="">Select Province/State</option>
                                        {paymentInformation.country === 'CA' && provinces.map((province) => (<option key={province.value} value={province.value}>{province.text}</option>))}
                                        {paymentInformation.country === 'US' && states.map((state) => (<option key={state.value} value={state.value}>{state.text}</option>))}
                                    </select>
                                </div>
                            </div>
                            <div className="col-12 col-sm-6 ">
                                <label htmlFor="billing-zip-0">
                                    {Lang.trans('billing.postalZip')}
                                    <span className="asterix">*</span>
                                </label>
                                <div className="element-container">
                                    <div>
                                        <input
                                            type="text"
                                            id="billing-zip-0"
                                            className={`form-control ${errorKeys.includes('postal') ? 'error-highlight' : ''}`}
                                            placeholder=""
                                            value={paymentInformation.postal}
                                            onChange={updatePayment.bind(null, 'postal')}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

PaymentForm.propTypes = {
    paymentInformation: PropTypes.instanceOf(Object).isRequired,
    onUpdate: PropTypes.func.isRequired,
    errors: PropTypes.instanceOf(Object),
};

PaymentForm.defaultProps = {
    errors: {},
};

export default PaymentForm;
