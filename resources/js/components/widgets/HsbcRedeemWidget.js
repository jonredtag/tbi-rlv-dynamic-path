import React, { Component } from 'react';
import Helper from 'libraries/common/Helper';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import Lang, { priceFormat } from 'libraries/common/Lang';

var redeemAmountStep = 0.01; // 1$
var minRedeemPoints = 10; // 1$

class HsbcRedeemWidget extends Component {
    constructor(props) {
        super(props);
        const accAmount = parseFloat(this.props.memberAccount.amount, 2);
        const redeemAmountLimit = accAmount > this.props.totalBase ? this.props.totalBase : accAmount;

        this.loopLimit = Math.ceil(redeemAmountLimit * 1000 / minRedeemPoints);
        let maxDollarReedem = redeemAmountStep * this.loopLimit;
        maxDollarReedem = maxDollarReedem > this.props.totalBase ? this.props.totalBase : maxDollarReedem;
        maxDollarReedem = parseFloat(maxDollarReedem.toFixed(2), 2);
        this.maxDollarReedem = maxDollarReedem;

        this.state = {
            redeemAmount: maxDollarReedem,
        };
        this.redeemClick = this.redeemClick.bind(this);
        this.onRedeemPlus = this.onRedeemPlus.bind(this);
        this.onRedeemMinus = this.onRedeemMinus.bind(this);
    }

    componentDidMount() {
        this.props.redeemChange(this.state.redeemAmount);
    }

    redeemClick(redeemNumber) {
        const redeemAmount = parseFloat(redeemNumber / 1000, 2);
        this.setState({ redeemAmount }, ()=>this.props.redeemChange(redeemAmount));
    }

    onRedeemPlus(maxDollarReedem) {
        if (this.state.redeemAmount < maxDollarReedem) {
            this.setState({ redeemAmount:this.state.redeemAmount + redeemAmountStep },
                () => this.props.redeemChange(this.state.redeemAmount)
            );
        }
    }

    onRedeemMinus() {
        if (this.state.redeemAmount >= redeemAmountStep) {
            this.setState({ redeemAmount: this.state.redeemAmount - redeemAmountStep },
                () => this.props.redeemChange(this.state.redeemAmount)
            );
        }
    }

    getInfo() {
        return this.state;
    }

    render() {
        const loopLimit = this.loopLimit;
        const maxDollarReedem = this.maxDollarReedem;
        const grandTotalDisplay = this.props.grandTotal;

        return (
            <div class="rounded-sm p-3 mb-3 box-shadow bg-white">
                <div className="booking-apply-hsbc border-bottom pb-3 mb-3">
                    <div className="amount-box text-center mb-3 border">
                        <div className="box-header p-3 h5 mb-0">{Lang.trans('hsbc.choose_how_many')}</div>

                        <div className="mb-1 mt-1 pl-3 pr-3 font-weight-500 py-1">
                            <span className="mr-1 text-highlight">{Lang.trans('hsbc.dream_miles_value')} = {Lang.trans('hsbc.dream_miles_equals')}</span>
                        </div>

                        <div className="bg-white pt-3 pt-md-2 pb-2 text-center three-cols-info">
                            <div className="row amounts-wrapper align-items-center mx-auto">
                                <div className="flex-grow-1 border-right">
                                    {Lang.trans('hsbc.booking_minimum')}
                                    <div className="amount text-highlight">0</div>
                                </div>
                                <div className="flex-grow-1 border-md-right">
                                    {Lang.trans('hsbc.booking_maximum')}
                                    <div className="amount text-highlight">{window.Locale =='en'? Helper.number_format(maxDollarReedem * 1000): Helper.number_format(maxDollarReedem,0,',',' ')}</div>
                                </div>
                                <div className="flex-grow-1 account-dream-balance border-top border-md-0 mt-3 mt-md-0">
                                    {Lang.trans('hsbc.account_dream_balance')}
                                    <div className="amount text-sm text-highlight">{ window.Locale =='en'? Helper.number_format(this.props.memberAccount.points): Helper.number_format(this.props.memberAccount.points,0,',',' ')}</div>
                                </div>

                            </div>
                        </div>
                        { loopLimit > 0 && 
                            <div className="py-4 px-3">
                                <div className="amounts-wrapper mx-auto">
                                    <div className="filter-container ">
                                        <div className="filter-content slider-range mb-3 mx-auto">
                                            <div className="slider-range-max-min d-flex justify-content-between mb-1 font-weight-500">
                                                <div>0</div>
                                                <div>{ window.Locale =='en'? Helper.number_format(maxDollarReedem*1000): Helper.number_format(maxDollarReedem*1000,0,',',' ')}</div>
                                            </div>
                                             <Slider step={redeemAmountStep*1000} min={0} max={maxDollarReedem*1000} value={this.state.redeemAmount*1000} onChange={this.redeemClick} />
                                             <div className="d-flex justify-content-between mt-1 font-weight-500">
                                                 <div className="text-highlight">Minimum</div>
                                                 <div className="text-highlight">Maximum</div>
                                             </div>
                                        </div>
                                    </div>
                                </div>
                            </div>                            
                        }
                </div>    
                

                <div className="totals container">
                    <div className="row border-bottom pb-3 mb-3 h6 ">
                        <div className="col-5 col-md-7 tx-sm-small">{Lang.trans('hsbc.total_dream_miles_applied')}</div>
                        <div className="col-7 col-md-5 text-right">
                            {window.Locale =='en'? '-'+Helper.number_format(this.state.redeemAmount*1000) : '-'+Helper.number_format(this.state.redeemAmount*1000, 0,',',' ')} {Lang.trans('hsbc.dream_miles')}
                            <div className="font-weight-normal">(- {priceFormat(this.state.redeemAmount,2)})</div>
                        </div>
                        <div className="row ">
                            <div className="col-4 col-md-7 h4 text-highlight tx-sm-small cost-after-total">{Lang.trans('hsbc.cost_after_redemption')}</div>
                            <div className=" col-8 col-md-5 text-right h4 text-highlight cost-after-total">{priceFormat(grandTotalDisplay, 2)} CAD</div>
                            <div className="col-7 mb-4 tx-sm-medium">{Lang.trans('hsbc.dream_miles_remaining_after_redemption')}</div>
                            <div className="col-5 text-right">{window.Locale === 'en' ? Helper.number_format(this.props.memberAccount.points - this.state.redeemAmount * 1000) : Helper.number_format(this.props.memberAccount.points - this.state.redeemAmount * 1000, 0, ',', ' ')} {Lang.trans('hsbc.dream_miles')}</div>
                        </div>
                    </div>

                    <p className="mt-4 text-left">
                        {this.props.minDepositCheck ? Lang.trans('common.deposit_price_of_one') : Lang.trans('common.full_purchase_price_of_one')}
                        <strong>{priceFormat(this.props.minDepositCheck ? `${this.props.minDepositAmount}` : `${grandTotalDisplay}`, 2)}</strong> {Lang.trans('common.full_purchase_price_of_two')}
                        <strong>{` ${Helper.number_format(this.state.redeemAmount * 1000, 0, ' ', ' ')}`} {Lang.trans('hsbc.dream_miles')}</strong> {Lang.trans('common.will_deducted_finish_checkout')}
                    </p>
                </div>
            </div>
        </div>    
        );
    }
}

export default HsbcRedeemWidget;
