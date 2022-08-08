import React, { Component } from 'react';
import SearchResultItemSection from 'components/flights/search/SearchResultItemSection';

class SearchResultSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            flightDetailInfo: null,
        };

        //this.UIModals = new Modal();
        //this.showFlightModalDetail = this.showFlightModalDetail.bind(this);
        //this.requestMoreOptions = this.requestMoreOptions.bind(this);
    }

    render(){
        const { parsedList, preferedClass, pagination, loadMoreResultStatus } = this.props;
        //const { preferedClass } = this.props;
        //const { pagination } = this.props;

        const resultsID = (typeof parsedList != "undefined" && Object.prototype.hasOwnProperty.call(parsedList, 'resultsID')) ? parsedList.resultsID : '';
        const rows = (typeof parsedList != "undefined" && Object.prototype.hasOwnProperty.call(parsedList, 'rows')) ? parsedList.rows : [];
        const extras = (typeof parsedList != "undefined" && Object.prototype.hasOwnProperty.call(parsedList, 'extras')) ? parsedList.extras : [];
        const hideClass = (typeof parsedList != "undefined" && typeof pagination != "undefined" && pagination!=null && parsedList!=null && (pagination.currentPage + 1) <= pagination.totalPage) ? "" : "hide";

        return(
            <div className="col-12 col-xl-9">
                <button id="filter-toggle" className="p-0 text-center text-md-left btn-filter-results mb-md-3 d-xl-none">
                    <svg className="icon d-md-inline mr-md-3 " width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                        <use xlinkHref="/img/icons/icon-defs.svg#icon-filter-bar" />
                    </svg>
                    <span className="d-none d-md-inline filter-text">Filter your results</span>
                </button>
                { rows && rows.length > 0 && rows.map((list, key) => (
                    <SearchResultItemSection onFilterChange={this.props.onFilterChange} loopkey={key} filterValues={this.props.filterValues} list={list} key={key} extras={extras} preferedClass={preferedClass} resultsID={resultsID} />
                ))}

                <button className={`${hideClass} load-more-results btn btn-light border mt-3 mx-auto`} onClick={e=> this.props.loadMore()}>Load More Results
                    {
                        loadMoreResultStatus ? (<svg className="icon ani-pulse ml-1" role="" title="" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                            <use xlinkHref="/img/icons/icon-defs.svg#icon-spinner" />
                        </svg>) : ''
                    }

                </button>

            </div>
        )
    }

}

export default SearchResultSection;
