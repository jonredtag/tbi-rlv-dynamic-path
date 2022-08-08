import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Collapse from 'reactstrap/lib/Collapse';
import popupWindow from 'helpers/popupWindow';
import Lang, { priceFormat } from 'libraries/common/Lang';

const InsuranceOption = (props) => {
    const {
        plan,
        config,
        passengerInformation,
        isRecommended,
        onUpdate,
    } = props;

    const [isOpen, setOpen] = useState(false);

    const updatePassenger = (key, event) => {
        const newPassenger = Object.assign({}, passengerInformation[key]);
        newPassenger.plan = event.target.value;

        onUpdate(newPassenger, `insurance.plan-${key}`);
    };

    const showPopup = () => {
        popupWindow(plan.planURL, 740, 660, '1');
    };

    return (
        <div className="col-12 mb-3">
            <div className="rounded row border mb-2 h-100 p-2">
                <div className="col-sm-8 order-2 order-sm-1">
                    <span className="h6">{plan.planName}</span>
                    <button type="button" className="ml-2 btn-unstyled" onClick={showPopup}>
                        <svg className="icon" width="100%" height="100%" xmlns="http://www.w3.org/1999/xlink" xmlnsXlink="http://www.w3.org/1999/xlink">
                            <use xlinkHref="/img/icons/icon-defs.svg#icon-info-circle" />
                        </svg>
                    </button>


                    {(config !== undefined && config.length > 0) && (<div className="insurance-check-list">
                        <div className="d-flex py-2 mb-2 ">
                            <div>
                                <svg className="icon mr-2" width="100%" height="100%" xmlns="http://www.w3.org/1999/xlink" xmlnsXlink="http://www.w3.org/1999/xlink">
                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-checkmark-thin" />
                                </svg>
                            </div>
                            <div>{config[0]}</div>
                        </div>
                        <Collapse isOpen={isOpen}>
                            {config.map((option, index) => (index > 0 ? (
                                <div key={`option-${index}`} className="d-flex py-2 mb-2 border-top">
                                    <div>
                                        <svg className="icon mr-2" width="100%" height="100%" xmlns="http://www.w3.org/1999/xlink" xmlnsXlink="http://www.w3.org/1999/xlink">
                                            <use xlinkHref="/img/icons/icon-defs.svg#icon-checkmark-thin" />
                                        </svg>
                                    </div>
                                    <div>{option}</div>
                                </div>
                            ) : null
                            ))}
                            <div className="d-flex py-2 mb-2 border-top">
                                <div>
                                    <svg className="icon mr-2" width="100%" height="100%" xmlns="http://www.w3.org/1999/xlink" xmlnsXlink="http://www.w3.org/1999/xlink">
                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-checkmark-thin" />
                                    </svg>
                                </div>
                                <div>
                                    {Lang.trans('insurance.coverage_more_click')}
                                    <button type="button" className="btn-unstyled ml-1" onClick={showPopup}>{Lang.trans('insurance.coverage_more_here')}</button>
                                </div>
                            </div>
                        </Collapse>
                        <button type="button" className="btn-underline-link pl-0 pl-md-4" onClick={() => { setOpen(!isOpen); }}>{isOpen ? Lang.trans('common.show_less') : Lang.trans('common.show_more')}</button>
                    </div>
                    )}

                </div>
                <div className="col-sm-4 text-sm-right order-1 order-sm-2 mb-1">
                    <div className="insurnace-starting-from-text">{Lang.trans('common.starting_from')}</div>
                    <span className="insurance-price">C{priceFormat(plan.passengers[0].planTotal)}</span>
                    <small className="d-sm-block mx-1 insurance-per-person-text mb-md-1">{Lang.trans('common.per_person')}</small>
                    {isRecommended && (<div className="recommended-text font-weight-bold d-inline-block py-1 px-2 rounded">{Lang.trans('common.recommended')}</div>)}
                </div>
                <div className="col-12 mt-2 order-3">
                    <div className="passengers w-100 ">
                        {plan.passengers.map((passenger, index)=> (
                            <div key={`${plan.planCode}-${passenger.id}`} className="d-inline-block mr-4">
                                <div className="styled-radio theme-2">
                                    <input
                                        type="radio"
                                        id={`passenger${passenger.id}_${plan.planCode}`}
                                        name={`passenger-${passenger.id}`}
                                        value={plan.planCode}
                                        checked={passengerInformation[passenger.id].plan === plan.planCode}
                                        onChange={updatePassenger.bind(null, passenger.id)}
                                    />
                                    <label className="pl-4 py-md-1 py-2" htmlFor={`passenger${passenger.id}_${plan.planCode}`}>
                                        <span>{((passengerInformation[passenger.id].first || passengerInformation[passenger.id].last) && `${passengerInformation[passenger.id].first} ${passengerInformation[passenger.id].last}`) || `${Lang.trans('common.passenger')} ${passenger.id + 1}`}</span>
                                    </label>
                                </div>
                                <div className="pl-4 font-weight-bold insurance-price-per-day">{priceFormat(passenger.planPerDay)}/{Lang.trans('common.per_day')}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

InsuranceOption.propTypes = {
    plan: PropTypes.instanceOf(Object).isRequired,
    config: PropTypes.instanceOf(Array).isRequired,
    passengerInformation: PropTypes.instanceOf(Array).isRequired,
    onUpdate: PropTypes.func.isRequired,
    isRecommended: PropTypes.bool,
};

InsuranceOption.defaultProps = {
    isRecommended: false,
};

export default InsuranceOption;
