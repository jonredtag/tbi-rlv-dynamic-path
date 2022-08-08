import React from 'react';
import PropTypes from 'prop-types';
import Lang from 'libraries/common/Lang';

const TitlePointsProvider = (props) => {
    const { rate } = props;

    return (
        <div className="airmiles-section text-right  d-flex px-0 justify-content-end">
            <div>
                {Lang.trans('petro.collect_petro')}&nbsp;
                <span className="points-highlight">
                    {Math.floor(rate * 10)}
                    <span className="d-md-none ml-1">Petro-</span>
                    <span className="d-md-points-highlight ml-md-1">Points</span>
                </span>
            </div>
            <img className="petro-points-logo ml-2" src="https://s3.amazonaws.com/itravel2000/img/branding/petro-points-logo.png" alt="" />
        </div>
    );
};

TitlePointsProvider.propTypes = {
    rate: PropTypes.number.isRequired,
};

export default TitlePointsProvider;
