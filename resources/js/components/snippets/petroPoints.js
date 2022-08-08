import React from 'react';
import PropTypes from 'prop-types';
import Lang from 'libraries/common/Lang';

const PetroPoints = (props) => {
    const { rate } = props;

    return (
        <div className="petro-points-price-section d-flex flex-column justify-content-center  ml-auto mx-md-auto mb-2">
            <span className="d-md-block">{Lang.trans('petro.collect_petro')}</span>
            <span className="points-highlight">
                {Math.floor(rate * 10)}
                <span className="d-md-none ml-1">Petro-</span>
                <span className="d-md-points-highlight ml-md-1">Points</span>
            </span>
            <img className="petro-points-logo" src="https://s3.amazonaws.com/itravel2000/img/branding/petro-points-logo.png" alt="" data-was-processed="true"/>
        </div>
    );
};

PetroPoints.propTypes = {
    rate: PropTypes.number.isRequired,
};

export default PetroPoints;
