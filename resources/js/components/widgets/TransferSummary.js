import React from 'react';
import PropTypes from 'prop-types';
import Lang, { priceFormat } from 'libraries/common/Lang';

const TransferSummary = (props) => {
    const { step, selectedList, sid, removeOpt } = props;
    const { results } = selectedList;

    const onRemove = (e, rowId) => {
        e.preventDefault();
        removeOpt('transfer', rowId)
    }

    return (
        <>
           {Object.keys(results).length >0  && (<div className="border-top p-lg-3">
                <h5 className="mb-2 primary-color">Transportation Details</h5>
                {step === 'review' && (
                    <a className="btn-underline-link"  href="#transfer-options-list" data-productid="">
                        {results ? 'Change Transportation' : 'Add Transportation'}
                    </a>
                )}
                {step === 'payment' && (
                    <a className="btn-underline-link"  href={`/review/?sid=${sid}#transfer-options-list`} data-productid="">
                        {results ? 'Change Transportation' : 'Add Transportation'}
                    </a>
                )}
                { Object.entries(results).map((arrItem, index) => {
                        const item = arrItem[1];
                        const { airport } = item;
                        const transferType = `${item.transferType} ${item.vehicle.name}`;
                        return (
                            <div key={`select-transfer-${index}`} className="row">
                                <div className="col-12 col-md-6">
                                    <img className="w-100" src={item.thumbImg} />
                                </div>
                                <div className="col-12">
                                    <div>{`${transferType}:${airport}`} <a href="#" onClick={(e)=>onRemove(e, item.rowId)}>Remove</a></div>
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
                                        <svg
                                            className="icon-sm mr-1"
                                            width="100%"
                                            height="100%"
                                            xmlns="http://www.w3.org/2000/svg"
                                            xmlnsXlink="http://www.w3.org/1999/xlink"
                                        >
                                            <use xlinkHref="/img/icons/icon-defs.svg#icon-dollar-sign-circle" />
                                        </svg>
                                        {`${priceFormat(item.price.totalAmount)}`}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </div>)
            }
        </>
    );
};

TransferSummary.propTypes = {
    step: PropTypes.string,
    sid:PropTypes.string,
    removeOpt: PropTypes.func.isRequired,
    selectedList: PropTypes.instanceOf(Object).isRequired,
};

export default TransferSummary;
