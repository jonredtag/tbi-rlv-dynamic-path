import React from 'react';
import PropTypes from 'prop-types';
import Lang, { priceFormat } from 'libraries/common/Lang';

const ActivitySummary = (props) => {
    const { step, selectedList, sid, isStandalone,removeOpt } = props;
    const { results } = selectedList;
    const onRemove = (e, code) =>{
        e.preventDefault();
        removeOpt('activity',code)
    };

    const onPaymentChangeActitity = (e) =>{
        e.preventDefault();
        if(isStandalone){
            window.history.go(-1);
        } else {
            window.location = `/review/?sid=${sid}#activity-options-list`;
        }
    };

    return (
        <>
           { Object.keys(results).length>0 && (<div className="border-top p-lg-3">
                <h5 className="mb-2 primary-color">Activity Details</h5>
                {step === 'review' && (
                    <a className="btn-underline-link" href="#activity-options-list" data-productid="">
                        {results ? 'Change Activity' : 'Add Activity'}
                    </a>
                )}
                {step === 'payment' && (
                    <a className="btn-underline-link" onClick={onPaymentChangeActitity}  href="#" data-productid="">
                        {results ? 'Change Activity' : 'Add Activity'}
                    </a>
                )}
                { Object.values(results).map((item,index) => {
                        const activityName = item.name;
                        return (
                            <div key={`select-activity-${index}`} className="row">
                                <div className="col-12 col-md-6">
                                    <img className="w-100" src={item.thumbImg} />
                                </div>
                                <div className="col-12">
                                    <div>{activityName} {step === 'review' && <a href="#" onClick={(e)=>onRemove(e, item.selectId)} >Remove</a>}</div>
                                    <div>Date: {item.selectDate.from}</div>
                                    
                                    {!isStandalone && <div>
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
                                    }
                                </div>
                                
                            </div>
                        );
                    })}
            </div>)
           }
        </>
    );
};

ActivitySummary.propTypes = {
    step: PropTypes.string,
    sid:PropTypes.string,
    removeOpt: PropTypes.func,
    selectedList: PropTypes.instanceOf(Object).isRequired,
};

export default ActivitySummary;
