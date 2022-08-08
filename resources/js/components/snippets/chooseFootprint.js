import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { priceFormat } from 'libraries/common/Lang';

const ChooseFootprint = (props) => {
    const { sid, flightID } = props;

    const [rate, setRate] = useState(undefined);
    const [loaded, setLoaded] = useState(false);

    const makeCall = () => {
        if (!loaded) {
            setLoaded(true);
            fetch(`/api/dynamic/footprint?sid=${sid}&flightID=${JSON.stringify(flightID)}`)
                .then((response) => response.json())
                .then((data) => {
                    if (data.error === undefined) {
                        setRate(data.price);
                    } else {
                        setRate(null);
                    }
                })
                .catch(() => {
                    setRate(null);
                });
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center btn-choose-footprint mr-2">
            {(loaded && (
                <span className="text-main mr-2">
                    {(loaded && rate === undefined && 'Calculating...')
                    || (loaded && rate !== null && `+ Add ${priceFormat(rate)} at Checkout`)
                    || 'Error Obtaining Rate.'}
                </span>
            )) || (
                <button type="button" className="btn-unstyled" onClick={makeCall}>
                    <span className="text-underline text-main mr-2">
                        Calculate Footprint
                    </span>
                </button>
            )}
            <span className="text-small mr-1">Powered by</span><img className="logo-choose" src="https://travel-img-assets.s3.us-west-2.amazonaws.com/logos/logo-choose.png" alt="" />
        </div>
    );
};

ChooseFootprint.propTypes = {
    sid: PropTypes.string.isRequired,
    flightID: PropTypes.instanceOf(Array),
};

ChooseFootprint.defaultProps = {
    flightID: null,
};

export default ChooseFootprint;
