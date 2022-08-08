import React from 'react';
import ReactDom, { render } from 'react-dom';
import CarResults from 'components/pages/dynamicCarResults';

const pageContainer = document.getElementById('dyn_carSearchResults');

if (pageContainer !== null) {
    const {
        sid,
        parameters,
        breadcrumbs,
        features,
        profileconfig,
    } = pageContainer.dataset;

    render(<CarResults
        sid={sid}
        parameters={JSON.parse(parameters)}
        breadcrumbs={JSON.parse(breadcrumbs)}
        features={JSON.parse(features)}
        profileConfig={JSON.parse(profileconfig)}
    />, pageContainer);
}
