import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AriaModal from 'react-aria-modal';
import DetailGallery from 'components/widgets/activityOptionGallery';
import errorModal from 'helpers/errorModal';
import Collapse from 'reactstrap/lib/Collapse';
import Lang, { priceFormat } from 'libraries/common/Lang';
import Select from '../selectors/Select';
import uniqueID from '../../helpers/uniqueID';

const ActivityOptionItem = (props) => {
    const {
        sid,
        item,
        selectOpts,
        addOpt,
        removeOpt,
    } = props;

    const [selectDateOpt, setSeletDateOpt] = useState();
    const [ticketOptIndex, setTicketOptIndex] = useState();
    const [showMore, setShowMore] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [activityDetail, setActivityDetail] = useState();

    const add = (index) => {
        addOpt('activity', index);
    };

    const remove = (index) => {
        removeOpt('activity', index);
    };

    const onSelectMdlOptions = (e) => {
        setTicketOptIndex(e.target.value);
        setSeletDateOpt(null);
    };

    const onSelectDateChange = (value) => {
        const splitKeys = value.split('|');
        const key = splitKeys[0];
        setSeletDateOpt(splitKeys[1]);
    };


    const showMoreInfo = () => {
        setShowMore(true);
    };

    const toggleShowDetail = () => {
        const curState = !showDetail;
       if(curState && !activityDetail){
            getActivityDetail();
        } else {
            setShowDetail(curState);
        }
    };

    const closeModal = () => {
        setShowMore(false);
    };

    const getActivityDetail = () => {
        const url = '/api/addon/activity-details';
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({ sid, id: item.code }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error !== undefined) {
                    errorModal(data.error);
                } else {
                    //console.log(data);
                    setActivityDetail(data);
                }
                setShowDetail(true);
            });
    };

    let mdl = null;
    let selectedValue = null;
    if (activityDetail && ticketOptIndex !== undefined) {
        mdl = activityDetail.options[ticketOptIndex];
        selectedValue = selectDateOpt!=null
            ? `${mdl.key}|${selectDateOpt}`
            : '';
    }

    let optionAva = true;
    if (!(activityDetail
        && Object.prototype.hasOwnProperty.call(activityDetail, 'options')
        && activityDetail.options.length)){
        optionAva =  false;
    }
    const actName = item.name;
    return (<div className="pb-3 mb-3 border-bottom">
            <div className="row padding">
                <div className="col-4  col-md-3">
                    <DetailGallery entity={item} entityName="activity" />
                </div>
                <div className="col-8  col-md-5 mb-2">
                    <div className="primary-color h6 mb-1"><strong>{actName}</strong></div>
                    <div><strong>{item.categories.join(",")}</strong></div>
                    <div className="overflow-auto-y overflow-hide-review"
                        dangerouslySetInnerHTML={{ __html: item.summary }}
                    />
                    <a
                        className=""
                        href="#"
                        onClick={() => showMoreInfo()}
                    >
                        More details
                    </a>
                    </div>

                <div className=" col-12 col-md-4 text-right">
                    <div className="price-text h6 font-weight-bold mb-0">
                        From CAD {`${priceFormat(item.price.adultPrice)}`}
                    </div>
                    <div className="secondary-color">
                        <small>Per Person</small>
                    </div>
                    <button
                        type="button"
                        className="btn btn-secondary  py-3 col-6 col-sm-8 col-lg-7  h6 font-weight-bold"
                        onClick={() => toggleShowDetail()}
                    >
                        <span className="open-details">
                            {showDetail ? 'Hide Detail' : 'Select'}
                        </span>
                    </button>
                </div>
            </div>
            <Collapse isOpen={showDetail}>

                {optionAva?(<><label className="d-block font-weight-bold" htmlFor="ticket-options">
                    Find Tickets
                </label>
                <div className="mb-3 element-container input-chevron-down w-auto">
                    <select
                        className="form-control bg-grey"
                        id="ticket-options"
                        name=""
                        onChange={(e) => onSelectMdlOptions(e)}
                    >
                        <option value="">Choose option</option>
                        {activityDetail &&
                            Object.prototype.hasOwnProperty.call(activityDetail, 'options') &&
                            activityDetail.options.map((md, mdlIndex) => (
                                <option key={`${item.code}-${mdlIndex}`} value={mdlIndex}>
                                    Select - {md.title}
                                </option>
                            ))}
                    </select>
                </div></>):(<div className="text-red">Sorry, this product is not available now!</div>)}


                {mdl && (
                    <div className="mb-2">
                        { optionAva && (
                                <div className="" key={mdl.key}>
                                    <div className="row gutter-10">
                                        <div className="col-12">
                                            <h5>{mdl.name}</h5>
                                            <div className="d-flex mb-3">
                                                <div>
                                                    <div className="font-weight-bold">Price per person</div>
                                                    <ul className="mb-0">
                                                        {mdl.paxAmounts.map((pax, paxIdx) => (
                                                            <li
                                                                className="mr-2"
                                                                key={`${mdl.key}-${paxIdx}`}
                                                            >
                                                                {`${pax.paxType}${
                                                                    pax.paxType !== 'ADULT'
                                                                        ? `(Age:${pax.ageFrom}-${pax.ageTo})`
                                                                        : ''
                                                                }:$${pax.amount}`}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div className="pl-3 ml-3 border-left">
                                                    <span className="font-weight-bold">{mdl.duration}</span>
                                                    <span className="pl-2 ml-2 border-left font-weight-bold">
                                                        ${mdl.price.totalAmount}
                                                    </span>
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
                                                </div>
                                                <div className="col-4 col-sm-5 col-md-3 col-lg-4 col-xl-3   align-self-end">
                                                    {selectOpts.includes(`${mdl.key}|${selectDateOpt?? '0'}`) ? (
                                                        <button
                                                            type="button"
                                                            className="btn btn-link  py-3 h6 font-weight-bold  px-4 mb-0 w-100 "
                                                            onClick={() => remove(`${mdl.key}|${selectDateOpt?? '0'}`)}
                                                        >
                                                            <span className="close-details">Remove</span>
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            className="btn btn-secondary  py-3 h6 font-weight-bold  px-4 mb-0 w-100"
                                                            onClick={() => add(`${mdl.key}|${selectDateOpt?? '0'}`)}
                                                        >
                                                            <span className="close-details">Add</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                    </div>
                )}
            </Collapse>
            {showMore && (
                <AriaModal
                    onExit={closeModal}
                    initialFocus="#mdl-act-content"
                    aria-describedby="mdl-act-content"
                    titleId="mdl-act-title"
                    aria-labelledby="mdl-act-title"
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
                                            {item.name}
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
                            <div className="modal-main" id="mdl-act-content">
                                <div className="content">
                                   <div className="description-preview d-flex row no-gutters">
                                        <div className="col-12 order-1 order-md-0">
                                            <h4 className="mb-4 font-weight-bold mt-3">Description</h4>
                                            <div dangerouslySetInnerHTML={{ __html: item.summary }} />
                                            <div dangerouslySetInnerHTML={{ __html: item.description }} />
                                            { item.highligths.length>0 && (<><strong>Highlights</strong>
                                                    {item.highligths.map((info,i)=>(
                                                        <div key={`${item.code}-highligths-${i}`} dangerouslySetInnerHTML={{ __html: info }} />
                                                    ))}
                                                </>)
                                            }
                                            { item.redeemInfo.length>0 && (<><strong>RedeemInfo</strong>
                                                    {item.redeemInfo.map((info,i)=>(
                                                        <div key={`${item.code}-redeem-${i}`} dangerouslySetInnerHTML={{ __html: info }} />
                                                    ))}
                                                </>)
                                            }
                                            { item.included.length>0 && (<><strong>Included</strong>
                                                    {item.included.map((info,i)=>(
                                                        <div key={`${item.code}-included-${i}`} dangerouslySetInnerHTML={{ __html: info }} />
                                                    ))}
                                                </>)
                                            }
                                            { item.requirement && (<><strong>Requirement</strong>
                                                        <div dangerouslySetInnerHTML={{ __html: item.requirement }} />

                                                </>)
                                            }
                                            { item.guideOptions && (<><strong>Guide Options</strong>
                                                        <div>Guide type: {item.guideOptions.guideType.toLowerCase()} </div>
                                                        {item.guideOptions.groupType && (<div>Group type: {item.guideOptions.groupType.toLowerCase()} </div>)}
                                                        {item.guideOptions.tips && (<div>Tips type: {item.guideOptions.tips.toLowerCase()} </div>)}

                                                </>)
                                            }

                                             { item.location && (<><strong>Location</strong>
                                                        <div>Start Point:</div>
                                                        <div>
                                                            <div>{item.location.start}</div>
                                                            <div>{item.location.pickUpInfo}</div>
                                                        </div>

                                                        <div>End Point:</div>
                                                        <div>
                                                            {item.location.end}
                                                        </div>
                                                </>)
                                            }

                                             { item.scheduling && (<><strong>Schedule</strong>
                                                        <div>Opening dates:</div>
                                                        <div>
                                                            {Object.prototype.hasOwnProperty.call(item.scheduling,'opened') && item.scheduling.opened.map((info,i)=>(
                                                                <span key={`${item.code}-schedule-time-${i}`}>{info.openingTime}-{info.closeTime}</span>
                                                            ))}
                                                        </div>
                                                </>)
                                            }
                                            { item.duration.length>0 && (<><strong>Activity Duration</strong>
                                                    {item.duration.map((info,i)=>(
                                                        <div key={`${item.code}-duration-${i}`} dangerouslySetInnerHTML={{ __html: info }} />
                                                    ))}
                                                </>)
                                            }
                                            { item.categories.length>0 && (<><strong>Categories</strong>
                                                    {item.categories.map((info,i)=>(
                                                        <div key={`${item.code}-categories-${i}`} dangerouslySetInnerHTML={{ __html: info }} />
                                                    ))}
                                                </>)
                                            }


                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </AriaModal>
            )}
        </div>);
};

ActivityOptionItem.propTypes = {
    item: PropTypes.instanceOf(Object).isRequired,
    sid: PropTypes.string.isRequired,
    addOpt: PropTypes.func.isRequired,
    removeOpt: PropTypes.func.isRequired,
};

export default ActivityOptionItem;
