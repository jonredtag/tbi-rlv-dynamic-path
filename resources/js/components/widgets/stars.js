import React from 'react';
import PropTypes from 'prop-types';

const Stars = (props) => {
    const rating = parseFloat(props.rating);
    const { component } = props;
    const stars = [];
    let numStars = 0;
    for (let i = 1; i <= rating; i++) {
        stars.push((
            <svg key={`${component}-stars-${i}`} className="first icon star" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                <use xlinkHref="/img/icons/icon-defs.svg#icon-star" />
            </svg>
        ));
        numStars = i;
    }
    if (rating > numStars) {
        stars.push((
            <div key={`${component}-starstack`} className="icon icon-stack">
                <svg className="fifth icon star" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                    <use xlinkHref="/img/icons/icon-defs.svg#icon-star" />
                </svg>
                <svg className="icon star star-empty" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                    <use xlinkHref="/img/icons/icon-defs.svg#icon-star-half" />
                </svg>
            </div>
        ));
    }
    for (let i = rating + 1; i <= 5; i++) {
        stars.push((
            <svg key={`${component}-halfstars-${i}`} className="icon star-half" width="100%" height="100%" xmlns="http://www.w3.org/1999/xlink" xmlnsXlink="http://www.w3.org/1999/xlink">
                <use xlinkHref="/img/icons/icon-defs.svg#icon-star" />
            </svg>
        ));
    }

    return stars;
};

Stars.propTypes = {
    rating: PropTypes.number.isRequired,
    component: PropTypes.string.isRequired,
};

export default Stars;
