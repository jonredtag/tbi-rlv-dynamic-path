import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Stars from 'components/widgets/stars';
import moment from 'moment';
import Collapse from 'reactstrap/lib/Collapse';
import Lang, { priceFormat } from 'libraries/common/Lang';

const SelectedHotel = (props) => {
    const {
        hotel,
        sid,
        parameters,
        rate,
        products,
    } = props;
    const [open, setOpen] = useState(false);

    const toggle = () => {
        setOpen(!open);
    };

    const image = (hotel.image !== null && hotel.image !== '') ? hotel.image : 'https://travel-img.s3.amazonaws.com/2020-07-14--15947010820462no-photo.png';
    const depDate = moment(parameters.depDate).format('ddd ll');
    const retDate = moment(parameters.retDate).format('ddd ll');
    let depDateHotel = null;
    let retDateHotel = null;
    if (parameters.customHotelDates) {
        depDateHotel = moment(parameters.depDateHotel).format('ddd ll');
        retDateHotel = moment(parameters.retDateHotel).format('ddd ll');
    }
    return (
        <>
            <button type="button" onClick={toggle} className={`btn-unstyled d-md-none primary-color py-2 mt-2 ${open ? '' : 'collapsed'}`}>
                <span className="text-closed">{Lang.trans('dynamic.view_selected_hotel_details')}</span>
                <span className="text-open">{Lang.trans('dynamic.hide_hotel_details')}</span>
                <svg className="icon rotate ml-1" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                    <use xlinkHref="/img/icons/icon-defs.svg#icon-chevron-down" />
                </svg>
            </button>
            <Collapse className="d-md-block" isOpen={open}>
                <div className="border box-shadow rounded mb-3 mt-3 mt-md-0 dynamic-information-box py-lg-4 d-md-block ">
                    <div className="container">
                        <div className="row no-gutters py-2">
                            <div className="col-12 col-md-8">
                                <div className="container p-0">
                                    <div className="row gutter-10">
                                        <div className="d-none col-sm-3 d-sm-flex col-lg-2">
                                            <img className="w-100 h-100 rounded" src={image} alt="" />
                                        </div>
                                        <div className="col-12 col-sm-9">
                                            <div className="h6 mb-0 primary-color">{hotel.hotelName}{(hotel.nearby !== undefined && hotel.nearby !== '') ? `, ${hotel.nearby}` : ''}</div>
                                            <span className="rating" title={`${hotel.hotelRating} ${Lang.trans('engine.stars')}`}>
                                                <Stars component="SelectedHotel" rating={hotel.hotelRating} />
                                            </span>
                                            <div className="">
                                                <svg className="icon info align-middle mr-1" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-calendar" />
                                                </svg>
                                                Flight Dates: {depDate} - {retDate}
                                            </div>
                                            {parameters.customHotelDates && (
                                                <div className="">
                                                    <svg className="icon info align-middle mr-1" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-calendar" />
                                                    </svg>
                                                    Hotel Stay: {depDateHotel} - {retDateHotel}
                                                </div>
                                            )}
                                            <div className="">
                                                <svg className="icon info align-middle mr-1" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-bed" />
                                                </svg>
                                                {hotel.roomResult.rateinfo.attr.roomDescription}
                                            </div>
                                        </div>

                                    </div>

                                </div>
                            </div>
                            <div className="col-12 offset-sm-3 offset-md-0 col-md-4 text-md-right mt-3 mt-md-0">
                                <div className="h6">{products.map((product) => Lang.trans(`product.${product}`)).join(' + ')}</div>
                                <div><span className="h6 mb-0 primary-color">{Lang.trans('dynamic.package_price')}: {priceFormat(Math.max(rate, 0))}</span></div>
                                <div><a href={`/hotel/details/${hotel.hotelId}?sid=${sid}`}>{Lang.trans('dynamic.change_room')}</a></div>
                            </div>
                        </div>
                    </div>
                </div>
            </Collapse>
        </>
    );
};

SelectedHotel.propTypes = {
    hotel: PropTypes.instanceOf(Object).isRequired,
    sid: PropTypes.string.isRequired,
    parameters: PropTypes.instanceOf(Object).isRequired,
    rate: PropTypes.string.isRequired,
    products: PropTypes.instanceOf(Array).isRequired,
};

export default SelectedHotel;
