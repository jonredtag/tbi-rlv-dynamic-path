import React from 'react';
import { render } from 'react-dom';
import Index from 'components/pages/index';

const pageContainer = document.getElementById('dyn_index');

if (pageContainer !== null) {
    const { parameters, features, profileconfig } = pageContainer.dataset;
    render(<Index
        parameters={JSON.parse(parameters)}
        features={JSON.parse(features)}
        profileConfig={JSON.parse(profileconfig)} />, pageContainer);
}
