/* global Uplift, tripInfo */
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import DynamicEngine from 'components/engines/dynamicEngine';
import BookingSteps from 'components/common/BookingSteps';
import DetailHeader from 'components/activities/detailHeader';
import DetailGallery from 'components/activities/detailGallery';
import PaxSelect from 'components/activities/detailPaxSelect';
import OptionResult from 'components/activities/optionResult';
import HotelDetailsOverviewLoader from 'components/widgets/hotelDetailsOverviewLoader';
import Profile from 'components/widgets/profile';
import errorModal from 'helpers/errorModal';
import Formatter from 'helpers/formatter';
import customModal from 'helpers/customModal';
import Loader from 'components/common/Loader';
import Lang, { priceFormat } from 'libraries/common/Lang';


import { Element } from 'react-scroll';

import 'react-dates/initialize';

const DynActivityDetails = (props) => {
    const {
        sid,
        activity,
        parameters,
        breadcrumbs,
        features,
        profileConfig,
    } = props;

    const [results, setResults] = useState();
    const [loading, setLoading] = useState(false);
    const [avaMdlList, setAvaMdlList] = useState([]);
    const [paxCount, setPaxCount] = useState();
    const [cheapRate,setCheapRate] =  useState(0);
    const [selectedMdlIndex, setSelectedMdlIndex] = useState(0);
    const [selectedDate, setSelectedDate] = useState();
 
    const updateAvaList = (avaKeys, options) =>{
        const avaMdlList = [];
        if (avaKeys.length) {
            for (let i = 0; i < avaKeys.length; i++){
                const key = avaKeys[i];
                for (let j = 0; j < options.length; j++){
                    const mdl = options[j];
                    if(mdl.key === key){
                        avaMdlList.push(mdl);
                        break;
                    }
                }
            }
        }
        setAvaMdlList(avaMdlList);

        setSelectedMdlIndex(0);
        const mdl = avaMdlList[0];
        const paxCountObj = {};
        for (let paxIdx = 0; paxIdx < mdl.paxAmounts.length; paxIdx++) {
            paxCountObj[paxIdx] = mdl.paxAmounts[paxIdx].paxType === 'adult' ? 1 : 0;
        }
        setPaxCount(paxCountObj);
        setCheapRate(mdl.price.cheapRate);
    };

    const onActivitySelect = (e) => {
        const index = e.target.value;
        setSelectedMdlIndex(index);
    };

    const onActivityDateSelect = (e)=> {
        const index = e.target.value;
        updateAvaList(results.dateFilters[index].data, results.options);
        setSelectedDate(results.dateFilters[index].key);
        setSelectedMdlIndex(0);
    };


    useEffect(() => {
        const url = `/api/activity/details?id=${activity}&sid=${sid}`;
        //consider to reload page from payment step 
        setLoading(true);
        const promise = fetch(url);
        promise
            .then((response) => response.json())
            .then((data) => {
                if (data.error !== undefined) {
                    errorModal(data.error);
                } else {
                    const basicValid = data !== null && Object.keys(data.options).length > 0;
                    if (!basicValid) {
                        const optionsError = {
                            code: 'r-01',
                            message: 'No activities available, please select another activity.',
                            buttons: [
                                {
                                    text: 'OK',
                                    type: 'secondary',
                                    onClick: () => {
                                        window.history.back();
                                    },
                                },
                            ],
                        };
                        customModal(optionsError);
                    }
                    setLoading(false);
                    setResults(data);
                    updateAvaList(data.dateFilters[0].data, data.options);
                    setSelectedDate(data.dateFilters[0].key);
                    if (UPLIFT_FEATURE && typeof Uplift !== 'undefined') {
                        setTimeout(() => {
                            Uplift.Payments.update(tripInfo, () => {});
                        }, 200);
                    }
                }
            });
        promise.catch(() => {
             setLoading(false);
        });
    }, []);

    const getPaxsSelection = () =>{
        let adults = 0;
        let children = 0;
        const ages = [];
        const { paxAmounts } = avaMdlList[selectedMdlIndex];
        for (let paxIdx = 0; paxIdx < paxAmounts.length; paxIdx++) {
            if(paxCount){
                if (paxAmounts[paxIdx].paxType === 'adult') {
                    const adultCount = paxCount[paxIdx];
                    adults += adultCount;
                } else {
                    const childCount = paxCount[paxIdx];
                    children += childCount;
                    for(let i=0; i<childCount; i++){
                        ages.push(paxAmounts[paxIdx].age);
                    }
                }
            }
        }
        return {adults, children, ages};
    };

    const onContinue = () => {
        const selectedMdl = avaMdlList[selectedMdlIndex]; 
        const index = selectedMdl.operationDates.findIndex((item)=> selectedDate == item.text);
        const id = `${selectedMdl.key}|${index}`;
        const paxs = getPaxsSelection();
        const url = '/api/activity/add';
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                sid,
                type:'activity',
                id,
                paxs,
                paxCount,
                isStandalone:true,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error !== undefined) {
                    errorModal(data.error);
                } else {
                    window.location.href = `/checkout?sid=${sid}`;
                }
            });
        return false;
    };

   
    const clickUpdatePaxCount = (paxIndex, oper) => {
        if (oper === '+') {
            paxCount[paxIndex] = paxCount[paxIndex] + 1;
        } else if (oper === '-' && paxIndex == 0 && paxCount[paxIndex] == 1) { // atleast 1 adult should be selected for booking
            paxCount[paxIndex] = 1;
        } else if (paxCount[paxIndex] > 0) {
            paxCount[paxIndex] = paxCount[paxIndex] - 1;
        }
        setPaxCount({ ...paxCount });
    };

    
    const basicValid = results && Object.keys(results.options).length > 0;
    const validLoaded = !loading && basicValid;
   
    let totalAmount = 0;
    let selectedMdl = null;
    if(paxCount && avaMdlList && avaMdlList[selectedMdlIndex]){
        selectedMdl = avaMdlList[selectedMdlIndex];
        for (const [key, value] of Object.entries(paxCount)) {
           if(value > 0){
                const amount = selectedMdl.paxAmounts[key].amount * value;
                totalAmount += amount;
            }
        }
    } 

    return (
        <div>
            <Element name="top" />
            {features.profile && (<Profile element="pro_section" config={profileConfig} />)}
            {features.profile && (<Profile element="pro_section_mobile" config={profileConfig} />)}
            <BookingSteps steps={breadcrumbs} active='actDetails' />
            <DynamicEngine sid={sid} parameters={parameters} />
            <Loader position={loading ? 0 : 100} active={loading} />
            {loading && (
                <div className="container">
                    <HotelDetailsOverviewLoader />
                </div>
            )}
            {!validLoaded && (
                <div className="container">
                    <div className="alert alert-danger">No activities available.</div>
                </div>
            )}
            {validLoaded && (
                <>
                    <Element className="container border rounded box-shadow p-3 my-4 bg-white" name="overview">
                        <div className="">
                            <DetailHeader activity={results} />
                        </div>
                        <div className="mt-2">
                            <div className="row gutter-10 gallery-lightbox-preview  d-flex h-100">
                                <div className="col-12 col-lg-7 h-100 overlay-parent">
                                    <DetailGallery entity={results} entityName="activity" />
                                </div>
                                <div className="col-lg-5 mt-3 mt-lg-0 h-100">
                                <PaxSelect  
                                    results={results}
                                    paxCount={paxCount}
                                    cheapRate={cheapRate}
                                    selectedMdl={selectedMdl}
                                    selectedMdlIndex={selectedMdlIndex} 
                                    avaMdlList={avaMdlList} 
                                    onActivitySelect={onActivitySelect} 
                                    onActivityDateSelect={onActivityDateSelect} 
                                    onContinue={onContinue}
                                    totalAmount={totalAmount}
                                    clickUpdatePaxCount={clickUpdatePaxCount}
                                />
                                </div>                               
                            </div>
                        </div>

                    </Element>
                    
                    <div className="container border rounded box-shadow p-3 my-4 bg-white">
                        {/*
                        <PaxSelect  
                                results={results}
                                paxCount={paxCount}
                                selectedMdl={selectedMdl}
                                selectedMdlIndex={selectedMdlIndex} 
                                avaMdlList={avaMdlList} 
                                onActivitySelect={onActivitySelect} 
                                onActivityDateSelect={onActivityDateSelect} 
                                onContinue={onContinue}
                                totalAmount={totalAmount}
                                clickUpdatePaxCount={clickUpdatePaxCount}
                            />
                        */}
                        


                        
                        <div id='details' className="">
                            <Element name="extr-details">
                                {Object.prototype.hasOwnProperty.call(results,'requirement') && 
                                        results.requirement.map((item,index)=>( 
                                            <div key={`req-${index}`} className="border p-2 d-flex alert alert-warning mt-3">
                                                <div>
                                                    <svg
                                                        className="icon-lg mr-2"
                                                        width="100%"
                                                        height="100%"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                                    >
                                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-exclamation-triangle" />
                                                    </svg>
                                                </div>
                                                <div className='font-weight-bold' dangerouslySetInnerHTML={{ __html: item }} />
                                            </div>))
                                }
                                <div className="description-preview d-flex row no-gutters">
                                    { results.categories.length>0 &&  <div className="col-12 order-1 order-md-0">
                                            <h2 className="mb-3 font-weight-bold mt-3 h5">{results.categories.join(",")}</h2>
                                            <div className="h6 mb-3">
                                                <svg className="icon mr-1"width="100%"height="100%"xmlns="http://www.w3.org/2000/svg"xmlnsXlink="http://www.w3.org/1999/xlink">
                                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-clock" />
                                                </svg><span className="font-weight-bold">{results.duration.join(",")}</span>
                                            { Object.prototype.hasOwnProperty.call(results,'scheduling') 
                                                && Object.prototype.hasOwnProperty.call(results.scheduling,'duration') && <span className="font-weight-normal">{`,${results.scheduling.duration.value} ${results.scheduling.duration.metric.toLowerCase()}`}</span>
                                            }
                                            </div>
                                        </div>
                                    }                                     
                                </div>
                                <div>
                                    <ul className="list-unstyled row mb-2">
                                        {results.included &&
                                            results.included.map((info,i)=>(
                                                <li className="col-6 col-md-3" key={i}>
                                                    <div className="included" key={`${results.code}-included-${i}`}>
                                                        <h2 className="h5 font-weight-bold">{info['name']}</h2>
                                                        <div className="d-flex h6 text-capitalize">
                                                            <svg className="mr-1 green-check-bg-light-green icon"width="100%"height="100%"xmlns="http://www.w3.org/2000/svg"xmlnsXlink="http://www.w3.org/1999/xlink">
                                                                <use xlinkHref="/img/icons/icon-defs.svg#icon-checkmark-round" />
                                                            </svg>
                                                            {/* {info['included'][0].toUpperCase() + info['included'].slice(1)} */}
                                                            {info['included'].join(', ')}
                                                        </div>
                                                    </div>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>
                                <div>
                                    <ul className="list-unstyled row mb-2">
                                        {results.excluded &&
                                            results.excluded.map((info,i)=>(
                                                <li className="col-6 col-md-3">
                                                    <div className="excluded" key={`${results.code}-excluded-${i}`}>
                                                        <h2 className="h5 font-weight-bold">{info['name']}</h2>
                                                        <div className="d-flex h6 text-capitalize">
                                                            <svg className="mr-1 black-close-bg-grey"width="100%"height="100%"xmlns="http://www.w3.org/2000/svg"xmlnsXlink="http://www.w3.org/1999/xlink">
                                                                <use xlinkHref="/img/icons/icon-defs.svg#icon-close" />
                                                            </svg>{info['excluded'].join(', ')}
                                                        </div>
                                                    </div>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>

                                { Object.prototype.hasOwnProperty.call(results,'highligths') && results.highligths.length>0 && (<><h3 className="h6">Highligths</h3>
                                        {results.highligths.map((info,i)=>(
                                            <div key={`${results.code}-highligths-${i}`} dangerouslySetInnerHTML={{ __html: info }} />
                                        ))}
                                    </>)
                                }
                                              
                                { Object.prototype.hasOwnProperty.call(results,'location') && results.location && (<><h2 className="h5 font-weight-bold">Location</h2>
                                            <div className="h6">Start Point:</div>
                                            <div>
                                                <div>{results.location.addr}</div>
                                                <div>{results.location.pickUpInfo}</div>
                                            </div>

                                            <div className="h6">End Point:</div>
                                            <div>
                                                {results.location.end}
                                            </div>
                                    </>)
                                }

                                <div className='desc'>
                                    <h2 className="h6">About this tour</h2>
                                    <div dangerouslySetInnerHTML={{ __html: results.description }} />
                                </div>
                            </Element>
                        </div>
                    </div>

                </>
            )}
        </div>
    );
};

DynActivityDetails.propTypes = {
    sid: PropTypes.string.isRequired,
    breadcrumbs: PropTypes.instanceOf(Object).isRequired,
    parameters: PropTypes.instanceOf(Object).isRequired,
    activity: PropTypes.string.isRequired,
};

export default DynActivityDetails;
