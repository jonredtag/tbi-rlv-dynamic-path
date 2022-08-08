import React from 'react';
import { render } from 'react-dom';
import FlightResults from 'components/pages/dynamicFlightResults';

const pageContainer = document.getElementById('dyn_flightSearchResults');

if (pageContainer !== null) {
    const {
        sid,
        parameters,
        isincremental,
        breadcrumbs,
        features,
        profileconfig,
    } = pageContainer.dataset;

    render(<FlightResults
        sid={sid}
        parameters={JSON.parse(parameters)}
        isIncremental={isincremental === 'true'}
        breadcrumbs={JSON.parse(breadcrumbs)}
        features={JSON.parse(features)}
        profileConfig={JSON.parse(profileconfig)}
    />, pageContainer);
}
