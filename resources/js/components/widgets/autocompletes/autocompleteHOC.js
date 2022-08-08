/* eslint class-methods-use-this: "off" */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default function autocompleteHOC(AutocompleteComponent) {
    class AutocompleteWrapper extends Component {
        constructor(props) {
            super(props);
            this.renderMenu = this.renderMenu.bind(this);
            this.onKeyDown = this.onKeyDown.bind(this);
            this.onFocus = this.onFocus.bind(this);
            this.clear = this.clear.bind(this);
            this.checkBlur = this.checkBlur.bind(this);
            this.onSelect = this.onSelect.bind(this);
            this.blurReady = true;

            this.state = {
                // closeVisible: false
            };
        }

        onSelect(item) {
            setTimeout(() => {
                this.blurTest.focus();
            });

            this.props.onSelect(item);
        }

        onFocus(event, this2) {
            this.blurReady = true;
            setTimeout(() => {
                this2.refs.input.setSelectionRange(
                    0,
                    this2.refs.input.value.length,
                );
            }, 0);
        }

        onKeyDown(event, this7) {
            if (event.key === 'Tab') {
                if (!this7.isOpen()) {
                    // menu is closed so there is no selection to accept -> do nothing
                } else if (this7.state.highlightedIndex == null) {
                    // input has focus but no menu item is selected + enter is hit -> close the menu, highlight whatever's in input
                    this7.setState(
                        {
                            isOpen: false,
                        },
                        () => {
                            this7.refs.input.select();
                        }
                    );
                } else {
                    // text entered + menu item has been highlighted + enter is hit -> update value to that of selected menu item, close the menu
                    event.preventDefault();
                    const item = this7.getFilteredItems(this7.props)[
                        this7.state.highlightedIndex
                    ];
                    const value = this7.props.getItemValue(item);
                    this7.setState(
                        {
                            isOpen: false,
                            highlightedIndex: null,
                        },
                        () => {
                            // this.refs.input.focus() // TODO: file issue
                            this7.refs.input.setSelectionRange(
                                value.length,
                                value.length
                            );
                            this7.props.onSelect(value, item);
                        }
                    );
                }
            }
        }

        checkBlur() {
            return this.blurReady;
        }

        clear() {
            this.blurReady = false;

            const input = document.getElementById(this.props.id);

            setTimeout(() => {
                input.focus();
            });

            this.ac.setState({ displayText: '' });
            this.props.onSelect('', {});
            this.empty = true;
        }

        renderMenu(items, value) {
            let response = null;
            if (value.length >= 3 && items.length === 0) {
                response = (
                    <div className="autocomplete-section">
                        <div className="autocomplete-error">
                            No matches found
                        </div>
                    </div>
                );
            } else if (items.length > 0) {
                response = <div className="autocomplete-section">{items}</div>;
            } else {
                response = <div className="d-none" />;
            }

            return response;
        }

        render() {
            const { clearButton } = this.props;

            return (
                <div ref={(element) => { this.wrapper = element; }}>
                    {clearButton && (
                        <button
                            tabIndex="-1"
                            type="button"
                            className="clear-btn"
                            onMouseDown={this.clear}
                        >
                            <svg
                                className="icon"
                                width="100%"
                                height="100%"
                                xmlns="http://www.w3.org/1999/xlink"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                            >
                                <use xlinkHref="/img/icons/icon-defs.svg#icon-close-circle" />
                            </svg>
                        </button>
                    )}
                    <AutocompleteComponent
                        {...this.props}
                        ref={(input) => {
                            this.ac = input;
                        }}
                        onSelect={this.onSelect}
                        renderMenu={this.renderMenu}
                        onKeyDown={this.onKeyDown}
                        onFocus={this.onFocus}
                        isBlurReady={this.checkBlur}
                    />
                    <button type="button" ref={(element) => { this.blurTest = element; }} className="remove-focus-btn" />
                </div>
            );
        }
    }

    AutocompleteWrapper.propTypes = {
        clearButton: PropTypes.bool,
    };

    AutocompleteWrapper.defaultProps = {
        clearButton: false,
    };

    return AutocompleteWrapper;
}
