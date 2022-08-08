import React from 'react';
import PropType from 'prop-types';
import FilterHOC from 'components/widgets/filterHOC';

const InputFilter = (props) => {
    const { code, onChange, values } = props;

    const textChange = (event) => {
        const results = {};
        results[code] = event.target.value;
        onChange(results);
    };

    return (
        <div className="input-bar row no-gutters">
            <input type="text" className="form-control" value={values} name={code} onChange={textChange} />
        </div>
    );
};

InputFilter.propTypes = {
    code: PropType.string.isRequired,
    onChange: PropType.func.isRequired,
    values: PropType.string.isRequired,
};

export default FilterHOC(InputFilter);
