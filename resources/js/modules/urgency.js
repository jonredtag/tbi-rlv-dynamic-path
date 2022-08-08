import React from 'react';
import { render } from 'react-dom';
import Urgency from 'components/common/Urgency';

const urgencyBar = document.getElementById('urgencyBar');
if (urgencyBar !== null) {
    const urgencyProps = {};
    if (urgencyBar.dataset.bgcolor !== undefined) {
        urgencyProps.bgColor = urgencyBar.dataset.bgcolor;
    }
    if (urgencyBar.dataset.displaytype !== undefined) {
        urgencyProps.displayType = urgencyBar.dataset.displaytype;
    }
    if (urgencyBar.dataset.context !== undefined) {
        // The urgency context prop affects the wording of the urgent message
        const validContexts = ['payment', 'search'];
        const contextProperty = (validContexts.indexOf(urgencyBar.dataset.context) > -1) ? urgencyBar.dataset.context : 'search';
        urgencyProps.context = contextProperty;
    }
    if (urgencyBar.dataset.timeoutduration !== undefined) {
        urgencyProps.timeoutDuration = parseInt(urgencyBar.dataset.timeoutduration, 10);
    }
    if (urgencyBar.dataset.product !== undefined) {
        urgencyProps.product = urgencyBar.dataset.product;
    }
    if (urgencyBar.dataset.productkey !== undefined) {
        urgencyProps.productKey = urgencyBar.dataset.productkey;
    }
    if (urgencyBar.dataset.randomfactor !== undefined) {
        urgencyProps.randomFactor = parseInt(urgencyBar.dataset.randomfactor, 10);
    }
    render(<Urgency {...urgencyProps} />, urgencyBar);
}
