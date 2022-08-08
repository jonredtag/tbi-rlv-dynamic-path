import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Collapse from 'reactstrap/lib/Collapse';

const CouponInput = (props) => {
    const { onChange, coupon } = props;
    const [show, setShow] = useState(false);
    const [code, setCode] = useState('');
    const toggleCollapse = () => {
        setShow(!show);
    };

    const couponActive = coupon !== '';

    const changeCode = (event) => {
        setCode(event.target.value);
    };

    const trigger = (event) => {
        event.preventDefault();

        if (couponActive) {
            onChange('');
            setCode('');
        } else {
            onChange(code);
        }
    };

    return (
        <div className="">
            <button type="button" className="mt-4 pl-lg-3 mb-2 text-underline btn-unstyled w-100 text-right" onClick={toggleCollapse}>Apply a coupon / gift card</button>
            <form onSubmit={trigger}>
                <Collapse isOpen={couponActive || show} className="row gutter-10 coupon-code-section">
                    <div className="col-sm-8">
                        <div className="element-container">
                            {(couponActive && (
                                <input type="text" id="coupon-input" disabled placeholder="Enter your coupon / gift card" className="form-control" value={coupon} />
                            )) || (
                                <input type="text" id="coupon-input" placeholder="Enter your coupon / gift card" className="form-control" value={code} onChange={changeCode} />
                            )}
                        </div>
                    </div>
                    <div className="col-sm-4 mt-2 mt-sm-0">
                        <button type="submit" className="btn w-100 btn-secondary input-button-height">
                            {(couponActive && (
                                <strong>Remove</strong>
                            )) || (
                                <strong>Apply</strong>
                            )}
                        </button>
                    </div>
                </Collapse>
            </form>
        </div>
    );
};

CouponInput.propTypes = {
    onChange: PropTypes.func.isRequired,
    coupon: PropTypes.string,
};

CouponInput.defaultProps = {
    coupon: {},
};

export default CouponInput;
