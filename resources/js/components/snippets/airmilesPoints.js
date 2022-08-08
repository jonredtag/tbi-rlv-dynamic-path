import React from 'react';
import PropTypes from 'prop-types';
import Lang from 'libraries/common/Lang';

const Airmiles = (props) => {
    const { rate } = props;

    // return (
    //     <div className="airmiles-price-section d-flex align-items-center justify-content-center  ml-auto mx-md-auto mb-2 rounded">
    //         <div className="">{Lang.trans('airmiles.airmiles_get')} <span className="points-highlight">{Math.floor(rate / 20)} {Lang.trans('airmiles.airmiles_miles')} </span> </div>
    //         <img className="airmiles-logo loading ml-2" src="https://s3.amazonaws.com/redtag-ca/img/airmiles/airmiles-logo.png" alt="" data-was-processed="true" />
    //     </div>
    // );
    return (
        <div className="airmiles-price-section d-flex flex-column justify-content-center  ml-auto mx-md-auto mb-2">
            <div className="">{Lang.trans('airmiles.airmiles_get')} <span className="points-highlight">{Math.floor(rate / 20)} {Lang.trans('airmiles.airmiles_miles')} </span> </div>
            <img className="airmiles-logo loading ml-2" src="https://s3.amazonaws.com/redtag-ca/img/airmiles/airmiles-logo.png" alt="" data-was-processed="true" />
        </div>
    );
};

Airmiles.propTypes = {
    rate: PropTypes.number.isRequired,
};

export default Airmiles;
