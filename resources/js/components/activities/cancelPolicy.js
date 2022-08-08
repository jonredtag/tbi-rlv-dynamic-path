import React from 'react';
import Lang, { priceFormat } from 'libraries/common/Lang';
import moment from 'moment';


const CancelPolicy = (props) => {
    const {item, totalAmount} = props;
    if(item.selectDate.cancellationPolicies && item.selectDate.cancellationPolicies.length) {
        const dateFrom = moment(item.selectDate.cancellationPolicies[0]['dateFrom']);
        const cancelDate = moment(item.selectDate.cancellationPolicies[0]['dateFrom']).subtract(1,'minutes');
    
         return (<div className="border-top col-12 ">
                <div className="row mt-3">
                    <div className="col-12 col-md-6 border-md-right">
                        <div className="row gutter-10">
                            <div className="col-12"><b>Cancellation fees</b></div>
                            <div className="col-8 green-text font-weight-bold">
                                Until {cancelDate.format('HH:mm')} {cancelDate.format('A')} on {cancelDate.format('MM/DD/YYYY')}
                            </div>
                            <div className="col-4 text-right green-text font-weight-bold">
                                <svg className="mr-1 icon-md green-check-bg-light-green align-middle"width="100%"height="100%"xmlns="http://www.w3.org/2000/svg"xmlnsXlink="http://www.w3.org/1999/xlink">
                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-checkmark-round" />
                                </svg>Free
                            </div>
                            <div className="col-8">
                                From on { dateFrom.format('YYYY-MM-DD HH:mm')} {dateFrom.format('A')}
                            </div>
                            <div className="col-4 text-right red-text">
                                <strong> {`${priceFormat(totalAmount)}`}</strong>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-6 align-self-center">
                        <div className="text-muted">
                            <small>Date and time are calculated based on local time in the destination. In case of no-show, different fees will apply. Please refer to our T&C.</small>
                        </div>
                    </div>
                </div>
            </div>)
     } else return null;

};

export default CancelPolicy;
