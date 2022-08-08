import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Loader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            position: props.position,
            display: props.active,
        };

        this.interval = null;
        this.fakeProgress = this.fakeProgress.bind(this);
    }

    componentDidMount() {
        const { active, interval } = this.props;
        if (active) {
            this.interval = setInterval(this.fakeProgress, interval);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { position, active, interval } = this.props;
        const { display } = this.state;
        let newDisplay = display;
        if (prevProps.active !== active) {
            if (active) {
                // turn on interval
                this.interval = setInterval(this.fakeProgress, interval);
                newDisplay = true;
            } else {
                // turn off interval
                clearInterval(this.interval);

                setTimeout(() => {
                    this.setState({ display: false });
                }, 400);
            }

            this.setState({ position, display: newDisplay });
        }
    }

    fakeProgress() {
        const { position } = this.state;
        const updateValue = Math.floor(Math.random() * (5 - 2)) + 2;

        const newPosition = ((100 - position) * (updateValue / 100)) + position;

        this.setState({ position: newPosition });
    }

    render() {
        const { position, display } = this.state;
        return (
            <div className={display ? '' : 'd-none'}>
                <div className="progress">
                    <div className="progress-bar" role="progressbar" style={{ width: `${position}%` }} />
                </div>
            </div>
        );
    }
}

Loader.propTypes = {
    position: PropTypes.number.isRequired,
    active: PropTypes.bool.isRequired,
    interval: PropTypes.number,
};

Loader.defaultProps = {
    interval: 100,
};

export default Loader;
