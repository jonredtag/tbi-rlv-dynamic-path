import React, { Component } from 'react';
import moment from 'moment';
import { SingleDatePicker, isInclusivelyAfterDay } from 'react-dates';
import PropTypes from 'prop-types';

class Single extends Component {
    constructor(props) {
        super(props);
        this.state = {
            focused: false,
        };

        this.onDateChange = this.onDateChange.bind(this);
        this.onFocusChange = this.onFocusChange.bind(this);
    }

    onDateChange(date) {
        this.setState({ date });
        this.props.onDateChange(date);
    }

    onFocusChange({ focused }) {
        this.setState({ focused });
        this.props.onFocusChange(focused);
    }

    render() {
        const { focused } = this.state;
        const { minDate, maxDate } = this.props;
        const props = Object.assign({}, this.props);
        const dayBlocked = this.props.dayBlocked !== undefined ? this.props.dayBlocked : () => {};

        let dateRange = () => false;
        if (minDate !== null || maxDate !== null) {
            dateRange = (day) => {
                const startDate = minDate !== null ? !isInclusivelyAfterDay(day, moment().add(minDate, 'days')) : false;
                const endDate = maxDate !== null ? isInclusivelyAfterDay(day, moment().add(maxDate, 'days')) : false;

                return startDate || endDate;
            };
        }
        delete props.minDate;
        delete props.maxDate;
        delete props.onFocusChange;
        delete props.onDateChange;
        return (
            <SingleDatePicker
                {...props}
                focused={focused}
                onDateChange={this.onDateChange}
                onFocusChange={this.onFocusChange}
                displayFormat="MM/DD/YYYY"
                isOutsideRange={dateRange}
                readOnly
                isDayBlocked={dayBlocked}
            />
        );
    }
}

Single.propTypes = {
    minDate: PropTypes.number,
    maxDate: PropTypes.number,
    onFocusChange: PropTypes.func,
    onDateChange: PropTypes.func,
};

Single.defaultProps = {
    minDate: 2,
    maxDate: 325,
    date: null,
    onFocusChange: () => {},
    onDateChange: () => {},
};
export default Single;
