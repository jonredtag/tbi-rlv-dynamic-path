import React, { createRef } from 'react';
import PropType from 'prop-types';
import FilterHOC from 'components/widgets/filterHOC';
import formSerialize from 'helpers/formSerialize';

const ButtonRowFilter = (props) => {
    const {
        filterKeyPrefix,
        options,
        code,
        isMulti,
        onChange,
        values,
    } = props;
    const listRef = createRef();

    const filterChange = () => {
        const results = {};
        results[code] = [];
        Object.assign(results, formSerialize(listRef.current));
        onChange(results);
    };

    return (
        <div ref={listRef} className="input-bar no-gutters styled-checkbox theme-3  text-left col-12 p-0">
            {options.map((option) => (
                <div key={`${filterKeyPrefix}-${code}-${option.value}`} className="col-12">
                    <input
                        type={isMulti ? 'checkbox' : 'radio'}
                        id={`${filterKeyPrefix}-${code}-${option.value}`}
                        name={`[${code}]`}
                        value={option.value}
                        checked={values.find((value) => value === option.value) !== undefined}
                        onChange={filterChange}
                    />
                    <label htmlFor={`${filterKeyPrefix}-${code}-${option.value}`} className="col py-2">
                        <div className="ellipsis">{option.text}</div>
                    </label>
                </div>
            ))}
        </div>
    );
};

ButtonRowFilter.propTypes = {
    options: PropType.instanceOf(Array).isRequired,
    code: PropType.string.isRequired,
    isMulti: PropType.bool.isRequired,
    onChange: PropType.func.isRequired,
    values: PropType.instanceOf(Array).isRequired,
};

export default FilterHOC(ButtonRowFilter);
