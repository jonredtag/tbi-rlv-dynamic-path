import React, { useState } from 'react';
import PropTypes from 'prop-types';

const FilterHOC = (Filter) => {
    const FilterWrapper = (props) => {
        const {
            collapse,
            title,
            subTitle,
            className,
            ...otherProps
        } = props;
        const { resetFilters, code } = otherProps;
        const [isOpen, setOpen] = useState(true);

        const visible = (collapse && isOpen) || !collapse;

        return (
            <div className={`filter-container ${className} filter-btns ${visible ? 'open' : 'closed'}`}>
                {(collapse && (
                    <button type="button" className="filter-title btn-unstyled" onClick={() => { setOpen(!isOpen); }}>
                        {title}
                        {subTitle.length > 0 && (<span className="instruction">{subTitle}</span>)}
                        <div className="float-right d-none status-icon" />
                    </button>
                )) || (
                    <div className="h6 filter-title text-left">
                        {title}
                        {subTitle.length > 0 && (<span className="instruction">{subTitle}</span>)}
                        <div className="float-right d-none status-icon" />

                        {code !== undefined && code == "poi" && (
                            <a href="javascript:void(0);" className="d-none d-lg-inline font-size-sm text-muted text-underline float-right" onClick={() => resetFilters(code)}>Reset</a>
                        )}
                    </div>
                )}
                    <div className="filter-content">
                        <Filter {...otherProps} />
                    </div>
            </div>
        );
    };

    FilterWrapper.propTypes = {
        collapse: PropTypes.bool,
        title: PropTypes.string.isRequired,
        subTitle: PropTypes.string,
        className: PropTypes.string,
        code: PropTypes.string,
    };

    FilterWrapper.defaultProps = {
        collapse: false,
        subTitle: '',
        className: '',
        code: '',
    };

    return FilterWrapper;
};

export default FilterHOC;
