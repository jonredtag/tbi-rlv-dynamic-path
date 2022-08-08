import React from 'react';
import Lang, { priceFormat } from 'libraries/common/Lang';
import Formatter from 'helpers/formatter';

const ActivityPaxSelect = (props) => {
    const { results, paxCount, totalAmount, selectedMdl, cheapRate,
            selectedMdlIndex, avaMdlList, onActivitySelect, 
            onActivityDateSelect, onContinue, clickUpdatePaxCount 
        } = props;

    const tourLang = [];
    if(avaMdlList && avaMdlList.length>0){
        avaMdlList.forEach((item,mdlIndex)=>{
            if(Object.prototype.hasOwnProperty.call(item,'tourLang')){
                tourLang.push({mdlIndex,desc: item.tourLang});
            }
        })
    }
    let savedPrice = 0;
    if(cheapRate >0) {
        const gatePrice =  totalAmount/(1-cheapRate);
        savedPrice =  parseFloat(gatePrice-totalAmount).toFixed(2);
    }     
        
    
    return (
            <>
                <div className="rounded bg-grey p-3">
                    <div className="d-flex mb-2">
                        <h2 className="h4 font-weight-bold">Select date and tour options</h2>
                    </div>
                    <div className="row ">
                        <div className="col-12 ">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="d-flex flex-column mb-2">
                                        <label>Please select a tour date</label>
                                        <div className="element-container input-chevron-down w-auto">
                                            <select className="form-control" onChange={(e)=>onActivityDateSelect(e)}>
                                                    {results.dateFilters.map((dateInfo, index) => (
                                                         <option key={`key-${dateInfo.key}`} value={index}>{dateInfo.key}</option>
                                                    ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                {results.tourLang && results.tourLang.length>0 ?
                                    <div className="col-md-6">
                                        <div className="d-flex flex-column mb-2">
                                            <label>Language</label>
                                            <div className="element-container input-chevron-down w-auto">
                                                <select className="form-control" value={selectedMdlIndex} onChange={(e)=>onActivitySelect(e)}>
                                                    {tourLang.map(langInfo => (
                                                        <option key={`lang-${langInfo['mdlIndex']}`} value={langInfo['mdlIndex']}>{langInfo['desc']}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>:
                                    <div className="col-md-6">
                                        <div className="d-flex flex-column mb-2">
                                            <label>Type of Ticket</label>
                                            <div className="element-container input-chevron-down w-auto">
                                                <select className="form-control" value={selectedMdlIndex} onChange={onActivitySelect}>
                                                    {/* {avaMdlList.map((mdl, mdlIndex) => (
                                                        <option key={mdl.key} value={mdlIndex}>{mdl.title}</option>
                                                    ))} */}
                                                    {avaMdlList.sort((a, b) => (a.title > b.title) ? 1 : -1).map((mdl, mdlIndex) => (
                                                        <option key={mdl.key} value={mdlIndex} >{mdl.title}</option>
                                                    ))}

                                                </select>
                                            </div>
                                        </div>
                                    </div>}
                            </div>
                            {/*
                            <div className="d-flex flex-column mb-2">
                                <label>Please select time</label>
                                <div className="element-container input-chevron-down w-auto">
                                    <select className="form-control">
                                        <option value="">8:30am</option>
                                        <option value="">8:30am</option>
                                        <option value="">8:30am</option>
                                        <option value="">8:30am</option>
                                    </select>
                                </div>
                            </div>
                            */}
                        </div>
                        <div className="col-12">
                            <label>Quantity</label>
                            {selectedMdl && paxCount && selectedMdl.paxAmounts.map((pax, paxIdx) =>(
                                <div key={`${selectedMdl.key}_${paxIdx}`} className="bg-white p-3 d-flex justify-content-between mb-2 border rounded">
                                    <span className="align-self-center h6 mb-0">{`${Formatter.capitalizeFirstLetter(pax.paxType)}${
                                            pax.paxType !== 'adult' ? `(Age:${pax.age})` : ''}`}</span>
                                    <div className="d-flex">
                                        <span className="h5 mb-0 primary-color align-self-center mr-3">{priceFormat(pax.amount)}</span>

                                        <button onClick={() => clickUpdatePaxCount(paxIdx, '-')} className="btn-unstyled">
                                            <svg
                                                className="icon-lg"
                                                width="100%"
                                                height="100%"
                                                xmlns="http://www.w3.org/2000/svg"
                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                            >
                                                <use xlinkHref="/img/icons/icon-defs.svg#icon-minus-circle" />
                                            </svg>
                                        </button>
                                        <span className="mx-3 h6 mb-0 align-self-center">{paxCount[paxIdx]}</span>
                                        <button onClick={() => clickUpdatePaxCount(paxIdx, '+')} className="btn-unstyled">
                                            <svg
                                                className="icon-lg"
                                                width="100%"
                                                height="100%"
                                                xmlns="http://www.w3.org/2000/svg"
                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                            >
                                                <use xlinkHref="/img/icons/icon-defs.svg#icon-plus-circle" />
                                            </svg>
                                        </button>

                                    </div>
                                </div>))}
                            <div className=" ">
                                {cheapRate >0 &&  <div className="green-text font-weight-bold">{parseFloat(cheapRate*100).toFixed(2)} % cheaper (-{savedPrice} {APP_CURRENCY}) than gate price</div>}
                                <div className="d-flex justify-content-between">
                                    <div className="d-flex">
                                        <div className="h4 mb-0 mr-3 align-self-center">Total</div>
                                        <div className="h4 primary-color mb-0 align-self-center">{priceFormat(totalAmount)}</div>
                                    </div>
                                    <button onClick={()=>onContinue()} className="btn btn-primary align-self-center h5 mb-0">{Lang.trans('buttons.continue')}</button>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        </>
    );
};


export default ActivityPaxSelect;
