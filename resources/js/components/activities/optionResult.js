import React, { useState, useEffect } from 'react';
import AriaModal from 'react-aria-modal';
import Select from '../selectors/Select';
import Lang, { priceFormat } from 'libraries/common/Lang';
import uniqueID from '../../helpers/uniqueID';

const OptionResult = (props) => {
    const { onSelect, mdl, dateFilter } = props;
   // const [selectDateOpt, setSeletDateOpt] = useState({});
   // const [selectAddOpt, setSelectAddonOpt] = useState([]);
    const [optQuestions, setOptQuestions] = useState({});
    const [showPaxModal, setShowPaxModal] = useState(false);
    const [paxCount, setPaxCount] = useState();
    const [questValid, setQuestValid] = useState(true);
    const [paxValid, setPaxValid] = useState(true);

    const getPaxsSelection = () =>{
        let adults = 0;
        let children = 0;
        const ages = [];

        for (let paxIdx = 0; paxIdx < mdl.paxAmounts.length; paxIdx++) {
            if(paxCount){
                if (mdl.paxAmounts[paxIdx].paxType === 'adult') {
                    const adultCount = paxCount[paxIdx];
                    adults += adultCount;
                } else {
                    const childCount = paxCount[paxIdx];
                    children += childCount;
                    for(let i=0; i<childCount; i++){
                        ages.push(mdl.paxAmounts[paxIdx].age);
                    }
                }
            }
        }
        return {adults, children, ages};
    };


    useEffect(() => {
        const paxCountObj = {};
        for (let paxIdx = 0; paxIdx < mdl.paxAmounts.length; paxIdx++) {
            paxCountObj[paxIdx] = mdl.paxAmounts[paxIdx].paxType === 'adult' ? 1 : 0;
        }
        setPaxCount(paxCountObj);
    }, []);

    /*
    const onSelectDateChange = (value) => {
        const splitKeys = value.split('|');
        const key = splitKeys[0];
        selectDateOpt[key] = splitKeys[1];
        // setSeletDateOpt({ ...selectDateOpt });
    };
    */

    const onChangeQuestion = (key, e) => {
        optQuestions[key] = e.target.value;
        setOptQuestions({ ...optQuestions });
    };

    const add = (mdlKey, questionsKeys) => {
        const answers = {};
        let questionOk = true;
        if (questionsKeys.length) {
            for (let i = 0; i < questionsKeys.length; i++) {
                const key = questionsKeys[i];
                if (Object.prototype.hasOwnProperty.call(optQuestions, key)) {
                    answers[key] = optQuestions[key];
                } else {
                    document.getElementById(key).focus();
                    questionOk = false;
                }
            }
        }
        const paxs = getPaxsSelection();
        const {adults, children, ages} = paxs;
        let paxOk = true;
        if((adults + children) === 0) {
            paxOk = false;
        }
        setPaxValid(paxOk);
        setQuestValid(questionOk);
        if(!(paxOk && questionOk)){
            return;
        }
        setPaxValid(true);
       // selectAddOpt.push(mdlKey);

        const index = mdl.operationDates.findIndex((item)=> dateFilter.key == item.text);

        const key = `${mdlKey}|${index}`;
        onSelect('activity', key, paxs, paxCount, answers);
    };

    const openPaxModalSelection = () => {
        setShowPaxModal(true);
    };

    const onClickClosePaxModal = () => {
        setShowPaxModal(false);
    };

    const selectPaxDone = () => {
        setShowPaxModal(false);
    };
    const clickUpdatePaxCount = (paxIndex, oper) => {
        if (oper === '+') {
            paxCount[paxIndex] = paxCount[paxIndex] + 1;
        } else if (paxCount[paxIndex] > 0) {
            paxCount[paxIndex] = paxCount[paxIndex] - 1;
        }
        setPaxCount({ ...paxCount });
    };

    /*
    const selectedValue = Object.prototype.hasOwnProperty.call(selectDateOpt, mdl.key)
        ? `${mdl.key}|${selectDateOpt[mdl.key]}`
        : '';
    */

    const questionsKeys = Object.prototype.hasOwnProperty.call(mdl, 'questions')
        ? mdl.questions.map((item) => item.key)
        : [];


    const {adults, children} = getPaxsSelection();

    const priceListShow = [];
    let totalAmount = 0;
    if(paxCount){
        for (const [key, value] of Object.entries(paxCount)) {
           if(value >0){
                const amount  = mdl.paxAmounts[key].amount*value;
                priceListShow.push(<li className="price-sub_item" key={`${mdl.key}_${key}_price`} ><span className="sub_item_detail">CA {priceFormat(mdl.paxAmounts[key].amount)} X {value} {mdl.paxAmounts[key].paxType==='adult'? `Adult${value>1?'s':''}`:`${value>1?'children':'child'} (age:${mdl.paxAmounts[key].age})`}</span>&nbsp;<span className="sub-item_total">CA {priceFormat(amount)}</span></li>);
                totalAmount += amount;
            }
        }
    }
    priceListShow.push(<li className="price-total_item" key={`${mdl.key}_total_price`} ><span className="sub_item_detail">Total</span>&nbsp;<span className="sub-item_total">CA {priceFormat(totalAmount)}</span></li>);


    return (
        <div className={dateFilter.data.includes(mdl.key)? "mb-2":"hide"}>
            <div className="" key={mdl.key}>
                <div className="row gutter-10">
                    <div className="col-12">
                        <h5>{mdl.name}</h5>
                        <div className="d-flex mb-3">
                            <div className="pl-3 ml-3 border-left">
                                <span className="font-weight-bold">{mdl.duration}</span>
                                {/*
                                <div className="">
                                    <div className="mt-2 element-container input-chevron-down w-auto">
                                        <Select
                                            id={uniqueID()}
                                            list={mdl.operationDates}
                                            onChange={onSelectDateChange}
                                            selectedValue={selectedValue}
                                            classes="form-control bg-grey"
                                        />
                                    </div>
                                </div>
                                */}
                            </div>
                            <div className="pl-3 ml-3 border-left">
                                <span>Travellers</span>
                                <button
                                    type="button"
                                    className="btn btn-secondary  py-3 h6 font-weight-bold  px-4 mb-0 w-100 "
                                    onClick={() => openPaxModalSelection()}
                                >
                                    <span className="close-details">
                                        {`${adults} Adult${adults>1?'s':''}`}
                                        {children > 0 ? ` ${children} ${children>1?`Children`:'Child'}`: ''}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                    {Object.prototype.hasOwnProperty.call(mdl, 'questions') && mdl.questions.length > 0 && (
                        <>
                            {mdl.questions.map((item) => (
                                <div className="col-12 col-sm-6 col-xl-4 mb-2 align-self-end" key={item.key}>
                                    <span>{item.text}</span>
                                    <div>
                                        <input
                                            id={item.key}
                                            type="text"
                                            value={
                                                Object.prototype.hasOwnProperty.call(optQuestions, item.key)
                                                    ? optQuestions[item.key]
                                                    : ''
                                            }
                                            className="form-control border"
                                            onChange={(e) => onChangeQuestion(item.key, e)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                    <div className="col-4 col-sm-5 col-md-3 col-lg-4 col-xl-3 mb-2 align-self-end">
                       <button
                                type="button"
                                className="btn btn-secondary  py-3 h6 font-weight-bold  px-4 mb-0 w-100"
                                onClick={() => add(mdl.key, questionsKeys)}
                            >
                                <span className="close-details">Book</span>

                        </button>
                        {!questValid && (<div className="error-text">Please fill questions</div>)}
                        {!paxValid && (<div className="error-text">Please select pax </div>)}
                        <div>
                           <ul className="price-detail">
                            {priceListShow}
                           </ul>
                        </div>
                    </div>
                </div>
            </div>
            {showPaxModal && (
                <AriaModal
                    onExit={onClickClosePaxModal}
                    titleId="modal-pax-title"
                    aria-modal="true"
                    initialFocus="#mdl-pax-content"
                    aria-describedby="mdl-pax-content"
                    dialogClass="modal-lg"
                    dialogStyle={{ marginTop: '50px', width: '500px' }}
                    alert={false}
                >
                    <div className="modal-content modal">
                        <div id="modal-pax-title" className="modal-header">
                            <button className="btn-unstyled" type="button" onClick={onClickClosePaxModal}>
                                <svg
                                    className="icon mr-3 "
                                    role="button"
                                    title=""
                                    width="100%"
                                    height="100%"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                >
                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-close" />
                                </svg>
                                <span className="h6">Travellers</span>
                            </button>
                        </div>
                        <div
                            style={{
                                height: '300px',
                                width: '100%',
                                padding: '0px',
                            }}
                            className="modal-main"
                            id="mdl-pax-content"
                        >
                            <h5>{mdl.name}</h5>
                            <div>
                                <ul className="mb-0">
                                    {mdl.paxAmounts.map((pax, paxIdx) => (
                                        <li className="mr-2" key={`${mdl.key}_${paxIdx}`}>
                                            <div>
                                                {`${pax.paxType}${
                                                    pax.paxType !== 'adult' ? `(Age:${pax.age})` : ''
                                                }:$${pax.amount}`}
                                            </div>
                                            <div>
                                                <span onClick={() => clickUpdatePaxCount(paxIdx, '-')}>
                                                    &nbsp;-&nbsp;
                                                </span>
                                                {paxCount[paxIdx]}
                                                <span onClick={() => clickUpdatePaxCount(paxIdx, '+')}>
                                                    &nbsp;+&nbsp;
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div>
                            <button
                                type="button"
                                className="btn btn-secondary  py-3 h6 font-weight-bold  px-4 mb-0 w-100"
                                onClick={() => selectPaxDone()}
                            >
                                <span className="close-details">Done</span>
                            </button>
                        </div>
                    </div>
                </AriaModal>
            )}
        </div>
    );
};

export default OptionResult;
