/* eslint class-methods-use-this: "off" */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Autocomplete from 'react-autocomplete';
import autocompleteHOC from 'components/widgets/autocompletes/autocompleteHOC';
import Icons from 'libraries/common/Icons';
import Lang from 'libraries/common/Lang';

class ActivityAutocomplete extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            displayText: props.value || '',
            filterList: [],
        };

        this.input = null;

        this.renderItem = this.renderItem.bind(this);
        this.renderMenu = this.renderMenu.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.onVisibilityChange = this.onVisibilityChange.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onFocus = this.onFocus.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (this.state.displayText !== nextState.displayText
            || this.state.filterList.length !== nextState.filterList.length
            || this.state.loading !== nextState.loading
            || this.props.value !== nextProps.value
        );
    }

    componentDidUpdate(prevProps) {
        if (this.props.value !== prevProps.value) {
            this.setState({ displayText: this.props.value });
        }
    }

    onVisibilityChange(visibility) {
        this.props.onVisibilityChange(visibility);
    }

    onChange(event, value) {
        this.filter(value);
        this.setState({ displayText: value });
    }

    onFocus(event) {
        this.props.onFocus(event, this.input);
        this.filter('');
    }

    onKeyDown(event) {
        this.props.onKeyDown(event, this.input);
    }

    onSelect(value, item) {
        this.props.onSelect(item);
        this.setState({ displayText: value });
    }

    onBlur() {
        if (this.props.isBlurReady()) {
            this.setState({ displayText: this.props.value });
        }
    }

    filter(value) {
        if (this.state.loading === true) {
            this.state.gatewayRequest.abort();
        }

        const xhr = new XMLHttpRequest();
        const { endpoint, sid, departure } = this.props;
        this.setState({ loading: true, gatewayRequest: xhr });
        const autocompleteType = (endpoint === undefined) ? 'autocomplete' : endpoint;
        xhr.open('GET', `/api/activity/${autocompleteType}/${encodeURIComponent(`${departure ? `${departure}||` : ''}${value}`)}${sid ? `?sid=${sid}` : ''}`);

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                const data = JSON.parse(xhr.response);
                this.setState({ filterList: data, loading: false });
            } else {
                console.log(`status: ${xhr.status}, statusText: ${xhr.statusText}`);
            }
        };
        xhr.onerror = () => {
            console.log(`status: ${xhr.status}, statusText: ${xhr.statusText}`);
        };
        xhr.send();
    }

    renderItem(item, isHighlighted) {
        const { id, icon } = this.props;
        const classes = [];

        classes.push('suggestion-item');
        classes.push('gateway');
        classes.push('autocomplete-row');
        classes.push('airport-code-padding');

        let iconType = 'plane-right';
        if (item.category !== undefined) {
            if (item.category === 'city') {
                iconType = 'map-pin';
            }
            if (item.category === 'area') {
                iconType = 'building';
            }
        }
        const index = (item.index !== undefined) ? item.index : Math.floor(Math.random() * (5 - 2)) + 2;

        if (isHighlighted) {
            classes.push('active');
        }
        return (
            <div data-category={item.category} className={classes.join(' ')} key={`${id}-${index}-suggestion`} id={item.code}>
                {(icon === 'icon') && (
                    <svg className="icon" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                        <use xlinkHref={Icons.path(iconType)} />
                    </svg>
                )}
                { (icon === 'iata' || item.category === 'airport') && <span className="airport-code">{item.value}</span> }
                <div className="autocomplete-text ellipsis"><strong>{item.text}</strong></div>
                <small className="ellipsis sub-text">{item.text2}</small>
            </div>
        );
    }

    renderMenu(items, value) {
        const { id } = this.props;
        if (value.length >= 3 && items.length === 0) {
            return (
                <div className="autocomplete-section">
                    <div className="autocomplete-error">{Lang.trans('engine.no_matches_found')}</div>
                </div>
            );
        } else if (items.length > 0) {
            const iconType = 'map-pin';           
            return (
                <div className="autocomplete-section">
                    {items.map((item, index) => {
                        const icon = (<svg className="icon" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                    <use xlinkHref={Icons.path(iconType)} />
                                </svg>);
                        return item;
                    })}
                </div>
            );
        }
        return <div className="d-none" />;
    }

    render() {
        const { displayText, filterList } = this.state;
        const {
            id,
            inputClass,
            placeholder,
        } = this.props;

        return (
            <Autocomplete
                ref={(element) => { this.input = element; }}
                value={displayText}
                inputProps={{
                    name: '',
                    id,
                    className: `form-control ${inputClass}`,
                    placeholder,
                    onKeyDown: this.onKeyDown,
                    onFocus: this.onFocus,
                    onBlur: this.onBlur,
                    autoCorrect: 'off',
                }}
                items={filterList}
                onMenuVisibilityChange={this.onVisibilityChange}
                getItemValue={(item) => item.text}
                onSelect={this.onSelect}
                onChange={this.onChange}
                wrapperStyle={{ display: 'block' }}
                wrapperProps={{ className: 'element-wrapper' }}
                renderItem={this.renderItem}
                renderMenu={this.renderMenu}
            />
        );
    }
}

ActivityAutocomplete.propTypes = {
    placeholder: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
    inputClass: PropTypes.string,
    value: PropTypes.string.isRequired,
    onVisibilityChange: PropTypes.func,
    // these come from higher component
    onKeyDown: PropTypes.func.isRequired,
    renderMenu: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    isBlurReady: PropTypes.func.isRequired,
    icon: PropTypes.string,
};

ActivityAutocomplete.defaultProps = {
    onVisibilityChange: () => {},
    inputClass: '',
    icon: 'icon',
};

export default autocompleteHOC(ActivityAutocomplete);
