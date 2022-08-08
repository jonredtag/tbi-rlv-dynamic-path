import 'core-js/stable';
import 'regenerator-runtime/runtime.js';
import 'picturefill';
import moment from 'moment';
import svg4everybody from 'svg4everybody';
import 'whatwg-fetch';
import 'modules/header';

moment.locale(`${window.Locale}-ca`);
svg4everybody();
const app = document.getElementById('app');
const { page } = app.dataset;

window.IMG_ICONS = '/img/icons/';

switch (page) {

case 'default':
    import('pages/index');
    break;
case 'htl-search':
    import('pages/dyn-hotel-search');
    break;
case 'htl-details':
    import('pages/dyn-hotel-details');
    break;
case 'htl-deal':
    import('pages/dyn-hotel-deal');
    break;
case 'flt-search':
    import('pages/dyn-flight-search');
    break;
case 'review':
    import('pages/review');
    break;
case 'act-search':
    import('pages/dyn-activity-search');
    break;
case 'act-details':
    import('pages/dyn-activity-details');
    break;
case 'checkout':
    import('pages/checkout');
    break;
case 'htl-manager':
    import('pages/hotel-manager');
    break;
case 'sms-auth':
    import('pages/sms-auth');
    break;
case 'car-search':
    import('pages/dyn-car-search');
    break;
case 'confirmation':
    import('pages/confirmation');
    break;
default:
    import('pages/index');
    break;
}

if (page !== 'default' && page !== 'confirmation' && page !== 'sms-auth' && page !== 'wtch-list') {
    import('modules/sessionExpire');
}
