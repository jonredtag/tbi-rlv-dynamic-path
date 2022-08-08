import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AriaModal from 'react-aria-modal';
import ReactPaginate from 'react-paginate';
import Lang, { priceFormat } from 'libraries/common/Lang';

const TransferOptions = (props) => {
    const { options, addOpt, removeOpt, selectOpts, totalPax, totalResults, paginate } = props;
    const [descInfo, setDescInfo] = useState({
        title: '',
        descList: {
            arr: null,
            dep: null,
            airport: null,
            hotel: null,
        },
    });
    const [showMore, setShowMore] = useState(false);
    const numPerPage = 4;
    const pageRangeDisplayed = 10;

    const add = (index) => {
        addOpt('transfer', index);
    };
    const remove = (index) => {
        removeOpt('transfer', index);
    };

    const handlePageClick = (data) => {
        const { selected } = data;
        paginate(selected, 'transfer');
    };

    const showMoreInfo = (title, airport, hotel, descList) => {
        setDescInfo({
            title,
            airport,
            hotel,
            descList,
        });
        setShowMore(true);
    };
    const closeModal = () => {
        setShowMore(false);
    };

    const showDescDetail = (info) => (
        <div className="dates-list-wrapper">
            <ul className="list-unstyled mt-2">
                {info.pickupDesc && (
                    <li>
                        <div>
                            <strong>Pick Up Description</strong>
                        </div>
                        <div>{info.pickupDesc}</div>
                    </li>
                )}
                {info.pickupLocation && (
                    <li>
                        <div>
                            <strong>Pick Up Location</strong>
                        </div>
                        <div>{info.pickupLocation}</div>
                    </li>
                )}
                {info.pickupTime && (
                    <li>
                        <div>
                            <strong>Pick Up Date/Time</strong>
                        </div>
                        <div>{info.pickupTime}</div>
                    </li>
                )}

                {info.generalDesc && (
                    <li>
                        <div>
                            <strong>General Description</strong>
                        </div>
                        <div>{info.generalDesc}</div>
                    </li>
                )}
                {info.guideline && (
                    <li>
                        <div>
                            <strong>Guide inforation</strong>
                        </div>
                        <div>
                            <ul className="">
                                {info.guideline.map((item, idx) => (
                                    <li key={`guideline-${idx}`}>
                                        <strong>{item.title}:</strong>
                                        {item.desc}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </li>
                )}
            </ul>
        </div>
    );

    return (
        <>
            <section id="transfer-options-list" className="rounded-sm p-3 mb-3 box-shadow bg-white">
                <h5 className="mt-2 primary-color">Getting to and from your hotel</h5>
                {options.map((item, index) => {
                    const { hotel, airport, rowId } = item;
                    const transferType = `${item.transferType} ${item.vehicle.name}`;

                    return (
                        <div key={`tr-${rowId}`} className="row my-3">
                            <div className="col-4 col-sm-3 col-md-3">
                                <img className="w-100" src={item.thumbImg} />
                            </div>
                            <div className="col-8 col-sm-4 mb-1">
                                <div className="primary-color h6">{`${transferType}`}</div>
                                <div>{`${hotel}`}<svg className="icon ml-2 mr-1 align-middle" width="100%" height="100%"xmlns="http://www.w3.org/2000/svg"xmlnsXlink="http://www.w3.org/1999/xlink"><use xlinkHref="/img/icons/icon-defs.svg#icon-arrow-dot" /></svg>{`${airport}`}</div>
                                <div>
                                    <svg
                                        className="icon-sm mr-1"
                                        width="100%"
                                        height="100%"
                                        xmlns="http://www.w3.org/2000/svg"
                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                    >
                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-user" />
                                    </svg>
                                    {item.maxCapacity}
                                </div>
                                <a
                                    className=""
                                    href="#"
                                    onClick={() => showMoreInfo(transferType, airport, hotel, item.desc)}
                                >
                                    Show more information
                                </a>
                            </div>

                            <div className=" col-12 col-sm-5 text-right">
                                <div className="price-text h6 font-weight-bold mb-0">
                                    CAD {`${priceFormat(item.price.totalAmount)}`}
                                </div>
                                <div className="secondary-color">
                                    <small>roundtrip for {totalPax} travellers</small>
                                </div>
                                {selectOpts.includes(`${rowId}`) ? (
                                    <button
                                        type="button"
                                        className="btn btn-link  py-3 col-6 col-sm-8 col-lg-7  h6 font-weight-bold"
                                        onClick={() => remove(rowId)}
                                    >
                                        <span className="close-details">Remove from Trip</span>
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        className="btn btn-secondary  py-3 col-6 col-sm-8 col-lg-7  h6 font-weight-bold"
                                        onClick={() => add(rowId)}
                                    >
                                        <span className="open-details">Add to Trip</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </section>
             {options.length > 0 && (<div>
                <ReactPaginate
                    previousLabel="Prev"
                    nextLabel="Next"
                    breakLabel="..."
                    breakClassName="break-me"
                    pageCount={Math.ceil(totalResults / numPerPage)}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={pageRangeDisplayed}
                    onPageChange={handlePageClick}
                    containerClassName="pagination"
                    activeClassName="active"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    nextClassName="page-item"
                    previousLinkClassName="page-link"
                    nextLinkClassName="page-link"
                />
            </div>)}
            {showMore && (
                <AriaModal
                    onExit={closeModal}
                    initialFocus="#mdl-content"
                    aria-describedby="mdl-content"
                    titleId="mdl-title"
                    aria-labelledby="mdl-title"
                    dialogStyle={{ width: '1000px' }}
                    aria-modal="true"
                    verticallyCenter
                >
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content modal">
                            <div className="modal-header modal-solid-header-bar">
                                <h5 className="modal-title h4 ">
                                    <div className="header-text">
                                        <h2 className="modal-title" id="mdl-title">
                                            {descInfo.title}
                                        </h2>
                                    </div>
                                </h5>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="close close-lg pt-3"
                                    aria-label="Close"
                                >
                                    <span className="pt-md-1 d-inline-block" aria-hidden="true">
                                        ×
                                    </span>
                                </button>
                            </div>
                            <div className="modal-main" id="mdl-content">
                                <div className="content">
                                    <h5>
                                        From {`${descInfo.airport}`} to {`${descInfo.hotel}`}
                                    </h5>
                                    {showDescDetail(descInfo.descList.arr)}

                                    <h5>
                                        From {`${descInfo.hotel}`} to {`${descInfo.airport}`}
                                    </h5>
                                    {showDescDetail(descInfo.descList.dep)}
                                </div>
                            </div>
                        </div>
                    </div>
                </AriaModal>
            )}
        </>
    );
};

TransferOptions.propTypes = {
    options: PropTypes.instanceOf(Object).isRequired,
    addOpt: PropTypes.func.isRequired,
    removeOpt: PropTypes.func.isRequired,
    selectOpts: PropTypes.instanceOf(Array).isRequired,
    totalPax: PropTypes.number.isRequired,
    paginate: PropTypes.func.isRequired,
    totalResults: PropTypes.number.isRequired,
};

export default TransferOptions;
