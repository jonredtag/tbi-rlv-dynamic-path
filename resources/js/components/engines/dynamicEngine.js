import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DynamicAutocomplete from 'components/widgets/autocompletes/dynamicAutocomplete';
import RefundableAutocomplete from 'components/widgets/autocompletes/refundableAutocomplete';
import ActivityAutocomplete from 'components/widgets/autocompletes/activityAutocomplete';
import RangeDatePicker from 'components/widgets/rangeDatePicker';
import RangeDatePickerBlock from 'components/widgets/rangeDatePickerBlock';
import DatePicker from 'components/widgets/singleDatePicker';
import HotelOccupancy from 'components/widgets/hotelOccupancy';
import buildQueryString from 'helpers/buildQueryString';
import moment from 'moment';
import Lang from 'libraries/common/Lang';
import ErrorTooltip from 'components/snippets/errorTooltip';
import Select from 'components/selectors/Select';

import Collapse from 'reactstrap/lib/Collapse';

class DynamicEngine extends Component {
    static sendRequest(request, sid) {
        const params = {
            request: JSON.stringify(request),
            sid,
        };

        const query = buildQueryString(params);
        const url = `/api/dynamic/update?${query}`;

        const promise = fetch(url);
        promise
            .then((response) => response.text())
            .then((url) => {
                window.location.href = url;
            });
    }

    constructor(props) {
        super(props);
        this.state = {
            departure: props.parameters.departure || {},
            destination: props.parameters.destination || {},
            depDate: moment(props.parameters.depDate || moment()),
            retDate: moment(props.parameters.retDate || moment().add(7, 'days')),
            depDateHotel:
                props.parameters.depDateHotel !== null
                    ? moment(props.parameters.depDateHotel)
                    : null,
            retDateHotel:
                props.parameters.retDateHotel !== null
                    ? moment(props.parameters.retDateHotel)
                    : null,
            occupancy: props.parameters.occupancy || [
                { adults: 2, children: 0, ages: [] },
            ],
            lang: props.parameters.lang || 'en',
            occupancyOpen: false,
            open: false,
            numMonths: window.innerWidth > 767 ? 2 : 1,
            selectedProducts: props.parameters.selectedProducts || 'H',
            shouldValidate: false,
            errors: {},
            flightDates: [],
            duration: 7,
            durations: [{ value: 7, text: '7 days' }],
            classFare: props.parameters.cabinType || 'Y',
            fares: [
                {
                    value: 'Y',
                    text: Lang.trans('engine_flights.class_economy'),
                },
                {
                    value: 'S',
                    text: Lang.trans('engine_flights.class_premium_economy'),
                },
                {
                    value: 'C',
                    text: Lang.trans('engine_flights.class_business'),
                },
                {
                    value: 'F',
                    text: Lang.trans('engine_flights.class_first'),
                },
            ],
            customHotelDates: props.parameters.customHotelDates || false,
            hotelSearch: props.parameters.hotelSearch || ''
        };

        this.productTypes = [
            { code: 'FH', text: Lang.trans('dynamic.flight_plus_hotel') },
            { code: 'H', text: Lang.trans('dynamic.hotel') },
            { code: 'FHC', text: 'Flight + Hotel + Car' },
            { code: 'FC', text: 'Flight + Car' },
            { code: 'A', text: 'Activity' },
        ];

        this.selectDeparture = this.selectDeparture.bind(this);
        this.selectDestination = this.selectDestination.bind(this);
        this.onDatesChange = this.onDatesChange.bind(this);
        this.onDateChange = this.onDateChange.bind(this);
        this.onCustomDatesChange = this.onCustomDatesChange.bind(this);
        this.setOccupancy = this.setOccupancy.bind(this);
        this.setProduct = this.setProduct.bind(this);
        this.onOccupancyChange = this.onOccupancyChange.bind(this);
        this.onRoomChange = this.onRoomChange.bind(this);
        this.windowResize = this.windowResize.bind(this);
        this.submit = this.submit.bind(this);
        this.toggle = this.toggle.bind(this);
        this.onClassChange = this.onClassChange.bind(this);
        this.toggleCustomHotelDates = this.toggleCustomHotelDates.bind(this);
        this.showOccupancy = this.showOccupancy.bind(this);
        this.hideOccupancy = this.hideOccupancy.bind(this);
        this.handleOccupancyBlur = this.handleOccupancyBlur.bind(this);
        this.isDayBlocked = this.isDayBlocked.bind(this);
        this.setHotelSearch = this.setHotelSearch.bind(this);
        this.resetHotelSearch = this.resetHotelSearch.bind(this);
    }

    componentDidMount() {
        window.addEventListener('resize', this.windowResize);
        this.getDates();
    }

    handleOccupancyBlur(event) {
        let node = event.target;

        let within = false;

        while (node !== event.currentTarget) {
            node = node.parentNode;

            if (node.classList.contains('htl_popover')) {
                within = true;
                break;
            }
        }

        if (!within) {
            this.hideOccupancy();
        }
    }

    onClassChange(classFare) {
        this.setState({
            classFare,
        });
    }

    onDatesChange(startDate, endDate) {
        this.setState(
            {
                depDate: startDate,
                retDate: endDate,
            },
            () => {
                if (this.state.shouldValidate) {
                    this.clearError('engine.dates');
                    this.validateField('engine.dates');
                }
            }
        );
    }

    onDateChange(startDate) {
        const { duration, flightDates } = this.state;
        const date = flightDates.find((row) => startDate.format('YYYY-MM-DD') === row.date);
        const durations = date.durations.map((duration) => ({ value: duration, text: `${duration} days` }));
        this.setState(
            {
                durations,
                depDate: startDate,
                retDate: startDate.clone().add(duration, 'days'),
            },
            () => {
                if (this.state.shouldValidate) {
                    this.clearError('engine.dates');
                    this.validateField('engine.dates');
                }
            }
        );
    }

    onCustomDatesChange(startDate, endDate) {
        this.setState(
            {
                depDateHotel: startDate,
                retDateHotel: endDate,
            },
            () => {
                if (this.state.shouldValidate) {
                    this.clearError('engine.dates');
                    this.validateField('engine.dates');
                }
            }
        );
    }

    onRoomChange(event) {
        const rooms = parseInt(event.target.value, 10);
        const { occupancy } = this.state;

        let updateOccupancy = [...occupancy];
        if (rooms > occupancy.length) {
            for (let i = updateOccupancy.length; i < rooms; i++) {
                updateOccupancy.push({ adults: 1, children: 0, ages: [] });
            }
        } else {
            for (let i = occupancy.length - 1; i > rooms - 1; i -= 1) {
                for (let a = occupancy[i].ages.length; a >= 0; a -= 1) {
                    this.clearError(`${i}-room.childAge-${a}`);
                }
            }

            updateOccupancy = updateOccupancy.slice(0, rooms);
        }

        this.setState({ occupancy: updateOccupancy }, () => {});
    }

    onOccupancyChange(occupancy, paramter) {
        const [room, field, index] = paramter.split('-');
        const { occupancy: currentOccupancy } = this.state;

        if (
            currentOccupancy[parseInt(room, 10)].children >
            occupancy[parseInt(room, 10)].children
        ) {
            for (
                let i = currentOccupancy[parseInt(room, 10)].children;
                i > occupancy[parseInt(room, 10)].children;
                i--
            ) {
                this.clearError(`${room}-room.childAge-${i - 1}`);
            }
        }

        if (currentOccupancy.length > occupancy.length) {
            for (let i = currentOccupancy.length, length = occupancy.length; i > length; i--) {
                this.clearError(`${i}-room`);
            }
        }

        this.setState({ occupancy }, () => {
            if (this.state.shouldValidate && field === 'childAge') {
                this.clearError(`${room}-room.childAge-${index}`);
                this.validateField(`${room}-room.childAge-${index}`);
            }

            let guests = 0;
            occupancy.forEach((room) => {
                guests += room.adults + room.children;
            });
            if(guests < 9) {
                this.clearError(`passengersMax.maximumPassengers`);
            }

        });
    }

    setOccupancy(occupancyOpen) {
        if (occupancyOpen) {
            this.showOccupancy();
        } else {
            this.hideOccupancy();
        }
    }

    setProduct(event) {
        this.setState({ selectedProducts: event.target.value });
    }

    setHotelSearch(event) {
        this.setState({ hotelSearch: event.target.value });
    }

    resetHotelSearch(id){
        this.setState({ hotelSearch: '' });
        setTimeout(() => { document.getElementById(id).click(); });
    }

    getDates() {
        const { parameters } = this.props;

        if (parameters.refundable) {
            const { departure, destination, duration } = this.state;

            const xhr = new XMLHttpRequest();

            const query = {
                origin: departure.value,
                destination: destination.value,
            };

            xhr.open('GET', `/api/dynamic/flightDates?${buildQueryString(query)}`);
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    const data = JSON.parse(xhr.response);
                    const { depDate, duration } = this.state;
                    let diff = 0;
                    let newStartDate = data[0];

                    if (depDate !== null) {
                        data.forEach((date) => {
                            const testDate = moment(date.date);

                            const newDiff = Math.abs(parseInt(testDate.format('X'), 10) - parseInt(depDate.format('X'), 10));

                            if (testDate.isBefore(depDate) || newDiff < diff) {
                                newStartDate = date;
                                diff = newDiff;
                            }
                        });
                    }

                    const durations = newStartDate.durations.map((duration) => ({ value: duration, text: `${duration} days` }));
                    const newDuration = (durations.findIndex((row) => row.value === duration) !== -1 ? duration : durations[0].value);
                    this.setState({
                        flightDates: data,
                        duration: newDuration,
                        durations,
                        depDate: moment(newStartDate.date),
                        retDate: moment(newStartDate.date).add(newDuration, 'days'),
                    });
                } else {
                    console.log(`status: ${xhr.status}, statusText: ${xhr.statusText}`);
                }
            };
            xhr.send();
        }
    }

    showOccupancy() {
        const app = document.getElementById('app');
        app.addEventListener('click', this.handleOccupancyBlur);

        this.setState({ occupancyOpen: true });
    }

    hideOccupancy() {
        const app = document.getElementById('app');
        app.removeEventListener('click', this.handleOccupancyBlur);

        this.setState({ occupancyOpen: false });
    }

    toggleCustomHotelDates() {
        this.setState({
            customHotelDates: !this.state.customHotelDates,
        });
    }

    isDayBlocked(day) {
        const { flightDates } = this.state;

        return flightDates.findIndex((date) => date.date === day.format('YYYY-MM-DD')) === -1;
    }

    validateField(entity) {
        const [key, field] = entity.split('.');
        const parts = key.split('-');
        const { departure, destination, occupancy, depDate, retDate } = this.state;

        if (field === 'departure') {
            if (Object.keys(departure).length === 0) {
                this.addError(key, {
                    id: field,
                    message: Lang.trans('error.departure'),
                });
            }
        } else if (field === 'destination') {
            if (Object.keys(destination).length === 0) {
                this.addError(key, {
                    id: field,
                    message: Lang.trans('error.destination'),
                });
            }
        } else if (field.includes('childAge')) {
            const index = field.split('-');
            if (occupancy[parts[0]].ages[index[1]] === '') {
                this.addError(key, {
                    id: field,
                    message: Lang.trans('error_hotels.childAges', {
                        number: parseInt(index[1], 10) + 1,
                        room: parseInt(parts[0], 10) + 1,
                    }),
                });
                this.showOccupancy();
            }
        } else if (field === 'dates') {
            if (depDate === null || retDate === null) {
                this.addError(key, {
                    id: field,
                    message: Lang.trans('error.date'),
                });
            }
        }
    }

    addError(key, error) {
        const { errors } = this.state;
        // const errors = Object.assign({}, curErrors);

        // add error to key array
        if (!Object.prototype.hasOwnProperty.call(errors, key)) {
            errors[key] = {};
        }

        errors[key][error.id] = error;

        // replace state
        this.setState({
            errors,
        });
    }

    clearError(entity) {
        const { errors } = this.state;
        const [key, field] = entity.split('.');
        // const errors = Object.assign({}, curErrors);

        if (
            Object.prototype.hasOwnProperty.call(errors, key) &&
            Object.prototype.hasOwnProperty.call(errors[key], field)
        ) {
            delete errors[key][field];

            const keys = Object.keys(errors[key]);
            if (keys.length === 0) {
                delete errors[key];
            }
        } else if (field === undefined) {
            delete errors[key];
        }
        this.setState({
            errors,
        });
    }

    toggle() {
        this.setState((state) => ({ open: !state.open }));
    }

    selectDeparture(item) {
        const { parameters } = this.props;
        const stateUpdate = { departure: item };
        if (parameters.refundable) {
            stateUpdate.destination = {};
        }

        this.setState(stateUpdate, () => {
            this.getDates();
            if (this.state.shouldValidate) {
                this.clearError('engine.departure');
                this.validateField('engine.departure');
            }
        });
    }

    selectDestination(item) {
        this.setState({ destination: item }, () => {
            this.getDates();
            if (this.state.shouldValidate) {
                this.clearError('engine.destination');
                this.validateField('engine.destination');
            }
        });
    }

    windowResize() {
        if (this.resizeTimer !== null) clearTimeout(this.resizeTimer);
        const that = this;
        this.resizeTimer = setTimeout(() => {
            that.setState({ numMonths: window.innerWidth > 767 ? 2 : 1 });
        }, 250);
    }

    submit(event) {
        const {
            departure,
            destination,
            depDate,
            retDate,
            depDateHotel,
            retDateHotel,
            occupancy,
            selectedProducts,
            lang,
            errors,
            classFare,
            customHotelDates,
            hotelSearch,
        } = this.state;
        const { submitRequest, sid, parameters } = this.props;

        console.log('errors from dunamic', errors);

        if (selectedProducts.includes('F')) {
            this.validateField('engine.departure');
        }
        this.validateField('engine.destination');
        this.validateField('engine.dates');
        if (selectedProducts.includes('H')) {
            occupancy.forEach((room, key) => {
                room.ages.forEach((age, index) => {
                    this.validateField(`${key}-room.childAge-${index}`);
                });
            });
        }
        event.preventDefault();
        if (Object.keys(errors).length > 0) {
            this.setState({ shouldValidate: true });
        } else {
            const request = {
                occupancy,
                depDate: depDate.format('YYYY-MM-DD'),
                retDate: retDate.format('YYYY-MM-DD'),
                depDateHotel:
                    customHotelDates && depDateHotel !== null
                        ? depDateHotel.format('YYYY-MM-DD')
                        : null,
                retDateHotel:
                    customHotelDates && retDateHotel !== null
                        ? retDateHotel.format('YYYY-MM-DD')
                        : null,
                customHotelDates,
                departure,
                destination,
                cabinType: classFare,
                trip: 'roundtrip',
                selectedProducts,
                lang,
                hotelSearch,
            };

            if (parameters.smsCode !== undefined) {
                request.smsCode = parameters.smsCode;
            }

            if (parameters.refundable !== undefined) {
                request.refundable = parameters.refundable;
            }

            if(selectedProducts == 'FH') {
                
                let guests = 0;
                occupancy.forEach((room) => {
                    guests += room.adults + room.children;
                });
                console.log('guests', guests);
                if(guests > 9) {
                    this.addError('passengersMax', {
                        id: 'maximumPassengers',
                        message: Lang.trans('error.passengers'),
                    });
                    this.showOccupancy();
                } else {
                    submitRequest(request, sid);
                }
               
            } else {

                submitRequest(request, sid);
            }

        }
    }

    render() {
        const {
            departure,
            destination,
            depDate,
            retDate,
            depDateHotel,
            retDateHotel,
            occupancyOpen,
            occupancy,
            open,
            numMonths,
            selectedProducts,
            errors,
            classFare,
            fares,
            duration,
            durations,
            customHotelDates,
        } = this.state;

        const { sid, parameters } = this.props;

        const displayErrors = {};
        if (Object.prototype.hasOwnProperty.call(errors, 'engine')) {
            const errorKeys = Object.keys(errors.engine);

            errorKeys.forEach((key) => {
                displayErrors[key] = <ErrorTooltip error={errors.engine[key]} />;
            });
        }

        const activityStandalone = selectedProducts === 'A';
        return (
            <>
                <div className="d-md-none mobile-search-header hotel-search-header clearfix bg-white">
                    <div className="search-header-wrapper container d-flex align-items-end">
                        <div className="text text-left text-md-right">
                            <h1 className="d-flex mb-2">
                                <button type="button" className="btn-unstyled" onClick={() => { history.back(); }}>
                                    <svg
                                        className="icon mr-2"
                                        role="img"
                                        title=""
                                        xmlns="http://www.w3.org/2000/svg"
                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                    >
                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-chevron-left" />
                                    </svg>
                                </button>
                                <strong>
                                    {departure.text}
                                    &nbsp;-&nbsp;
                                    {destination.text}
                                </strong>
                            </h1>
                            <div className="pl-4 d-flex flex-wrap align-items-center">
                                {customHotelDates && <span>Travel Dates: &nbsp;</span>}

                                {depDate !== null && depDate.format('MMM DD')}
                                &nbsp;-&nbsp;
                                {retDate !== null && retDate.format('MMM DD')}

                                <span className="dot-divider-lg" />
                                <svg
                                    className="icon-md mx-1"
                                    role="img"
                                    title=""
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                >
                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-bed" />
                                </svg>
                                <span className="mt-1"> 1</span>
                                <svg
                                    className="icon mx-1"
                                    role="img"
                                    title=""
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                >
                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-person" />
                                </svg>
                                <span className="mt-1"> 2</span>
                            </div>
                            {customHotelDates && (
                                <div>
                                    Hotel Dates:&nbsp;
                                    <strong>
                                        {depDateHotel !== null
                                            ? depDateHotel.format('ll')
                                            : depDate !== null && depDate.format('ll')}
                                        &nbsp;-&nbsp;
                                        {retDateHotel !== null
                                            ? retDateHotel.format('ll')
                                            : retDate !== null && retDate.format('ll')}
                                    </strong>
                                </div>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={this.toggle}
                            className="btn-primary-outline font-weight-bold px-3 bg-white py-1"
                            id="m-engine-toggle"
                        >

                            Edit
                        </button>
                    </div>
                </div>
                <Collapse className="d-md-block" isOpen={open}>
                    <section className={`search-widget search-widget-horizontal d-md-block ${selectedProducts === 'FH' ? 'flight-hotel' : ''} ${selectedProducts === 'H' ? 'hotel-only' : ''}  `}>
                        <div className="w-100">
                            <div>
                                <form
                                    className="custom-form-element container search-wrapper hotel-flight-horizontal-search"
                                    onSubmit={this.submit}
                                >
                                    {typeof IS_DEVELOPMENT !== 'undefined' && (
                                        <div className="search-options clearfix mb-3 mb-md-2">
                                            <div className="mr-md-1 pr-md-2 d-md-inline d-flex justify-content-between mb-2 mb-md-0">
                                                {this.productTypes.map((product,index) => (
                                                    <div className="styled-radio theme-3 pr-2" key={`${index}`}>
                                                        <input
                                                            type="radio"
                                                            id={`product-${product.code}`}
                                                            name="trip"
                                                            value={product.code}
                                                            onChange={this.setProduct}
                                                            checked={selectedProducts === product.code}
                                                        />
                                                        <label htmlFor={`product-${product.code}`}>
                                                            <span>{product.text}</span>
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <div className="row gutter-10">
                                        {selectedProducts.includes('F') && (
                                            <>
                                                {!parameters.refundable && (
                                                    <div className="col-6 col-sm-4 col-md-auto">
                                                        <div className="element-container select-unstyled-container">
                                                            <Select
                                                                id="flt_class"
                                                                classes="w-100 select-unstyled"
                                                                onChange={this.onClassChange}
                                                                selectedValue={classFare}
                                                                list={fares}
                                                            />
                                                            <svg
                                                                className="icon-select"
                                                                role="img"
                                                                title=""
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                                            >
                                                                <use xlinkHref="/img/icons/icon-defs.svg#icon-chevron-down" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                )}
                                                {false && (
                                                    <div className="col-6 col-md-auto d-flex align-self-center align-content-center">
                                                        <div className="mx-2 d-inline-block align-self-center">
                                                            |
                                                        </div>
                                                        <label className="switch theme-3 align-self-center">
                                                            <input type="checkbox" />
                                                            <span className="slider round ml-0" />
                                                        </label>
                                                        <div className="pl-2 ml-2 d-inline-block align-self-center">
                                                            Direct Flights
                                                        </div>
                                                    </div>
                                                )}
                                                {parameters.refundable && (
                                                    <div className="col-6 col-sm-4 col-md-auto">
                                                        <div className="element-container input-chevron-down ">
                                                            <Select
                                                                classes="bg-transparent"
                                                                onChange={() => {}}
                                                                selectedValue={duration}
                                                                list={durations}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                    <div className="row gutter-10">
                                        {selectedProducts.includes('F') && (
                                            <div className="col-12 col-md-6 departing-from flights">
                                                <label
                                                    className="d-none d-md-block input-header"
                                                    htmlFor="dyn_return"
                                                >
                                                    {Lang.trans('engine.departing_from')}
                                                </label>
                                                <div className="element-container">
                                                    <label className="icon left" htmlFor="dyn_departure">
                                                        <svg
                                                            width="100%"
                                                            height="100%"
                                                            role="img"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            xmlnsXlink="http://www.w3.org/1999/xlink"
                                                        >
                                                            <use xlinkHref="/img/icons/icon-defs.svg#icon-plane-right" />
                                                        </svg>
                                                    </label>
                                                    <div className="element-wrapper">
                                                        {(!parameters.refundable && (
                                                            <DynamicAutocomplete
                                                                clearButton
                                                                placeholder={Lang.trans('engine.from')}
                                                                id="dyn_departure"
                                                                inputClass="pr-5 d-inline-block text-truncate"
                                                                value={departure.text || ''}
                                                                onSelect={this.selectDeparture}
                                                                icon="iata"
                                                            />
                                                        )) || (
                                                            <RefundableAutocomplete
                                                                clearButton
                                                                placeholder={Lang.trans('engine.from')}
                                                                id="dyn_departure"
                                                                inputClass="pr-5 d-inline-block text-truncate"
                                                                value={departure.text || ''}
                                                                onSelect={this.selectDeparture}
                                                                icon="iata"
                                                                sid={sid}
                                                            />
                                                        )}
                                                        {displayErrors.departure || ''}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        <div className="col-12 col-md-6 going-to flights">
                                            <label
                                                className="d-none d-md-block input-header "
                                                htmlFor="dyn_return"
                                            >
                                                {Lang.trans('engine.going_to')}
                                            </label>
                                            <div className="element-container">
                                                <label className="icon left" htmlFor="dyn_return">
                                                    <svg
                                                        className=""
                                                        width="100%"
                                                        height="100%"
                                                        role="img"
                                                        title=""
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                                    >
                                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-map-pin" />
                                                    </svg>
                                                </label>
                                                <div className="element-wrapper">
                                                    {(activityStandalone && (
                                                        <ActivityAutocomplete
                                                            clearButton
                                                            placeholder={Lang.trans('engine.to')}
                                                            id="dyn_return"
                                                            inputClass="pr-5 d-inline-block text-truncate"
                                                            value={destination.text || ''}
                                                            onSelect={this.selectDestination}
                                                            endpoint="autosuggest"
                                                            icon="icon"
                                                        />
                                                    )) || (!parameters.refundable && (
                                                        <DynamicAutocomplete
                                                            clearButton
                                                            placeholder={Lang.trans('engine.to')}
                                                            id="dyn_return"
                                                            inputClass="pr-5 d-inline-block text-truncate"
                                                            value={destination.text || ''}
                                                            onSelect={this.selectDestination}
                                                            endpoint="autosuggest"
                                                            icon="icon"
                                                        />
                                                    )) || (
                                                        <RefundableAutocomplete
                                                            clearButton
                                                            placeholder={Lang.trans('engine.to')}
                                                            id="dyn_return"
                                                            value={destination.text || ''}
                                                            onSelect={this.selectDestination}
                                                            endpoint="autosuggest"
                                                            icon="icon"
                                                            sid={sid}
                                                            departure={departure.value || ''}
                                                        />
                                                    )}
                                                    {displayErrors.destination || ''}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-6 departure-return flights">
                                            <label
                                                className="d-none d-md-block input-header"
                                                htmlFor="dyn_departureDate"
                                            >
                                                {Lang.trans(parameters.refundable ? 'dynamic.engine_depart_dates_label' : 'dynamic.engine_dates_label')}
                                            </label>
                                            <div className="element-container">
                                                <label
                                                    className="icon left"
                                                    htmlFor="dyn_departureDate"
                                                >
                                                    <svg
                                                        width="100%"
                                                        height="100%"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                                    >
                                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-calendar" />
                                                    </svg>
                                                </label>
                                                <div className="element-wrapper">
                                                    {(parameters.refundable && (
                                                        <DatePicker
                                                            onDateChange={this.onDateChange}
                                                            minDate={moment('2021-11-05').diff(
                                                                moment(),
                                                                'days'
                                                            )}
                                                            maxDate={moment('2022-11-15').diff(
                                                                moment(),
                                                                'days'
                                                            )}
                                                            date={depDate}
                                                            numberOfMonths={2}
                                                            dayBlocked={this.isDayBlocked}
                                                        />
                                                    )) || (
                                                        <RangeDatePicker
                                                            startDateId="dyn_departureDate"
                                                            endDateId="dyn_returnDate"
                                                            onDatesChange={this.onDatesChange}
                                                            minDate={2}
                                                            startDatePlaceholderText='Start Date'
                                                            endDatePlaceholderText='End Date'
                                                            startDate={depDate}
                                                            endDate={retDate}
                                                            maxDate={moment().add(11, 'months').subtract(5,'days')}
                                                            numberOfMonths={numMonths}
                                                        />
                                                    )}
                                                    {displayErrors.dates || ''}
                                                </div>
                                            </div>
                                        </div>
                                        {selectedProducts.includes('H') && (
                                            <div className="col-6 col-md-3 col-lg-1 small-number-dropdown">
                                                <label className="d-md-block input-header" htmlFor="dyn_rooms">{Lang.trans('engine_vacations.rooms')}</label>
                                                <div className="element-container input-chevron-down chevron-sm">
                                                    <select id="dyn_rooms" className="select-component pr-0 p-2" value={occupancy.length.toString()} onChange={this.onRoomChange}>
                                                        <option value="1">1</option>
                                                        <option value="2">2</option>
                                                        <option value="3">3</option>
                                                        <option value="4">4</option>
                                                        <option value="5">5</option>
                                                        <option value="6">6</option>
                                                    </select>
                                                </div>
                                            </div>
                                        )}
                                        {!selectedProducts.includes('A') && (
                                            <div className="col-6 col-md-3 col-lg-1 small-number-dropdown">
                                                <label className="d-md-block input-header" htmlFor="dyn_guests">{selectedProducts.includes('H') ? Lang.trans('engine.guests') : Lang.trans('engine.travellers')}</label>
                                                <HotelOccupancy
                                                    errors={errors}
                                                    onChange={this.onOccupancyChange}
                                                    visible={occupancyOpen}
                                                    validateField={() => {}}
                                                    onVisibilityChange={this.setOccupancy}
                                                    occupancy={occupancy}
                                                    hasRooms={selectedProducts.includes('H')}
                                                />
                                            </div>
                                        )}
                                        {selectedProducts.includes('H') && (
                                            <div className="col-12 col-md-7 col-lg-10 align-self-end input-keywords">
                                                <div className="element-container">
                                                    <label className="icon left" htmlFor="">
                                                        <svg
                                                            className=""
                                                            width="100%"
                                                            height="100%"
                                                            role="img"
                                                            title=""
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            xmlnsXlink="http://www.w3.org/1999/xlink"
                                                        >
                                                            <use xlinkHref="/img/icons/icon-defs.svg#icon-magnify-glass" />
                                                        </svg>
                                                    </label>
                                                    <div className="element-wrapper">
                                                        <div>

                                                            {this.state.hotelSearch.trim() != '' ?
                                                                <a className="clear-btn" onClick={() => this.resetHotelSearch("flt_searchBtn")}><svg className="icon" width="100%" height="100%" xmlns="http://www.w3.org/1999/xlink" xmlnsXlink="http://www.w3.org/1999/xlink"><use xlinkHref="/img/icons/icon-defs.svg#icon-close-circle"></use></svg></a> 
                                                            : "" }

                                                            <div className="element-wrapper">
                                                                <input
                                                                    id="hotelSearch"
                                                                    type="text"
                                                                    placeholder="Try “quiet and free breakfast”"
                                                                    value={this.state.hotelSearch}
                                                                    className="form-control border"
                                                                    onChange={this.setHotelSearch}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        <div className="col-12 col-md-2 search-button ">
                                            <div className="button-container">
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary-outline btn-lg btn-block  font-weight-bold"
                                                    id="flt_searchBtn"
                                                >
                                                    {Lang.trans('buttons.search')}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    {selectedProducts.includes('H') && selectedProducts !== 'H' && (
                                        <div className="row gutter-10 mt-2">
                                            <div className="col-12 col-lg-auto  d-flex align-self-center align-content-center mb-3 partial-stay">
                                                <label className="switch theme-3 mb-0 align-self-center">
                                                    <input
                                                        type="checkbox"
                                                        onChange={this.toggleCustomHotelDates}
                                                        value={false}
                                                        checked={customHotelDates === true}
                                                    />
                                                    <span className="slider round ml-0" />
                                                </label>
                                                <div className="pl-2 ml-2 d-inline-block align-self-center">
                                                    I only need a hotel for part of my stay
                                                </div>
                                            </div>
                                            {customHotelDates && (
                                                <div className="col-auto departure-return flights hotel-calendar ">
                                                    <div className="element-container">
                                                        <label
                                                            className="icon left"
                                                            htmlFor="dyn_customHotelDate"
                                                        >
                                                            <svg
                                                                width="100%"
                                                                height="100%"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                                            >
                                                                <use xlinkHref="/img/icons/icon-defs.svg#icon-calendar" />
                                                            </svg>
                                                        </label>
                                                        <div className="element-wrapper">
                                                            <RangeDatePickerBlock
                                                                startDateId="dyn_customHotelDate"
                                                                endDateId="dyn_customHotelDateReturn"
                                                                onDatesChange={this.onCustomDatesChange}
                                                                minDate={depDate}
                                                                maxDate={retDate}
                                                                startDatePlaceholderText="Start Date"
                                                                endDatePlaceholderText="End Date"
                                                                startDate={
                                                                    depDateHotel !== null ? depDateHotel : depDate
                                                                }
                                                                endDate={
                                                                    retDateHotel !== null ? retDateHotel : (retDateHotel == null && depDateHotel == null ? retDate : null)
                                                                }
                                                                numberOfMonths={numMonths}
                                                            />
                                                            {displayErrors.dates || ''}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </section>
                </Collapse>
            </>
        );
    }
}

DynamicEngine.propTypes = {
    sid: PropTypes.string,
    submitRequest: PropTypes.func,
    parameters: PropTypes.instanceOf(Object),
};

DynamicEngine.defaultProps = {
    sid: '',
    submitRequest: (request, sid) => {
        DynamicEngine.sendRequest(request, sid);
    },
    parameters: {},
};

export default DynamicEngine;
