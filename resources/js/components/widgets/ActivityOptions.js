import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Lang, { priceFormat } from 'libraries/common/Lang';
import ReactPaginate from 'react-paginate';
import ActivityOptionItem from './activityOptionItem';


const ActivityOptions = (props) => {
    const {
        options,
        addOpt,
        totalResults,
        paginate,
        removeOpt,
        filterActivity,
        selectOpts,
        sid,
    } = props;

    const numPerPage = 4;
    const pageRangeDisplayed = 10;
    const [category, setCategory] = useState();

    const handlePageClick = (data) => {
        const { selected } = data;
        paginate(selected, 'activity');
    };

    const filter = ( e ) => {
        const select = e.target.value;
        setCategory(select);
        const filterCategory = [];
        if(select){
            filterCategory.push(select);
        }
        filterActivity({ category: filterCategory }, 'activity');
    };


    const extraContent = (
            <div className="row align-items-center justify-content-end px-3 mb-2">
                <div className="col-6 pl-0 pr-1 mt-md-1 mt-3 ">
                    <div className="row gutter-10 justify-content-end">
                        <label htmlFor="sort_results" className="col-3 mb-0 text-right align-self-center">
                            Filter By:
                        </label>
                        <div className="element-container col-8 px-0 input-chevron-down">
                            <select
                                id="filter_results"
                                className="form-control select-component h-100"
                                onChange={filter}
                                value={category}
                            >
                                <option value="">All</option>
                                <option value="1">City tours</option>
                                <option value="2">Amusement Parks</option>
                                <option value="3">Tickets & Attraction Passes</option>
                                <option value="4">Art & culture</option>
                                <option value="5">Shows, sports and special events</option>
                                <option value="6">Gastronomy & nightlife</option>
                                <option value="7">Outdoor activities & Adventure</option>
                                <option value="8">Day Trips & Excursions</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        );

    return (
        <section id="activity-options-list" className="rounded-sm p-3 mb-3 box-shadow bg-white">
            <h5 className="mt-2 primary-color">Unlock your trip savings</h5>
            {extraContent}
            {options.map(item => (<ActivityOptionItem selectOpts={selectOpts} key={`activity-${item.rowId}`} sid={sid} item={item} addOpt={addOpt} removeOpt={removeOpt} />))}
            {options.length > 0 && (<div>
                <ReactPaginate
                    previousLabel="Prev"
                    nextLabel="Next"
                    breakLabel="..."
                    breakClassName="break-me"
                    pageCount={Math.ceil(totalResults / numPerPage)}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={pageRangeDisplayed}
                    onPageChange={handlePageClick}
                    containerClassName="pagination"
                    activeClassName="active"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    nextClassName="page-item"
                    previousLinkClassName="page-link"
                    nextLinkClassName="page-link"
                />
            </div>)}
        </section>
    );
};

ActivityOptions.propTypes = {
    options: PropTypes.instanceOf(Object).isRequired,
    addOpt: PropTypes.func.isRequired,
    removeOpt: PropTypes.func.isRequired,
    paginate: PropTypes.func.isRequired,
    sid: PropTypes.string.isRequired,
    totalResults: PropTypes.number.isRequired,
    selectOpts: PropTypes.instanceOf(Array).isRequired,
    filterActivity: PropTypes.func.isRequired,
};

export default ActivityOptions;
