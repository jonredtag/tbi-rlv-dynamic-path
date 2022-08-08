import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Helper from 'libraries/common/Helper';
import Lang from 'libraries/common/Lang';
import BrandedFaresItems from 'components/flights/payment/BrandedFaresItems';


class BrandedFares extends Component {
    constructor(props) {
        super(props);
        //this.extraOptions = {};
        this.flightAva = false;
        this.state = {
            brandedFaresDivExpand: false,
            returnExtraOptions: [],
            showmore: false,
            initialBrandedFareData : null
        };

        this.showBrandedFares =  this.showBrandedFares.bind(this);
    }

    showBrandedFares()
    {
        this.setState({brandedFaresDivExpand: !this.state.brandedFaresDivExpand});
    }

    showmoreBrandedFares()
    {
        this.setState({showmore: !this.state.showmore});
    }


    render() { 

        const { brandedFareResults, itinerarySlices, selected_result, airlines, includedBrandName } = this.props.brandedfaresData;

        var displayExtraPrice = true;
        if(this.props.brandedfaresData.noofticket == 1) displayExtraPrice = false;


        var brandedFaresList = '';        
        if(this.props.brandedfaresData.itinerarySlices.length > 0)
        {
            brandedFaresList = this.props.brandedfaresData.itinerarySlices.map((itinerary, keyItinerary) => {

                var slicedBrandedFare = {};
                Object.keys(brandedFareResults[keyItinerary]).slice(0,2).map((itinerary1, keyItinerary1) => {
                    slicedBrandedFare[itinerary1] = brandedFareResults[keyItinerary][itinerary1];
                });

                return  (
                            <div className="flight-leg-section" key={itinerary}>
                                <div className="mt-20">
                                    <div className="title d-flex justify-space-between align-items-center ">
                                        <div className="brandedfareheading" id={"brandedfareheading_" + itinerary} data-slicecount={itinerary}>                                         
                                            <span className="flight-number">{(keyItinerary == 0) ? 'Outbound' : 'Inbound'}</span>               
                                        </div>

                                        <div className="lowest-price brandedfarepricediv">
                                            <svg className="icon" role="" title="" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                                <use xlinkHref={`${IMG_ICONS}icon-defs.svg#icon-chevron-up`} />
                                            </svg> 
                                        </div>
                                    </div>


                                    { (typeof brandedFareResults[keyItinerary]!='undefined') ? (
                                        <BrandedFaresItems brandedfares={((!this.state.showmore) ? slicedBrandedFare : brandedFareResults[keyItinerary])} displayExtraPrice={displayExtraPrice} showmore={this.state.showmore} includedBrandName={includedBrandName} keyItinerary={keyItinerary} selected_result={selected_result} requotePriceWithBrandedfares={this.props.requotePriceWithBrandedfares} />
                                      ) : ''}

                                    {(() => {
                                            if(Object.keys(brandedFareResults[keyItinerary]).length > 2) {
                                                return (
                                                        <div className="sub-container">
                                                            <a href="javascript:void(0)" onClick={(e)=>this.showmoreBrandedFares()} id={"fltDetailsbtn-" + keyItinerary} className="show-all d-block border mb-20 showallbrandedfare" data-togglelist={"brandedfaretoggle" + itinerary}>
                                                                <svg className="icon  mr-1">
                                                                    <use xmlnsXlink="http://www.w3.org/2000/svg" xlinkHref={`${IMG_ICONS}icon-defs.svg#icon-chevron-down`}></use>
                                                                </svg>
                                                                 {`${this.state.showmore ? `${Lang.trans('common.close_tab')}`:`${Lang.trans('common.open_tab')}`}`}
                                                            </a>
                                                        </div>
                                                )
                                            }
                                    })()}

                                </div>
                            </div>
                        );
            });
        }
        
        var brandedFaresDivExpandClass = '';
        if(this.state.brandedFaresDivExpand) brandedFaresDivExpandClass = 'show';

        return (

            <div className="border rounded p-3 mb-3 custom-form-element box-shadow flights-upgrade">
                <a className="accordion-toggle hide-link" data-toggle="collapse" href="#allbrandedfareoptions">

                <div className="d-flex align-items-center primary-color">
                    <div className="mr-2">
                    
                        <svg className="   icon-md" role="" title="" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                            <use xlinkHref={`${IMG_ICONS}icon-defs.svg#icon-arrow-up`} />
                        </svg>
                    </div><h5>Upgrade your flights </h5>
                </div>

                <div className="border-top pt-3 mt-3">
                    <div className="d-flex">
                        <div><img src="https://s3.amazonaws.com/redtag-ca/img/placeholders/airplane-cabin-interior-view-450w-548944045.jpg" alt="First Class Image" className="upgrade-img d-none d-md-block"/></div>
                        
                        <div >
                            <h6>Get more comforts and benefits by adding an upgrade.</h6>
                            
                            <ul>
                                <li>Relax while packing! Get free bags</li>
                                <li>Enjoy more flexibility with free cancellation</li>
                                <li>Choose seats at no extra charge</li>
                            </ul>
                        </div>
                    </div>
                    <div className="display-link mt-3"><a href="javascript:void(0)" onClick={(e)=>this.showBrandedFares()} >{`${this.state.brandedFaresDivExpand ? `${Lang.trans('flights.hide_upgrade_options')}`:`${Lang.trans('flights.show_upgrade_options')}`}`}</a></div>
                </div>
                </a>

                <div className={`upgrade-flight collapse accord-segment ${brandedFaresDivExpandClass}`} id="allbrandedfareoptions">

                    <div className="upgrade-legend border mb-3 mt-3 ">
                        <ul className=" list-unstyled d-flex flex-wrap flex-sm-nowrap justify-content-between">
                          <li className="item">
                            <div className="d-block d-xl-inline-block mr-2">
                              <svg className="icon icon-not-available  ">
                                <use xmlnsXlink="http://www.w3.org/2000/svg" xlinkHref={`${IMG_ICONS}icon-defs.svg#icon-close`}></use>
                              </svg>

                            </div>
                            Not available 
                          </li>
                          <li className="item">
                              <div className="d-block d-xl-inline-block mr-2">
                                <svg className="icon-md mt-2  ">
                                  <use xmlnsXlink="http://www.w3.org/2000/svg" xlinkHref={`${IMG_ICONS}icon-defs.svg#icon-dollar-sign-circle`}></use>
                                </svg>
                              </div>
                              Fee applies 
                          </li>
                          <li className="item">
                            <div className="d-block d-xl-inline-block mr-2">
                              <svg className="icon icon-included ">
                                <use xmlnsXlink="http://www.w3.org/2000/svg" xlinkHref={`${IMG_ICONS}icon-defs.svg#icon-check`}></use>
                              </svg>
                            </div>
                           Included 
                          </li>
                          <li className="item">

                            <div className="d-block d-xl-inline-block mr-2">
                              <svg className="icon icon-included ">
                                <use xmlnsXlink="http://www.w3.org/2000/svg" xlinkHref={`${IMG_ICONS}icon-defs.svg#icon-suitcase`}></use>
                              </svg>
                            </div>

                            Checked bag included 
                          </li>
                        </ul>



                    </div>

                    {brandedFaresList}

                </div>
                <input type="hidden" id="sameAirlines" value={(airlines.length==1) ? 'true' : false} />
                <input type="hidden" id="totalSlicecount" value={selected_result.itineraries.length}/>

            </div>
        );
    }
}

export default BrandedFares;
