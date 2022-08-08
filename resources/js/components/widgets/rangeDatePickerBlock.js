import React, { Component } from 'react';
import moment from 'moment';
import { DateRangePicker, isInclusivelyAfterDay } from 'react-dates';
import isAfterDay from 'react-dates/lib/utils/isAfterDay';
import PropTypes from 'prop-types';
// import 'react-dates/in3itialize';

class Range extends Component {
    constructor(props) {
        super(props);
        this.state = {
            focusedInput: null,
        };

        this.onDatesChange = this.onDatesChange.bind(this);
        this.onFocusChange = this.onFocusChange.bind(this);
    }

    onDatesChange({ startDate, endDate }) {
        // this.setState({ startDate, endDate });
        // also call parent change callback
        this.props.onDatesChange(startDate, endDate);
    }

    onFocusChange(focusedInput) {
        this.setState({ focusedInput });
    }

    render() {
        const { focusedInput } = this.state;
        const props = Object.assign({}, this.props);
        delete props.onDateChange;
        const arrow = (<div className="DateRangePickerInput__arrow DateRangePickerInput_arrow_svg d-lg-none" aria-hidden="true" role="presentation"><svg viewBox="0 0 1000 1000"><path d="M694.4 242.4l249.1 249.1c11 11 11 21 0 32L694.4 772.7c-5 5-10 7-16 7s-11-2-16-7c-11-11-11-21 0-32l210.1-210.1H67.1c-13 0-23-10-23-23s10-23 23-23h805.4L662.4 274.5c-21-21.1 11-53.1 32-32.1z" /></svg></div>);
        return (
            <DateRangePicker
                {...props}
                displayFormat="MM/DD/YYYY"
                focusedInput={focusedInput}
                onDatesChange={this.onDatesChange}
                onFocusChange={this.onFocusChange}
                customArrowIcon={arrow}
                readOnly
                minimumNights={0}
                isOutsideRange={(day) => !isInclusivelyAfterDay(day, props.minDate)
                    || isAfterDay(day, props.maxDate)}
            />
        );
    }
}

Range.propTypes = {
    onDatesChange: PropTypes.func.isRequired,
};

Range.defaultProps = { startDate: null, endDate: null };
export default Range;
