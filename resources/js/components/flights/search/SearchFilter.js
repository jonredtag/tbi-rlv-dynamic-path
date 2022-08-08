import React, { Component } from 'react';


import LabeledSlider from 'components/common/LabeledSlider';

//import Helper from 'libraries/common/Helper';
//import VacationLib from 'libraries/vacations/VacationLib';

class SearchFilter extends Component {
    constructor(props) {
        super(props);

        this.state = props.filterValues;

        this._updateDurationRange = this._updateDurationRange.bind(this);
        this._updatePriceRange = this._updatePriceRange.bind(this);
        this._handleNoOfStop = this._handleNoOfStop.bind(this);
        this._handleDepartureAirports = this._handleDepartureAirports.bind(this);
        this._handleReturnAirports = this._handleReturnAirports.bind(this);
        this._handleCarriers = this._handleCarriers.bind(this);
        this._handleDepartureTime = this._handleDepartureTime.bind(this);
        this._handleArrivalTime = this._handleArrivalTime.bind(this);
    }

    handleFilterResults() {
        this.props.onFilterChange(this.state);
    }

    getDuration(minutes) {
        var formattedduration = (Math.floor(minutes) % 60) + 'm';
        if (Math.floor(minutes / 60) > 0) {
            formattedduration = Math.floor(minutes / 60) + 'h' + ' ' + formattedduration;
        }

        return formattedduration;
    };

    _updatePriceRange(pricerange) {
        this.setState({
            minPrice: pricerange[0],
            maxPrice: pricerange[1],
            setFilter:true,
        }, () => { this.handleFilterResults(); });
    }

    _updateDurationRange(durationrange) {
        this.setState({
            minDuration: durationrange[0],
            maxDuration: durationrange[1],
        }, () => { this.handleFilterResults(); });
    }

    _handleNoOfStop(e){
        const { value, checked } = e.currentTarget;
        const noOfStop = this.state.noOfStops;
        if (checked) {
            noOfStop.push(value);
        } else {
            const index = noOfStop.indexOf(value);
            noOfStop.splice(index, 1);
        }
        this.setState({ noOfStops: noOfStop }, () => { this.handleFilterResults(); });
    }

    _handleReturnAirports(e){
        const { value, checked } = e.currentTarget;
        const destinationAirport = this.state.destinationAirports;
        if (checked) {
            destinationAirport.push(value);
        } else {
            const index = destinationAirport.indexOf(value);
            destinationAirport.splice(index, 1);
        }
        this.setState({ destinationAirports: destinationAirport }, () => { this.handleFilterResults(); });
    }

    _handleDepartureAirports(e){
        const { value, checked } = e.currentTarget;
        const originAirport = this.state.originAirports;
        if (checked) {
            originAirport.push(value);
        } else {
            const index = originAirport.indexOf(value);
            originAirport.splice(index, 1);
        }
        this.setState({ originAirports: originAirport }, () => { this.handleFilterResults(); });
    }

    _handleCarriers(e){
        const { value, checked } = e.currentTarget;
        const carrier = this.state.carriers;
        if (checked) {
            carrier.push(value);
        } else {
            const index = carrier.indexOf(value);
            carrier.splice(index, 1);
        }
        this.setState({ carriers: carrier }, () => { this.handleFilterResults(); });
    }

    _handleDepartureTime(e)
    {

        const { value, checked } = e.currentTarget;
        const departureTime = this.state.departureTimes;
        if (checked) {
            departureTime.push(value);
        } else {
            const index = departureTime.indexOf(value);
            departureTime.splice(index, 1);
        }
        this.setState({ departureTimes: departureTime }, () => { this.handleFilterResults(); });
    }

    _handleArrivalTime(e)
    {
        const { value, checked } = e.currentTarget;
        const arrivalTime = this.state.arrivalTimes;
        if (checked) {
            arrivalTime.push(value);
        } else {
            const index = arrivalTime.indexOf(value);
            arrivalTime.splice(index, 1);
        }
        this.setState({ arrivalTimes: arrivalTime }, () => { this.handleFilterResults(); });
    }

    render() {

        var filters = this.props.filters;
        var airports = this.props.airports;
        var carriers = this.props.carriers;
        var departureArrivalTime = this.props.departureArrivalTime;


        return (


                    <div className="col-12 col-xl-3 ">


                            {
                                (this.props.rowsLength!=0) ?
                                (
                                    <section id="resultsFiltersElement" className=" results-filters results-filters-out">
                                    <h3 className="modal-header justify-content-start align-items-center" >
                                        <svg className="icon user d-none d-md-inline mr-2 " width="100%" height="100%" role="img" title="">
                                            <use xlinkHref="/img/icons/icon-defs.svg#icon-filter-bar" />
                                        </svg>
                                        Filter Your Results
                                        <button id="filter-drop" type="button" className="close d-xl-none" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">×</span>
                                        </button>
                                    </h3>
                                    <div className="content">

                                        {
                                        (filters!='') ?
                                        <div className="filter-container">
                                            <div  className="filter-title  ">
                                                {Lang.trans('dynamic.number_of_stops')}
                                            </div>
                                            <div className="filter-content  p-2">
                                                {

                                                    Object.keys(filters.stops).map((stop, keystop) => {
                                                        return (
                                                            <div key={`stop-${keystop}`}>
                                                                <div className="styled-checkbox ellipsis  col-7 p-0">
                                                                    <input type="checkbox" id={`stops-${stop}`} className="filternoofstops" value={stop} onChange={this._handleNoOfStop} />
                                                                    <label htmlFor={`stops-${stop}`}>
                                                                        <span>{stop} {Lang.trans('flights.stops')}</span>
                                                                    </label>
                                                                </div>
                                                                <div className="d-inline-block float-right col-5 p-0 text-right">from: ${filters.stops[stop]}</div>
                                                            </div>
                                                        );
                                                    })
                                                }
                                            </div>
                                        </div> : ''
                                        }

                                        {
                                        (filters!='') ?
                                        <div className="filter-container">
                                            <div  className="filter-title  ">
                                                Airports
                                            </div>

                                            <div className="filter-content  p-2">
                                                {
                                                    (typeof filters.originDestination!='undefined' && filters.originDestination!='') ?
                                                    <div>
                                                        <span className="font-weight-bold text-muted mb-2 mb-2 d-inline-block">Departure</span>
                                                        {
                                                            Object.keys(filters.originDestination).map((val, key) => {
                                                                return (
                                                                    <div key={`origin-${key}`}>
                                                                        <div className="styled-checkbox ellipsis  col-7 p-0">
                                                                            <input type="checkbox" id={`origin-${val}`} className="filterorigins" onChange={this._handleDepartureAirports} value={val} />
                                                                            <label htmlFor={`origin-${val}`}>
                                                                                <span>{val} - {airports[val].name}</span>
                                                                            </label>
                                                                        </div>
                                                                        <div className="d-inline-block float-right col-5 p-0 text-right">from: ${filters.originDestination[val]}</div>
                                                                    </div>
                                                                );
                                                            })
                                                        }
                                                    </div>
                                                    : ''
                                                }

                                                {
                                                    (typeof filters.destinationOrigin!='undefined' && filters.destinationOrigin!='') ?
                                                    <div>
                                                        <span className="font-weight-bold text-muted mb-2 mb-2 d-inline-block">Return</span>
                                                        {
                                                            Object.keys(filters.destinationOrigin).map((val, key) => {
                                                                return (
                                                                    <div key={`destination-${key}`}>
                                                                        <div className="styled-checkbox ellipsis  col-7 p-0">
                                                                            <input type="checkbox" id={`destination-${val}`} className="filterdestinations" onChange={this._handleReturnAirports} value={val} />
                                                                            <label htmlFor={`destination-${val}`}>
                                                                                <span>{val} - {airports[val].name}</span>
                                                                            </label>
                                                                        </div>
                                                                        <div className="d-inline-block float-right col-5 p-0 text-right">from: ${filters.destinationOrigin[val]}</div>
                                                                    </div>
                                                                );
                                                            })
                                                        }
                                                    </div>
                                                    : ''
                                                }

                                            </div>
                                        </div> : ''
                                        }

                                        {
                                        (filters!='') ?
                                        <div className="filter-container">
                                            <div  className="filter-title  ">
                                                Price Range
                                            </div>
                                            <div className="filter-content slider-range p-2">
                                                {
                                                    <LabeledSlider onValuesUpdated={this._updatePriceRange} min={filters.price.minPrice} max={filters.price.maxPrice} values={[filters.price.minPrice, filters.price.maxPrice]} />
                                                }
                                            </div>
                                        </div> : ''
                                        }

                                        {
                                        (filters!='') ?
                                        <div className="filter-container">
                                            <div  className="filter-title  ">
                                                Depart Time
                                            </div>

                                            <div className="filter-content  p-2">
                                                {
                                                    Object.keys(departureArrivalTime).map((val, key) => {
                                                            return (
                                                                <div key={`deparrtime-${key}`}>
                                                                    <div className="styled-checkbox ellipsis  col-12 p-0">
                                                                        <input type="checkbox" id={`deptime-${key}`} value={`${departureArrivalTime[val].datetimefrom}-${departureArrivalTime[val].datetimeto}`} onChange={this._handleDepartureTime} />
                                                                        <label htmlFor={`deptime-${key}`}>
                                                                            <span>{departureArrivalTime[val].text}</span><small className="d-block"><strong>({departureArrivalTime[val].timeText})</strong></small>
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            );
                                                    })
                                                }
                                            </div>
                                        </div> : ''
                                        }


                                        {
                                        (filters!='') ?
                                        <div className="filter-container">
                                            <div  className="filter-title  ">
                                                Arrival Time
                                            </div>
                                            <div className="filter-content  p-2">
                                                {
                                                    Object.keys(departureArrivalTime).map((val, key) => {
                                                            return (
                                                                <div key={`deparrtime-${key}`}>
                                                                    <div className="styled-checkbox ellipsis  col-12 p-0">
                                                                        <input type="checkbox" id={`arrtime-${key}`} value={`${departureArrivalTime[val].datetimefrom}-${departureArrivalTime[val].datetimeto}`} onChange={this._handleArrivalTime} />
                                                                        <label htmlFor={`arrtime-${key}`}>
                                                                            <span>{departureArrivalTime[val].text}</span><small className="d-block"><strong>({departureArrivalTime[val].timeText})</strong></small>
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            );
                                                    })
                                                }
                                            </div>
                                        </div> : ''
                                        }

                                        {
                                        (filters!='') ?
                                        <div className="filter-container">
                                            <div  className="filter-title  ">
                                                Travel Time
                                            </div>
                                            <div className="filter-content slider-range  p-2">
                                                {
                                                    <LabeledSlider onValuesUpdated={this._updateDurationRange}
                                                    min={filters.duration.minDuration}
                                                    max={filters.duration.maxDuration}
                                                    formatValue={(value) => {
                                                      return `${this.getDuration(value)}`;
                                                    }}
                                                    values={[filters.duration.minDuration, filters.duration.maxDuration]} />
                                                }
                                            </div>
                                        </div> : ''
                                        }


                                        {
                                        (filters!='') ?
                                        <div className="filter-container">
                                            <div  className="filter-title  ">
                                                Airlines
                                            </div>
                                            <div className="filter-content  p-2">

                                                {
                                                    Object.keys(filters.carriers).map((val, key) => {
                                                        return (
                                                            <div key={`carrier-${key}`}>
                                                                <div className="styled-checkbox ellipsis  col-7 p-0">
                                                                    <input type="checkbox" id={`carrierfilter-${val}`} onChange={this._handleCarriers} value={val} />
                                                                    <label htmlFor={`carrierfilter-${val}`}>
                                                                        <span>{ typeof carriers[val] != 'undefined' ?  carriers[val].name : '' }</span>
                                                                    </label>
                                                                </div>
                                                                <div className="d-inline-block float-right col-5 p-0 text-right">from: ${filters.carriers[val]}</div>
                                                            </div>
                                                        );
                                                    })
                                                }

                                            </div>
                                        </div> : ''
                                        }

                                    </div>
                                    </section>
                                )
                                :
                                ''
                            }


                    </div>


        );
    }
}

export default SearchFilter;
