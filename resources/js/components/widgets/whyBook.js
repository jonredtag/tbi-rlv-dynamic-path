import React from 'react';
import PropTypes from 'prop-types';
import Lang from 'libraries/common/Lang';

const WhyBook = (props) => {
    const { isStandalone, site } = props;

    return (
        <div className="why-book rounded-sm p-4 mt-3 d-none d-lg-block bg-white box-shadow">
            <div className="h5 mb-3">{Lang.trans('why_book.why_book_with', { xsitex: site })}</div>
            <div className="d-flex mb-2">
                <div>
                    <div className="mr-2">
                        <svg className="icon" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                            <use xlinkHref="/img/icons/icon-defs.svg#icon-lock" />
                        </svg>
                    </div>
                </div>
                <div>
                    <h6>{Lang.trans('why_book.secure_shopping')}</h6>
                    <p className="ml-0 secondary-color">{Lang.trans('why_book.security_standard')}</p>
                </div>
            </div>
            <div className="d-flex mb-2">
                <div>
                    <div className="mr-2">
                        <svg className="icon" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                            <use xlinkHref="/img/icons/icon-defs.svg#icon-eye" />
                        </svg>
                    </div>
                </div>
                <div>
                    <h6>{Lang.trans('why_book.privacy_protection')}</h6>
                    <p className="ml-0 secondary-color">{Lang.trans('why_book.number_one_priority')}.</p>
                </div>
            </div>
            <div className="d-flex mb-2">
                <div>
                    <div className="mr-2">
                        <svg className="icon" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                            <use xlinkHref="/img/icons/icon-defs.svg#icon-phone" />
                        </svg>
                    </div>
                </div>
                <div>
                    <h6>{Lang.trans('why_book.exceptional_service')}</h6>
                    <p className="mb-0 ml-0 secondary-color">{Lang.trans('why_book.have_questions')}</p>
                    <p className="ml-0 secondary-color">{Lang.trans('why_book.here_to_help')}</p>
                </div>
            </div>
            {!isStandalone && (
                <div className="why-book-alert rounded p-3 ">
                    <span className="mr-1">
                        <strong>{Lang.trans('why_book.important')}</strong>
                    </span>
                    {Lang.trans('why_book.why_book_important_info')}
                </div>
            )}
        </div>
    );
};

WhyBook.propTypes = {
    isStandalone: PropTypes.bool.isRequired,
    site: PropTypes.string.isRequired,
};

export default WhyBook;
