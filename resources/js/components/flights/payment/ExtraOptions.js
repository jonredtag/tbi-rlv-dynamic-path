import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Helper from 'libraries/common/Helper';
import Lang from 'libraries/common/Lang';


class ExtraOptions extends Component {
    constructor(props) {
        super(props);
        //this.extraOptions = {};
        this.flightAva = false;
        this.state = {
            extraOptionsToggle: true,
            flightToggleReturning: false,
            flightToggleDeparture: false,
            featureToggle: false,
            displayExtraoptionRequoteButton: false,
            departExtraOptions: [],
            returnExtraOptions: [],
        };

        this.selectFlightOptions =  this.selectFlightOptions.bind(this);
        this.requoteflight =  this.requoteflight.bind(this);
    }

    selectFlightOptions(e) {
        var { value, checked } = e.currentTarget;
        var optionType = e.currentTarget.attributes.getNamedItem('data-key').value;
        this.props.selectFlightOptions(false);

        const flightOptions = [];
        var departExtraOptions = this.state.departExtraOptions;
        var returnExtraOptions = this.state.returnExtraOptions;

        if(checked==true)
        {
            if(optionType == 'Returning')
                returnExtraOptions.push(value);
            if(optionType == 'Departure')
                departExtraOptions.push(value);
        }
        else
        {
            if(optionType == 'Returning')
                returnExtraOptions.splice( returnExtraOptions.indexOf(value), 1 );
            if(optionType == 'Departure')
                departExtraOptions.splice( departExtraOptions.indexOf(value), 1 );
        }

        this.setState({ departExtraOptions: departExtraOptions, returnExtraOptions: returnExtraOptions, displayExtraoptionRequoteButton: true });

    }

    requoteflight()
    {

        this.setState({displayExtraoptionRequoteButton: false });
        this.props.requotePriceWithExtraoptions(this.state);

        /*

        var str = "";

        for(var i=1;i<= di;i++){
            if($("#eOptions"+i).is(':checked')){
                str = str + "|"+$("#eOptions"+i).val();
                updateRequired = true;
            }
        }
        //if(updateRequired && $('#return input:checked').length>0)
        str = str + "DEPSPLIT";

        for(var i=1;i<= ri;i++){
            if($("#eOptions"+i+"_arr").is(':checked')){
                str = str + "|"+$("#eOptions"+i+"_arr").val();
                updateRequired = true;
            }
        }

        postData.ePotionsVal = str;

        $("#priceDetailModal").empty();
        $("#flightDetailModal").empty();

        $("#flightDetails").empty();
        $("#flightDetailsLoad").show();

        $("#requoteBtn").hide();
        verify();
        */


    }


    generateFlightOptions(extraOptions, optionKey){
        const options = Object.keys(extraOptions).map((key) => {
            return (
                    <div key={`flight-opt-${key}`} className="collapse show">
                        <div className="border rounded m-3  ">
                            <div className="p-3 border-bottom">
                                <div className="styled-checkbox theme-2">
                                    <input type="checkbox" id="same-as-primary" data-key={optionKey} onChange={ this.selectFlightOptions } value={`${extraOptions[key].ID}=${extraOptions[key].Discount_Name}`} />
                                    <label htmlFor={extraOptions[key].Discount_Type}>
                                        <span>{extraOptions[key].Discount_Type}  {extraOptions[key].Discount_Value}</span>
                                    </label>
                                </div>
                            </div>
                            { extraOptions[key].Remarks.map((segement,subIdx)=>{
                                return (
                                <div key={`flight-remarks-${subIdx}-out`} className="flight-product-component d-flex justify-content-around row m-0 gutter-10 border-0">
                                    <div className="col-12">
                                        {segement}
                                    </div>
                                </div>
                                )
                            })}

                        </div>
                    </div>
            );
        });
        return options;
    }

    render() {
        return (
            <div className="rounded-sm p-3 mb-3 box-shadow bg-white">
                <div className="d-flex justify-content-between">
                    <div className="d-flex align-items-center primary-color">
                        <div className="mr-2">
                            <svg className="icon-md mt-2" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                <use xlinkHref="/img/icons/icon-defs.svg#icon-umbrella-box" />
                            </svg>
                        </div>
                        <h5 className="m-0">{Lang.trans('common.extra_options')}</h5>
                    </div>
                    <button className="btn-underline-link" onClick={(e)=>{ this.setState({extraOptionsToggle: !this.state.extraOptionsToggle})}}>{`${this.state.extraOptionsToggle ? `${Lang.trans('common.close_tab')}`:`${Lang.trans('common.open_tab')}`}`}</button>
                </div>
                <div className={`collapse ${this.state.extraOptionsToggle ? 'show' : ''}`}>

                        {Object.keys(this.props.extraOptions).map((key) => {
                            return (
                                <div key={`flight-opt-${key}`} className="border rounded pt-3 mt-3">
                                    <div className="d-flex justify-content-between pr-3 pl-3 mb-3">
                                        <div className="d-flex align-items-center">
                                            <h6 className="m-0">{key}</h6>
                                        </div>
                                        {
                                            (key=='Departure') ? (<button className="btn-underline-link" onClick={(e)=>{ this.setState({flightToggleDeparture: !this.state.flightToggleDeparture})}}>{`${this.state.flightToggleDeparture ? `${Lang.trans('common.close_tab')}`:`${Lang.trans('common.open_tab')}`}`}</button>) : ''
                                        }
                                        {
                                            (key=='Returning') ? (<button className="btn-underline-link" onClick={(e)=>{ this.setState({flightToggleReturning: !this.state.flightToggleReturning})}}>{`${this.state.flightToggleReturning ? `${Lang.trans('common.close_tab')}`:`${Lang.trans('common.open_tab')}`}`}</button>) : ''
                                        }

                                    </div>
                                    {/* Flight Options */}
                                    {
                                            (key=='Departure') ? (<div className={`collapse ${this.state.flightToggleDeparture ? 'show' : ''}`}>{  this.generateFlightOptions(this.props.extraOptions[key], key) }</div>) : ''
                                    }
                                    {
                                            (key=='Returning') ? (<div className={`collapse ${this.state.flightToggleReturning ? 'show' : ''}`}>{  this.generateFlightOptions(this.props.extraOptions[key], key) }</div>) : ''
                                    }

                                </div>);
                        })}

                </div>

                        {
                            (this.state.displayExtraoptionRequoteButton ? <button onClick={(e)=>this.requoteflight()} type="button" className="btn btn-lg p-3 btn-primary col-12 col-md-6" id="requoteFlight"> {Lang.trans('flights.requote')}</button> : '')
                        }



            </div>

        );
    }
}

export default ExtraOptions;
