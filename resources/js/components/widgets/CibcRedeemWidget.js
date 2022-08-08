import React, { Component } from 'react';
import Helper from 'libraries/common/Helper';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import Lang from 'libraries/common/Lang';
import PropTypes from 'prop-types';

var CIBC_POINTS_INCR = 100;
class CibcRedeemWidget extends Component {
    constructor(props) {
        super(props);
        const customerPointsInCash = parseInt(this.props.memberAccount.points, 10) / CIBC_POINTS_INCR;
        const redeemAmountLimit = customerPointsInCash >= this.props.grandTotal ? this.props.grandTotal : customerPointsInCash;
        this.redeemAmountLimit =  redeemAmountLimit;
        this.state = {
            redeemAmount: redeemAmountLimit ,
            cashAmount: this.props.grandTotal- redeemAmountLimit,
        };
        this.redeemChange = this.redeemChange.bind(this);
    }


    componentDidMount(prevProps, prevState, prevContext) {
         this.props.redeemChange(this.state.redeemAmount);
    }

    redeemChange(redeemPoint) {
        const redeemAmount =  redeemPoint/CIBC_POINTS_INCR;
        if(redeemPoint ==0){
            console.log(">>redeemAmount:", redeemAmount);
            console.log("balance:",this.props.grandTotal - redeemAmount);
        }
        const cashAmount =  this.props.grandTotal - redeemAmount;
        this.setState({redeemAmount, cashAmount},
            ()=>this.props.redeemChange(redeemAmount)
            );
    }


    getInfo() {
        return this.state;
    }

    render() {
        const grandTotalDisplay = this.props.grandTotal;
        const stepLimit =  this.redeemAmountLimit;
        if(!stepLimit) {
            return null;
        }

        return (
            <div className="border rounded p-3 mb-3 box-shadow">
                <div className="d-flex justify-content-between">
                    <div className="d-flex align-items-center primary-color ">
                        <div className="mr-2">
                            <img alt="booking cibc logo" className="booking-cibc-logo" src="https://cibc-rewards.s3-us-west-2.amazonaws.com/img/branding/cibc-logo.svg"/>
                        </div>
                        <h5 className="m-0">CIBC Points Information</h5>
                    </div>
                </div>
                <div className="border-top pt-3 mt-3">
                    <div className="booking-apply-cibc  border-bottom pb-3 mb-3">
                        <div className="amount-box mb-3 border">
                            <div className="box-header p-3 h5 mb-0">Choose how many Points you'd like to use</div>
                                <div className="row border-bottom pb-3 mb-3 mx-0">
                                    <div className="col-12 col-md-6">
                                        <div className="py-3 pl-1 mb-0 h6">Pay By Card</div>
                                        <div className="row gutter-10 mx-0">
                                            <div className="col-5 col-md-7">Car Rental</div>
                                            <div className="col-7 col-md-5">
                                                <div className="font-weight-normal">{Lang.priceFormat(this.props.totalBase)}</div>
                                            </div>
                                            <div className="col-5 col-md-7">Taxes and Fees</div>
                                            <div className="col-7 col-md-5">
                                                <div className="font-weight-normal">{Lang.priceFormat(this.props.grandTotal-this.props.totalBase)}</div>
                                            </div>
                                            <div className="col-5 col-md-7">Total Price</div>
                                            <div className="col-7 col-md-5">
                                                <div className="font-weight-normal">{Lang.priceFormat(this.props.grandTotal)}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-none"> or</div>
                                    <div className="col-12 col-md-6">
                                        <div className="py-3 pl-1 mb-0 h6 col-12">Price In Points</div>
                                        <div className="row gutter-10 mx-0 ">
                                            <div className="col-5 col-md-7">Car Rental</div>
                                            <div className="col-7 col-md-5">
                                                <div className="font-weight-normal">{Helper.number_format(Helper.calcCibcPoint(this.props.totalBase))} Points</div>
                                            </div>
                                            <div className="col-5 col-md-7">Taxes and Fees</div>
                                            <div className="col-7 col-md-5">
                                                <div className="font-weight-normal">{Helper.number_format(Helper.calcCibcPoint(this.props.grandTotal-this.props.totalBase))} Points</div>
                                            </div>
                                            <div className="col-5 col-md-7">Total Price</div>
                                            <div className="col-7 col-md-5">
                                                <div className="font-weight-normal">{Helper.number_format(Helper.calcCibcPoint(this.props.grandTotal))} Points</div>
                                            </div>
                                        </div>
                                    </div>
                            </div>

                            <div className="py-4 px-3">
                                <div className="amounts-wrapper mx-auto">
                                    <div className="filter-container ">
                                        <div className="filter-content slider-range mb-3 mx-auto">
                                            <div className="slider-range-max-min d-flex justify-content-between mb-1 font-weight-500">
                                                <div>Allocate Points</div>
                                            </div>
                                            <Slider step={1} min={0} max={Helper.calcCibcPoint(stepLimit)} value={ Helper.calcCibcPoint(this.state.redeemAmount)} onChange={this.redeemChange} />
                                        </div>
                                        <div className="element-container d-flex h-6">
                                            <span>Points</span>
                                            <div className="d-inline-block mx-2">{Helper.number_format(Helper.calcCibcPoint(this.state.redeemAmount))}</div>
                                            <span>+ Cash</span>
                                            <div className="d-inline-block ml-2">{Lang.priceFormat(this.state.cashAmount)}</div>
                                        </div>

                                    </div>
                                    <div className="d-flex align-items-center primary-color pt-3 mt-3 border-top ">
                                        <h5 className="m-0">Total Price: { Helper.number_format(Helper.calcCibcPoint(this.state.redeemAmount)) } Points { this.state.cashAmount > 0 ? `+ ${Lang.priceFormat(this.state.cashAmount)}` : '' }   </h5>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
           </div>
        );
    }
}


CibcRedeemWidget.propTypes = {
    productName: PropTypes.string.isRequired,
    cibcChangeCallback: PropTypes.func.isRequired,
    grandTotal: PropTypes.number.isRequired,
    totalBase: PropTypes.number.isRequired,
    memberAccount: PropTypes.instanceOf(Object).isRequired,
};

export default CibcRedeemWidget;
