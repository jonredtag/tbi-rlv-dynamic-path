import React from 'react';
import { render } from 'react-dom';
import ActivityDetails from 'components/pages/dynamicActivityDetails';

const pageContainer = document.getElementById('dyn_activityDetails');

if (pageContainer !== null) {
    const {
        sid,
        parameters,
        activity,
        breadcrumbs,
        features,
        profileconfig,
    } = pageContainer.dataset;

    render(<ActivityDetails
        activity={activity}
        breadcrumbs={JSON.parse(breadcrumbs)}
        sid={sid}
        parameters={JSON.parse(parameters)}
        features={JSON.parse(features)}
        profileConfig={JSON.parse(profileconfig)}
    />, pageContainer);
}
