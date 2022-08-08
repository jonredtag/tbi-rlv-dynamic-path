import React, { useState, createRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import ToggleButtonFilter from 'components/widgets/toggleButtonFilter';
import ButtonRowFilter from 'components/widgets/buttonRowFilter';
import InputFilter from 'components/widgets/inputFilter';
import SliderFilter from 'components/widgets/sliderFilter';
import CheckboxFilter from 'components/widgets/checkboxFilter';
import Lang from 'libraries/common/Lang';

let resizeTimer = null;
let isOpen = false;
const Filters = (props) => {
    // const [isOpen, setOpen] = useState(false);
    const {
        filters,
        filterValues,
        onChange,
        numberRecords,
        specialtyField,
        toggleMapButtonMobile,
    } = props;

    const filtersComponent = createRef();
    const [tempFilter, setTempFilter] = useState(filterValues);
    const [tempCloseFilter, setTempCloseFilter] = useState(filterValues);

    // useEffect(() => {
    //     if (Object.keys(tempFilter).length === 0) {
    //         const newtmpFilterval = Object.assign(tempFilter, filterValues);
    //         setTempFilter({ ...newtmpFilterval });
    //     }
    // }, [tempFilter]);

    const resize = () => {
        if (resizeTimer !== null) clearTimeout(resizeTimer);
        console.log(isOpen);
        resizeTimer = setTimeout(() => {
            isOpen = ((isOpen && window.innerWidth < 1200));
        }, 250);
    };

    useEffect(() => {
        window.addEventListener('resize', resize);
    }, []);

    const filterChange = (value) => {
        if (isOpen) {
            let newtmpFilterval = {};
            if (Object.keys(tempFilter).length === 0) {
                newtmpFilterval = Object.assign(tempFilter, filterValues, value);
            } else {
                newtmpFilterval = Object.assign(tempFilter, value);
            }
            setTempFilter({ ...newtmpFilterval });
        } else {
            const newFilters = Object.assign({}, filterValues, value);
            onChange(newFilters);
        }
    };

    const resetFilters = (code = 'reset') => {
        let resetObject = {};

        if (code === 'reset') {
            filters.forEach((filter) => {
                const filtercode = filter.code;
                if (filtercode === 'price') {
                    const PriceMinval = filter.options.min;
                    const PriceMaxval = filter.options.max;
                    const Pricearray = [PriceMinval, PriceMaxval];
                    resetObject.price = Pricearray;
                }
            });
            // resetObject.price= filterValues.price;
        } else {
            resetObject = filterValues;
            resetObject[code] = [];
        }

        if (isOpen && window.innerWidth < 1200) {
            setTempFilter(resetObject);
        } else {
            onChange(resetObject);
        }
    };

    const toggleFilters = () => {
        setTempFilter({ ...tempCloseFilter });
        if (isOpen) {
            document.body.classList.remove('overflow-hidden-lg-down');
        } else {
            document.body.classList.add('overflow-hidden-lg-down');
        }
        isOpen = (!isOpen);
    };

    const filterCloseChange = (value) => {
        const newFilters = Object.assign({}, value);
        onChange(newFilters);
    };

    const mobileFilter = (action) => {
        if (isOpen) {
            document.body.classList.remove('overflow-hidden-lg-down');
        } else {
            document.body.classList.add('overflow-hidden-lg-down');
        }
        isOpen = (!isOpen);

        if (action === 'donebtn') {
            setTempCloseFilter({ ...tempFilter });
            filterCloseChange(tempFilter);
        }
    };

    const filterKeyPrefix = 'main'; // Have a prefix to identify each filter to avoid id confliction in the same page

    return (
        <div ref={filtersComponent} className="col-12 col-xl-3">
            <div className="d-none d-lg-flex flex-xl-column ">
                {specialtyField}
                <div className={`results-filters-backdrop ${isOpen ? 'is-visible' : 'not-visible'} d-xl-none`} />
                <h1 className="d-none d-xl-block h6 search-results-found">
                    <strong>{numberRecords} {Lang.trans('common.results')} </strong>
                    {Lang.trans('common.found')}!
                </h1>
                <button type="button" className="p-0 text-center text-md-left btn-filter-results mb-md-3 d-xl-none" onClick={toggleFilters}>
                    <svg className="icon d-md-inline mr-md-3 " width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                        <use xlinkHref="/img/icons/icon-defs.svg#icon-filter-bar" />
                    </svg>
                    <span className="d-none d-md-inline filter-text">{Lang.trans('common.filter_your_results')}</span>
                </button>
            </div>
            <div className="d-flex btn-filter-map-container p-2 p-lg-0 rounded-sm d-lg-none">
                <button type="button" className="p-0 text-center text-md-left btn-filter-results mb-lg-3 d-xl-none" onClick={toggleFilters}>
                    <svg className="icon d-lg-inline mr-lg-3" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                        <use xlinkHref="/img/icons/icon-defs.svg#icon-filters" />
                    </svg>
                    <span className="d-none d-lg-inline filter-text">{Lang.trans('common.filter_your_results')}</span>
                    <span className="d-lg-none filter-text">Fillters</span>
                </button>
                <span className="mx-2 border-left" />
                <button
                    onClick={() => toggleMapButtonMobile()}
                    type="button"
                    className="btn-map-view mt-md-0 mr-lg-2 text-left text-xl-center mr-xl-0 mb-lg-3"
                >
                    <img
                        className="w-100 map-image rounded-top d-none d-xl-block"
                        src="https://travel-img.s3.amazonaws.com/2019-10-23--15718614125067map-image.gif"
                        alt="show map"
                    />
                    <div className="btn-map-view-footer p-xl-2 ">
                        <svg
                            className="icon mr-1 mr-lg-3 d-xl-none"
                            role="button"
                            title=""
                            width="100%"
                            height="100%"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                        >
                            <use xlinkHref="/img/icons/icon-defs.svg#icon-map" />
                        </svg>
                        <span className="btn-text d-none d-lg-inline">
                            {Lang.trans('dynamic.click_to_see_map')}
                        </span>
                        <span className="btn-text d-lg-none">
                            View Map
                        </span>
                    </div>
                </button>
            </div>
            <section id="mobileresultsfilter" className={`results-filters  bg-white box-shadow ${isOpen ? 'results-filters-in' : 'results-filters-out'}`}>
                <h6 className="modal-header justify-content-between align-items-center mx-3 px-0">
                    <button type="button" className="d-lg-none btn-unstyled" onClick={() => resetFilters('reset')}>Clear All</button>
                    <div className="d-flex align-items-center">
                        <svg className="icon user d-none d-md-inline mr-2 filter-bar" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                            <use xlinkHref="/img/icons/icon-defs.svg#icon-filter-bar" />
                        </svg>
                        <svg className="icon user d-md-none mr-2 filter-bar" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                            <use xlinkHref="/img/icons/icon-defs.svg#icon-filters" />
                        </svg>
                        <span className="d-none d-lg-inline">{Lang.trans('common.filter_your_results')}</span>
                        <span className="d-lg-none">Fillters</span>
                    </div>
                    <button type="button" className="d-none d-lg-none btn-unstyled font-size-sm text-muted text-underline d-xl-block" onClick={() => resetFilters('reset')}>Reset</button>
                    <button type="button" className="close d-xl-none p-0 m-0 text-primary" data-dismiss="modal" aria-label="Close" onClick={toggleFilters}><span aria-hidden="true">×</span></button>
                </h6>
                <div className="content">
                    {filters.map((filter) => {
                        const { type, ...filterProps } = filter;
                        let filterElement = null;
                        if (filter.hidden !== undefined && filter.hidden === true) {
                            return filterElement;
                        }
                        let mainTempFilter = {};
                        if (isOpen) {
                            mainTempFilter = tempFilter[filter.code];
                        } else {
                            mainTempFilter = filterValues[filter.code];
                        }

                        if (type === 'toggle') {
                            filterElement = (<ToggleButtonFilter filterKeyPrefix={filterKeyPrefix} key={`filter-${filterKeyPrefix}-${filter.code}`} {...filterProps} values={mainTempFilter || []} onChange={filterChange} resetFilters={resetFilters}  />);
                        } else if (type === 'buttonRow') {
                            filterElement = (<ButtonRowFilter filterKeyPrefix={filterKeyPrefix} key={`filter-${filterKeyPrefix}-${filter.code}`} {...filterProps} values={mainTempFilter || []} onChange={filterChange} />);
                        } else if (type === 'input') {
                            filterElement = (<InputFilter filterKeyPrefix={filterKeyPrefix} key={`filter-${filterKeyPrefix}-${filter.code}`} {...filterProps} values={mainTempFilter || ''} onChange={filterChange} />);
                        } else if (type === 'slider') {
                            filterElement = (<SliderFilter filterKeyPrefix={filterKeyPrefix} key={`filter-${filterKeyPrefix}-${filter.code}`} {...filterProps} values={mainTempFilter || []} onChange={filterChange} />);
                        } else if (type === 'checkbox') {
                            filterElement = (<CheckboxFilter filterKeyPrefix={filterKeyPrefix} key={`filter-${filterKeyPrefix}-${filter.code}`} {...filterProps} values={mainTempFilter || []} onChange={filterChange} />);
                        } else {
                            filterElement = (<div filterKeyPrefix={filterKeyPrefix} key={`filter-${filterKeyPrefix}-${filter.code}`}>Error</div>);
                        }

                        return filterElement;
                    })}
                    <button type="button" className="btn btn-primary col-12 d-xl-none ml-0 py-2" data-dismiss="modal" aria-label="Close" onClick={() => { mobileFilter('donebtn') }}><span aria-hidden="true">Done</span></button>
                </div>
            </section>
        </div>
    );
};

Filters.propTypes = {
    filters: PropTypes.instanceOf(Array).isRequired,
    filterValues: PropTypes.instanceOf(Object).isRequired,
    onChange: PropTypes.func.isRequired,
    numberRecords: PropTypes.number.isRequired,
    specialtyField: PropTypes.element,
    toggleMapButtonMobile: PropTypes.func,
};

Filters.defaultProps = {
    specialtyField: null,
    toggleMapButtonMobile: () => {},
};

export default Filters;
