import React from 'react';
import { render } from 'react-dom';
import HotelDetails from 'components/pages/dynamicHotelDetails';

const pageContainer = document.getElementById('dyn_hotelDetails');

if (pageContainer !== null) {
    const {
        sid,
        parameters,
        hotel,
        breadcrumbs,
        features,
        googleapikey,
        profileconfig,
    } = pageContainer.dataset;

    render(<HotelDetails
        hotel={hotel}
        sid={sid}
        parameters={JSON.parse(parameters)}
        breadcrumbs={JSON.parse(breadcrumbs)}
        features={JSON.parse(features)}
        googleKey={googleapikey}
        profileConfig={JSON.parse(profileconfig)}
    />, pageContainer);
}
