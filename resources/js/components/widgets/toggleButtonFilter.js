import React, { createRef } from 'react';
import PropType from 'prop-types';
import FilterHOC from 'components/widgets/filterHOC';
import formSerialize from 'helpers/formSerialize';

const ToggleButtonFilter = (props) => {
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
        <ul ref={listRef} className={`${(cols !== '') ? `list-grid-${cols}` : ''} list-unstyled text-left`}>

            {options.map((option,index) => (
                <li key={`${filterKeyPrefix}-${code}-${index}`} className="d-flex align-items-center styled-checkbox text-left theme-3  col-12 p-0">
                    <input
                        type={isMulti ? 'checkbox' : 'radio'}
                        id={`${code}-${index}`}
                        name={`[${code}]`}
                        value={option.value}
                        checked={values.find((value) => value === option.value) !== undefined}
                        onChange={filterChange}
                    />
                    <label htmlFor={`${code}-${index}`} title={option.text} className="d-flex py-2 mb-0 ml-2 text-truncate">
                        <div className="ellipsis">{option.text}</div>
                    </label>
                </li>
            ))}
        </ul>
    );
};

ToggleButtonFilter.propTypes = {
    options: PropType.instanceOf(Array).isRequired,
    code: PropType.string.isRequired,
    isMulti: PropType.bool.isRequired,
    onChange: PropType.func.isRequired,
    values: PropType.instanceOf(Array).isRequired,
    cols: PropType.string,
};

ToggleButtonFilter.defaultProps = {
    cols: '',
};

export default FilterHOC(ToggleButtonFilter);
