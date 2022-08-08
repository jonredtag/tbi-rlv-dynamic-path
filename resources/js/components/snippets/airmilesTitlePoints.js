import React from 'react';
import PropTypes from 'prop-types';
import Lang from 'libraries/common/Lang';

const TitlePointsProvider = (props) => {
    const { rate } = props;

    return (
        <div className="bg-grey justify-content-end d-flex align-content-center">
            <div className="airmiles-section text-right col-md-4 d-flex p-1 justify-content-end">
                <div className="align-self-center">{Lang.trans('airmiles.airmiles_get')} <span className="points-highlight">{Math.floor(rate / 20)} {Lang.trans('airmiles.airmiles_miles')}</span></div>
                <img className="airmiles-logo ml-2 align-self-center" src="https://s3.amazonaws.com/redtag-ca/img/airmiles/airmiles-logo.png" alt="" />
            </div>
        </div>
    );
};

TitlePointsProvider.propTypes = {
    rate: PropTypes.number.isRequired,
};

export default TitlePointsProvider;
