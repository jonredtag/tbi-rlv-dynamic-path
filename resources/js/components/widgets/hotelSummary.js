import React from 'react';
import PropTypes from 'prop-types';
import Star from 'components/widgets/stars';
import Lang from 'libraries/common/Lang';
import moment from 'moment';

const HotelSummary = (props) => {
    const { sid, hotelDetails, isStandalone, customHotelDates } = props;

    return (
        <>
            <h5 className="primary-color font-weight-bold">Review Details</h5>
            <div className="d-flex justify-content-between align-items-center">
                <h5 className="mt-2 text-secondary">{Lang.trans('dynamic.hotel_summary_heading')}</h5>
                <a id="change_hotel" className="text-dark font-weight-bold" href={`/hotel/search?sid=${sid}${!isStandalone ? '&modify=1' : ''}`}>{Lang.trans('dynamic.change_hotel')}</a>
            </div>
            <div className="row pb-2 mb-2  ">
                <div className="col-12 col-md-5 col-lg-12">
                    <div className="row m-0 mb-3">
                        {hotelDetails.image.map((image) => (
                            <div className="col-6 p-1">
                                <img height="115" className="w-100 object-fit-cover mt-2 mb-2 img-feature rounded" src={image} alt="" />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-12 col-md-7 col-lg-12">
                    <h5 className="mb-0 font-weight-bold">{hotelDetails.name}</h5>
                    <div className="d-flex align-items-center">
                        <span className="mt-1 font-weight-bold">{hotelDetails.cityCountry}</span>
                    </div>
                    <div className="d-flex">
                        <span className="rating my-2 mr-2" title="4.5 stars">
                            <span className="rating" title="4.5 stars">
                                <Star component="hotelSummary" rating={hotelDetails.rating} />
                            </span>
                        </span>
                    </div>
                    <div className="row mx-0 my-2">

                    </div>

                    <div className="row">
                        <div className="col-4 mb-1">{Lang.trans('vacations.no_of_rooms')}:</div>
                        <div className="col-8">{hotelDetails.numRooms} {Lang.trans('dynamic.room')}(s)</div>
                        <div className="col-4 mb-1">{Lang.trans('vacations.room_type')}:</div>
                        <div className="room-type-capitilize-text col-8">{hotelDetails.room}</div>
                        {((isStandalone || customHotelDates) && (
                            <>
                                <div className="col-4 mb-1">{Lang.trans('hotels.check_in')}:</div>
                                <div className="col-8">{moment(hotelDetails.checkin).format('MM/DD/YYYY')} 3:00PM</div>
                                <div className="col-4 mb-1">{Lang.trans('hotels.check_out')}:</div>
                                <div className="col-8">{moment(hotelDetails.checkout).format('MM/DD/YYYY')} 11:00AM</div>
                            </>
                        )) || (
                            <>
                                <div className="col-4 mb-1">{Lang.trans('vacations.trip_duration')}:</div>
                                <div className="col-8">{hotelDetails.numNights} {Lang.trans('engine.nights')}</div>
                            </>
                        )}
                        {/* <div className="col-4 mb-1">Occupancy:</div>
                        <div className="col-8">Double Occupancy</div> */}
                        {isStandalone && hotelDetails.cancellation === false && (
                            <div className="col text-red" style={{ color: '#ca0000' }}>Non-refundable</div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

HotelSummary.propTypes = {
    sid: PropTypes.string.isRequired,
    hotelDetails: PropTypes.instanceOf(Object).isRequired,
    isStandalone: PropTypes.bool.isRequired,
    customHotelDates: PropTypes.bool.isRequired,
};

export default HotelSummary;
