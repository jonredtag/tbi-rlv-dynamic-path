import React from 'react';
import PropTypes from 'prop-types';

const TrustYouSummary = (props) => {
    const { data } = props;

    const renderData = [];
    let i = 0;

    for (i = 0; i < parseInt(data.star, 10); i++) {
        renderData.push((
            <span className="rating-unit is-full" />
        ));
    }
    if ((parseFloat(data.star) - parseInt(data.star, 10)) > 0) {
        renderData.push((
            <span className="rating-unit is-half" />
        ));
    }
    for (let j = Math.ceil(data.star); j < 5; j++) {
        renderData.push((
            <span className="rating-unit is-empty" />
        ));
    }

    return (
        <div className="mt-2 ml-2 pl-2 border-left border-md-0 border-lg-left ml-md-0 ml-lg-2 pl-md-0 pl-lg-2">
            <div className="trustscore size-xs pos">
                <div className="value">{data.star.toPrecision(2)}</div>
                <div className="score-rating-container">
                    <div className="score-wrapper">
                        <div className="score mb-md-1 mb-lg-0">{data.scoreDescription}</div>
                        <div className="badges d-none d-sm-inline-block">
                            <i className="ty-icon ty-icon-badge neg" />
                            <i className="ty-icon ty-icon-badge neu" />
                            <i className="ty-icon ty-icon-badge pos" />
                        </div>
                    </div>
                    <div className="rating-wrapper">
                        <div className="trustyou-ui rating">
                            <div className="rating-units">
                                {renderData}
                            </div>
                        </div>
                        <div className="counter float-md-none float-lg-left d-none d-sm-inline-block">
                            {data.reviews} Reviews
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

TrustYouSummary.propTypes = {
    data: PropTypes.instanceOf(Object),
};

TrustYouSummary.defaultProps = {
    data: {
        star: 4.5,
        reviews: 2134,
        scoreDescription: 'Good',
    },
};

export default TrustYouSummary;
