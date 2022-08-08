import React, { useState } from 'react';
import PropTypes from 'prop-types';
import RoomOption from 'components/hotels/roomOption';
import RoomDetail from 'components/hotels/roomDetail';
import Collapse from 'reactstrap/lib/Collapse';
import AmenityIcons from 'libraries/common/AmenityIcons';
import RoomResultAmenitie from 'components/hotels/roomResultAmenitie';

const RoomResult = (props) => {
    const {
        onSelect,
        room,
        numberOfPax,
        isStandalone,
        showTotal,
        isFilterStatus,
    } = props;

    let firstroomindex = 0;
    let secondroomindex = 1;
    let collapseroomindex = 1;
    let TotalCount = 0;
    const RoomMainarr = room.rooms;
    if (isFilterStatus === 1) {
        for (let i = 0; i < RoomMainarr.length; i++) {
            if (RoomMainarr[i].cancellation === true) {
                firstroomindex = i;
                for (let j = firstroomindex; j < RoomMainarr.length; j++) {
                    if (RoomMainarr[j].cancellation === true) {
                        secondroomindex = j + 1;
                        collapseroomindex = secondroomindex;
                        break;
                    }
                }
                break;
            }
        }

        for (let i = 0; i < RoomMainarr.length; i++) {
            if (RoomMainarr[i].cancellation === true) {
                TotalCount += 1;
            }
        }
    }

    const roomTopAmenities = [
        'Private suite',
        'Landmark view',
        'Ocean view',
        'City view',
        'Air conditioning',
        'Private Bathroom',
        'Flat-screen TV',
        'Minibar',
        'Free WiFi',
        'Balcony',
    ];

    const [showRooms, setShowRooms] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);

    if (isFilterStatus === 0) {
        for (let i = 0; i < RoomMainarr.length; i++) {
            if (RoomMainarr[i].cancellation === false) {
                firstroomindex = i;
                for (let j = firstroomindex; j < RoomMainarr.length; j++) {
                    if (RoomMainarr[j].cancellation === false) {
                        secondroomindex = j + 1;
                        collapseroomindex = secondroomindex;
                        break;
                    }
                }
                break;
            }
        }

        for (let i = 0; i < RoomMainarr.length; i++) {
            if (RoomMainarr[i].cancellation === false) {
                TotalCount += 1;
            }
        }
    }

    if (isFilterStatus === 2) {
        TotalCount = RoomMainarr.length;
    }

    return (
        <>
            <div className="border-top room-selection-result my-3">
                <div className="row gutter-10 py-3">
                    <div className="col-12">
                        <h5 className="mb-0 primary-color font-weight-bold">{room.name}</h5>
                        <div className="d-flex mt-2">
                            {room.rooms[0].bedTypes && room.rooms[0].bedTypes.map((bed, index) => {
                                let bedTypesClass = '';
                                if (index > 0) {
                                    bedTypesClass = 'ml-2 pl-2 border-left mr-3';
                                }

                                return (
                                    <div className={bedTypesClass}>
                                        <svg
                                            className="icon mr-1 align-middle"
                                            width="100%"
                                            height="100%"
                                            xmlns="http://www.w3.org/2000/svg"
                                            xmlnsXlink="http://www.w3.org/1999/xlink"
                                        >
                                            <use xlinkHref="/img/icons/icon-defs.svg#icon-bed" />
                                        </svg>
                                        {bed.title} bed{bed.count > 1 ? 's' : ''}
                                    </div>
                                );
                            })}
                            &nbsp;&nbsp;
                            <button type="button" className="btn-unstyled text-underline" onClick={() => { setModalOpen(true); }}>
                                <svg className="icon mr-1" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-info" />
                                </svg>
                                More details
                            </button>
                        </div>

                        <div className="d-flex flex-wrap pb-2">
                            {room.rooms[0].roomSquareFootage && (
                                <div className="mr-2">
                                    <span className="d-flex align-items-center">
                                        <svg
                                            className="icon mr-1"
                                            title={room.rooms[0].roomSquareFootage}
                                            width="100%"
                                            height="100%"
                                            xmlns="http://www.w3.org/2000/svg"
                                            xmlnsXlink="http://www.w3.org/1999/xlink"
                                        >
                                            <use xlinkHref="/img/icons/amenities-icon-defs.svg#icon-sqfeet" />
                                        </svg>{`${parseInt(room.rooms[0].roomSquareFootage, 10)} ft²`}
                                    </span>
                                </div>
                            )}

                            {room.rooms[0].amenities && room.rooms[0].amenities.map((hotelAmenitie) => (
                                <>
                                    {hotelAmenitie && roomTopAmenities.includes(hotelAmenitie) && (
                                        <div className="mr-2">
                                            <span className="d-flex align-items-center">
                                                <svg
                                                    className="icon mr-1"
                                                    width="100%"
                                                    height="100%"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                                >
                                                    <use xlinkHref={AmenityIcons.get(hotelAmenitie)} />
                                                </svg>{hotelAmenitie}
                                            </span>
                                        </div>
                                    )}
                                </>
                            ))}
                        </div>
                        <div className="border-top pt-2">
                            <RoomResultAmenitie
                                amenities={room.rooms[0].amenities}
                                roomTopAmenities={roomTopAmenities}
                            />
                        </div>
                    </div>
                    {/* <div className="col-12 text-right mt-2">
                        <RoomOption room={room.rooms[0]} isStandalone={isStandalone} numberOfPax={numberOfPax} onSelect={onSelect} showTotal={showTotal} />

                        {room.rooms.length > 1 && (
                            <RoomOption room={room.rooms[1]} isStandalone={isStandalone} numberOfPax={numberOfPax} onSelect={onSelect} showTotal={showTotal} />
                        )}
                        {room.rooms.length > 2 && (
                            <>
                                <Collapse isOpen={showRooms}>
                                    {room.rooms.map((option, index) => {
                                        if (index > 1) {
                                            return (<RoomOption key={`rm_${index}`} room={option} isStandalone={isStandalone} numberOfPax={numberOfPax} onSelect={onSelect} showTotal={showTotal} />);
                                        }
                                        return false;
                                    })}
                                </Collapse>
                                <div className="text-left">
                                    <button type="button" className={`btn-unstyled primary-color font-weight-bold ${showRooms ? '' : 'collapsed'}`} onClick={() => { setShowRooms(!showRooms); }}>
                                        <span className="text-closed">Show More Rooms</span>
                                        <span className="text-open">Show Less Rooms</span>
                                        <svg className="icon-sm rotate ml-1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                            <use xlinkHref="/img/icons/icon-defs.svg#icon-chevron-down" />
                                        </svg>
                                    </button>
                                </div>
                            </>
                        )}
                    </div> */}

                    <div className="col-12 text-right mt-2">
                        <RoomOption room={room.rooms[firstroomindex]} isStandalone={isStandalone} numberOfPax={numberOfPax} onSelect={onSelect} showTotal={showTotal} isFilterStatus={isFilterStatus} />

                        {TotalCount > 1 && (
                            <RoomOption room={room.rooms[secondroomindex]} isStandalone={isStandalone} numberOfPax={numberOfPax} onSelect={onSelect} showTotal={showTotal} isFilterStatus={isFilterStatus}  />
                        )}

                        {TotalCount > 2 && (
                            <>
                                <Collapse isOpen={showRooms}>
                                    {room.rooms.map((option, index) => {
                                        if (index > collapseroomindex) {
                                            return (<RoomOption room={option} isStandalone={isStandalone} numberOfPax={numberOfPax} onSelect={onSelect} showTotal={showTotal} isFilterStatus={isFilterStatus}  />);
                                        }
                                        return false;
                                    })}
                                </Collapse>
                                <div className="text-left">
                                    <button type="button" className={`btn-unstyled primary-color font-weight-bold ${showRooms ? '' : 'collapsed'}`} onClick={() => { setShowRooms(!showRooms); }}>
                                        <span className="text-closed">Show More Rooms</span>
                                        <span className="text-open">Show Less Rooms</span>
                                        <svg className="icon-sm rotate ml-1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                            <use xlinkHref="/img/icons/icon-defs.svg#icon-chevron-down" />
                                        </svg>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <RoomDetail showDetailsModel={isModalOpen} onClose={() => { setModalOpen(false); }} room={room.rooms[0]} />
            </div>
        </>
    );
};

RoomResult.propTypes = {
    onSelect: PropTypes.func.isRequired,
    room: PropTypes.instanceOf(Object).isRequired,
    isStandalone: PropTypes.bool.isRequired,
    numberOfPax: PropTypes.number.isRequired,
    showTotal: PropTypes.bool,
};

RoomResult.defaultProps = {
    showTotal: false,
};

export default RoomResult;
