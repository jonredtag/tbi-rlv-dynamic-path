import React from 'react';
import PropTypes from 'prop-types';
import Helper from 'libraries/common/Helper';
import Lang from 'libraries/common/Lang';

const Hsbc = (props) => {
    const { rate } = props;
    const styleTmp = {color:'#1c75bc', fontWeight: 'bold'};

    return (
        <div className="hsbc-points-price-section d-flex flex-column justify-content-center  ml-auto mx-md-auto mb-2">
            <span className="d-block">Redeem</span>
            <span className="points-highlight">{Helper.number_format(Helper.calcHsbcPoint(rate))}
            <span className=""> Points</span></span>
            <img className="hsbc-points-logo" src="https://travel-img-assets.s3.us-west-2.amazonaws.com/logos/logo-hsbc-icon.png" alt="" />
        </div>
    );
};

Hsbc.propTypes = {
    rate: PropTypes.number.isRequired,
};

export default Hsbc;
