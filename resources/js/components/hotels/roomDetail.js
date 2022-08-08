/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import PropTypes from 'prop-types';
import Lang from 'libraries/common/Lang';
import Carousel from 'components/widgets/carousel';

import Modal from 'reactstrap/lib/Modal';
import ModalBody from 'reactstrap/lib/ModalBody';

const RoomDetail = (props) => {
    const { showDetailsModel, onClose, room } = props;
    const defaultImage = 'http://r-cf.bstatic.com/images/hotel/max1024x768/210/210164397.jpg';

    return (
        <Modal size="lg" isOpen={showDetailsModel} toggle={() => onClose()}>
            <div className="modal-header modal-solid-header-bar">
                <h5 className="modal-title h4">
                    {Lang.trans('dynamic.room_details')}
                    <button type="button" className="close close-lg pt-3" onClick={() => onClose()} aria-label="Close">
                        <span className="pt-md-1 d-inline-block" aria-hidden="true">×</span>
                    </button>
                </h5>
            </div>
            <ModalBody>
                <div>
                    <h1>{room.name}</h1>
                    {room.images.length > 0 && (
                        <Carousel>
                            {room.images.map((image) => (
                                <div className="carousel-pane d-flex align-items-center">
                                    <img src={image.url || defaultImage} className="product-img" alt="..." />
                                </div>
                            ))}
                        </Carousel>
                    )}
                    {room.roomDescription !== '' && (
                        <>
                            <div className="mb-4 mt-2" dangerouslySetInnerHTML={{ __html: room.roomDescription }} />
                        </>
                    )}
                    <hr />
                    {room.amenities.length > 0 && (
                        <>
                            <h1>Amenities</h1>
                            <div className="row">
                                {room.amenities.map((amenity, amenityIndex) => (
                                    <div key={`roomResult-${room.roomIndex}-amenities-${amenityIndex}`} className="col-md-6 amenity-item d-flex align-items-center pb-1">
                                        <div>
                                            <svg className="icon-md mr-3" width="50%" height="50%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                                <use xlinkHref="/img/icons/icon-defs.svg#icon-checkmark-round" />
                                            </svg>
                                        </div>
                                        <span>{amenity}</span>
                                    </div>
                                ))}
                            </div>
                            <hr />
                        </>
                    )}
                    {(room.checkInInstructions !== '' && room.checkInInstructions !== undefined) && (
                        <>
                            <h1>Check In Instructions</h1>
                            <div className="mb-4" dangerouslySetInnerHTML={{ __html: room.checkInInstructions }} />
                        </>
                    )}
                    {room.policyData.length > 0 && (
                        <>
                            {Object.keys(room.policyData[0]).map((policyKey, policyIndex) => {
                                const policy = room.policyData[0][policyKey];
                                return (
                                    <div key={`roomResult-${room.roomIndex}-policy-${policyIndex}`}>
                                        <strong>{policy.title}</strong>
                                        <div className="mb-2">
                                            <p>{policy.paragraph_data[Object.keys(policy.paragraph_data)[0]]}</p>
                                        </div>
                                    </div>
                                );
                            })}
                            <hr />
                        </>
                    )}
                </div>
            </ModalBody>
        </Modal>
    );
};

RoomDetail.propTypes = {
    showDetailsModel: PropTypes.bool,
    onClose: PropTypes.func,
    room: PropTypes.object,
};

RoomDetail.defaultProps = {
    showDetailsModel: false,
    onClose: () => { },
    room: {},
};
export default RoomDetail;
