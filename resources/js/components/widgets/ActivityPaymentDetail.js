import React,{forwardRef, useState, useImperativeHandle,useRef} from 'react';
import moment from 'moment';
import AriaModal from 'react-aria-modal';
import Select from '../selectors/Select';
import ErrorText from 'components/snippets/errorText';
import QuestionList from 'components/activities/questionList';
import CancelPolicy from 'components/activities/cancelPolicy';

import uniqueID from '../../helpers/uniqueID';
import Lang, { priceFormat } from 'libraries/common/Lang';

const ActivityPaymentDetail = forwardRef( (props,ref) => {
    const { step, selectedList, sid, isStandalone,removeOpt } = props;
    const { results, fare } = selectedList;
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

    const refArr = [];
    const [error, setError] = useState(false);

    const list = Object.values(results);
    let haveQuestion = false;
    const mdlList = [];
    for (let i = 0; i < list.length; i++) {
        refArr.push(useRef());
        const mdl = list[i];
        if (Object.prototype.hasOwnProperty.call(mdl, 'questions') && mdl.questions.length) {
            haveQuestion = true;
            mdlList.push(mdl);
        }
    }

    const checkError = () =>{
        let error = false;
        for (let i = 0; i < mdlList.length; i++) {
            if (refArr[i].current.errorCheck()) {
                error = true;
            }
        }
        setError(error);
        return error;
    };

    useImperativeHandle(ref, () => ({
        validate: () => {
           return checkError();
        },
        getAnswers: () => {
            const answers = {};
            for(let i = 0; i < mdlList.length; i++){
                const key = mdlList[i]['selectId'];
                answers[key] = refArr[i].current.getAnswers();
            }
            return answers;
        },

    }));

    return (
        <>
           { Object.keys(results).length>0 && (<div ref={ref} className="rounded-sm p-3 mb-3 box-shadow color-pop bg-white">
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
                                    <div className="col-4  col-md-3">
                                        <img className="w-100" src={item.thumbImg} />
                                    </div>
                                    <div className="col-8  mb-2">
                                        <div className="primary-color h6 mb-1"><strong>{activityName}</strong>{step === 'review' && <a href="#" onClick={(e)=>onRemove(e, item.selectId)} >Remove</a>}</div>
                                        <div className="d-flex align-items-center">
                                            <svg
                                                className="icon mr-1"
                                                width="100%"
                                                height="100%"
                                                xmlns="http://www.w3.org/2000/svg"
                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                            >
                                                <use xlinkHref="/img/icons/icon-defs.svg#icon-map-pin" />
                                            </svg>
                                            <span className="mt-1">{item.destination}</span>
                                        </div>
                                        <div className="">
                                            <svg
                                                className="icon mr-1"
                                                width="100%"
                                                height="100%"
                                                xmlns="http://www.w3.org/2000/svg"
                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                            >
                                                <use xlinkHref="/img/icons/icon-defs.svg#icon-calendar" />
                                            </svg>From Date: {item.selectDate.from}</div>
                                        {!isStandalone &&
                                        <div>
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

                                
                                {haveQuestion && (<div className='rounded-sm p-3 mb-3 box-shadow color-pop bg-white'>
                                        {error && (
                                            <div className="error-container w-100 mb-2">
                                                <ErrorText key='act-question' error={{message:'Please complete all the questions here'}} />
                                            </div>
                                        )}
                                        <div className="border-top pt-3 mt-3">
                                            {mdlList.map((_,i)=>(<QuestionList 
                                                                        key={``}
                                                                        validate={checkError}
                                                                        ref={refArr[i]}
                                                                        mdl={_}
                                                                    />))}
                                        </div>
                                    </div>)
                                }

                                {Object.prototype.hasOwnProperty.call(item, 'comments') &&
                                <div className="p-3 col-12">
                                    <div className="h6"><b>Remarks</b></div>
                                    <div className="">{item.comments.text}</div>
                                </div>}
                                <CancelPolicy totalAmount={fare}  item={item} />
                            </div>
                        );
                    })}
            </div>)
           }
        </>
    );
});

export default ActivityPaymentDetail;
