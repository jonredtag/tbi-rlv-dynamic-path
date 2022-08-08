import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Helper from 'libraries/common/Helper';
import Lang from 'libraries/common/Lang';


class BrandedFaresItems extends Component {
    constructor(props) {
        super(props);
        this.selectBrandedFares =  this.selectBrandedFares.bind(this);
        this.state = {
            includedBrandName: this.props.includedBrandName,
            initialIncludedBrandName: this.props.includedBrandName,
        };
    }

    selectBrandedFares(e){
        var { value, checked, id, name, dataset } = e.currentTarget;

        var includedBrandName = this.state.includedBrandName;
        includedBrandName[dataset.keyitinerary] = dataset.keybrandedfare;

        var selectedBrandedFares = '';

        for(var i=0;i<document.getElementById('totalSlicecount').value;i++){
            var rates = document.getElementsByName('brandedFareOption_'+i);

            for(var j = 0; j < rates.length; j++){
                if(rates[j].checked){
                    selectedBrandedFares+= rates[j].name + "|" + rates[j].value + "|" + rates[j].dataset.resbookdesigcode + "DEPSPLIT";
                }
            }
        }
        this.setState({includedBrandName: includedBrandName});

        this.props.requotePriceWithBrandedfares(selectedBrandedFares);
    }

    render() {

        const { brandedfares, keyItinerary, selected_result, displayExtraPrice} = this.props;

        const brandedFaresList = Object.keys(brandedfares).map((eachbrandedFare, keybrandedFare) => {
            var dynamicClass = '';
            var displayPrice = brandedfares[eachbrandedFare].totalFare.Amount;
            if(this.state.includedBrandName[keyItinerary]==keybrandedFare)
            {
                dynamicClass = 'selected';
            }

            if(this.state.initialIncludedBrandName[keyItinerary]==keybrandedFare)
            {
                displayPrice = 0;
            }

            var cabinCodesText = '';
            if(brandedfares[eachbrandedFare].cabinCodes.length == 1 && brandedfares[eachbrandedFare].cabinCodes[0] == 'Y') cabinCodesText = Lang.trans('engine_flights.class_economy');
            else if(brandedfares[eachbrandedFare].cabinCodes.length == 1 && brandedfares[eachbrandedFare].cabinCodes[0] == 'S') cabinCodesText = Lang.trans('engine_flights.class_premium_economy');
            else if(brandedfares[eachbrandedFare].cabinCodes.length == 1 && brandedfares[eachbrandedFare].cabinCodes[0] == 'C') cabinCodesText = Lang.trans('engine_flights.class_business');
            else if(brandedfares[eachbrandedFare].cabinCodes.length == 1 && brandedfares[eachbrandedFare].cabinCodes[0] == 'F') cabinCodesText = Lang.trans('engine_flights.class_first');
            else if(brandedfares[eachbrandedFare].cabinCodes.length > 1) cabinCodesText = "Mixed";

            var includedFeatures = '';
            if(typeof brandedfares[eachbrandedFare].includedFeature != undefined && brandedfares[eachbrandedFare].includedFeature.length > 0){
                includedFeatures = brandedfares[eachbrandedFare].includedFeature.map((includedfeature, keyincludedfeature) => {

                return  (
                            <li className="d-flex" key={keyincludedfeature}>
                                <i className="icon-ok icon-included feature-icon"></i> <div>{includedfeature}</div>
                            </li>

                        );
            });
            }

            var paidFeatures = '';
            if(typeof brandedfares[eachbrandedFare].paidFeature != undefined && brandedfares[eachbrandedFare].paidFeature.length > 0){
                paidFeatures = brandedfares[eachbrandedFare].paidFeature.map((paidfeature, keypaidfeature) => {

                return  (

                            <li className="d-flex">
                                <div className="icon-fees-apply circle feature-icon"><i className="icon-dollar"></i></div> <div>{keypaidfeature}</div>
                            </li>

                        );
            });
            }

            var notavailableFeatures = '';
            if(typeof brandedfares[eachbrandedFare].notavailableFeature != undefined && brandedfares[eachbrandedFare].notavailableFeature.length > 0){
                notavailableFeatures = brandedfares[eachbrandedFare].notavailableFeature.map((notavailablefeature, keynotavailablefeature) => {

                return  (

                            <li className="d-flex">
                                <div className="icon-fees-apply circle feature-icon"><i className="icon-dollar"></i></div> <div>{keynotavailablefeature}</div>
                            </li>

                        );
            });
            }

            return (

                    <li key={keybrandedFare} className={`p-3 brandedfareoptionli ${keybrandedFare} ${dynamicClass}`}>


                        <div className="row " id={`brandedfaredetails${eachbrandedFare}`}>



                            <div className="col-1 styled-radio theme-2 l-10 t-0 fare-radio ">


                                <input type="radio" data-resbookdesigcode={brandedfares[eachbrandedFare].brandDetails.segmentResBookDesigCode.join()} data-requotetype="brandedfares" className="brandedFareOptionRdbtn requoteprice" id={`brandedFareOption_${brandedfares[eachbrandedFare].brandDetails.brandId}`} name={`brandedFareOption_${keyItinerary}`} onChange={this.selectBrandedFares} data-keybrandedfare={keybrandedFare} data-keyitinerary={keyItinerary} checked={this.state.includedBrandName[keyItinerary]==keybrandedFare} value={brandedfares[eachbrandedFare].brandDetails.brandId} />
                                <label htmlFor={`brandedFareOption_${brandedfares[eachbrandedFare].brandDetails.brandId}`}></label>



                            </div>
                            <div className="span4 upgrade-name">
                                <label htmlFor={`brandedFareOption_${brandedfares[eachbrandedFare].brandDetails.brandId}`}>
                                    <div className="fare-name">{eachbrandedFare}</div>
                                    Cabin:
                                    { cabinCodesText }
                                </label>
                                <a className="show-more hover-no-underline accordion-toggle brandedfareshowmoretoggle" data-toggle="collapse" data-parent={"#brandedfaredetails"+eachbrandedFare} href={"#brandedfaremoredetails_"+ eachbrandedFare.replace(" ", "")}>

                                    <svg className="icon mr-1 ">
                                        <use xmlnsXlink="http://www.w3.org/2000/svg" xlinkHref="/img/icons/icon-defs.svg#icon-chevron-down"></use>
                                    </svg>
                                    <span className="display-link">{Lang.trans('common.show_more')}</span>
                                </a>
                            </div>



                            <hr className="col-9 order-3 d-sm-none mt-2 mb-3" />


                            <label htmlFor={`brandedFareOption_${brandedfares[eachbrandedFare].brandDetails.brandId}`} className="col-3 order-4 order-sm-3 w-xs-40 ml-4 ml-sm-0">

                                <a className="clearfix" data-original-title="A fee applies to check a bag">
                                        {(() => {
                                            if(brandedfares[eachbrandedFare].freeBaggageQuantity > 0)
                                            {
                                                if(brandedfares[eachbrandedFare].bagType=='K'){
                                                    return (<div><div className="feature-icon float-left">
                                                  <svg className="icon icon-included ">
                                                    <use xmlnsXlink="http://www.w3.org/2000/svg" xlinkHref="/img/icons/icon-defs.svg#icon-suitcase"></use>
                                                  </svg></div><div className="ml-25">'+brandedfares[eachbrandedFare].freeBaggageQuantity+' KG</div></div>)
                                                }
                                                else
                                                {
                                                    for (var i = 0; i < brandedfares[eachbrandedFare].freeBaggageQuantity; i++) {
                                                      return (<div className="feature-icon float-left"><i className="icon-suitcase icon-included"></i></div>)
                                                    }
                                                    return (<div className="ml-25">Checked Bags</div>)
                                                }
                                            }
                                            else if(typeof brandedfares[eachbrandedFare].paidFeature.checkedbaggage != undefined) {
                                                return (<div><div className="icon-fees-apply circle feature-icon float-left">
                                                  <svg className="icon icon-fees-apply ">
                                                    <use xmlnsXlink="http://www.w3.org/2000/svg" xlinkHref="/img/icons/icon-defs.svg#icon-dollar-sign-circle"></use>
                                                  </svg> </div><div className="ml-25">Checked Bags</div></div>)
                                            }
                                            else{
                                                return (<div><div className="feature-icon float-left">
                                                  <svg className="icon icon-not-available ">
                                                    <use xmlnsXlink="http://www.w3.org/2000/svg" xlinkHref="/img/icons/icon-defs.svg#icon-close"></use>
                                                  </svg> </div><div className="ml-25">Checked Bags</div></div>)
                                            }
                                        })()}

                                </a>
                                <a className="d-inline-block"  data-original-title="A fee applies to choose a seat">
                                        {(() => {
                                            if(typeof brandedfares[eachbrandedFare].paidFeature.seatchoice != undefined) {
                                                return (<div><div className="feature-icon float-left">
                                                  <svg className="icon icon-fees-apply ">
                                                    <use xmlnsXlink="http://www.w3.org/2000/svg" xlinkHref="/img/icons/icon-defs.svg#icon-dollar-sign-circle"></use>
                                                  </svg> Seat Choice</div></div>)
                                            }
                                            else if(typeof brandedfares[eachbrandedFare].includedFeature.seatchoice != undefined) {
                                                return (<div><div className="feature-icon float-left">
                                                  <svg className="icon icon-included ">
                                                    <use xmlnsXlink="http://www.w3.org/2000/svg" xlinkHref="/img/icons/icon-defs.svg#icon-check"></use>
                                                  </svg> </div><div className="ml-25"> Seat Choice</div></div>)
                                            }
                                            else if(typeof brandedfares[eachbrandedFare].notavailableFeature.seatchoice != undefined) {
                                                return (<div><div className="feature-icon float-left">
                                                  <svg className="icon icon-not-available ">
                                                    <use xmlnsXlink="http://www.w3.org/2000/svg" xlinkHref="/img/icons/icon-defs.svg#icon-close"></use>
                                                  </svg> </div><div className="ml-25"> Seat Choice</div></div>)
                                            }
                                        })()}
                                </a>
                            </label>
                            <label htmlFor={`brandedFareOption_${brandedfares[eachbrandedFare].brandDetails.brandId}`} className="col-3 order-5 order-sm-4 w-xs-40 ml-4 ml-sm-0">
                                    {(() => {
                                        if(typeof brandedfares[eachbrandedFare].paidFeature.carryonbaggage != undefined) {
                                            return (<div><div className="icon-fees-apply circle feature-icon float-left">
                                                  <svg className="icon icon-fees-apply ">
                                                    <use xmlnsXlink="http://www.w3.org/2000/svg" xlinkHref="/img/icons/icon-defs.svg#icon-dollar-sign-circle"></use>
                                                  </svg> </div><div  className="ml-25">Carry On Bag</div></div>)
                                        }
                                        else if(typeof brandedfares[eachbrandedFare].includedFeature.carryonbaggage != undefined) {
                                            return (<div><div className="feature-icon float-left">
                                                  <svg className="icon icon-included ">
                                                    <use xmlnsXlink="http://www.w3.org/2000/svg" xlinkHref="/img/icons/icon-defs.svg#icon-check"></use>
                                                  </svg></div><div  className="ml-25">Carry On Bag</div></div>)
                                        }
                                        else if(typeof brandedfares[eachbrandedFare].notavailableFeature.carryonbaggage != undefined) {
                                            return (<div><div className="feature-icon float-left">
                                                  <svg className="icon icon-not-available ">
                                                    <use xmlnsXlink="http://www.w3.org/2000/svg" xlinkHref="/img/icons/icon-defs.svg#icon-close"></use>
                                                  </svg>
                                                   </div><div  className="ml-25">Carry On Bag</div></div>)
                                        }
                                    })()}
                            </label>
                            <label htmlFor={`brandedFareOption_${brandedfares[eachbrandedFare].brandDetails.brandId}`} className="col-1 p-0 upgrade-price order-sm-5">
                                <div className="price-amount">
                                {
                                    Lang.priceFormat(displayPrice)
                                }
                                </div>
                                {(() => {
                                        if(displayExtraPrice===false) {
                                            return (<span className="footnote">total per person</span>)
                                        }
                                })()}
                            </label>
                        </div>


                        <div className="full-fare-list  collapse" id={"brandedfaremoredetails_" + eachbrandedFare.toLowerCase()}>
                            <div className="row-fluid">
                                {(() => {
                                        if(includedFeatures != '') {
                                            return (
                                                    <div className="col-4" >
                                                        <strong>Included</strong>
                                                        <ul className="unstyled">{includedFeatures}
                                                        </ul>
                                                    </div>
                                            )
                                        }
                                })()}

                                {(() => {
                                        if(paidFeatures != '') {
                                            return (
                                                    <div className="col-4" >
                                                        <strong>Fees Apply</strong>
                                                        <ul className="unstyled">{paidFeatureFeatures}
                                                        </ul>
                                                    </div>
                                            )
                                        }
                                })()}

                                {(() => {
                                        if(notavailableFeatures != '') {
                                            return (
                                                    <div className="col-4" >
                                                        <strong>Not available</strong>
                                                        <ul className="unstyled">{notavailableFeatures}
                                                        </ul>
                                                    </div>
                                            )
                                        }
                                })()}

                            </div>

                        </div>

                    </li>


                );
        });

        return (

            <ul className="upgrade-list list-unstyled">
                {brandedFaresList}
            </ul>
        );
    }
}

export default BrandedFaresItems;
