import React, { Component } from 'react';
import Tooltip from 'reactstrap/lib/Tooltip';

class FlightsTooltip extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
        };
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({ show: !this.state.show });
    }

    render() {
        const {
            flightToolTip,
            fid,
            itin,
            divClassName,
            depToolTipText,
            retToolTipText,
            inputChecked,
            inputType,
            inputOnChange,
            inputClassName,
            inputValue,
        } = this.props;

        const { show } = this.state;

        if (flightToolTip) {
            let message;
            itin === 0 ? message = depToolTipText : message = retToolTipText;
            return (
                <div className="select-flight-btn-container mx-2 mb-2">
                    <div className={divClassName} id={fid}>
                        <input checked={inputChecked} type={inputType} id="" onChange={inputOnChange} className={inputClassName} value={inputValue} />
                        <label htmlFor=""><span /></label>
                    </div>
                    <Tooltip placement="top" isOpen={show} target={fid} toggle={this.toggle}>
                        {message}
                    </Tooltip>
                </div>
            );
        }

    }
}

export default FlightsTooltip;
