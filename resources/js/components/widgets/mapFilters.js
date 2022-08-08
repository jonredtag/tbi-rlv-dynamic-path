import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ToggleButtonFilter from 'components/widgets/toggleButtonFilter';
import ButtonRowFilter from 'components/widgets/buttonRowFilter';
import InputFilter from 'components/widgets/inputFilter';
import SliderFilter from 'components/widgets/sliderFilter';
import CheckboxFilter from 'components/widgets/checkboxFilter';

const MapFilters = (props) => {
    const { filters, filterValues, onChange, filterKeyPrefix } = props;
    const filterChange = (value) => {
        const newFilters = Object.assign({}, filterValues, value);
        onChange(newFilters);
    };

    return (
        <div className="results-filters results-filters-static">
            <div className="content">
                {filters.map((filter) => {
                    const { type, ...filterProps } = filter;
                    let filterElement = null;
                    if (filter.hidden !== undefined && filter.hidden === true) {
                        return filterElement;
                    }
                    if (type === 'toggle') {
                        filterElement = (
                            <ToggleButtonFilter
                                filterKeyPrefix={filterKeyPrefix}
                                key={`filter-${filterKeyPrefix}-${filter.code}`}
                                {...filterProps}
                                values={filterValues[filter.code] || []}
                                onChange={filterChange}
                            />
                        );
                    } else if (type === 'buttonRow') {
                        filterElement = (
                            <ButtonRowFilter
                                filterKeyPrefix={filterKeyPrefix}
                                key={`filter-${filterKeyPrefix}-${filter.code}`}
                                {...filterProps}
                                values={filterValues[filter.code] || []}
                                onChange={filterChange}
                            />
                        );
                    } else if (type === 'input') {
                        filterElement = (
                            <InputFilter
                                filterKeyPrefix={filterKeyPrefix}
                                key={`filter-${filterKeyPrefix}-${filter.code}`}
                                {...filterProps}
                                values={filterValues[filter.code] || ''}
                                onChange={filterChange}
                            />
                        );
                    } else if (type === 'slider') {
                        filterElement = (
                            <SliderFilter
                                filterKeyPrefix={filterKeyPrefix}
                                key={`filter-${filterKeyPrefix}-${filter.code}`}
                                {...filterProps}
                                values={filterValues[filter.code] || []}
                                onChange={filterChange}
                            />
                        );
                    } else if (type === 'checkbox') {
                        filterElement = (
                            <CheckboxFilter
                                filterKeyPrefix={filterKeyPrefix}
                                key={`filter-${filterKeyPrefix}-${filter.code}`}
                                {...filterProps}
                                values={filterValues[filter.code] || []}
                                onChange={filterChange}
                            />
                        );
                    } else {
                        filterElement = (
                            <div filterKeyPrefix={filterKeyPrefix} key={`filter-${filterKeyPrefix}-${filter.code}`}>
                                Error
                            </div>
                        );
                    }

                    return filterElement;
                })}
            </div>
        </div>
    );
};

MapFilters.propTypes = {
    filters: PropTypes.instanceOf(Array).isRequired,
    filterValues: PropTypes.instanceOf(Object).isRequired,
    onChange: PropTypes.func.isRequired,
    filterKeyPrefix: PropTypes.string.isRequired,
};

export default MapFilters;
