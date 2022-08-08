import React from 'react';
import ReactDom, { render } from 'react-dom';
import ActivityResults from 'components/pages/dynamicActivityResults';

const pageContainer = document.getElementById('dyn_activitySearchResults');

if (pageContainer !== null) {
    const {
        sid,
        parameters,
        breadcrumbs,
        features,
        profileconfig,
    } = pageContainer.dataset;

    render(<ActivityResults
        sid={sid}
        breadcrumbs={JSON.parse(breadcrumbs)}
        parameters={JSON.parse(parameters)}
        features={JSON.parse(features)}
        profileConfig={JSON.parse(profileconfig)}
    />, pageContainer);
}
