import React from 'react';
import PropTypes from 'prop-types';
import InsuranceOption from 'components/widgets/InsuranceOption';
import ErrorText from 'components/snippets/errorText';
import Lang from 'libraries/common/Lang';

const InsuranceOptions = (props) => {
    const {
        insuranceInformation,
        passengerInformation,
        updateProvince,
        onPassengerUpdate,
        errors,
        province,
        insuranceOptions,
    } = props;

    const insDetailConfig = {
        en: {
            RGIN: [
                'Emergency Medical, No age Limit',
                'Trip Cancellation and Interruption Coverage',
                'Baggage Delay, Loss, and Damage',
                'Delayed Return and Missed Connections',
            ],
            RGCX: [
                'No Age Limit',
                'Trip Cancellation and Interruption Coverage',
                'Baggage Delay, Loss and Damage',
                'Delayed Return and Missed Connection',
            ],
            REMU: [
                'No Medical Questionnaire Required',
                'Covered Medical Provider Expenses',
                'Toll-Free Assistance Centre',
                'Arrangement of Air Ambulance When Necessary',
            ],
            RPPP: [
                'Applicable to Residents of Canada',
                'Trip Cancellation and Trip Interruption',
                'Baggage Delay, Loss and Damage',
                'Emergency Medical under the age of 74',
            ],
        },
        fr: {
            RGIN: [
                'Soins médicaux d’urgence, Aucune limite d’âge',
                'Assurance annulation et interruption de voyage',
                'Bagages perdus, endommagés et retardés',
                'Retour retardé et connexions manquées',
            ],
            RGCX: [
                'Aucune limite d’âge',
                'Assurance annulation et interruption de voyage',
                'Bagages perdus, endommagés et retardés',
                'Retour retardé et connexions manquées',
            ],
            REMU: [
                'Aucun questionnaire médical requis',
                'Frais de médecin couverts',
                'Centre d’assistance téléphonique',
                'Transport par ambulance aérienne lorsqu’il est nécessaire',
            ],
            RPPP: [
                'Applicable aux résidents du Canada',
                'Annulation et interruption de voyage',
                'Bagages perdus, endommagés et retardés',
                'Soins médicaux d’urgence, moins de 74 ans',
            ],
        },
    };

    const updateTraveller = (passenger, key) => {
        // const newPassengers = [...passengers.slice(0, index), passenger, ...passengers.slice(index + 1)];

        // console.log('updateTraveller', passenger);
        onPassengerUpdate(passenger, key);
    };

    const changeProvince = (event) => {
        const { target } = event;

        updateProvince(target.value);
    };

    const updatePassenger = (key, event) => {
        const newPassenger = Object.assign({}, passengerInformation[key]);
        newPassenger.plan = event.target.value;

        updateTraveller(newPassenger, `insurance.plan-${key}`);
    };

    const errorKeys = Object.keys(errors);

    return (
        <section className="rounded-sm p-3 mb-3 box-shadow bg-white">
            <div className="d-flex justify-content-between">
                <div className="d-flex align-items-center primary-color">
                    <div className="mr-2 d-none">
                        <svg className="icon-md" width="100%" height="100%" xmlns="http://www.w3.org/1999/xlink" xmlnsXlink="http://www.w3.org/1999/xlink">
                            <use xlinkHref="/img/icons/icon-defs.svg#icon-hand-umbrella" />
                        </svg>
                    </div>
                    <h5 className="m-0 font-weight-bold">{Lang.trans('insurance.protect_insurance')}</h5>
                </div>
                <img src="https://travel-img-assets.s3-us-west-2.amazonaws.com/logos/manulife-global.png" width="90px" height="45px" alt="" />
            </div>
            <div>
                {(Object.prototype.hasOwnProperty.call(errors, 'failed') && (
                    <div className="error-container w-100 mt-2">
                        <ErrorText error={errors.failed} />
                    </div>
                )) || (
                    <>
                        <div className="rounded color-pop p-2 mt-3">
                            <div className="row gutter-10 align-items-center">
                                <div className="col-7">
                                    <h6>{Lang.trans('insurance.coverage_valid')}</h6>
                                </div>
                                <div className="col-5">
                                    <div className="element-container input-chevron-down">
                                        <div>
                                            <select id="insurance-province" className="form-control default-select bg-white" value={province} onChange={changeProvince}>
                                                <option value="">{Lang.trans('common.select_province')}</option>
                                                <option value="AB">Alberta</option>
                                                <option value="BC">British Columbia</option>
                                                <option value="MB">Manitoba</option>
                                                <option value="NB">New Brunswick</option>
                                                <option value="NL">Newfoundland and Labrador</option>
                                                <option value="NT">Northwest Territories</option>
                                                <option value="NS">Nova Scotia</option>
                                                <option value="NU">Nunavut</option>
                                                <option value="ON">Ontario</option>
                                                <option value="PE">Prince Edward Island</option>
                                                <option value="QC">Quebec</option>
                                                <option value="SK">Saskatchewan</option>
                                                <option value="YT">Yukon Territory</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {(insuranceOptions.provinces.includes(province) && (
                            <div className="mt-3">
                                {errorKeys.length > 0 && (
                                    <div className="error-container w-100 mb-2">
                                        {errorKeys.map((key) => (<ErrorText key={errors[key].id} error={errors[key]} />))}
                                    </div>
                                )}
                                {insuranceInformation.plans && insuranceInformation.plans.map((plan, index) => (
                                    <InsuranceOption
                                        key={plan.planCode}
                                        plan={plan}
                                        config={insDetailConfig[window.Locale][plan.planCode] || []}
                                        passengerInformation={passengerInformation}
                                        passengerPlans={insuranceInformation.passengerPlans}
                                        isRecommended={index === 0}
                                        onUpdate={updateTraveller}
                                    />
                                ))}
                                <div className="col-12 mb-3">
                                    <div className="rounded row border mb-2 h-100 p-2">
                                        <div className="col-sm-8 order-2 order-sm-1"><span className="h6">{Lang.trans('payments_vacations.decline_insurance_payment')}</span></div>
                                        <div className="col-sm-4 text-sm-right order-1 order-sm-2 mb-1"></div>
                                        <div className="col-12 mt-2 order-3">
                                            <div className="passengers w-100">
                                                {passengerInformation.map((passenger, index) => (
                                                    <div key={`declined-${index}`} className="d-inline-block mr-4">
                                                        <div className="styled-radio theme-2">
                                                            <input
                                                                type="radio"
                                                                id={`DECLINED-pax-${index}`}
                                                                name={`passenger-${index}`}
                                                                value="DECLINED"
                                                                checked={passengerInformation[index].plan === 'DECLINED'}
                                                                onChange={updatePassenger.bind(null, index)}
                                                            />
                                                            <label className="pl-4 py-md-1 py-2" htmlFor={`DECLINED-pax-${index}`}>
                                                                <span>{((passenger.first || passenger.last) && `${passenger.first} ${passenger.last}`) || `${Lang.trans('payments_vacations.passenger_payment')} ${index + 1}`}</span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )) || (
                            <div className="ins-not-support" dangerouslySetInnerHTML={{ __html: Lang.trans('insurance.insurance_not_support', { XXXX: insuranceOptions.token }) }} />
                        )}
                    </>
                )}
            </div>
        </section>
    );
};

InsuranceOptions.propTypes = {
    insuranceInformation: PropTypes.instanceOf(Object).isRequired,
    passengerInformation: PropTypes.instanceOf(Array).isRequired,
    insuranceOptions: PropTypes.instanceOf(Object).isRequired,
    onPassengerUpdate: PropTypes.func.isRequired,
    province: PropTypes.string.isRequired,
    updateProvince: PropTypes.func,
    errors: PropTypes.instanceOf(Object),
};

InsuranceOptions.defaultProps = {
    updateProvince: () => {},
    errors: {},
};

export default InsuranceOptions;
