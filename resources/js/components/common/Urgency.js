import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Lang from 'libraries/common/Lang';

class Urgency extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            message: '',
        };
        this.blub = this.blub.bind(this);
        this.show = this.show.bind(this);
    }

    componentDidMount() {
        const {
            randomFactor,
            displayType,
            product,
            productKey,
            context,
            timeoutDuration,
        } = this.props;
        const localStorageKey = `on_load_counter-${productKey}-${context}`;
        let n = localStorage.getItem(localStorageKey);
        if (n === null) {
            n = 0;
        }
        n = parseInt(n, 10) + 1;
        localStorage.setItem(localStorageKey, n);
        const number = Math.floor(Math.random() * randomFactor) + 1;
        const total = number + n;
        if (displayType === 'timeout') {
            setTimeout(() => this.blub(number, total), timeoutDuration);
        } else if (displayType === 'mousemove') {
            const body = document.getElementById('app');
            window.mouseFlag = 0;
            body.addEventListener('mousemove', () => {
                if (!window.mouseFlag) {
                    this.blub(number, total);
                }
                window.mouseFlag = 1;
            });
        }
    }

    updateMessage(message) {
        this.setState({ message });
    }
    show(bool) {
        this.setState({ show: bool });
    }

    blub(number, total) {
        const { context, product } = this.props;
        if (context === 'payment') {
            if (number === 1) {
                this.updateMessage(Lang.trans('urgency.payment_message_single', { number, product }));
            } else {
                this.updateMessage(Lang.trans('urgency.payment_message_plural', { number, product }));
            }
        } else if (context === 'search') {
            this.updateMessage(Lang.trans('urgency.search_message', { total, product }));
        }
        if (context === 'search' || context === 'payment') {
            this.show(true);
        }
    }

    render() {
        const {
            bgColor,
            txtColor,
            height,
        } = this.props;

        const { show, message } = this.state;
        const messageStyle = {
            textAlign: 'center',
            lineHeight: `${height}px`,
            padding: '5px',
        };
        const outputStyle = {
            bottom: '20px',
            position: 'fixed',
            right: '20px',
            width: '25%',
            borderRadius: '5px',
            float: 'right',
            zIndex: '100',
            height: height,
            backgroundColor: bgColor,
            color: txtColor,
            display: show ? 'block' : 'none',
        };
        return (
            <div id="notification-bar" style={outputStyle}>
                <div className="notification-message" style={messageStyle}>{message}</div>
            </div>
        );
    }
}

Urgency.propTypes = {
    bgColor: PropTypes.string,
    txtColor: PropTypes.string,
    height: PropTypes.string,
    displayType: PropTypes.string,
    context: PropTypes.string.isRequired,
    randomFactor: PropTypes.number,
    product: PropTypes.string,
    timeoutDuration: PropTypes.number,
};

Urgency.defaultProps = {
    duration: 6500,
    bgColor: "#A8C5DB",
    txtColor: "#000000",
    height: 'auto',
    displayType: 'timeout',
    randomFactor: 3,
    product: 'product',
    timeoutDuration: 7000,
};

export default Urgency;
