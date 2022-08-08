import React, { createRef } from 'react';
import PropType from 'prop-types';
import FilterHOC from 'components/widgets/filterHOC';
import formSerialize from 'helpers/formSerialize';
/*
    pass option.text2 for under label position
    pass option.text3 for far right position
*/
const CheckboxFilter = (props) => {
    const {
        filterKeyPrefix,
        options,
        code,
        isMulti,
        onChange,
        values,
        cols,
    } = props;
    const listRef = createRef();

    const filterChange = () => {
        const results = {};
        results[code] = [];
        Object.assign(results, formSerialize(listRef.current));
        onChange(results);
    };

    return (
        <div ref={listRef}>

            {options.map((option) => (
                <div className="d-flex align-items-center mb-2" key={`${filterKeyPrefix}-${code}-${option.value}`}>
                    <div className={`styled-checkbox ellipsis theme-3 py-1 p-0 ${option.text3 !== undefined ? 'col-7' : 'col-12'}`}>
                        <input
                            type={isMulti ? 'checkbox' : 'radio'}
                            id={`${filterKeyPrefix}-${code}-${option.value}`}
                            name={`[${code}]`}
                            value={option.value}
                            checked={values.find((value) => value === option.value) !== undefined}
                            onChange={filterChange}
                        />
                        <label htmlFor={`${filterKeyPrefix}-${code}-${option.value}`}>
                            <span>{option.text1}</span>
                            {option.text2 !== undefined && <small className="d-block"><strong>{option.text2}</strong></small>}
                        </label>
                    </div>
                    {option.text3 !== undefined && <div className="d-inline-block col-5 p-0 text-right">{option.text3}</div>}
                </div>
            ))}
        </div>
    );
};

CheckboxFilter.propTypes = {
    options: PropType.instanceOf(Array).isRequired,
    code: PropType.string.isRequired,
    isMulti: PropType.bool.isRequired,
    onChange: PropType.func.isRequired,
    values: PropType.instanceOf(Array).isRequired,
};

export default FilterHOC(CheckboxFilter);
