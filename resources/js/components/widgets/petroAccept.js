/* globals PETRO_POINTS_DECR, PETRO_API_VER, PETRO_POINTS_INCR */
import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import 'whatwg-fetch';
import ReCAPTCHA from 'react-google-recaptcha';
import MaskedInput from 'react-text-mask';
import numberFormat from 'helpers/numberFormat';
import errorModal from 'helpers/errorModal';
import Lang, { priceFormat } from 'libraries/common/Lang';
import Loader from 'components/common/Loader';
import ErrorText from 'components/snippets/errorText';

import Modal from 'reactstrap/lib/Modal';
import ModalHeader from 'reactstrap/lib/ModalHeader';
import ModalBody from 'reactstrap/lib/ModalBody';

const captchaSiteKey = '6LcqmZ4UAAAAAIWGdkZXk6t-8P4j0FTfrrqGOy0k';

class PetroWidget extends Component {
    static checkAccountNumber(v) {
        const firsStr = v.substring(0, 4);
        if (firsStr !== '7069') {
            return false;
        }
        return true;
    }

    constructor(props) {
        super(props);
        const petroAcc = {
            number: '',
            lastName: '',
        };
        this.state = {
            applied: false,
            processDone: null,
            capchaError: false,
            erroMsg: '',
            petroOption: 'petro-earn',
            petroAcc,
            errors: {},
            accountInfo: null,
            loading: false,
            showModal: false,
            redeemAmount: 0,
            showPetroTab: true,
        };

        this.capture = createRef();

        this.applyPetro = this.applyPetro.bind(this);
        this.changeInput = this.changeInput.bind(this);
        // this.validate = this.validate.bind(this);
        this.checkFormInput = this.checkFormInput.bind(this);
        this.onChangeApplyPetro = this.onChangeApplyPetro.bind(this);
        this.onChangePetroOption = this.onChangePetroOption.bind(this);
        this.onCaptureChange = this.onCaptureChange.bind(this);
        this.onRedeemPlus = this.onRedeemPlus.bind(this);
        this.onRedeemMinus = this.onRedeemMinus.bind(this);
        this.showHideTabHandler = this.showHideTabHandler.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.state.petroOption === 'petro-redeem' && this.state.accountInfo && this.props.totalBase !== prevProps.totalBase) {
            this.maxUsablePoints();
        }
    }


    onRedeemPlus() {
        const { redeemAmount, accountInfo } = this.state;
        const { petroChangeCallback } = this.props;

        const newRedeemAmount = redeemAmount + 10;
        if (newRedeemAmount <= accountInfo.maxDollarRedeem) {
            this.setState({ redeemAmount: newRedeemAmount },
                () => petroChangeCallback({ redeemDollarAmount: newRedeemAmount }));
        }
    }

    onRedeemMinus() {
        const { redeemAmount } = this.state;
        const { petroChangeCallback } = this.props;
        const newRedeemAmount = redeemAmount - 10;
        if (redeemAmount >= 10) {
            this.setState({ redeemAmount: newRedeemAmount },
                () => petroChangeCallback({ redeemDollarAmount: newRedeemAmount }));
        }
    }


    onCaptureChange() {
        this.setState({ capchaError: false, erroMsg: '' });
    }

    onChangeApplyPetro(e) {
        const check = e.currentTarget.checked;
        this.setState({
            applied: check, petroOption: 'petro-earn', accountInfo: null, redeemAmount: 0, processDone: null,
        });
    }

    onChangePetroOption(e) {
        const v = e.target.value;
        this.setState({ petroOption: v, accountInfo: null, capchaError: false }, () => {
        });
    }

    changeInput(e) {
        const { petroChangeCallback } = this.props;
        const modelKey = e.target.dataset.model;
        const [model, key] = modelKey.split('.');
        const data = this.state;
        data.accountInfo = null;
        data.erroMsg = '';
        const v = e.target.value;

        data[model][key] = v;

        if (key === 'number') {
            petroChangeCallback({ petroCard: String(v).replace(/[^\d]/g, '') });
        }
        const { errors } = this.state;
        if (Object.prototype.hasOwnProperty.call(errors, key)) {
            this.setState(data, () => { this.checkFormInput(); });
        } else {
            this.setState(data);
        }
    }

    applyPetro() {
        const errorStatus = this.checkFormInput();
        const { petroOption, petroAcc } = this.state;
        const { petroChangeCallback } = this.props;

        if (errorStatus === false) {
            if (petroOption === 'petro-earn') {
                this.setState({ accountInfo: true, capchaError: false, processDone: true });
            } else { // redeem
                this.setState({ showModal: true, loading: true });
                const that = this;
                let didTimeOut = false;

                let token = '';
                if (this.capture.current) {
                    token = this.capture.current.getValue();
                    if (token !== '') {
                        const formData = {
                            petroAccountno: String(petroAcc.number).replace(/[^\d]/g, ''),
                            captchaToken: token,
                            lang: window.Locale,
                        };
                        if (PETRO_API_VER === '2') {
                            formData.lastName = String(petroAcc.lastName).trim();
                        }

                        const verifyTimer = setTimeout(() => {
                            that.setState({ showModal: false });
                            errorModal({ message: Lang.trans('petro.api_timeout') });
                            didTimeOut = true;
                        }, 6000);
                        fetch(`/api/petropoints/verify?q=${JSON.stringify(formData)}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        }).then((response) => response.json())
                            .then((data) => {
                                clearTimeout(verifyTimer);
                                if (!didTimeOut) {
                                    this.setState({ showModal: false, loading: false });
                                    if (!Object.prototype.hasOwnProperty.call(data, 'error')) {
                                        if (data.status === false) {
                                            this.setState({
                                                accountInfo: false, erroMsg: data.msg, capchaError: false, processDone: true,
                                            });
                                        } else if (data.balance < 0) {
                                            this.setState({
                                                accountInfo: false, erroMsg: Lang.trans('petro.not_enough_balance'), capchaError: false, processDone: true,
                                            });
                                        } else {
                                            this.setState({
                                                accountInfo: data, erroMsg: '', capchaError: false, processDone: true,
                                            }, () => { this.maxUsablePoints(); });
                                            petroChangeCallback({ name: data.holderName });
                                        }
                                    } else {
                                        errorModal(data.error);
                                    }
                                }
                            }).catch(() => {});
                    } else {
                        this.capture.current.reset();
                        this.setState({ accountInfo: false, capchaError: true, processDone: false });
                    }
                }
            }
        }
    }


    showRedeemPointTool(maxPointRedeem) {
        const { accountInfo, redeemAmount } = this.state;
        const { maxDollarRedeem } = accountInfo;
        return (
            <div className="py-4 px-3">
                <div className="amounts-wrapper mx-auto">
                    <div className="filter-container ">
                        <div className="element-container d-flex justify-content-center align-items-center">
                            <button type="button" disabled={this.state.redeemAmount === 0} onClick={() => this.onRedeemMinus()} className="btn-primary points-textbox-button">-</button>
                            <div className="col-sm-4"><input type="text" onChange={() => false} className="form-control text-center points-amount-textbox" value={priceFormat(this.state.redeemAmount)} /></div>
                            <button type="button" disabled={this.state.redeemAmount === maxDollarRedeem} onClick={() => this.onRedeemPlus(maxDollarRedeem)} className="btn-primary points-textbox-button">+</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    maxUsablePoints() {
        const { minDepositCheck, minDepositAmount, totalBase, petroChangeCallback } = this.props;
        const { accountInfo, redeemAmount } = this.state;

        if (accountInfo.balance) {
            const value = minDepositCheck ? minDepositAmount : totalBase;

            const maxDollarRedeemFromDollar = 10 * parseInt(value / 10, 10);
            const maxDollarRedeemFromPoints = 10 * parseInt(accountInfo.balance / (PETRO_POINTS_DECR * 10), 10);

            const stateUpdate = {};
            stateUpdate.accountInfo = Object.assign({}, accountInfo);
            stateUpdate.accountInfo.maxDollarRedeem = Math.min(maxDollarRedeemFromPoints, maxDollarRedeemFromDollar);
            if (redeemAmount > stateUpdate.accountInfo.maxDollarRedeem) {
                stateUpdate.redeemAmount = stateUpdate.accountInfo.maxDollarRedeem;
                petroChangeCallback({ redeemDollarAmount: stateUpdate.redeemAmount });
            }
            this.setState(stateUpdate);
        }
    }

    checkFormInput() {
        const { errors } = this.state;
        Object.keys(this.state.petroAcc).forEach((key) => {
            const modelKey = `petroAcc.${key}`;
            const v = this.state.petroAcc[key].trim();

            let status = false;
            let erroMessage = null;
            switch (key) {
            case 'number':
                var temp = String(v).replace(/[^\d]/g, '');
                if (temp.length < 16) {
                    status = true;
                    if (temp !== '') {
                        erroMessage = Lang.trans('petro.invalid_petro');
                    }
                } else if (!PetroWidget.checkAccountNumber(temp)) {
                    status = true;
                    erroMessage = Lang.trans('petro.invalid_petro');
                }
                break;
            case 'lastName':
                if (this.state.petroOption === 'petro-redeem' && PETRO_API_VER === '2') {
                    if (v === '' || !/^[A-Za-z0-9-'\u007D-\u00FF\s.]+$/i.test(v)) {
                        status = true;
                        if (v !== '') {
                            erroMessage = `${Lang.trans(`${modelKey}`)} ${Lang.trans('error.is_invalid')}`;
                        }
                    }
                }

                break;
            default:
                break;
            }

            if (status) {
                errors[key] = {
                    id: key,
                    message: erroMessage || `${Lang.trans(`${modelKey}`)} ${Lang.trans('error.is_required')}`,
                };
            } else if (Object.prototype.hasOwnProperty.call(errors, key)) {
                delete errors[key];
            }
        });

        this.setState({
            errors,
        });
        let errorStatus = Object.keys(errors).length;

        if (!this.state.accountInfo && this.capture.current) {
            const captchaToken = this.capture.current.getValue();
            if (captchaToken === '') {
                this.setState({ capchaError: true });
                errorStatus++;
            }
        }
        return (errorStatus > 0);
    }

    showHideTabHandler(tabType) {
        if (tabType === 'petro') this.setState({ showPetroTab: !this.state.showPetroTab });
    }

    showAccountDetail() {
        const { redeemAmount, petroOption, accountInfo } = this.state;
        const {
            totalBase,
            bonusPoint,
            grandTotal,
            minDepositCheck,
            minDepositAmount,
        } = this.props;
        const totalPointEarned = Math.max((Math.floor((totalBase - redeemAmount) * PETRO_POINTS_INCR) + bonusPoint), 0);
        if (petroOption === 'petro-redeem') {
            const maxPointRedeem = accountInfo.maxDollarRedeem;
            return (
                <div className="col-12">
                    <table className="table mt-3">
                        <tbody>
                            <tr>
                                <th scope="row">{Lang.trans('petro.account_info')}:</th>
                                <td>{accountInfo.holderName}</td>
                            </tr>
                            <tr>
                                <th scope="row">{Lang.trans('petro.total_points_earned')}</th>
                                <td>{numberFormat({ value: totalPointEarned, decimal: 0 })}</td>
                            </tr>
                            <tr>
                                <th scope="row">{Lang.trans('petro.your_available_petro_points')}:</th>
                                <td>{numberFormat({ value: accountInfo.balance, decimal: 0 })} ({Lang.trans('petro.max_point_applied')}: {numberFormat({ value: maxPointRedeem * PETRO_POINTS_DECR, decimal: 0 })})</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="booking-apply-petro border-bottom pb-3 mb-3">
                        <div className="amount-box text-center mb-3 border">
                            <div className="box-header p-3 h5 mb-0 bg-dark">{Lang.trans('petro.points_towards_trip')}</div>
                            <div className="mb-1 mt-1 pl-3 pr-3"><span className="text-nowrap">{numberFormat({ value: 10000 })} Petro-Points = {priceFormat(10)} {Lang.trans('petro.petro_point_cash_value')}.</span></div>
                            <div className="bg-white pl-4 pr-4 pt-3 pt-md-2 pb-2 text-center">
                                <div className="row amounts-wrapper align-items-center mx-auto">
                                    <div className="col-6 col-md-4 border-right">
                                        {Lang.trans('petro.petro_minimum')}
                                        <div className="amount text-highlight">{priceFormat(0)}</div>
                                    </div>
                                    <div className="col-6 col-md-4 border-md-right">
                                        {Lang.trans('petro.petro_maximum')}
                                        <div className="amount text-highlight"> {priceFormat(maxPointRedeem)}</div>
                                    </div>
                                    <div className="col-12 col-md-4 border-top border-md-0 mt-3 mt-md-0 pt-2">
                                        {Lang.trans('petro.your_available_petro_points')}
                                        <div className="amount text-sm text-highlight">{numberFormat({ value: accountInfo.balance, decimal: 0 })} Petro-Points</div>
                                    </div>
                                </div>
                            </div>
                            {this.showRedeemPointTool(maxPointRedeem * PETRO_POINTS_DECR)}
                        </div>
                        <div className="totals container">
                            <div className="row border-bottom pb-3 mb-3 h6 ">
                                <div className="col-5 col-md-7 tx-sm-small">{Lang.trans('petro.petro_points_used')}</div>
                                <div className="col-7 col-md-5 text-right">
                                    {numberFormat({ value: redeemAmount * PETRO_POINTS_DECR, dcimal: 0 })} Petro-Points
                                    <div className="font-weight-normal">(- {priceFormat(redeemAmount)})</div>
                                </div>
                            </div>
                            <div className="row ">
                                <div className="col-4 col-md-7 h4 text-highlight tx-sm-small">{Lang.trans('petro.new_total_petro')}</div>
                                <div className=" col-8 col-md-5 text-right h4 text-highlight cost-after-total">{priceFormat(grandTotal - redeemAmount)} CAD</div>
                                <div className="col-7 mb-2 tx-sm-medium">{Lang.trans('petro.total_petro_points_earned')}</div>
                                <div className="col-5 text-right">{numberFormat({ value: totalPointEarned, decimal: 0 })}</div>
                                <div className="col-7 mb-4 tx-sm-medium">{Lang.trans('petro.new_petro_account_balance')}</div>
                                <div className="col-5 text-right">{ numberFormat({ value: parseInt(accountInfo.balance, 10) + totalPointEarned - (redeemAmount * PETRO_POINTS_DECR), decimal: 0 })}</div>
                            </div>
                        </div>
                        <p className="mt-4 text-left">
                            {minDepositCheck
                                ? Lang.trans('common.deposit_price_of_one')
                                : Lang.trans('common.full_purchase_price_of_one')}
                            <strong>{priceFormat((minDepositCheck ? minDepositAmount : grandTotal) - redeemAmount)}</strong> {Lang.trans('common.full_purchase_price_of_two')}<br />
                            <strong>{numberFormat({ value: redeemAmount * PETRO_POINTS_DECR, decimal: 0 })}  Petro-Points</strong> {Lang.trans('common.will_deducted_finish_checkout')}
                        </p>


                    </div>
                </div>
            );
        }
        return (
            <div className="col-12">
                <table className="table mt-3">
                    <tbody>
                        <tr>
                            <th scope="row">{Lang.trans('petro.total_points_earned')}:</th>
                            <td>{numberFormat({ value: totalPointEarned })}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    showAccountInput() {
        const {
            errors,
            petroOption,
            petroAcc,
            capchaError,
            processDone,
            accountInfo,
            erroMsg,
        } = this.state;

        const errorKeys = Object.keys(errors);
        return (
            <div>
                {
                    errorKeys.length > 0 && (
                        <div className="error-container w-100 mb-2">
                            {errorKeys.map((key) => (<ErrorText key={errors[key].id} error={errors[key]} />))}
                        </div>
                    )
                }
                <div className="row">
                    <div className="col-xl-5 col-sm-6 mb-3 mb-lg-2 mt-3  ">
                        <label htmlFor="card-holder-0">{Lang.trans('petro.petro_points_account')}<span className="asterix">*</span></label>
                        <div className="element-container">
                            <div>
                                <MaskedInput
                                    data-model="petroAcc.number"
                                    onChange={this.changeInput}
                                    type="text"
                                    className={`form-control ${errorKeys.includes('number') ? 'error-highlight' : ''}`}
                                    placeholder="7069-11111-1111-111"
                                    mask={[/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/]}
                                    value={petroAcc.number}
                                />
                            </div>
                        </div>
                    </div>
                    {petroOption === 'petro-redeem' && PETRO_API_VER === '2' ? (
                        <div className="col-xl col-sm-6 mb-3 mb-lg-2 mt-3">
                            <label htmlFor="card-holder-0">Last Name<span className="asterix">*</span></label>
                            <div className="element-container">
                                <div><input data-model="petroAcc.lastName" onChange={this.changeInput} type="text" className={`form-control ${errorKeys.includes('lastName') ? 'error-highlight' : ''}`} placeholder="Last Name" /></div>
                            </div>
                        </div>
                    ) : null }


                    <div className="col-12 mt-3">
                        { petroOption === 'petro-redeem' ? (
                            <ReCAPTCHA
                                ref={this.capture}
                                sitekey={captchaSiteKey}
                                onChange={this.onCaptureChange}
                                defaultValue=""
                            />
                        ) : null}
                        {
                            capchaError ? (
                                <div className="error-container w-100 my-2">
                                    <div className="error-text">
                                        <svg className="icon" title="" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                            <use xlinkHref="/img/icons/icon-defs.svg#icon-exclamation-circle" />
                                        </svg> {Lang.trans('petro.please_solve_captcha_petro')}
                                    </div>
                                </div>
                            ) : null
                        }

                    </div>
                    <br />
                </div>
                <div>
                    <div className="col-sm-5 col-md-3 mt-3 px-0">
                        <button type="button" onClick={this.applyPetro} className="btn w-100 btn-lg btn-secondary h-100"><strong>{Lang.trans('petro.apply_petro_btn')}</strong></button>
                    </div>
                    {processDone === false ? (
                        <div className="error-container w-100 my-2">
                            <div className="error-text">
                                <svg className="icon" role="" title="" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-exclamation-circle" />
                                </svg>
                                {Lang.trans('petro.click_apply_to_continue')}
                            </div>
                        </div>
                    ) : (accountInfo === false ? (
                        <div className="error-container w-100 my-2">
                            <div className="error-text">
                                <svg className="icon" role="" title="" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-exclamation-circle" />
                                </svg>
                                {erroMsg}
                            </div>
                        </div>
                    ) : null)}
                </div>
            </div>
        );
    }


    render() {
        const {
            showPetroTab,
            applied,
            petroOption,
            accountInfo,
            showModal,
            loading,
        } = this.state;

        return (
            <div className="rounded-sm p-3 mb-3 box-shadow bg-white">
                <div className="d-flex justify-content-between">
                    <div className="d-flex align-items-center">
                        <div className="mr-2"><img className="booking-airmiles-logo" src="//s3.amazonaws.com/itravel2000/img/branding/pp-logo.png" /></div>
                        <h5 className="m-0 pl-3">{Lang.trans('petro.petro_points_info')}</h5>
                    </div>
                    <button type="button" className="btn-underline-link" onClick={() => { this.showHideTabHandler('petro'); }} data-togglelabel="1" data-toggle="collapse" data-target="#petro-detail">{showPetroTab ? Lang.trans('common.close_tab') : Lang.trans('common.open_tab')}</button>
                </div>
                <div id="petro-detail" className={`collapse ${showPetroTab ? 'show' : ''}`}>
                    <div className="styled-checkbox theme-2 mb-3  mt-4"><input type="checkbox" id="show-petro-points" onChange={this.onChangeApplyPetro} checked={applied} value="1" /><label htmlFor="show-petro-points"><span>{Lang.trans('petro.earn_or_redeem_petro_points')}.</span></label></div>
                    {applied ? (
                        <div>
                            <div className="d-md-flex mt-4 mb-2">
                                <div className="styled-radio theme-2">
                                    <input type="radio" onChange={this.onChangePetroOption} name="petro-option" id="petro-earn" value="petro-earn" checked={petroOption === 'petro-earn'} />
                                    <label className="px-3 w-100" htmlFor="petro-earn">
                                        <h6 className="my-2 my-md-0 pl-3">{Lang.trans('petro.earn_petro_points')}</h6>
                                    </label>
                                </div>
                                <div className="styled-radio theme-2 d-inline-block" style={{ display: 'none' }}>
                                    <input type="radio" onChange={this.onChangePetroOption} name="petro-option" id="petro-redeem" value="petro-redeem" checked={petroOption === 'petro-redeem'} />
                                    <label className="px-3  w-100" htmlFor="petro-redeem">
                                        <h6 className="my-2 my-md-0  pl-3">{Lang.trans('petro.earn_and_redeem_petro_points')}</h6>
                                    </label>
                                </div>
                            </div>
                            {accountInfo ? this.showAccountDetail() : this.showAccountInput()}
                        </div>
                    ) : null}
                </div>
                <Modal id="mdl-petro-verify" className="modal-session-timeout" isOpen={showModal}>
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="text-center">
                            <ModalHeader className="modal-header">
                                <img src="https://s3.amazonaws.com/itravel2000/img/branding/itravel2000-logo.svg" alt="itravel2000 Logo" className="brand-logo mx-auto" />
                            </ModalHeader>
                            <ModalBody className="modal-main">
                                <div className="h4">{Lang.trans('petro.please_wait_checking')}</div>
                                <Loader position={loading ? 0 : 100} active={loading} interval={40} />
                            </ModalBody>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

PetroWidget.propTypes = {
    totalBase: PropTypes.number.isRequired,
    minDepositCheck: PropTypes.bool.isRequired,
    minDepositAmount: PropTypes.number.isRequired,
    petroChangeCallback: PropTypes.func.isRequired,
    bonusPoint: PropTypes.number,
    grandTotal: PropTypes.number.isRequired,
};

PetroWidget.defaultProps = {
    bonusPoint: 0,
};

export default PetroWidget;
