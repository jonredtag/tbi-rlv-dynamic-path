import React from 'react';
import PropTypes from 'prop-types';

const Occupants = ({ occupants }) => {
    const icons = [];
    for (let int = 0; int < occupants; int++) {
        icons.push((
            <svg
                className="icon ml-1 align-middle"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
            >
                <use xlinkHref="/img/icons/icon-defs.svg#icon-user" />
            </svg>
        ));
    }

    return icons;
};

export default Occupants;
