import React from 'react';
import PropTypes from 'prop-types';

import Collapse from 'reactstrap/lib/Collapse';
import Lang, { priceFormat } from 'libraries/common/Lang';

const ProductGrid = (props) => {
    const {
        grid,
        vendors,
        onSelect,
        filters,
        open,
        toggle,
    } = props;

    const activeClassPrimary = 'active active-primary';
    const activeClassSecondary = 'active active-secondary';

    const select = (operator, category) => {
        // run onSelect callback on parent Search Component
        onSelect(operator, category);
    };

    // clearFilters() {
    //     const { onClearAllFilters } = this.props;
    //     onClearAllFilters();
    // }

    // isActive(key, val) {
    //     const { filters } = this.props;
    //     return NotEmpty(key, filters) && filters[key].length === 1 && filters[key].indexOf(val) > -1;
    // }

    const isFiltered = (section, key = null) => {
        let filtered = false;
        if (key === null) {
            if (filters[section] !== undefined && filters[section].length > 0) {
                filtered = true;
            }
        } else {
            if (filters[section] !== undefined && filters[section].length === 1 && filters[section][0] === key) {
                filtered = true;
            }
        }

        return filtered;
    };

    const filterText = () => {

        return `${Lang.trans('carPriceGrid.displaying')} ${'category'} ${Lang.trans('carPriceGrid.car_rentals')} ${'operator'}`;
    };

    return (
        <div className="brand-price-table mb-5 d-none d-md-block">
            <div className="d-flex py-2 px-3 w-100 shadow-sm position-relative text-white justify-content-between table-header-bar rounded-top bg-secondary">
                <div className="h5">{Lang.trans('carPriceGrid.compare_prices')}</div>
                <button type="button" className={`btn-unstyled text-white show-more-btn bg-secondary ${open ? '' : 'collapsed'}`} onClick={toggle}>
                    <span className="text-closed lead">{Lang.trans('common.show_price_filter')}</span>
                    <span className="text-open lead">{Lang.trans('common.hide_price_filter')}</span>
                    <svg className="icon rotate ml-2">
                        <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="/img/icons/icon-defs.svg#icon-chevron-down" />
                    </svg>
                </button>
            </div>
            <Collapse isOpen={open}>
                <div className="table-responsive border border-secondary">
                    <table className="table mb-0">
                        <thead className="table-head">
                            <tr>
                                <th className="px-2 py-2 table-header-cell border-secondary border border-left-0 border-top-0 text-center" scope="col">{Lang.trans('carPriceGrid.best_car_rental_rates')}</th>
                                {vendors.map((operator) => (
                                    <th className="py-0 table-header-cell border-bottom-0 border-top-0" key={`grid-filter-thead-${operator}`}>
                                        <button
                                            type="button"
                                            className={`text-dark text-left btn-unstyled w-100 cell-button ${(isFiltered('operator', operator) && !isFiltered('category')) ? activeClassPrimary : ''}`}
                                            onClick={() => select(operator, null)}
                                        >
                                            <img className="d-block mx-auto rounded w-auto bg-white p-1 client-logo" src={`https://travel-img-assets.s3-us-west-2.amazonaws.com/cars/vendors/${operator.toLowerCase().replace(' ', '-')}.jpg`} alt={operator} />
                                        </button>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white table-body">
                            {Object.keys(grid).map((category) => {
                                const categoryVendors = grid[category];

                                return (
                                    <tr className={`body-row ${(isFiltered('category', category) && !isFiltered('operator')) ? activeClassSecondary : ''}`} key={`grid-filter-tbody-tr-${category}`}>
                                        <th className="table-header-cell" scope="row">
                                            <button
                                                type="button"
                                                className={`text-dark text-left btn-unstyled w-100 d-flex justify-content-between cell-button ${(isFiltered('category', category) && !isFiltered('operator')) ? activeClassPrimary : ''}`}
                                                onClick={() => select(null, category)}
                                            >
                                                <span> {category} </span>
                                                <svg className="icon icon-md mr-3 d-none">
                                                    <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="/img/icons/icon-defs.svg#icon-info-circle" />
                                                </svg>
                                            </button>
                                            <div className="popover popover-right menu-popover position-relative fade in d-none">
                                                <div className="bg-white">
                                                    <button type="button" className="close" data-toggle="popover">×</button>
                                                    <div className="row text-dark no-gutters">
                                                        <span className="d-block font-weight-bold lead">{category}</span>
                                                        <span className="d-block text-left">Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere ullam saepe error. Incidunt minus, porro.</span>
                                                        <img alt="" className="float-none" width="100" src="//www.globalmediaserver.com/images/cars/ChevroletSpark_2.jpg" />
                                                    </div>
                                                </div>
                                            </div>
                                        </th>
                                        {Object.keys(categoryVendors).map((operator) => {
                                            const record = categoryVendors[operator];
                                            const key = `grid-filter-tbody-${operator}-${category}`;
                                            if (record === null) {
                                                return (
                                                    <td className="text-center table-column" key={key}>--</td>
                                                );
                                            }
                                            return (
                                                <td key={key} className={`text-center table-column ${record.cheapest ? 'cheapest' : ''}`}>
                                                    <button
                                                        type="button"
                                                        className={`text-dark btn-unstyled w-100 cell-button ${isFiltered('category', category) && isFiltered('operator', operator) ? activeClassPrimary : ''} ${!isFiltered('category') && isFiltered('operator', operator) ? activeClassSecondary : ''}`}
                                                        onClick={() => select(operator, category)}
                                                    >
                                                        {record.rate < 0 ? '-' : '+'} {priceFormat(Math.abs(record.rate), 0)}
                                                    </button>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {/*<div className="selected-filters-section px-0 py-2 d-none d-md-block text-center px-2 my-3">
                    <div className="d-flex align-items-center justify-content-between selected-filters">
                        <div>
                            <svg className="icon mr-1 pt-1 car">
                                <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="/img/icons/icon-defs.svg#icon-car" />
                            </svg>
                            <div className="d-inline-block" dangerouslySetInnerHTML={{ __html: filterText() }}/>
                        </div>
                    </div>
                </div>*/}
            </Collapse>
        </div>
    );
};

ProductGrid.propTypes = {
    grid: PropTypes.instanceOf(Object).isRequired,
    onSelect: PropTypes.func.isRequired,
    vendors: PropTypes.instanceOf(Array).isRequired,
    filters: PropTypes.instanceOf(Object).isRequired,
    open: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
};

export default ProductGrid;
