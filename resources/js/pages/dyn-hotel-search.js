import React from 'react';
import { render } from 'react-dom';
import HotelResults from 'components/pages/dynamicHotelResults';

const pageContainer = document.getElementById('dyn_hotelSearchResults');

if (pageContainer !== null) {
    const {
        sid,
        parameters,
        breadcrumbs,
        features,
        googleapikey,
        profileconfig,
    } = pageContainer.dataset;
    
    render(<HotelResults
        sid={sid}
        parameters={JSON.parse(parameters)}
        breadcrumbs={JSON.parse(breadcrumbs)}
        features={JSON.parse(features)}
        googleKey={googleapikey}
        profileConfig={JSON.parse(profileconfig)}
    />, pageContainer);
}
