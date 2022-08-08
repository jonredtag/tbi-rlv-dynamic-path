import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Lang, { priceFormat } from 'libraries/common/Lang';
import ShowUpLift from 'components/common/ShowUpLift';
import UncontrolledPopover from 'reactstrap/lib/UncontrolledPopover';
import PopoverBody from 'reactstrap/lib/PopoverBody';

const ActivityResult = (props) => {
    const { result, index, sid, travelDate } = props;

    const imageOutput =
        result.thumbImg !== null && result.thumbImg !== ''
            ? result.thumbImg
            : 'https://travel-img.s3.amazonaws.com/2020-07-14--15947010820462no-photo.png';

    return (
        <>
            <div className="product-component-container">
                <div className="product-component hotel-search-results dealElement">
                    <div className="row gutter-10 m-0 ">
                        <div className="col-12 col-md px-0 product-img-container">
                            <img className="product-img w-100" src={imageOutput} alt={result.name} />
                        </div>
                        <div className="col-12 col-sm-7 col-md product-title-container px-2">
                            <div className="content-wrapper">
                                <div className="d-flex">
                                    <div className="d-flex flex-column title-star-container">
                                        <div>
                                            <a className="product-title d-block mt-1 hotel-search-result"href={`/activity/details/${result.code}?sid=${sid}`}data-productid={result.code}>{result.name}</a>
                                        </div>
                                        <div className="d-flex my-2">
                                            <svg className="icon mr-1"width="100%"height="100%"xmlns="http://www.w3.org/2000/svg"xmlnsXlink="http://www.w3.org/1999/xlink">
                                                <use xlinkHref="/img/icons/icon-defs.svg#icon-map-pin" />
                                            </svg>
                                            <div>{result.location.addr}</div>
                                        </div>
                                        <div className="mb-2"><b>{result.categories.join(",")}</b></div>
                                        <div className="overflow-hidden overflow-hide-review mb-2"
                                            style={{ height: '43px' }}
                                            dangerouslySetInnerHTML={{ __html: result.description }}
                                        />
                                        <div>
                                            <svg className="icon mr-1"width="100%"height="100%"xmlns="http://www.w3.org/2000/svg"xmlnsXlink="http://www.w3.org/1999/xlink">
                                                <use xlinkHref="/img/icons/icon-defs.svg#icon-clock" />
                                            </svg><span className="font-weight-bold">{result.duration.join(",")}</span>
                                            { Object.prototype.hasOwnProperty.call(result,'scheduling')
                                                && result.scheduling && Object.prototype.hasOwnProperty.call(result.scheduling,'duration') && <span className="font-weight-normal">{`:${result.scheduling.duration.value} ${result.scheduling.duration.metric.toLowerCase()}`}</span>
                                            }
                                            
                                            {result.tourLang !='' &&
                                                <div className="font-weight-bold">
                                                    <svg className="icon mr-1"width="100%"height="100%"xmlns="http://www.w3.org/2000/svg"xmlnsXlink="http://www.w3.org/1999/xlink">
                                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-clock" />
                                                    </svg>Guides in {result.tourLang.join(",")}
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-sm-5 col-md mt-2 mt-md-0 px-2 pb-2 pr-0 price-container text-right text-md-center">
                            <div className='act-num-ava d-none'>{result.numOfOptAva} option{result.numOfOptAva>1?'s':''} avaiable</div>
                            <div className=' d-inline-block text-center'>
                                <div className="d-flex text-center justify-content-between d-sm-inline-block mt-2  pb-sm-2">
                                    <div className="discount-section">
                                        <span className="was-price">${parseFloat(result.price.gatePrice).toFixed(2)}</span>
                                        <span className="save-price">{result.price.cheapRate >0 &&  <div>Save {parseFloat(result.price.cheapRate*100).toFixed(2)}%  </div>}</span>
                                    </div>
                                    <div className="price-text hotel-search-result" data-productid={result.id}>
                                        <span className="tax-include-text mr-1">From</span>{priceFormat(Math.max(result.price.adultPrice, 0), 0)}<span className="tax-include-text ml-1">PP</span>
                                    </div>
                                </div>
                            </div>
                            <div className="d-md-inline-block">
                                <a
                                    href={`/activity/details/${result.code}?sid=${sid}`}
                                    className="btn btn-primary btn-lg hotel-search-result"
                                    data-productid={result.code}>
                                    {Lang.trans('buttons.continue')}
                                    <svg
                                        className="icon ml-1"
                                        title=""
                                        width="100%"
                                        height="100%"
                                        xmlns="http://www.w3.org/2000/svg"
                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                    >
                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-triangle-right" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

ActivityResult.propTypes = {
    result: PropTypes.instanceOf(Object).isRequired,
    sid: PropTypes.string.isRequired,
    travelDate: PropTypes.string.isRequired,
};

export default ActivityResult;
