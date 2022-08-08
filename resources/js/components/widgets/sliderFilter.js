import React from 'react';
import PropTypes from 'prop-types';
import Rheostat from 'rheostat';
import numberFormat from 'helpers/numberFormat';
import FilterHOC from 'components/widgets/filterHOC';

const SilderFilter = (props) => {
    const {
        onChange,
        values,
        formatValue,
        code,
        options,
    } = props;

    const sliderChange = (filterValues) => {
        const results = {};
        results[code] = filterValues.values;
        onChange(results);
    };

    return (
        <div className="slider-range p-2 pb-3">
            <div className="d-flex justify-content-between mb-3">
                {
                    values.map((value) => (
                        <div key={value}>
                            {formatValue(value)}
                            <input type="hidden" name={`[${code}]`} value={value} />
                        </div>
                    ))
                }
            </div>
            <div className="mx-2">
                <Rheostat min={options.min} max={options.max} onValuesUpdated={sliderChange} values={values} />
            </div>
        </div>
    );
};

SilderFilter.propTypes = {
    values: PropTypes.instanceOf(Array),
    formatValue: PropTypes.func,
    onChange: PropTypes.func.isRequired,
    code: PropTypes.string.isRequired,
    options: PropTypes.instanceOf(Object).isRequired,
};
SilderFilter.defaultProps = {
    values: null,
    formatValue: (value) => numberFormat({ value, decimal: 0 }),
};

export default FilterHOC(SilderFilter);
