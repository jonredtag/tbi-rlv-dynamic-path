import React from 'react';
import PropTypes from 'prop-types';
import ErrorText from 'components/snippets/errorText';
import Lang from 'libraries/common/Lang';
import MaskedInput from 'react-input-mask';

const ActivityTravellerForm = (props) => {
    const {
        passenger,
        index,
        errors,
        onUpdate,
    } = props;

    const updatePassenger = (field, event) => {
        const newPassenger = Object.assign({}, passenger);

        if (newPassenger[field] !== event.target.value) {
            newPassenger[field] = event.target.value;
            onUpdate(newPassenger, `passenger-${props.index}.${field}`);
        }
    };

    const errorKeys = Object.keys(errors);

    return (
        <>
            <div className="mb-2 mt-3">
                <h6 className="d-md-inline-block">
                    {!passenger.isPrimary ? `${passenger.type === 'adult' ? Lang.trans('customer.adult') : Lang.trans('customer.child')} ${passenger.index + 1}` : `${Lang.trans('customer.primary_adult')} ${index + 1}`}
                    {passenger.type === 'child' ? `: ${Lang.trans('customer.age')} (${passenger.age})`:''}
                </h6>
            </div>
            {errorKeys.length > 0 && (
                <div className="error-container w-100 mb-2">
                    {errorKeys.map((key) => (<ErrorText key={errors[key].id} error={errors[key]} />))}
                </div>
            )}
            <div className="row gutter-10 mb-3">
                <div className="col-12 col-md-4 col-lg-3">
                    <label htmlFor={`first_${index}`}>
                        {Lang.trans('customer.first')}
                        <span className="asterix">*</span>
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
                    <label htmlFor={`middle_${index}`}>{Lang.trans('customer.middle')}</label>
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
                    <label htmlFor={`last_${index}`}>
                        {Lang.trans('customer.last')}
                        <span className="asterix">*</span>
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
            {index === 0 && (
                <div className="row gutter-10 mt-2 mb-3">
                    <div className="col-12 col-md-4 col-lg-3 mb-2 mb-md-0">
                        <label htmlFor="phone">{Lang.trans('customer.phone')}<span className="asterix">*</span></label>
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
                    <div className="col-12 col-md-6 mb-2 mb-md-0">
                        <label htmlFor="email">{Lang.trans('customer.email')}<span className="asterix">*</span></label>
                        <div className="element-container">
                            <div>
                                <input
                                    type="email"
                                    id="email"
                                    className={`form-control ${errorKeys.includes('email') ? 'error-highlight' : ''}`}
                                    placeholder={Lang.trans('customer.email_placeholder')}
                                    value={passenger.email}
                                    onChange={updatePassenger.bind(null, 'email')}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

ActivityTravellerForm.propTypes = {
    index: PropTypes.number.isRequired,
    passenger: PropTypes.instanceOf(Object).isRequired,
    onUpdate: PropTypes.func.isRequired,
    errors: PropTypes.instanceOf(Object),
};

ActivityTravellerForm.defaultProps = {
    errors: {},
};
export default ActivityTravellerForm;
