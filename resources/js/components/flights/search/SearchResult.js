import React, { Component } from 'react';
import { render } from 'react-dom';
import SearchEngine from 'engines/components/FlightSmallEngine';
import Modal from 'libraries/common/Modal';
import ModalError from 'components/common/ModalError';
import ModalLoader from 'components/common/ModalLoader';
import SearchFilter from 'components/flights/search/SearchFilter';
import PriceMatrix from 'components/flights/search/PriceMatrix';
import SearchResultSection from 'components/flights/search/SearchResultSection';
import FlightsLib from 'libraries/flights/FlightsLib';
import Loader from 'components/common/Loader';
import SearchDump from 'components/flights/search/SearchDump';
import SearchDumpFilter from 'components/flights/search/SearchDumpFilter';
import SearchDumpPriceMatrix from 'components/flights/search/SearchDumpPriceMatrix';
import ToggleFilter from 'components/common/search/ToggleFilter';


class SearchResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchEnv: {
                baseUrl: props.baseUrl,
                id: props.searchData.uid,
            },
            searchParams: props.searchData,
            preferedClass: props.preferedClass,
            departureArrivalTime: props.departureArrivalTime,
            loader : true,
            loadMoreResultStatus : false,
            receiveFirstResultSet : false,
            filterValues: {
                minDuration:null,
                maxDuration:null,
                minPrice:null,
                maxPrice:null,
                noOfStops:[],
                destinationAirports:[],
                originAirports:[],
                departureTimes:[],
                arrivalTimes:[],
                carriers:[],
                setFilter:false,
                outboundSegmentKey:null,
                inboundSegmentKey:null,
            },
            totalResults: 0,
            pagination: {
                currentPage : 1
            },
            parsedList: [],
            priceMatrix: null,
            errorModalInfo: { show: false, error: null },
        };
        this.UIModals = new Modal();
        this.getNextPageResult = this.getNextPageResult.bind(this);
        this.onFilterChange = this.onFilterChange.bind(this);
        //this.onPriceMatrixChange = this.onPriceMatrixChange.bind(this);
        this.toggleErrorModal = this.toggleErrorModal.bind(this);
       // this.getInitialResult = this.getInitialResult.bind(this);
        //this.handleSubErrorModal = this.handleSubErrorModal.bind(this);
    }

    componentDidMount(prevProps, prevState, prevContext) {
        if(typeof this.state.searchParams.error == 'undefined')
        {
            this.setState({ loader : true });
            var sessionStart = this.state.searchParams['sessionStart'];
            var sessionEnd = sessionStart + 3300; // (60 * 60)  60m
            var ts = Math.floor(Date.now() / 1000);
            var timeout = sessionEnd - ts;
            timeout *= 1000; // convert s to ms
            setTimeout(function() {
                this.UIModals = new Modal();
                new Modal().show('#mdl-session-timeout');
            }, timeout);
            this.getInitialResult();
        }
        else
        {
            this.setState({loader : false, errorModalInfo : { show: true, error: this.state.searchParams.error }});
        }
    }

    getNextPageResult() {
        this.setState({ loadMoreResultStatus : true });
        const nextPage = Number.parseInt(this.state.pagination.currentPage) + 1;

        const flightsSearch = new FlightsLib(this.state.searchEnv);
        var resultsID = (typeof this.state.parsedList.resultsID != 'undefined') ? this.state.parsedList.resultsID : '';
        var paginationParam = {'nextPage' : nextPage, 'resultsID' : resultsID, 'filterValues' : this.state.filterValues };
        const result = flightsSearch.getResults('pagination', paginationParam, '');
        result.then((data) => {
            // need more error process here
            const parsedListRows = this.state.parsedList.rows.concat(data.parsedList.rows);
            data.parsedList.rows = parsedListRows;
            this.setState({ parsedList : data.parsedList, loadMoreResultStatus : false, pagination: data.pagination });
        }).catch((error) => {
            if(error.code == 1) { //session Expired
                this.UIModals.show('#mdl-session-timeout');
            } else {
                this.setState({ errorModalInfo: { show: true, error: error } });
            }
        });
    }

    toggleErrorModal() {
        const { errorModalInfo } = this.state;
        errorModalInfo.show = !errorModalInfo.show;
        this.setState({ errorModalInfo });
    }

    componentWillUnmount() {
        this.isCancelled = true;
    }

    onFilterChange(filterInfo) {
        filterInfo.setFilter = true;
        this.setState({ filterValues: filterInfo }, () => {
            this.getFilterResult();
        });
    }

    getFilterResult(){

        var paginationParam = this.state.pagination;
        paginationParam.currentPage = 1;
        this.setState({ pagination: paginationParam });
        const flightsSearch = new FlightsLib(this.state.searchEnv);
        var resultsID = (typeof this.state.parsedList.resultsID != 'undefined') ? this.state.parsedList.resultsID : '';
        var filterParam = {'resultsID' : resultsID, 'filterValues' : this.state.filterValues };
        const result = flightsSearch.getResults('getFilterResults', filterParam, '');
        result.then((data) => {
            this.setState({ parsedList : data.parsedList, pagination: data.pagination });
        }).catch((error) => {
            if(error.code == 1) { //session Expired
                this.UIModals.show('#modal-session-timeout');
            } else {
                this.setState({ errorModalInfo: { show: true, error: error } });
            }
        });

    }

    getInitialResult() {

        const flightsSearch = new FlightsLib(this.state.searchEnv);

        let promises=[];
        promises['Sabre'] = flightsSearch.getResults('getsearchresult', this.state.searchParams, 'Sabre');
        promises['AIRCANADA'] = flightsSearch.getResults('getsearchresult', this.state.searchParams, 'AIRCANADA');
        promises['Ita'] = flightsSearch.getResults('getsearchresult', this.state.searchParams, 'ITA');
        promises['Intair'] = flightsSearch.getResults('getsearchresult', this.state.searchParams, 'Intair');
        promises['Softvoyage'] = flightsSearch.getResults('getsearchresult', this.state.searchParams, 'Softvoyage');

        promises['Sabre'].then((data) => {
            !this.isCancelled && this.setState({
                parsedList: data.parsedList,
                pagination: data.pagination,
                priceMatrix:data.matrix,
                receiveFirstResultSet:true
            });
        }).catch((error) => {

        });
        promises['AIRCANADA'].then((data) => {
            !this.isCancelled && this.setState({
                parsedList: data.parsedList,
                pagination: data.pagination,
                priceMatrix:data.matrix,
                receiveFirstResultSet:true
            });

        }).catch((error) => {

        });
        promises['Ita'].then((data) => {
            !this.isCancelled && this.setState({
                parsedList: data.parsedList,
                pagination: data.pagination,
                priceMatrix:data.matrix,
                receiveFirstResultSet:true
            });

        }).catch((error) => {

        });
        promises['Intair'].then((data) => {
            !this.isCancelled && this.setState({
                parsedList: data.parsedList,
                pagination: data.pagination,
                priceMatrix:data.matrix,
                receiveFirstResultSet:true
            });

        }).catch((error) => {

        });
        promises['Softvoyage'].then((data) => {
           !this.isCancelled && this.setState({
                parsedList: data.parsedList,
                pagination: data.pagination,
                priceMatrix:data.matrix,
                receiveFirstResultSet:true
            });
        }).catch((error) => {

        });


        Promise.all([promises['AIRCANADA'] ,promises['Sabre'], promises['Softvoyage'], promises['Ita'], promises['Intair']])
         .then((results) => {
                const filterValues = this.state.filterValues;

                console.log(this.state.parsedList);


                if(typeof this.state.parsedList.extras != 'undefined' && this.state.parsedList.extras.filters!=null)
                {
                    filterValues.minPrice = this.state.parsedList.extras.filters.price.minPrice;
                    filterValues.maxPrice = this.state.parsedList.extras.filters.price.maxPrice;
                    filterValues.minDuration = this.state.parsedList.extras.filters.duration.minDuration;
                    filterValues.maxDuration = this.state.parsedList.extras.filters.duration.maxDuration;
                }

                this.setState({
                    loader : false,
                    filterValues : filterValues,
                });

                if(typeof this.state.parsedList.rows != "undefined")
                {
                    const toggle = new ToggleFilter();
                    toggle.init();
                }

        }).catch(err => {
            console.log('error occured');
            console.log(err);
            this.setState({
                    loader : false,
            });
        });

    }


    render() {
        //  var dataEngine = new PackagePageData(this.searchEnv.baseUrl, this.searchEnv.sessions);
        //  this.results =  dataEngine.results;

        const { loader, receiveFirstResultSet } = this.state;

        const filters = (this.state.parsedList.extras !== undefined) ? this.state.parsedList.extras.filters : '';
        const airports = (this.state.parsedList.extras !== undefined) ? this.state.parsedList.extras.airports : '';
        const carriers = (this.state.parsedList.extras !== undefined) ? this.state.parsedList.extras.carriers : '';
        const rows = (this.state.parsedList.rows !== undefined) ? this.state.parsedList.rows : [];

        this.UIModals.close('#mdl-loadresult');

        return (
            <div id="app">
                <section id='backend-search-widget' className="search-widget search-widget-horizontal  contract-expand-sm expand d-md-block">
                   <div className="">
                      <SearchEngine searchDefault={this.state.searchParams} />
                      <Loader key="loader" position={loader ? 0 : 100} active={loader} />
                   </div>
                </section>

                <div className="container">

                        <div>


                            {
                                this.state.priceMatrix ?
                                (
                                    <PriceMatrix carriers={carriers} onFilterChange={this.onFilterChange} filterValues={this.state.filterValues} priceMatrix={this.state.priceMatrix} searchParams={this.state.searchParams} />
                                )
                                :
                                (
                                    (rows.length==0) ?
                                    ''
                                    :
                                    (
                                        <SearchDumpPriceMatrix />
                                    )
                                )
                            }

                            <div className="row">

                                {
                                    this.state.searchParams.error ? '' : (

                                        (loader) ? 
                                        (<SearchDumpFilter />)
                                        :
                                        (<SearchFilter rowsLength={rows.length} onFilterChange={this.onFilterChange} filters={filters} airports={airports} carriers={carriers} filterValues={this.state.filterValues} departureArrivalTime={this.state.departureArrivalTime} />)
                                    )
                                }

                                {

                                    this.state.searchParams.error ? this.state.searchParams.error.message : (
                                       receiveFirstResultSet ?
                                        (
                                            (rows.length==0) ?
                                                loader ? (<SearchDump />) : 'No result found'
                                                :
                                                (

                                                    <SearchResultSection onFilterChange={this.onFilterChange} filterValues={this.state.filterValues} parsedList={this.state.parsedList} pagination={this.state.pagination} loadMoreResultStatus={this.state.loadMoreResultStatus} loadMore={this.getNextPageResult} preferedClass = {this.state.preferedClass} />)
                                        )
                                        :
                                        (<SearchDump />) 
                                    )

                                }

                            </div>
                        </div>

                </div>
                <ModalError errorModalInfo={this.state.errorModalInfo} toggleErrorModal={this.toggleErrorModal} />

            </div>

        );
    }
}

export default SearchResult;
