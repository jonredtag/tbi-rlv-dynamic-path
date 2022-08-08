import React from 'react';
import PropTypes from 'prop-types';
import IFrame from 'iframe-resizer-react';
import Lang from 'libraries/common/Lang';

const Reviews = (props) => {
    const { id } = props;
    return (
        <>
            <div className="d-md-flex align-items-end py-2 price-and-title-selection">
                <div className="col-md-4 px-0 h4 font-weight-bold mb-0">{Lang.trans('dynamic.hotel_reviews')}</div>
            </div>
            <div className="hotel-details-reviews-container">
                <div>
                    <IFrame
                        src={`https://api.trustyou.com/hotels/${id}/tops_flops.html?lang=en&iframe_resizer=true&key=e322d37b-ae0d-4d1f-ace9-40ebd855b983`}
                        frameborder="0"
                        width="100%"
                        title="sd"
                    />
                </div>
            </div>
            {/*<script type="text/javascript" src="//cdn.trustyou.com/apps/widgets/public/v6.6.3-0-gc532aea/3rdparty/iframe-resizer/js/iframeResizer.min.js" />*/}
            {<script type="text/javascript" src="https://raw.githubusercontent.com/davidjbradshaw/iframe-resizer/master/js/iframeResizer.contentWindow.min.js" />}
        </>
    );
};

Reviews.propTypes = {
    id: PropTypes.string.isRequired,
};

export default Reviews;
