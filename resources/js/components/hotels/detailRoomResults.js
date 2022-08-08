import React, { Component } from 'react';
import RoomsHeader from 'components/hotels/detailRoomsHeader';
import RoomResult from 'components/hotels/roomResult';
import FixedRoomResult from 'components/hotels/detailFixedRoomResult';
import PropTypes from 'prop-types';
import Lang from 'libraries/common/Lang';

class DetailRoomResults extends Component {
    constructor(props) {
        super(props);

        this.state = {
            refundable: 2,
            fullRate: false,
            rooms: [],
            hotelAmenities: props.hotel.amenities,
            RefundableRooms: [],
            NonRefundableRooms: [],
            isFilterStatus: 2,
        };

        this.setRefundable = this.setRefundable.bind(this);
        this.getRefundable = this.getRefundable.bind(this);
        this.filter = this.filter.bind(this);
        this.toggleFullRate = this.toggleFullRate.bind(this);
    }

    componentDidMount() {
        this.setState({ rooms: this.filter(2) });
        this.filterRefundableRooms(1);
        this.filterNonRefundableRooms(0);
    }

    getRefundable(refundable) {
        return this.filter(refundable);
    }

    setRefundable(refundable) {
        this.setState({ refundable }, () => (
            this.setState({ rooms: this.getRefundable(refundable) })
        ));
    }

    filterRefundableRooms(refundable) {
        const { hotel } = this.props;
        const temparr = [];
        hotel.roomResults.forEach((room) => {
            room.rooms.forEach((roomdetail) => {
                if ((refundable === 1 && roomdetail.cancellation)) {
                    temparr.push(roomdetail);
                }
            });
        });
        this.setState({ RefundableRooms: temparr });
        return temparr;
    }

    filterNonRefundableRooms(refundable) {
        const { hotel } = this.props;
        const temparrnon = [];
        hotel.roomResults.forEach((room) => {
            room.rooms.forEach((roomdetail) => {
                if ((refundable === 0 && !roomdetail.cancellation)) {
                    temparrnon.push(roomdetail);
                }
            });
        });
        this.setState({ NonRefundableRooms: temparrnon });
        return temparrnon;
    }

    filter(refundable) {
        const { hotel } = this.props;
        this.setState({ isFilterStatus: refundable });
        return hotel.roomResults.filter((room) => {
            return room.rooms.filter((roomdetail) => {
                if ((refundable === 1 && roomdetail.cancellation) || (refundable === 0 && !roomdetail.cancellation) || (refundable === 2)) {
                    return true;
                }
                return false;
            });
        });
    }

    toggleFullRate() {
        const { fullRate } = this.state;
        this.setState({ fullRate: !fullRate });
    }

    render() {
        const {
            onSelect,
            hotel,
            fixedRoomVisible,
            parameters,
            isStandalone,
            toggleFlightModal,
            hidePrice,
        } = this.props;

        const {
            refundable,
            rooms,
            fullRate,
            isFilterStatus,
            hotelAmenities,
            RefundableRooms,
            NonRefundableRooms,
        } = this.state;

        // const countAll = hotel.roomResults.length;
        // const countRefundable = this.getRefundable(1).length;
        // const countNonRefundable = this.getRefundable(0).length;
        const countRefundable = RefundableRooms.length;
        const countNonRefundable = NonRefundableRooms.length;
        const countAll = ((countRefundable) + (countNonRefundable));

        let numberOfPax = 0;
        parameters.occupancy.forEach((room) => {
            numberOfPax += room.adults + room.children;
        });

        const showRoomFilter =
            isStandalone &&
            countAll > 0 &&
            (
                (countRefundable > 0 && countRefundable !== countAll) ||
                (countNonRefundable > 0 && countNonRefundable !== countAll)
            );

        const packageTotal = isStandalone
            ? hotel.roomResults[0].rooms[0].rate
            : hotel.packageTotal;

        return (
            <>
                <div className="container border rounded box-shadow px-3 pb-5 pt-4 my-4 bg-white">
                    <RoomsHeader
                        hidePrice={hidePrice}
                        packageTotal={packageTotal}
                        products={hotel.products}
                        toggleFullRate={this.toggleFullRate}
                        showTotal={fullRate}
                        isStandalone={isStandalone}
                    />
                    <div className="room-selection-result my-3">
                        <div>
                            {showRoomFilter && (
                                <div
                                    className="btn-group my-2 bg-grey p-1 col-sm-12 col-md-auto"
                                    role="group"
                                    aria-label="Basic example"
                                >
                                    <button
                                        onClick={() => this.setRefundable(2)}
                                        type="button"
                                        className={`btn btn-sm btn-${
                                            refundable === 2 ? 'secondary' : 'default'
                                        }`}
                                    >
                                        {Lang.trans('dynamic.filter_all_rooms')} ({countAll})
                                    </button>
                                    {countRefundable > 0 && countRefundable !== countAll && (
                                        <button
                                            onClick={() => this.setRefundable(1)}
                                            type="button"
                                            className={`btn btn-sm btn-${refundable === 1 ? 'secondary' : 'default'}`}
                                        >
                                            {Lang.trans('dynamic.filter_cancellation')} (
                                            {countRefundable})
                                        </button>
                                    )}
                                    {countNonRefundable > 0 && countNonRefundable !== countAll && (
                                        <button
                                            onClick={() => this.setRefundable(0)}
                                            type="button"
                                            className={`btn btn-sm btn-${refundable === 0 ? 'secondary' : 'default'}`}
                                        >
                                            {Lang.trans('dynamic.filter_no_cancellation')} (
                                            {countNonRefundable})
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                        {rooms.map((room) => (
                            <RoomResult
                                key={`room-${room.name}`}
                                hidePrice={hidePrice}
                                numberOfPax={numberOfPax}
                                room={room}
                                hotelAmenities={hotelAmenities}
                                isStandalone={isStandalone}
                                showTotal={fullRate}
                                toggleFlightModal={toggleFlightModal}
                                onSelect={onSelect}
                                isFilterStatus={isFilterStatus}
                            />
                        ))}
                    </div>
                </div>
                {!hidePrice && (
                    <FixedRoomResult
                        fixedRoomVisible={fixedRoomVisible}
                        packageTotal={packageTotal}
                        isStandalone={isStandalone}
                    />
                )}
            </>
        );
    }
}

DetailRoomResults.propTypes = {
    onSelect: PropTypes.func.isRequired,
    hotel: PropTypes.instanceOf(Object).isRequired,
    fixedRoomVisible: PropTypes.bool.isRequired,
    isStandalone: PropTypes.bool.isRequired,
    parameters: PropTypes.instanceOf(Object).isRequired,
    toggleFlightModal: PropTypes.func.isRequired,
    hidePrice: PropTypes.bool,
};

DetailRoomResults.defaultProps = {
    hidePrice: false,
};

export default DetailRoomResults;
