import React from 'react';
import { render } from 'react-dom';
import WatchList from 'components/pages/watchList';

const pageContainer = document.getElementById('wtch_list');

if (pageContainer !== null) {
    const { key, email } = pageContainer.dataset;
    render(<WatchList hash={key} email={email} />, pageContainer);
}
