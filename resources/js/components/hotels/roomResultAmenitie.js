import React, { useState } from 'react';
import PropTYpes from 'prop-types';
import Collapse from 'reactstrap/lib/Collapse';

const RoomResultAmenities = (props) => {
    const { amenities, roomTopAmenities } = props;

    const [isOpen, setIsOpen] = useState(false);

    const loadedAmenities = [];
    const loadMoreAmenities = [];

    amenities.forEach((amenitie, index) => {
        if (typeof amenitie !== 'undefined' && amenitie !== null && !roomTopAmenities.includes(amenitie)) {
            if (index < 3) {
                loadedAmenities.push(amenitie);
            } else {
                loadMoreAmenities.push(amenitie);
            }
        }
    });

    return (
        <>
            <div>
                <ul className="list-unstyled d-flex flex-wrap">
                    {typeof loadedAmenities !== 'undefined' && loadedAmenities !== null && (
                        <>
                            {loadedAmenities && loadedAmenities.map((amenity, index) => (
                                <li className="mr-1 mb-2" key={`rra-li${index}`}>
                                    {(typeof amenity !== 'undefined' && amenity !== null && !roomTopAmenities.includes(amenity) && (
                                        <span className="">
                                            <span className="d-flex align-items-center">
                                                <svg 
                                                    className="icon mr-1"
                                                    title={amenity}
                                                    width="100%" 
                                                    height="100%" 
                                                    xmlns="http://www.w3.org/2000/svg" 
                                                    xmlnsXlink="http://www.w3.org/1999/xlink">
                                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-checkmark-thin" />
                                                </svg>{amenity}
                                            </span>
                                        </span>
                                    ))}
                                </li>
                            ))}
                        </>
                    )}

                    {typeof loadMoreAmenities !== 'undefined' && loadMoreAmenities.length > 0 && (
                        <Collapse className="w-100 mt-0 font-size-md" isOpen={isOpen}>
                            <ul className="list-unstyled d-flex flex-wrap">
                                {loadMoreAmenities && loadMoreAmenities.map((amenity, index) => (
                                    <li className="mr-1 mb-2" key={`rra-li${index}`}>
                                        {(typeof amenity !== 'undefined' && amenity !== null && (
                                            <span className="">
                                                {/* <span className="d-flex align-items-center">
                                                    <svg className="icon info align-middle mr-2" title={amenity}>
                                                        <use xmlnsXlink="http://www.w3.org/2000/svg" xlinkHref="/img/icons/icon-defs.svg#icon-checkmark-thin" />
                                                    </svg>
                                                    {amenity}
                                                </span> */}
                                                <span className="d-flex align-items-center">
                                                    <svg 
                                                        className="icon mr-1" 
                                                        title={amenity}
                                                        width="100%" 
                                                        height="100%" 
                                                        xmlns="http://www.w3.org/2000/svg" 
                                                        xmlnsXlink="http://www.w3.org/1999/xlink">
                                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-checkmark-thin" />
                                                    </svg>{amenity}
                                                </span>
                                            </span>
                                        ))}
                                    </li>
                                ))}
                            </ul>
                        </Collapse>
                    )}
                </ul>
                {typeof loadMoreAmenities !== 'undefined' && loadMoreAmenities.length > 0 && (
                    <button type="button" className={`btn-unstyled mr-1 mb-2 ${isOpen ? '' : 'collapsed'}`} onClick={() => setIsOpen(!isOpen)}>
                        <span className="text-closed">Show More</span>
                        <span className="text-open">Show Less</span>
                        <svg className="icon ml-1 rotate align-middle" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                            <use xlinkHref="/img/icons/icon-defs.svg#icon-chevron-down" />
                        </svg>
                    </button>
                )}
            </div>
        </>
    );
};

RoomResultAmenities.propTypes = {
    amenities: PropTYpes.instanceOf('Array').isRequired,
    roomTopAmenities: PropTYpes.instanceOf('Array').isRequired,
};

export default RoomResultAmenities;
