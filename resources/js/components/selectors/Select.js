import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Select extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedValue: props.selectedValue,
        };

        this._onChange = this._onChange.bind(this);
        this._onBlur = this._onBlur.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const selectedIndex = nextProps.list.findIndex(item => item.value === this.state.selectedValue);
        if (selectedIndex === -1 || this.state.selectedValue !== nextProps.selectedValue) {
            this.setState({ selectedValue: nextProps.selectedValue });
        }
    }

    getSelectedText() {
        const item = this.props.list.find(element => this.state.selectedValue === element.value);

        return item.text;
    }

    _onChange(event) {
        const value = event.target.value;

        this.props.onChange(value);

        this.setState({ selectedValue: value });
    }

    _onBlur(event) {
        const blurHandler = this.props.onBlur;
        if (blurHandler) {
            blurHandler(event);
        }
    }

    render() {
        return (
            <select onBlur={this._onBlur} className={this.props.classes} id={this.props.id} value={this.state.selectedValue} onChange={this._onChange} name={this.props.name}>
                {this.props.list.map(item => <option disabled={item.disabled !== undefined && item.disabled == true} key={`${item.value}-${item.text}`} value={item.value}>{item.text}</option> )}
            </select>
        );
    }
}

Select.propTypes = {
    list: PropTypes.instanceOf(Array).isRequired,
    id: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    classes: PropTypes.string,
    name: PropTypes.string,
};

Select.defaultProps = {
    onChange: () => {},
    onBlur: null,
    classes: 'select-component',
    id: '',
    selectedValue: '',
    name: '',
};

export default Select;
