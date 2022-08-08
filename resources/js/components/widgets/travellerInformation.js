import React from 'react';
import PropTypes from 'prop-types';
import TravellerForm from 'components/widgets/travellerForm';
import ActivityTravellerForm from 'components/widgets/activityTravellerForm';
import Lang from 'libraries/common/Lang';


const TravellerInformation = (props) => {
    const { onPassengerUpdate, passengerInformation, selectedProducts, errors } = props;

    const updateTraveller = (passenger, key) => {
        onPassengerUpdate(passenger, key);
    };

    let PaxFormType = TravellerForm;
    /*
    if(selectedProducts === 'A'){
       PaxFormType =  ActivityTravellerForm;
    }
    */
    return (
        <div id="passenger-top" className="rounded-sm p-3 mb-3 custom-form-element box-shadow bg-white">
            <div className="d-flex align-items-center primary-color">
                <div className="mr-2 mt-1 d-none">
                    <svg className="icon-md" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                        <use xlinkHref="/img/icons/icon-defs.svg#icon-users-multiple" />
                    </svg>
                </div>
                <h5 className="m-0 font-weight-bold">{Lang.trans('customer.traveller_information')}</h5>
            </div>
            <article className="collapse show accord-segment">
                {passengerInformation.map((passenger, index) => (
                    <PaxFormType
                        key={`traveller-${index}`}
                        index={index}
                        passenger={passenger}
                        onUpdate={updateTraveller}
                        selectedProducts={selectedProducts}
                        errors={errors[`passenger-${index}`] || []}
                    />
                ))}
            </article>
        </div>
    );
};

TravellerInformation.propTypes = {
    onPassengerUpdate: PropTypes.func.isRequired,
    passengerInformation: PropTypes.instanceOf(Array).isRequired,
    errors: PropTypes.instanceOf(Object),
};

TravellerInformation.defaultProps = {
    errors: {},
};

export default TravellerInformation;
