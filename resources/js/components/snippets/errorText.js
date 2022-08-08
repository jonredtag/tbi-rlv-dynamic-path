import React from 'react';
import PropTypes from 'prop-types';

const ErrorText = (props) => {
    const { error } = props;
    return (
        <div className="error-text">
            <svg className="icon" width="100%" height="100%" xmlns="http://www.w3.org/1999/xlink" xmlnsXlink="http://www.w3.org/1999/xlink">
                <use xlinkHref="/img/icons/icon-defs.svg#icon-exclamation-circle" />
            </svg>
            {error.message}
        </div>
    );
};

ErrorText.propTypes = {
    error: PropTypes.instanceOf(Object).isRequired,
};

export default ErrorText;
