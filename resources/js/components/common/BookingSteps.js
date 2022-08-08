import React from 'react';
import PropTypes from 'prop-types';
import Lang from 'libraries/common/Lang';

const BookingSteps = (props) => {
    const { steps, active } = props;

    return (
        <section className="breadcrumb-backend d-none d-md-block">
            <div className="container">
                <nav className="breadcrumb justify-content-end ">
                    <div className="float-right">
                        <ol className="results-steps">
                            {Object.keys(steps).map((step) => {
                                let classValue = '';
                                if (step === active) {
                                    classValue = 'active';
                                } else if (steps[step] || (step === 'hotel' && active === 'htlDetails')) {
                                    classValue = 'completed';
                                }

                                return (
                                    <>
                                        <li className={classValue}>
                                            {Lang.trans(`breadcrumbs.${step}`)}
                                            <svg className="icon check" title="">
                                                <use xmlnsXlink="http://www.w3.org/2000/svg" xlinkHref="/img/icons/icon-defs.svg#icon-check" />
                                            </svg>
                                        </li>
                                        {step === 'hotel' && (
                                            <li className={active === 'htlDetails' ? 'active' : (active === 'hotel' ? '' : 'completed')}>
                                                {Lang.trans('breadcrumbs.htlDetails')}
                                                <svg className="icon check" title="">
                                                    <use xmlnsXlink="http://www.w3.org/2000/svg" xlinkHref="/img/icons/icon-defs.svg#icon-check" />
                                                </svg>
                                            </li>
                                        )}
                                        {step === 'activity' && (
                                            <li className={active === 'actDetails' ? 'active' : (active === 'activity' ? '' : 'completed')}>
                                                {Lang.trans('breadcrumbs.actDetails')}
                                                <svg className="icon check" title="">
                                                    <use xmlnsXlink="http://www.w3.org/2000/svg" xlinkHref="/img/icons/icon-defs.svg#icon-check" />
                                                </svg>
                                            </li>
                                        )}
                                    </>
                                );
                            })}
                            <li className={active === 'checkout' ? 'active' : ''}>
                                {Lang.trans('breadcrumbs.booking')}
                                <svg className="icon check" title="">
                                    <use xmlnsXlink="http://www.w3.org/2000/svg" xlinkHref="/img/icons/icon-defs.svg#icon-check" />
                                </svg>
                            </li>
                            <li>
                                {Lang.trans('breadcrumbs.confirmation')}
                                <svg className="icon check" title="">
                                    <use xmlnsXlink="http://www.w3.org/2000/svg" xlinkHref="/img/icons/icon-defs.svg#icon-check" />
                                </svg>
                            </li>
                        </ol>
                    </div>
                </nav>
            </div>
        </section>
    );
};

BookingSteps.propTypes = {
    steps: PropTypes.instanceOf(Object).isRequired,
    active: PropTypes.string.isRequired,
};

BookingSteps.defaultProps = {
    active:''
};

export default BookingSteps;
