import React from 'react';
import ReactDom, { render } from 'react-dom';
import HotelManager from 'components/pages/hotelManager';

const pageContainer = document.getElementById('hotelManagerApp');

if (pageContainer !== null) {
	const { parameters } = pageContainer.dataset;
	render(<HotelManager parameters={JSON.parse(parameters)} />, pageContainer);
}
