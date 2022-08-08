import React from 'react';
import PropTypes from 'prop-types';
import { priceFormat } from 'libraries/common/Lang';

const MapMarker = (props) => {
    const { rate, extraClass } = props;
    return (
        <button
            type="button"
            className={`map-marker-pin-currency ${extraClass}`}
            onClick={(e) => props.clickDo(e, props.params)}
        >
            <div>{priceFormat(Math.max(rate, 0), 0)}</div>
        </button>
    );
};

MapMarker.propTypes = {
    params: PropTypes.instanceOf(Object).isRequired,
    clickDo: PropTypes.func.isRequired,
    rate: PropTypes.number.isRequired,
    extraClass: PropTypes.string,
};

MapMarker.defaultProps = {
    extraClass: null,
};

export default MapMarker;
