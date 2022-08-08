import React, { Component } from 'react';
import { render } from 'react-dom';
import Lang from 'libraries/common/Lang';

class PriceDetailsSection extends Component {
    constructor(props) {
        super(props);
        
        this.convertPriceDetailsBreakdown = this.convertPriceDetailsBreakdown.bind(this);
    }


    convertPriceDetailsBreakdown(pricingInfo) {

        var priceDetailsBreakdown = [];
        var nonTaxPrices = [];
        var taxPrices = [];

        Object.keys(pricingInfo).map((paxType, paxQuote) => {

            
            if(typeof pricingInfo[paxType].taxBreakdown != 'undefined' && typeof pricingInfo[paxType].taxBreakdown['non-taxes'] != 'undefined')
            {

                Object.keys(pricingInfo[paxType].taxBreakdown['non-taxes']).map((nonTax, nonTaxKey) => { 
                    if(typeof nonTaxPrices[pricingInfo[paxType].taxBreakdown['non-taxes'][nonTax].TaxCode] == 'undefined') nonTaxPrices[pricingInfo[paxType].taxBreakdown['non-taxes'][nonTax].TaxCode] = [];
                    if(typeof nonTaxPrices[pricingInfo[paxType].taxBreakdown['non-taxes'][nonTax].TaxCode][paxType] == 'undefined') nonTaxPrices[pricingInfo[paxType].taxBreakdown['non-taxes'][nonTax].TaxCode][paxType] = [];

                    nonTaxPrices[pricingInfo[paxType].taxBreakdown['non-taxes'][nonTax].TaxCode]['text'] = pricingInfo[paxType].taxBreakdown['non-taxes'][nonTax].TaxName + '(' + pricingInfo[paxType].taxBreakdown['non-taxes'][nonTax].TaxCode + ')';
                    nonTaxPrices[pricingInfo[paxType].taxBreakdown['non-taxes'][nonTax].TaxCode][paxType]['amount'] = pricingInfo[paxType].taxBreakdown['non-taxes'][nonTax].Amount;
                });
                priceDetailsBreakdown['nontaxes'] = nonTaxPrices;

            }


            if(typeof pricingInfo[paxType].taxBreakdown != 'undefined' && typeof pricingInfo[paxType].taxBreakdown['taxes'] != 'undefined')
            {

                Object.keys(pricingInfo[paxType].taxBreakdown['taxes']).map((nonTax, nonTaxKey) => { 
                    if(typeof taxPrices[pricingInfo[paxType].taxBreakdown['taxes'][nonTax].TaxCode] == 'undefined') taxPrices[pricingInfo[paxType].taxBreakdown['taxes'][nonTax].TaxCode] = [];
                    if(typeof taxPrices[pricingInfo[paxType].taxBreakdown['taxes'][nonTax].TaxCode][paxType] == 'undefined') taxPrices[pricingInfo[paxType].taxBreakdown['taxes'][nonTax].TaxCode][paxType] = [];

                    taxPrices[pricingInfo[paxType].taxBreakdown['taxes'][nonTax].TaxCode]['text'] = pricingInfo[paxType].taxBreakdown['taxes'][nonTax].TaxName + '(' + pricingInfo[paxType].taxBreakdown['taxes'][nonTax].TaxCode + ')';
                    taxPrices[pricingInfo[paxType].taxBreakdown['taxes'][nonTax].TaxCode][paxType]['amount'] = pricingInfo[paxType].taxBreakdown['taxes'][nonTax].Amount;
                });
                priceDetailsBreakdown['taxes'] = taxPrices;

            }

        });

        var priceDetailsBreakdownList = '';
        if(typeof priceDetailsBreakdown.taxes!='undefined')
        {
            
            priceDetailsBreakdownList = Object.keys(priceDetailsBreakdown.taxes).map((item, key) => { 

                        return  (
                            <React.Fragment key={key}>
                                <div className="col-6 bg-white shadow-sm py-1 border-bottom border-left border-right">
                                    {priceDetailsBreakdown.taxes[item].text}
                                </div>
                                {
                                    Object.keys(pricingInfo).map((paxType, paxQuote) => { 

                                                return  (
                                                    <div className="col-6 bg-white shadow-sm py-1 border-bottom border-right" key={`${paxType}-${key}`}>                                                        
                                                        {typeof priceDetailsBreakdown.taxes[item][paxType]['amount']!='undefined' ? priceDetailsBreakdown.taxes[item][paxType]['amount'] : '--'}
                                                    </div>                     
                                                );

                                    })                 

                                }
                           </React.Fragment>                     
                        );

            });                    

        }

        return priceDetailsBreakdownList;
    }
    
    render() {
       
        var { pricingInfo } = this.props;

        var passengers = pricingInfo.passengers;

        var priceDetailsBreakdown = this.convertPriceDetailsBreakdown(passengers);

        return ( 
                <React.Fragment>
                        <div className="col-12 h6 mb-0 pb-2 border-bottom font-weight-bold">
                                <span>Base Price</span>
                        </div>
                        <div className="col-6 bg-white shadow-sm py-1 border-bottom border-right border-left">
                            {Lang.trans('customer.passenger_type')+': '}
                         </div>    
                            {Object.keys(passengers).map((item, key) => { 
                                return (
                                    <div className="col-6 bg-white shadow-sm py-1 border-bottom border-right" key={`price-details-${key}`} scope="col">
                                    {
                                        (item=='ADT') ? Lang.trans('customer.adult') : (item=='INF') ? Lang.trans('customer.infant') : Lang.trans('engine.child')
                                    }
                                    </div>
                                );
                            })}
                                           
                    
                        <div className="col-6 bg-white shadow-sm py-1 border-bottom border-right border-left">
                            {Lang.trans('flights.air_transportation_charges')+': '}
                        </div>
                            {
                                Object.keys(passengers).map((item, key) => {
                                    return (
                                        <div className="col-6 bg-white shadow-sm py-1 border-bottom border-right" key={`transportation-charge-${key}`}>{Lang.priceFormat(`${passengers[item].baseFare}`)}</div> 
                                    );
                                })
                            }
                        

                        <div className="col-12 h6 mb-0 pt-3 pb-2 border-bottom font-weight-bold" colSpan="{Object.keys(passengers).length}">
                                <span>{Lang.trans('flights.taxes_fees_charge')}</span>
                        </div>
                        
                        {this.convertPriceDetailsBreakdown(passengers)}       

                        
                        <div className="col-12 h6 mb-0 pt-3 pb-2 border-bottom font-weight-bold" colSpan="{Object.keys(passengers).length}">
                                <span>Total Price</span>
                        </div>

                        <div className="col-6 bg-white shadow-sm py-1 border-bottom border-right border-left">
                            {Lang.trans('common.total')+': '}
                        </div>
                            {
                               Object.keys(passengers).map((item, key) => {
                                    return (
                                        <div className="col-6 bg-white shadow-sm py-1 border-bottom border-right" key={`paxtotal-${key}`}>{Lang.priceFormat(`${passengers[item].totalFare}`)}</div>                                                
                                    );
                                }) 
                            } 
                            
                        <div className="col-6 bg-white shadow-sm py-1 border-bottom border-right border-left">
                            {Lang.trans('customer.number_of_passengers')+': '}
                        </div>
                            {
                               Object.keys(passengers).map((item, key) => {
                                    return (
                                        <div className="col-6 bg-white shadow-sm py-1 border-bottom border-right" key={`paxquantity-${key}`}>{passengers[item].quantity}</div>                                                
                                    );
                                }) 
                            }
                                                  
                        
                        <div className="col-6 bg-white shadow-sm py-1 border-bottom border-right border-left">
                            {Lang.trans('flights.grand_total')+': '}
                        </div>
                        <div className="col-6 bg-white shadow-sm py-1 border-bottom border-right">{Lang.priceFormat(`${pricingInfo.total}`)}</div>
                        
                    
                </React.Fragment>
        );
    }

  
}

export default PriceDetailsSection;
