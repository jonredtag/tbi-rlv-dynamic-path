import React from 'react';
import PropTypes from 'prop-types';
import ErrorText from 'components/snippets/errorText';
import Lang from 'libraries/common/Lang';
import MaskedInput from 'react-input-mask';

const TravellerForm = (props) => {
    const {
        passenger,
        index,
        errors,
        onUpdate,
        selectedProducts,
    } = props;


    const updatePassenger = (field, event) => {
        const newPassenger = Object.assign({}, passenger);

        if (newPassenger[field] !== event.target.value) {
            newPassenger[field] = event.target.value;

            if (field === 'year' || field === 'month' || field === 'day') {
                field = 'birth';
            }
            onUpdate(newPassenger, `passenger-${props.index}.${field}`);
        }
    };

    const years = [];
    const today = new Date();
    /*
    const startYear = passenger.type === 'adult' ? 18 : passenger.age - 2;
    const endYear = passenger.type === 'adult' ? 115 : parseInt(passenger.age, 10) + 2;
    */

    let startYear, endYear;
    let ischildAgeRang = false;
    if (passenger.type === 'adult') {
        startYear = 18;
        // if(selectedProducts &&  selectedProducts =='A'){
        //    startYear = 12;
        // }
        endYear = 115;
    } else {
        if(passenger.age.indexOf("-") === -1) {
            startYear = passenger.age - 2;
            endYear = parseInt(passenger.age, 10) + 2;
        } else {
            ischildAgeRang =  true;
            const childAge = passenger.age.split('-');
            startYear = parseInt(childAge[0], 10) - 2;
            endYear = parseInt(childAge[1], 10) + 2;
        }
    }

    if(startYear < 0){
       startYear = 0;
    }

    for (let i = startYear; i < endYear; i++) {
        const year = today.getFullYear() - i;
        years.push((<option key={year} value={year}>{year}</option>));
    }

    const errorKeys = Object.keys(errors);

    return (
        <>
            <div className="mb-2 mt-3">
                <h6 className="d-md-inline-block font-weight-bold">
                    {!passenger.isPrimary ? `${passenger.type === 'adult' ? Lang.trans('customer.adult') : Lang.trans('customer.child')} ${passenger.index + 1}` : `${Lang.trans('customer.primary_adult')} ${index + 1}`}
                    {passenger.type === 'child' ? `: ${Lang.trans('customer.age')} ${ischildAgeRang?`(${passenger.age})`:(passenger.age > 0 ? passenger.age : '(<1)')} ` : ''}
                </h6>
                <div className="secondary-text d-md-inline-block ml-2">({Lang.trans('customer.as_per_your_passport')})</div>
            </div>
            {errorKeys.length > 0 && (
                <div className="error-container w-100 mb-2">
                    {errorKeys.map((key) => (<ErrorText key={errors[key].id} error={errors[key]} />))}
                </div>
            )}
            <div className="row gutter-10 mb-3">
                <div className="col-12 col-md-3 col-lg-2">
                    <label className="label-style" htmlFor={`gender_${index}`}>
                        {Lang.trans('customer.title')}
                        <span className="asterix" />
                    </label>
                    <div className="element-container input-chevron-down">
                        <div>
                            <select
                                id={`gender_${index}`}
                                className={`form-control ${errorKeys.includes('title') ? 'error-highlight' : ''}`}
                                onChange={updatePassenger.bind(null, 'title')}
                                value={passenger.title}
                            >
                                <option value="">{Lang.trans('customer.title')}</option>
                                <option value="Mr">Mr</option>
                                <option value="Ms">Ms</option>
                                <option value="Mrs">Mrs</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4 col-lg-3">
                    <label className="label-style" htmlFor={`first_${index}`}>
                        {Lang.trans('customer.first')}
                        <span className="asterix" />
                    </label>
                    <div className="element-container">
                        <div>
                            <input
                                type="text"
                                id={`first_${index}`}
                                className={`form-control ${errorKeys.includes('first') ? 'error-highlight' : ''}`}
                                onChange={updatePassenger.bind(null, 'first')}
                                value={passenger.first}
                            />
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4 col-lg-3">
                    <label className="label-style" htmlFor={`middle_${index}`}>{Lang.trans('customer.middle')}</label>
                    <div className="element-container">
                        <div>
                            <input
                                type="text"
                                id={`middle_${index}`}
                                className={`form-control ${errorKeys.includes('middle') ? 'error-highlight' : ''}`}
                                onChange={updatePassenger.bind(null, 'middle')}
                                value={passenger.middle}
                            />
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4 col-lg-4">
                    <label className="label-style" htmlFor={`last_${index}`}>
                        {Lang.trans('customer.last')}
                        <span className="asterix" />
                    </label>
                    <div className="element-container">
                        <div>
                            <input
                                type="text"
                                id={`last_${index}`}
                                className={`form-control ${errorKeys.includes('last') ? 'error-highlight' : ''}`}
                                onChange={updatePassenger.bind(null, 'last')}
                                value={passenger.last}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="row gutter-10">
                <div className="col-12">
                    <label className="label-style" htmlFor={`year_${index}`}>
                        {Lang.trans('customer.date_of_birth')}
                        <span className="asterix" />
                    </label>
                </div>
                <div className="col-4 col-md-3n col-lg-3 col-xl-2">
                    <div className="element-container input-chevron-down">
                        <div>
                            <select
                                id={`year_${index}`}
                                className={`form-control insurance-base ${errorKeys.includes('birth') && passenger.year === '' ? 'error-highlight' : ''}`}
                                onChange={updatePassenger.bind(null, 'year')}
                                value={passenger.year}
                            >
                                <option value="">{Lang.trans('customer.year')}</option>
                                {years}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="col-4 col-md-3n col-lg-3 col-xl-2">
                    <div className="element-container input-chevron-down">
                        <div>
                            <select
                                className={`form-control insurance-base ${errorKeys.includes('birth') && passenger.month === '' ? 'error-highlight' : ''}`}
                                onChange={updatePassenger.bind(null, 'month')}
                                value={passenger.month}
                            >
                                <option value="">{Lang.trans('customer.month')}</option>
                                <option value="01">Jan</option>
                                <option value="02">Feb</option>
                                <option value="03">Mar</option>
                                <option value="04">Apr</option>
                                <option value="05">May</option>
                                <option value="06">Jun</option>
                                <option value="07">Jul</option>
                                <option value="08">Aug</option>
                                <option value="09">Sep</option>
                                <option value="10">Oct</option>
                                <option value="11">Nov</option>
                                <option value="12">Dec</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="col-4 col-md-3n col-lg-3 col-xl-2">
                    <div className="element-container input-chevron-down">
                        <div>
                            <select
                                className={`form-control insurance-base ${errorKeys.includes('birth') && passenger.day === '' ? 'error-highlight' : ''}`}
                                onChange={updatePassenger.bind(null, 'day')}
                                value={passenger.day}
                            >
                                <option value="">{Lang.trans('customer.day')}</option>
                                <option value="01">1</option>
                                <option value="02">2</option>
                                <option value="03">3</option>
                                <option value="04">4</option>
                                <option value="05">5</option>
                                <option value="06">6</option>
                                <option value="07">7</option>
                                <option value="08">8</option>
                                <option value="09">9</option>
                                <option value="10">10</option>
                                <option value="11">11</option>
                                <option value="12">12</option>
                                <option value="13">13</option>
                                <option value="14">14</option>
                                <option value="15">15</option>
                                <option value="16">16</option>
                                <option value="17">17</option>
                                <option value="18">18</option>
                                <option value="19">19</option>
                                <option value="20">20</option>
                                <option value="21">21</option>
                                <option value="22">22</option>
                                <option value="23">23</option>
                                <option value="24">24</option>
                                <option value="25">25</option>
                                <option value="26">26</option>
                                <option value="27">27</option>
                                <option value="28">28</option>
                                <option value="29">29</option>
                                <option value="30">30</option>
                                <option value="31">31</option>
                            </select>
                        </div>
                    </div>
                </div>
                { index === 0 && window.points === 'cibc' && (
                    <div className="col-md-4">
                        <label className="label-style" htmlFor="phone">{Lang.trans('customer.phone')}<span className="asterix" /></label>
                        <div className="element-container">
                            <div>
                                <MaskedInput
                                    type="text"
                                    id="phone"
                                    className={`form-control ${errorKeys.includes('phone') ? 'error-highlight' : ''}`}
                                    placeholder="111-111-1111"
                                    mask="999-999-9999"
                                    value={passenger.phone}
                                    onChange={updatePassenger.bind(null, 'phone')}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {index === 0 && (
                <div className="row gutter-10 mt-2 mb-3">
                    {window.points !== 'cibc' && (
                        <div className="col-12 col-md-4 col-lg-3 mb-2 mb-md-0">
                            <label className="label-style" htmlFor="phone">{Lang.trans('customer.phone')}<span className="asterix" /></label>
                            <div className="element-container">
                                <div>
                                    <MaskedInput
                                        type="text"
                                        id="phone"
                                        className={`form-control ${errorKeys.includes('phone') ? 'error-highlight' : ''}`}
                                        placeholder="111-111-1111"
                                        mask="999-999-9999"
                                        value={passenger.phone}
                                        onChange={updatePassenger.bind(null, 'phone')}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="col-12 col-md-6 mb-2 mb-md-0">
                        <label className="label-style" htmlFor="email">{Lang.trans('customer.email')}<span className="asterix" /></label>
                        <div className="element-container">
                            <div>
                                <input
                                    type="email"
                                    id="email"
                                    className={`form-control ${errorKeys.includes('email') ? 'error-highlight' : ''}`}
                                    placeholder={Lang.trans('customer.email_placeholder')}
                                    readOnly={window.points === 'cibc'}
                                    value={passenger.email}
                                    onChange={updatePassenger.bind(null, 'email')}
                                />
                            </div>
                        </div>
                    </div>

                    {window.points === 'cibc' && (
                        <div className="col-12 col-md-6 mb-2 mb-md-0">
                            <label className="label-style" htmlFor="additional_email">{Lang.trans('customer.additional_email')}<span className="asterix" /></label>
                            <div className="element-container">
                                <div>
                                    <input
                                        type="email"
                                        id="additional_email"
                                        className={`form-control ${errorKeys.includes('additional_email') ? 'error-highlight' : ''}`}
                                        placeholder={Lang.trans('customer.email_placeholder')}
                                        value={passenger.additional_email}
                                        onChange={updatePassenger.bind(null, 'additional_email')}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

TravellerForm.propTypes = {
    index: PropTypes.number.isRequired,
    passenger: PropTypes.instanceOf(Object).isRequired,
    onUpdate: PropTypes.func.isRequired,
    errors: PropTypes.instanceOf(Object),
};

TravellerForm.defaultProps = {
    errors: {},
};
export default TravellerForm;
