import React from 'react';
import PropTypes from 'prop-types';
import Stars from 'components/widgets/stars';
import TrustYouSummary from 'components/widgets/trustYouSummary';
import AmenityIcons from 'libraries/common/AmenityIcons';
import Lang, { priceFormat } from 'libraries/common/Lang';

const WatchHotelResult = (props) => {
    const { products, parameters, id, setRemove } = props;

    const { hotel } = products;
    parameters.hotelID = hotel.unicaID || 0;
    const depDate = new Date(parameters.depDate);
    const retDate = new Date(parameters.retDate);
    return (
        <div id="watchlist_item_" className="product-component-container mb-4">
            <div className="product-component watch-list dealElement">
                <form className="row gutter-10 m-0" action="/search" method="GET">
                    <input type="hidden" name="request" value={JSON.stringify(parameters)} />
                    <div className="col-12 col-md px-0 product-img-container">
                        <img className="product-img w-100" src={hotel.image} alt={hotel.name} />
                    </div>
                    <div className="col-7 col-md product-title-container">
                        <div className="content-wrapper">
                            <div className="d-flex">
                                <div className="d-flex flex-column title-star-container">
                                    <div>
                                        <button type="submit" className="btn-unstyled product-title d-block mt-1 text-left ">{hotel.name}</button>
                                    </div>
                                    <div className="d-flex flex-column flex-sm-row flex-md-column flex-lg-row">
                                        <span className="rating align-self-sm-center align-self-md-start align-self-lg-center d-inline-block mt-2 mb-3 m-sm-0" title="4 stars">
                                            <Stars component={`HotelResult-${hotel.id}`} rating={hotel.rating} />
                                        </span>
                                        {hotel.reviews && (
                                            <TrustYouSummary data={hotel.reviews} />
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="my-3">
                                <svg className="icon mr-2" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-plane-ascend-right" />
                                </svg>
                                <span className="text-underline">{depDate.toDateString()} - {retDate.toDateString()}</span>
                            </div>
                            <div id="hotel-amenities-700248157" className="amenities-preview-list flex-wrap mb-0 mt-2">
                                {hotel.amenities && hotel.amenities.map((amenity) => (
                                    <svg className="icon-md mr-2" xmlnsXlink="http://www.w3.org/2000/xlink">
                                        <use xlinkHref={AmenityIcons.get(amenity)} />
                                    </svg>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="col-5 col-md price-container mt-1 mt-md-3 px-md-2 ">
                        <small className="text-danger d-block my-2" />
                        <a href="/hotel/details/700248157?sid=60b93168a28655.69723323" className="price-text " data-productid="700248157">{priceFormat(hotel.rate, 0)}</a>
                        <span className="d-none d-md-inline tax-include-text ml-1">PP</span>
                        <div className="tax-include-text mt-1 mt-md-0 mb-md-2">
                            <div className="d-md-none">{Lang.trans('common.per_person')}</div>
                            <div className="mt-1">{Lang.trans('common.includes_taxes')}</div>
                        </div>
                        <div className="d-inline-block">
                            <button type="submit" className="btn btn-primary btn-lg px-2 mt-1 " data-productid="700248157">
                                {Lang.trans('common.reserve')}
                                <svg className="d-none d-md-inline-block icon ml-1" title="" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-triangle-right" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <button className="btn-product-close" type="button" data-toggle="modal" data-target="#confirmWatchlistDelete" onClick={() => { setRemove(id); }}>
                        <svg className="icon" role="button" title="" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                            <use xlinkHref="/img/icons/icon-defs.svg#icon-close" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
};

WatchHotelResult.propTypes = {
    products: PropTypes.instanceOf(Object).isRequired,
    parameters: PropTypes.instanceOf(Object).isRequired,
    id: PropTypes.number.isRequired,
    setRemove: PropTypes.func.isRequired,
};

export default WatchHotelResult;
