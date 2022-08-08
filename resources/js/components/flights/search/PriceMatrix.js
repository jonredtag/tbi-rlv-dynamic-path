import React, { Component } from 'react';
import { render } from 'react-dom';
import Carousel from 'components/common/Carousel';

class PriceMatrix extends Component { 
    constructor(props) { 
        super(props);
        this.state = {
          isHiddenPriceMatrix: true,
          hiddenPriceMatrixClass: '',
          filterValues:props.filterValues,          
        }

        this._togglePriceMatrix = this._togglePriceMatrix.bind(this);
        this._handleCarriers = this._handleCarriers.bind(this);
        this._handlePrice = this._handlePrice.bind(this);
    }

    _togglePriceMatrix () {
        this.setState({
          isHiddenPriceMatrix: !this.state.isHiddenPriceMatrix,
          hiddenPriceMatrixClass: (!this.state.isHiddenPriceMatrix ? '' : 'expand')
        })
    }

    handleFilterResults() {
        this.props.onFilterChange(this.state.filterValues);
    }

    _unSelectNumberOfStop(){
        var filternoofstops = document.getElementsByClassName("filternoofstops");
        const filterValues = this.state.filterValues;
        for (var i = 0; i < filternoofstops.length; i++) {
            filternoofstops[i].checked = false;
        }
        filterValues.noOfStops = []; // unchecking number of stop
        this.setState({ filterValues: filterValues });
    }

    _selectFilterOrigins(){
        var filterorigins = document.getElementsByClassName("filterorigins");
        const filterValues = this.state.filterValues;
        for (var i = 0; i < filterorigins.length; i++) {
            filterorigins[i].checked = true;
            filterValues.originAirports.push(filterorigins[i].value); // checking originAirports
        }
        this.setState({ filterValues: filterValues });
    }

    _selectFilterDestinations(){
        var filterdestinations = document.getElementsByClassName("filterdestinations");
        const filterValues = this.state.filterValues;
        for (var i = 0; i < filterdestinations.length; i++) {
            filterdestinations[i].checked = true;
            filterValues.destinationAirports.push(filterdestinations[i].value); // checking destinationAirports
        }
        this.setState({ filterValues: filterValues });
    }

    _handleCarriers(e){
        const value = e.currentTarget.attributes.getNamedItem('data-carriervalue').value;
        const filterValues = this.state.filterValues;
        if(value && filterValues.carriers.indexOf(value)==-1)
        {
            filterValues.carriers.push(value);
            document.getElementById('carrierfilter-'+value).checked = true;            
            this._unSelectNumberOfStop();
            this._selectFilterOrigins();
            this._selectFilterDestinations();            
        }
        this.setState({ filterValues: filterValues }, () => { this.handleFilterResults(); });
    }

    _handlePrice(e){
        const airlinesvalue = (e.currentTarget.attributes.getNamedItem('data-airlinesvalue') != null) ? e.currentTarget.attributes.getNamedItem('data-airlinesvalue').value : '';
        
        var stopvalue = e.currentTarget.attributes.getNamedItem('data-stopvalue').value;

        const filterValues = this.state.filterValues;
        if(airlinesvalue && filterValues.carriers.indexOf(airlinesvalue)==-1)
        {
            filterValues.carriers.forEach(function (value) {
              document.getElementById('carrierfilter-'+value).checked = false;
            });
            filterValues.carriers = [airlinesvalue];   
            document.getElementById('carrierfilter-'+airlinesvalue).checked = true;         
        }

        stopvalue = stopvalue.split("-");
        
        if(stopvalue.length >1){ 

            if(filterValues.noOfStops.length > 0)
            {
                filterValues.noOfStops.forEach(function (value) {
                  if(document.getElementById('stops-'+value) != null)
                    document.getElementById('stops-'+value).checked = false;
                });
            }
            

            filterValues.noOfStops = [];

            for (var i = 0; i <= stopvalue[0]; i++) { 
                filterValues.noOfStops.push(i + '-' + stopvalue[1]);
                if(document.getElementById('stops-' + i + '-' + stopvalue[1]) != null)
                {
                    document.getElementById('stops-' + i + '-' + stopvalue[1]).checked = true;
                }
                
            }

            for (var i = 0; i <= stopvalue[1]; i++) { 
                filterValues.noOfStops.push(stopvalue[0] + '-' + i);
                if(document.getElementById('stops-' + stopvalue[0] + '-' + i) != null)
                {
                    document.getElementById('stops-' + stopvalue[0] + '-' + i).checked = true;
                }
                
            }
        }

        this._selectFilterOrigins();
        this._selectFilterDestinations(); 

        this.setState({ filterValues: filterValues }, () => { this.handleFilterResults(); });
        return false;
    }

    render() {
        
        const {priceMatrix, searchParams, carriers} = this.props;
        
        const noOfStopsList =  Object.keys(priceMatrix.noOfStopsMatrix).map((val, key) => {
            var stopText = '';

            if(val == 0) stopText = 'Non-stop';
            else if(val == 1) stopText = '1 Stop';
            else stopText = val+' Stop';
            
            return  (
                        <a key={key} href="#" className="th " id="one_stop" onClick={this._handlePrice} data-stopvalue={`${val}-${val}`}>
                              {stopText}
                        </a>
                    );
        });

        return (

            <div className={` best-price-finder-slider d-none d-md-block  mb-4 ${this.state.hiddenPriceMatrixClass}`}>


                <h6 className="  table-caption p-3 m-0 font-weight-bold fade-in-on-expand " >
                      <div className="header-text d-inline-block">Hide Price Table</div>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">×</span>
                        </button>
                </h6>                


                <div className="row no-gutters price-finder-body border">
                    <div className="col-3 info thead">
                          <div className=" th table-header">
                                <div className="h5 fade-in-on-expand p-3 mb-0">Number of Stops</div>

                                <div className="intro-text font-weight-bold fade-out-on-expand p-3">
                                      Compare number of stops or <a href="#" onClick={this._togglePriceMatrix}>
                                      
                                        {!this.state.isHiddenPriceMatrix ? 'hide price table' : 'show price table'}
                                      
                                      
                                      </a>
                                </div>
                                
                          </div>
                          <div className="stops-list contract-expand">
                                {noOfStopsList}
                          </div>
                    
                          
                    </div>
                    <Carousel ref="carouselref" config={{ loop: true, perPage: { 0: 1, 768: 2, 970: 3 } }} className="carousel-widget">
                            {Object.keys(priceMatrix.carrierMatrix).map((carrierMatrixval, carrierMatrixkey) => {  
                            
                                return  (
                                            <div className="col th px-0 " id="westjet" key={`carrierscarousel-${carrierMatrixkey}`}> 
                                                <div className="airline">
                                                      
                                                      <img src={`${IMG_LOGOS}carriers/small/${carrierMatrixval}.jpg`} alt="Air Canada" className="airline-icon" />
                                                      <div className="airline-name">{typeof carriers[carrierMatrixval] != 'undefined' ? carriers[carrierMatrixval].name : ''}</div>
                                                </div>
                                                <div className="contract-expand">
                                                    {
                                                        Object.keys(priceMatrix.carrierMatrix[carrierMatrixval]).map((val, key) => { 
                                                            return(
                                                                    <a href="#" onClick={this._handlePrice} data-airlinesvalue={carrierMatrixval} data-stopvalue={`${val}-${val}`} key={key} className=" td td" aria-labelledby="one_stop westjet">{priceMatrix.carrierMatrix[carrierMatrixval][val]}</a>
                                                                );
                                                        })
                                                    }                                                   
                                                </div>
                                            </div>

                                        );
                            })}
                    </Carousel>
                </div>
                
          
            </div>


        );
    }
}

export default PriceMatrix;
