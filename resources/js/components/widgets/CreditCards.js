import React from 'react';
import MaskedInput from 'react-maskedinput';
import NumericInput from 'react-numeric-input';
import moment from 'moment';
import FormBlockBase from 'components/common/FormBlockBase';
import Lang from 'libraries/common/Lang';
import StateProvince from 'libraries/common/StateProvince';
import Helper from 'libraries/common/Helper';

class CreditCards extends FormBlockBase {
    constructor(props) {
        super(props);
        const billing = {
            ccNumber: '',
            ccName: '',
            ccExpiry: '',
            ccCVV: '',
            address: '',
            city: '',
            country: props.localization,
            province: '',
            postalZip: '',
        };

        if (this.props.idx === 0) {
            this.mainCard = true;
        } else {
            this.mainCard = false;
        }
        this.state = Object.assign({}, this.state, { billing, sameAsPrimary: !this.mainCard });
        this.amount = props.initTotal;
        this.handleSecondCardChange = this.handleSecondCardChange.bind(this);
        this.amountChange = this.amountChange.bind(this);
        this.checkVacationVendorCardNumber = this.checkVacationVendorCardNumber.bind(this);
    }

    amountChange(valueAsNumber) {
        if (this.mainCard) {
            const { mainCardAmountChangeCallback, max } = this.props;
            const amount = Math.min(Math.abs(valueAsNumber), max);
            mainCardAmountChangeCallback(amount);
        }
    }

    handleSecondCardChange() {
        const checked = !this.state.sameAsPrimary;
        let nowState = null;
        if (checked) {
            const clearParams = {
                address: '',
                city: '',
                country: this.props.localization,
                province: '',
                postalZip: '',
            };
            nowState = Object.assign({}, this.state, clearParams, { sameAsPrimary: true });
        } else {
            nowState = Object.assign({}, this.state, { sameAsPrimary: false });
        }
        this.setState(nowState);
    }

    checkVacationVendorCardNumber(str) {
        if (Object.prototype.hasOwnProperty.call(this.props, 'vendor') && (this.props.vendor === 'HOL' || this.props.vendor === 'CAH')) {
            const temp = String(str).replace(/[^\d]/g, '');
            const firstNum = parseInt(temp.charAt(0), 10);
            if (firstNum === 3) {
                return false;
            }
        }
        return true;
    }

    getInfo() {
        const { errors } = this.state;
        let modelKey = null;
        Object.keys(this.state.billing).forEach((key) => {
            modelKey = `billing.${key}`;
            const v = this.state.billing[key].trim();

            let status = false;
            let erroMessage = null;
            switch (key) {
            case 'ccName':
                if (v === '' || !/^[A-Za-z0-9\u007D-\u00FF\u0022'\s]+[A-Za-z0-9\u007D-\u00FF\u0022',-/.:;#_()\s]+$/i.test(v)) {
                    status = true;
                    if (v !== '') {
                        erroMessage = Lang.trans('error.invalid_card_holder_name');
                    }
                }
                break;

            case 'ccNumber':
                if (v === '' || !Helper.LuhnCheck(v)) {
                    status = true;
                    if (v !== '') {
                        erroMessage = Lang.trans('error.invalid_credit_card_number');
                    }
                } else if (!this.checkVacationVendorCardNumber(v)) {
                    status = true;
                    erroMessage = Lang.trans('error.invalid_vendor_accept_card');
                }
                break;

            case 'ccExpiry':
                if (v === '') {
                    status = true;
                } else {
                    const now = moment().date(1);
                    let expiryYear;
                    const expiryMonth = parseInt(v.slice(0, 2), 10) - 1;
                    if (expiryMonth > 11 || expiryMonth < 0) {
                        erroMessage = Lang.trans('error.invalid_credit_card_expiry_month');
                        status = true;
                    } else {
                        expiryYear = parseInt(v.slice(-4), 10);
                        if (!(expiryYear <= 99 || expiryYear >= 2019)) {
                            erroMessage = Lang.trans('error.invalid_credit_card_expiry_year');
                            status = true;
                        }
                    }

                    if (!status) {
                        // year must be future
                        if (expiryYear <= 99) {
                            expiryYear = parseInt(`20${expiryYear}`, 10);
                        }
                        const expiry = moment().date(1).month(expiryMonth).year(expiryYear);
                        if (expiry.isBefore(now)) {
                            status = true;
                            erroMessage = Lang.trans('error.invalid_credit_card_expiry_date');
                        }
                    }
                }
                break;
            case 'ccCVV':
                if (v === '' || !/^[0-9]{3,4}$/i.test(v)) {
                    status = true;
                    if (v !== '') {
                        erroMessage = Lang.trans('error.invalid_cvv_number');
                    }
                }
                break;
            case 'address':
                if (!this.state.sameAsPrimary && (v === '' || !/^[A-Za-z0-9\u007D-\u00FF\u0022',-/.:;#_()\s]+$/i.test(v))) {
                    status = true;
                    if (v !== '') {
                        erroMessage = Lang.trans('error.invalid_address');
                    }
                }
                break;
            case 'country':
                if (!this.state.sameAsPrimary && (v === '')) {
                    status = true;
                }
                break;

            case 'city':
                if (!this.state.sameAsPrimary && (v === '')) {
                    status = true;
                }
                break;
            case 'province':
                if (!this.state.sameAsPrimary && v === '') {
                    status = true;
                }
                break;

            case 'postalZip':
                if (!this.state.sameAsPrimary && (v === '' || !/^([a-z][0-9][a-z][-\s]?[0-9][a-z][0-9]|(\d{5}([-]\d{4})?))$/i.test(v))) {
                    status = true;
                    if (v !== '') {
                        erroMessage = Lang.trans('error.invalid_zip_code');
                    }
                }
                break;

            default:
                break;
            }

            if (status) {
                errors[modelKey] = {
                    id: modelKey,
                    message: erroMessage || `${Lang.trans(modelKey)} ${Lang.trans('error.is_required')}`,
                };
            } else if (Object.prototype.hasOwnProperty.call(errors, modelKey)) {
                delete errors[modelKey];
            }
        });

        this.setState({
            errors,
        });
        const data = this.state.billing;
        data.ccNumber = data.ccNumber.replace(/[^\d]/g, '');
        const errorStatus = Object.keys(errors).length;
        return { data, errorStatus };
    }

    numbericFormat(num) {
        return parseFloat(num).toFixed(2);
    }

    render() {
        const {
            idx,
            initTotal,
            max,
            min,
            twoPaymentCheck,
            currency,
            localization,
            isStandalone
        } = this.props;

        const provinceStateList = (this.state.billing.country === 'US') ? StateProvince.states : StateProvince.provinces;
        const provinceLabel = (localization === 'CA' ? Lang.trans('billing.provinceState') : Lang.trans('billing.state'));
        const creditCardIdx = parseInt(idx, 10) + 1;
        let model = '';
        const errorOutput = {};
        const errorClass = {};
        const { errors } = this.state;
        let errorExist = false;

        Object.keys(this.state.billing).forEach((key) => {
            model = `billing.${key}`;
            errorClass[model] = '';
            if (Object.prototype.hasOwnProperty.call(errors, model)) {
                errorExist = true;
                errorOutput[model] = Helper.error(errors[model]);
                errorClass[model] = 'error-highlight';
            }
        });

        return (
            <div>
                <div className="mb-3">
                    <div className="payment-section-sub-header ">{Lang.trans('billing.credit_card')}</div>
                    {
                        errorExist ? (
                            <div className="error-container w-100 mb-2">
                                {(errorOutput['billing.ccName'] !== undefined) ? errorOutput['billing.ccName'] : ''}
                                {(errorOutput['billing.ccNumber'] !== undefined) ? errorOutput['billing.ccNumber'] : ''}
                                {(errorOutput['billing.ccExpiry'] !== undefined) ? errorOutput['billing.ccExpiry'] : ''}
                                {(errorOutput['billing.ccCVV'] !== undefined) ? errorOutput['billing.ccCVV'] : ''}
                                {(errorOutput['billing.address'] !== undefined) ? errorOutput['billing.address'] : ''}
                                {(errorOutput['billing.city'] !== undefined) ? errorOutput['billing.city'] : ''}
                                {(errorOutput['billing.province'] !== undefined) ? errorOutput['billing.province'] : ''}
                                {(errorOutput['billing.postalZip'] !== undefined) ? errorOutput['billing.postalZip'] : ''}
                            </div>
                        ) : null
                    }

                    <div className="d-md-inline-block">
                        {Lang.trans('billing.amount_to_be_charged')}
                    </div>
                    <div className="d-md-inline-block mt-3 mt-lg-0">
                        <div className="ml-lg-3 mr-2 d-inline-block">
                            <strong>{currency}$</strong>
                        </div>
                        <div className="d-inline-block">
                            <NumericInput
                                id={`card-amount-${idx}`}
                                className="form-control"
                                min={min}
                                step={5}
                                value={initTotal}
                                max={max}
                                style={twoPaymentCheck ? (creditCardIdx === 2 ? false : {}) : false}
                                disabled={twoPaymentCheck ? (creditCardIdx === 2 ? true : false) : true}
                                format={this.numbericFormat}
                                onChange={this.amountChange}
                            />
                        </div>
                    </div>
                </div>
                { creditCardIdx === 2 && (
                    <div className="mb-3">
                        <div className="styled-checkbox theme-3">
                            <input type="checkbox" id="same-as-primary" onChange={this.handleSecondCardChange} checked={this.state.sameAsPrimary} />
                            <label className="label-style" htmlFor="same-as-primary">
                                <span>{Lang.trans('billing.same_as_primary_address')}</span>
                            </label>
                        </div>
                    </div>
                )}
                <div className="row gutter-10 custom-form-element">
                    <div className="col-12 col-lg-12">
                        <div className="row gutter-10">
                            <div className="col-12 mb-3 mb-lg-2 ">
                                <label className="label-style" htmlFor={`card-holder-${idx}`}>
                                    {Lang.trans('billing.ccName')}
                                    <span className="asterix" />
                                </label>
                                <div className="element-container">
                                    <div>
                                        <input
                                            data-model="billing.ccName"
                                            type="text"
                                            id={`card-holder-${idx}`}
                                            placeholder="e.g. Thomas James Smith"
                                            className={`form-control ${errorClass['billing.ccName']}`}
                                            value={this.state.billing.ccName}
                                            onChange={this.changeInput}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 mb-3 mb-lg-2">
                                <label className="label-style" htmlFor={`billing_cc_number-${idx}`}>
                                    {Lang.trans('billing.ccNumber')}
                                    <span className="asterix" />
                                </label>
                                <div className="element-container">
                                    <MaskedInput
                                        type="text"
                                        id={`billing_cc_number-${idx}`}
                                        data-model="billing.ccNumber"
                                        className={`form-control ${errorClass['billing.ccNumber']}`}
                                        placeholder="1111-1111-1111-1111"
                                        mask="1111-1111-1111-1111"
                                        value={this.state.billing.ccNumber}
                                        onChange={this.changeInput}
                                    />
                                </div>
                            </div>
                            <div className="col-6 mb-3 mb-lg-2">
                                <label className="label-style" htmlFor={`billing-expiry-${idx}`}>
                                    {Lang.trans('billing.ccExpiry')}
                                    <span className="asterix" />
                                </label>
                                <div className="element-container">
                                    <MaskedInput
                                        id={`billing-expiry-${idx}`}
                                        data-model="billing.ccExpiry"
                                        className={`form-control ${errorClass['billing.ccExpiry']}`}
                                        mask="11/1111"
                                        name="expiry"
                                        placeholder="mm/yyyy"
                                        value={this.state.billing.ccExpiry}
                                        onChange={this.changeInput}
                                    />
                                </div>
                            </div>
                            <div className="col-6 ">
                                <label className="label-style" htmlFor={`card-cvv-${idx}`}>
                                    {Lang.trans('billing.security_code')}
                                    <span className="asterix" />
                                </label>
                                <div className="element-container">
                                    <div>
                                        <input
                                            type="text"
                                            id={`card-cvv-${idx}`}
                                            data-model="billing.ccCVV"
                                            className={`form-control ${errorClass['billing.ccCVV']}`}
                                            value={this.state.billing.ccCVV}
                                            placeholder=""
                                            onChange={this.changeInput}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {((creditCardIdx === 1) || (creditCardIdx === 2 && !this.state.sameAsPrimary)) && (
                        <div className="col-12 col-lg-12">
                            <div className="row gutter-10">
                            <h5 className="m-2 col-12 p-0 font-weight-bold">{Lang.trans('billing.address')}</h5>
                                <div className="col-12 col-md-6 mb-3 mb-lg-2">
                                    <label className="label-style" htmlFor={`billing-addr-${idx}`}>
                                        {Lang.trans('billing.street')}
                                        <span className="asterix" />
                                    </label>
                                    <div className="element-container">
                                        <div>
                                            <input
                                                type="text"
                                                id={`billing-addr-${idx}`}
                                                className={`form-control ${errorClass['billing.address']}`}
                                                data-model="billing.address"
                                                value={this.state.billing.address}
                                                placeholder=""
                                                onChange={this.changeInput}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6 mb-3 mb-lg-2">
                                    <label className="label-style" htmlFor={`billing-country-${idx}`}>
                                        {Lang.trans('billing.country')}
                                        <span className="asterix" />
                                    </label>
                                    <div className="element-container input-chevron-down">
                                        <div>
                                            <select
                                                id={`billing-country-${idx}`}
                                                className={`form-control default-select ${errorClass['billing.country']}`}
                                                data-model="billing.country"
                                                value={this.state.billing.country}
                                                onChange={this.changeInput}
                                            >
                                                <option value="CA">Canada</option>
                                                <option value="US">United States</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-4 mb-3 mb-lg-2">
                                    <label className="label-style" htmlFor={`billing-city-${idx}`}>
                                        {Lang.trans('billing.city')}
                                        <span className="asterix" />
                                    </label>
                                    <div className="element-container">
                                        <div>
                                            <input
                                                type="text"
                                                id={`billing-city-${idx}`}
                                                className={`form-control ${errorClass['billing.city']}`}
                                                data-model="billing.city"
                                                value={this.state.billing.city}
                                                placeholder=""
                                                onChange={this.changeInput}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-4 mb-3 mb-lg-2">
                                    <label className="label-style" htmlFor={`billing-province-${idx}`}>
                                        {localization === 'CA' ? Lang.trans('billing.provinceState') : Lang.trans('billing.state')}
                                        <span className="asterix" />
                                    </label>
                                    <div className="element-container input-chevron-down">
                                        <select
                                            id={`billing-province-${idx}`}
                                            className={`form-control default-select ${errorClass['billing.province']}`}
                                            data-model="billing.province"
                                            value={this.state.billing.province}
                                            onChange={this.changeInput}
                                        >
                                            <option value="">Select {provinceLabel}</option>
                                            {Object.keys(provinceStateList).map((key) => (
                                                <option key={`billing.province.${key}`} value={key}>{provinceStateList[key]}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-4">
                                    <label className="label-style" htmlFor={`billing-zip-${idx}`}>
                                        {localization === 'CA' ? Lang.trans('billing.postalZip') : Lang.trans('billing.zip')}
                                        <span className="asterix" />
                                    </label>
                                    <div className="element-container">
                                        <div>
                                            <input
                                                type="text"
                                                id={`billing-zip-${idx}`}
                                                className={`form-control ${errorClass['billing.postalZip']}`}
                                                data-model="billing.postalZip"
                                                value={this.state.billing.postalZip}
                                                placeholder=""
                                                onChange={this.changeInput}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default CreditCards;
