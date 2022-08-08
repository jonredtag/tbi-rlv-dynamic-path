import React from 'react';
import { render } from 'react-dom';
import Checkout from 'components/pages/checkout';

const pageContainer = document.getElementById('dyn_checkout');

if (pageContainer !== null) {
    const {
        sid,
        parameters,
        tripinformation,
        breadcrumbs,
        insuranceoptions,
        user,
        features,
        localization,
        site,
        profileconfig,
    } = pageContainer.dataset;

    render(<Checkout
        sid={sid}
        tripInformation={JSON.parse(tripinformation)}
        parameters={JSON.parse(parameters)}
        breadcrumbs={JSON.parse(breadcrumbs)}
        insuranceOptions={JSON.parse(insuranceoptions)}
        user={JSON.parse(user)}
        features={JSON.parse(features)}
        profileConfig={JSON.parse(profileconfig)}
        localization={localization}
        site={site}
    />, pageContainer);
}
