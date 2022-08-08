import React from 'react';
import PropTypes from 'prop-types';

const ErrorTooltip = (props) => {
    const { error } = props;
    return (
        <div key={`error${error.id}`} className="error-tool-tip">
            <svg className="icon" width="100%" height="100%" xmlns="http://www.w3.org/1999/xlink" xmlnsXlink="http://www.w3.org/1999/xlink">
                <use xlinkHref="/img/icons/icon-defs.svg#icon-exclamation-circle" />
            </svg>
            {error.message}
        </div>
    );
};

ErrorTooltip.propTypes = {
    error: PropTypes.instanceOf(Object).isRequired,
};

export default ErrorTooltip;
