import React from 'react';
import PropTypes from 'prop-types';
import ErrorText from 'components/snippets/errorText';
import Slider from 'rc-slider';
import Lang from 'libraries/common/Lang';

const CibcAccept = (props) => {
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
                    <div className="mr-2"><img className="points-logo" src="https://cibc-rewards.s3-us-west-2.amazonaws.com/img/branding/cibc-logo.svg" alt="" data-was-processed="true" /></div>
                    <h5 className="m-0">CIBC Points Information</h5>
                </div>
            </div>
            <div className="border-top pt-3 mt-3">
                <div className="booking-apply-cibc border-bottom pb-3 mb-3">
                    <div className="amount-box mb-3 border">
                        <div className="box-header p-3 h5 mb-0">Choose how many Points you’d like to use</div>
                        <div className="row border-bottom pb-3 mb-3">
                            <div className="col-12 col-md-6">
                                <div className="p-3 mb-0 h6">Pay By Card</div>
                                <div className="row mx-0">
                                    <div className="col-5 col-md-7">Hotel</div>
                                    <div className="col-7 col-md-5"><div className="font-weight-normal">$424.00</div></div>
                                    <div className="col-5 col-md-7">Tax fand fees</div>
                                    <div className="col-7 col-md-5"><div className="font-weight-normal">$176.15</div></div>
                                    <div className="col-5 col-md-7">Total Price</div>
                                    <div className="col-7 col-md-5"><div className="font-weight-normal">$600.15</div></div>
                                </div>
                            </div>
                            <div className="d-none">or</div>
                            <div className="col-12 col-md-6">
                                <div className="p-3 mb-0 h6 col-12">Price In Points</div>
                                <div className="row mx-0">
                                    <div className="col-5 col-md-7">Hotel</div>
                                    <div className="col-7 col-md-5"><div className="font-weight-normal">42,400 Points</div></div>
                                    <div className="col-5 col-md-7">Tax fand fees</div>
                                    <div className="col-7 col-md-5"><div className="font-weight-normal">17,614 Points</div></div>
                                    <div className="col-5 col-md-7">Total Price</div>
                                    <div className="col-7 col-md-5"><div className="font-weight-normal">60,015 Points</div></div>
                                </div>
                            </div>
                        </div>
                        <div className="py-4 px-3">
                            <div className="amounts-wrapper mx-auto">
                                <div className="filter-container">
                                    <div className="filter-content slider-range mb-3 mx-auto">
                                        <div className="slider-range-max-min d-flex justify-content-between mb-1 font-weight-500"><div>Allocate Points</div></div>




                                        { stepLimit>0?(
                                            <div className="py-4 px-3">
                                                <div className="amounts-wrapper mx-auto">
                                                    <div className="filter-container ">
                                                        <div className="filter-content slider-range mb-3 mx-auto">
                                                            <div className="slider-range-max-min d-flex justify-content-between mb-1 font-weight-500">
                                                                <div>Allocate Points</div>
                                                            </div>
                                                            <Slider step={100} min={0} max={Helper.calcCibcPoint(stepLimit)} value={ Helper.calcCibcPoint(this.state.redeemAmount)} onChange={this.redeemChange} />
                                                        </div>
                                                        <div className="element-container d-flex h-6">
                                                            <span>Points</span>
                                                            <div className="d-inline-block mx-2">{Helper.number_format(Helper.calcCibcPoint(this.state.redeemAmount))}</div>
                                                            <span>+ Cash</span>
                                                            <div className="d-inline-block ml-2">{Lang.priceFormat(this.state.cashAmount)}</div>
                                                        </div>

                                                    </div>
                                                    <div className="d-flex align-items-center primary-color pt-3 mt-3 border-top ">
                                                        <h5 className="m-0">Total Price: { Helper.number_format(Helper.calcCibcPoint(this.state.redeemAmount)) } Points { this.state.cashAmount>0? `+ ${Lang.priceFormat(this.state.cashAmount)}`:'' }   </h5>
                                                    </div>
                                                </div>
                                            </div>
                                            ):null
                                        }


                                        <div className="rc-slider">
                                            <div className="rc-slider-rail"></div>
                                            {/*<div className="rc-slider-track" style="left: 0%; right: auto; width: 100%;"></div>*/}
                                            <div className="rc-slider-step"></div>
                                            {/*<div tabindex="0" className="rc-slider-handle" role="slider" aria-valuemin="0" aria-valuemax="60015" aria-valuenow="60015" aria-disabled="false" style="left: 100%; right: auto; transform: translateX(-50%);"></div>*/}
                                            <div className="rc-slider-mark"></div>
                                        </div>
                                    </div>
                                    <div className="element-container d-flex h-6">
                                        <span>Points</span>
                                        <div className="d-inline-block mx-2">60,015</div>
                                        <span>+ Cash</span>
                                        <div className="d-inline-block ml-2">$0.00</div>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center primary-color pt-3 mt-3 border-top"><h5 className="m-0">Total Price: 60,015 Points + $58.87</h5></div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

CibcAccept.propTypes = {
    baseRate: PropTypes.number.isRequired,
    cardNumber: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    errors: PropTypes.instanceOf(Object),
};

CibcAccept.defaultProps = {
    errors: {},
};

export default CibcAccept;
