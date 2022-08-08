import React from 'react';
import PropTypes from 'prop-types';
import Helper from 'libraries/common/Helper';
import Lang from 'libraries/common/Lang';

const CibcPoints = (props) => {
    const { rate } = props;

    return (
        <div className="my-2">
  			<div className="mb-2">or</div>
            <a href="{`/hotel/details/${result.id}?sid=${sid}`}" className="price">{Helper.number_format(Helper.calcCibcPoint(rate))}</a>
            <div className="tax-include-text">Total Points</div>
        </div>
    );
};

CibcPoints.propTypes = {
    rate: PropTypes.number.isRequired,
};

export default CibcPoints;
