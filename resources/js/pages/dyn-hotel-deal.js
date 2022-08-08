import React from 'react';
import ReactDom, { render } from 'react-dom';
import HotelDeal from 'components/pages/dynamicHotelDeal';

const pageContainer = document.getElementById('dyn_hotelDeal');

if (pageContainer !== null) {
    const {
        parameters,
        details,
        sid,
        features,
        profileconfig,
    } = pageContainer.dataset;

    render(<HotelDeal
        details={details}
        sid={sid}
        parameters={JSON.parse(parameters)}
        features={JSON.parse(features)}
        profileConfig={JSON.parse(profileconfig)}
    />, pageContainer);
}
