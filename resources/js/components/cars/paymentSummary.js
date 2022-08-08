import React from 'react';
import PropTypes from 'prop-types';
import Lang from 'libraries/common/Lang';

const CarSummary = (props) => {
    const { car, sid, notes } = props;

    return (
        <>
            <div className="d-flex justify-content-between align-items-center">
                <h5 className="mt-2 text-secondary">{Lang.trans('cars.car_rental_details')}</h5>
                <a className="text-dark font-weight-bold" href={`/car/search?sid=${sid}`}>Change Car</a>
            </div>
            <div className="row pb-2 mb-2">
                <div className="col-12 col-md-5 col-lg-12">
                    <img className="px-5 w-100 mt-2 mb-2" src={car.image} alt="" />
                </div>
                <div className="col-12 col-md-7 col-lg-12">
                    <div className="row">
                        <div className="col-3 col-md-3 col-lg-4">
                            <img className="w-100" src={`https://travel-img-assets.s3-us-west-2.amazonaws.com/cars/vendors/${car.vendor.toLowerCase().replace(' ', '-')}.jpg`} alt={car.vendor} />
                        </div>
                    </div>
                    <div className="d-flex flex-wrap align-items-center">
                        <h1 className="product-title d-block mt-1 mr-2 h4 mb-0" href="">{car.name}</h1>
                        <span className="mr-2 lead text-nowrap or-similar">{Lang.trans('cars.or_similar')}</span>
                    </div>
                    <div>
                        <button className="d-block btn-unstyled lead car-class">{car.class}</button>
                    </div>
                    <div className="d-flex mt-2 pb-2">
                        <div className="mt-2 text-center">
                            <svg className="icon chevron car-details-icon" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                <use xlinkHref="/img/icons/icon-defs.svg#icon-car-seat" />
                            </svg>
                            <div className="mt-1 car-detail-text">{car.passengers} seat</div>
                        </div>
                        <div className="mt-2 ml-3 text-center">
                            <svg className="icon chevron car-details-icon" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                <use xlinkHref="/img/icons/icon-defs.svg#icon-car-door-right" />
                            </svg>
                            <div className="mt-1 car-detail-text">{car.doors}dr</div>
                        </div>
                        <div className="mt-2 ml-3 text-center">
                            <svg className="icon chevron car-details-icon" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                <use xlinkHref="/img/icons/icon-defs.svg#icon-luggage" />
                            </svg>
                            <div className="mt-1 car-detail-text">{car.luggage || 'n/a'}</div>
                        </div>
                        <div className="mt-2 ml-3 text-center">
                            <svg className="icon chevron car-details-icon" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                <use xlinkHref="/img/icons/icon-defs.svg#icon-transmission-left" />
                            </svg>
                            <div className="mt-1 car-detail-text">{(car.transmission.toLowerCase().indexOf('auto') > -1) ? 'Automatic' : 'Manual'}</div>
                        </div>
                        <div className="mt-2 ml-3 text-center">
                            <svg className="icon chevron car-details-icon" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                <use xlinkHref="/img/icons/icon-defs.svg#icon-snow-flakes" />
                            </svg>
                            <div className="mt-1 car-detail-text">A/C</div>
                        </div>
                    </div>
                    <div className="row gutter-10 py-2 d-none">
                        <div className="col-5 font-weight-bold">{Lang.trans('cars.rate_type')}:</div>
                        <div className="col-7">{car.rate.description}</div>
                        <div className="col-5 font-weight-bold">{Lang.trans('cars.car_type')}:</div>
                        <div className="col-7">{`${car.name} ${Lang.trans('cars.or_similar')}:`} ({car.class})</div>
                        <div className="col-5 font-weight-bold">{Lang.trans('cars.pickup_date')}:</div>
                        <div className="col-7">{car.pickupDate}</div>
                        <div className="col-5 font-weight-bold">{Lang.trans('cars.dropoff_date')}:</div>
                        <div className="col-7">{car.dropoffDate}</div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <h1 className="mt-2 lead font-weight-bold">
                                <svg className="icon mr-1 d-none" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-shuttle" />
                                </svg>
                                {Lang.trans('cars.pickup_address')}:
                            </h1>
                            <div className="d-flex">
                                <svg className="icon icon-md mt-1 mr-1" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-map-pin" />
                                </svg>
                                <div className="d-block smaller-text border-0">
                                    {car.pickup.name} <br/> {car.pickup.address}, {car.pickup.row.CityName}, {car.pickup.row.CountryName}<br/>{Lang.trans('cars.pickup_date')}: {car.pickupDate}
                                </div>
                            </div>
                        </div>
                        <div className="col-12">
                            <h1 className="mt-2 lead font-weight-bold">
                                <svg className="icon mr-1 d-none" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-shuttle" />
                                </svg>
                                {Lang.trans('cars.dropoff_address')}:
                            </h1>
                            <div className="d-flex">
                                <svg className="icon icon-md mt-1 mr-1" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-map-pin" />
                                </svg>
                                <div className="d-block smaller-text border-0">
                                    {car.dropoff.name} <br/> {car.dropoff.address}, {car.dropoff.row.CityName}, {car.dropoff.row.CountryName} <br/> {Lang.trans('cars.dropoff_date')}: {car.dropoffDate}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row m-0">
                        <h1 className="mt-2 lead font-weight-bold">
                            {Lang.trans('cars.additional_info')}:
                        </h1>
                        {((car.rate.included.length > 0) && (
                            <>
                                {car.rate.included.map((inc) => (
                                    <span key={`included-${inc}`} className="border-0 mr-0 my-1 col-12 d-flex p-0">
                                        <svg className="icon mr-1 mt-1" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                            <use xlinkHref="/img/icons/icon-defs.svg#icon-checkmark-round" />
                                        </svg>
                                        {inc}
                                    </span>
                                ))}
                            </>
                        ))}

                    </div>
                    {notes.map((note, keynote) => (
                        <div className="mt-3 mb-0 alert alert-warning p-2 text-muted w-100" key={keynote}>
                            {note}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

CarSummary.propTypes = {
    car: PropTypes.instanceOf(Object).isRequired,
    sid: PropTypes.string.isRequired,
};

export default CarSummary;
