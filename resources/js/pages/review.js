import React from 'react';
import { render } from 'react-dom';
import Review from 'components/pages/review';

const pageContainer = document.getElementById('dyn_review');

if (pageContainer !== null) {
    const {
        sid,
        parameters,
        tripinformation,
        breadcrumbs,
        features,
        profileconfig,
    } = pageContainer.dataset;

    render(<Review
        sid={sid}
        tripInformation={JSON.parse(tripinformation)}
        parameters={JSON.parse(parameters)}
        breadcrumbs={JSON.parse(breadcrumbs)}
        features={JSON.parse(features)}
        profileConfig={JSON.parse(profileconfig)}
    />, pageContainer);
}
