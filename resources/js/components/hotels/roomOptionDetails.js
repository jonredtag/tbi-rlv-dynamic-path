import React from 'react';
import PropTypes from 'prop-types';
import HsbcPoints from 'components/snippets/HsbcPoints';
import CibcPoints from 'components/snippets/CibcPoints';

import ShowUpLift from 'components/common/ShowUpLift';
import Lang, { priceFormat } from 'libraries/common/Lang';
import UncontrolledPopover from 'reactstrap/lib/UncontrolledPopover';
import PopoverBody from 'reactstrap/lib/PopoverBody';

import Occupants from 'components/snippets/occupants';

const RoomOptionDetails = (props) => {
    const {
        room,
        isStandalone,
        numberOfPax,
        onSelect,
        showTotal,
        isFilterStatus,
    } = props;

    return (
        <>
            <div className="border rounded mb-3">
                <div className="row gutter-10 p-2">
                    <div className="col-12">
                        <div className="row">
                            <div className="col-6 col-sm-5 col-lg-8 col-md-9">
                                <div className="row">
                                    <div className="col-sm-12 col-md-5 text-left border-md-right">
                                        <div>
                                            Occupancy:<Occupants occupants={room.occupancy} />
                                        </div>
                                        {room.mealPlan && room.mealPlan !== undefined && (
                                            <div>{room.mealPlan}</div>
                                        )}
                                    </div>
                                    <div className="col-sm-12 col-lg-5 col-md-4 pt-2 pt-md-0 text-left price-col-12 border-md-right">
                                        {isStandalone && ((room.freeCancellation !== false) ? (
                                            <>
                                                <div className="promo-free-cancellation font-weight-bold">
                                                    <span className="pl-0 pl-md-2">Free Cancellation</span>
                                                </div>
                                                <div className="pl-0 pl-md-2">before {room.freeCancellation}</div>
                                            </>
                                        ) : (<div className="pl-0 pl-md-2 text-red">Non-refundable</div>))}
                                        {isStandalone && room.cancellationPolicy.length > 0 && (
                                            <>
                                                <button
                                                    type="button"
                                                    id={`room-CancellationPopover-${room.roomIndex}`}
                                                    className="text-underline text-left btn cancellation-policy-info py-0 pl-0 pl-md-2 rounded-0 col-12 pl-0"
                                                >
                                                    Cancellation Policy
                                                </button>
                                                <UncontrolledPopover
                                                    trigger="hover"
                                                    placement="bottom"
                                                    target={`room-CancellationPopover-${room.roomIndex}`}
                                                >
                                                    <strong>{Lang.trans('dynamic.cancellation_policy')}</strong>
                                                    <PopoverBody>
                                                        {room.cancellationPolicy.map((policy, policyIndex) => (
                                                            <p
                                                                key={`room-${room.roomIndex}-cancellationPolicy-${policyIndex}`}
                                                            >
                                                                {policy.description}
                                                            </p>
                                                        ))}
                                                    </PopoverBody>
                                                </UncontrolledPopover>
                                            </>
                                        )}
                                    </div>
                                    <div className="col-6 col-sm-6 col-md-2 pt-2 pt-md-0 text-center price-col-12 border-md-right">
                                        {/* <svg className="info icon-md mr-1" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                            <use xlinkHref="/img/icons/icon-defs.svg#icon-plate" />
                                        </svg>
                                        <svg className="info icon-md mr-1" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                            <use xlinkHref="/img/icons/icon-defs.svg#icon-plate" />
                                        </svg> */}
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-sm-7 col-lg-4 col-md-3 mt-md-0">
                                <div className="row">
                                    <div className="text-md-right text-right pr-xl-0 p-sm-0 pr-md-3 pr-lg-2 pr-xl-0 col-12 col-sm-6 col-lg-7 col-md-12">
                                        { isStandalone && window.points === 'hsbc' && (
                                            <HsbcPoints rate={room.rateTotal} />
                                        )}
                                        <div>
                                            <h3 className="font-weight-bold primary-color mb-0">
                                                {!isStandalone && (room.rate >= 0 ? '+' : '-')}{' '}
                                                {priceFormat(Math.max(showTotal ? Math.ceil(room.rateTotal) : room.rate, 0), 0)}
                                            </h3>
                                        </div>
                                        {/* <div className="">per night</div> */}
                                        {isStandalone && (
                                            <div className="font-weight-bold">
                                                {!showTotal ? priceFormat(Math.max(room.costPerRoom, 0), 0) : ''}
                                                {' '}
                                                {showTotal ? 'Total incl taxes & fees' : Lang.trans('hotels.for_nights', { duration: room.duration })}
                                            </div>
                                        )}
                                        { isStandalone && window.points === 'cibc' && (
                                            <CibcPoints rate={room.rateTotal} />
                                        )}
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-12 col-lg-5 text-right pl-lg-0">
                                        {room.roomsAvailable !== '' && (
                                            <div className="text-red">
                                                {room.roomsAvailable} {Lang.trans('dynamic.left_at_this_price')}
                                            </div>
                                        )}
                                        <button type="button" className="btn btn-primary mt-1 font-weight-bold px-md-3 py-md-2" onClick={() => { onSelect(room); }}>
                                            {Lang.trans(`${isRefundablePath ? 'buttons.reserve_room' : 'buttons.select_room'}`)}
                                        </button>
                                        {UPLIFT_FEATURE && !isRefundablePath && (
                                            <ShowUpLift
                                                type="1"
                                                numberOfPax={isStandalone ? 1 : numberOfPax}
                                                isStandalone={isStandalone}
                                                price={isStandalone ? room.costPerRoom : room.rateTotalPerPerson}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

RoomOptionDetails.propTypes = {
    room: PropTypes.instanceOf(Object).isRequired,
    isStandalone: PropTypes.bool.isRequired,
    numberOfPax: PropTypes.number.isRequired,
    onSelect: PropTypes.func.isRequired,
    showTotal: PropTypes.bool,
};

RoomOptionDetails.defaultProps = {
    showTotal: false,
};

export default RoomOptionDetails;
