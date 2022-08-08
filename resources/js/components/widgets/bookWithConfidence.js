import React from 'react';
import PropTypes from 'prop-types';
import Lang from 'libraries/common/Lang';
import Icons from 'libraries/common/Icons';
import Modal from 'modules/modal';


const BookWithConfidence = (props) => {

const showModal = () => {
   Modal.show('#mdl_bwc');
};

    return (
        <button className="promo-book-with-confidence py-2" onClick={showModal}>
            <div className="d-flex justify-content-center">
                <div className=" align-self-center pl-3 pr-2">
                    <img className="bwc-img" src="https://redtag-ca.s3.amazonaws.com/img/logos/logo-bwc.svg" />
                </div>
                <div className="align-self-center text-left pr-3">
                    <p className='bwc-copy font-weight-bold mb-0'>
                        {Lang.trans('common.only_50')}
                    </p>
                    <p className='bwc-copy font-weight-bold mb-0'>
                        {Lang.trans('payments_vacations.deposit')}
                    </p>
                </div>
            </div>
        </button>
    );
};

export default BookWithConfidence;
