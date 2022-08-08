import React from 'react';
import Modal from 'reactstrap/lib/Modal';
import ModalHeader from 'reactstrap/lib/ModalHeader';
import ModalBody from 'reactstrap/lib/ModalBody';
import Lang from 'libraries/common/Lang';

const UpliftModalError = (props) => {
    const { closeCallback, showModal, toggle } = props;
    const closeErrorModal = () => {
        closeCallback();
    };

    return (
        <Modal isOpen={showModal} toggle={toggle} onClosed={closeCallback} className="modal-lg modal-session-timeout">
            <ModalHeader toggle={toggle} className="modal-solid-header-bar">
                <span className="header-icon mt-3 header-icon-large d-none d-md-inline">
                    <svg className="icon icon-lg mr-2 " width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                        <use xlinkHref="/img/icons/icon-defs.svg#icon-exclamation-circle" />
                    </svg>
                </span>
                <div className="header-text">
                    {Lang.trans('uplift.modal_header')}
                </div>
            </ModalHeader>
            <ModalBody className="modal-main">
                <div className="h5 text-muted mb-4">{Lang.trans('uplift.modal_error')}</div>
                <div className="d-md-flex justify-content-center">
                    <div className="d-flex align-items-center mr-4 justify-content-center my-4 my-md-0">
                        <div className="uplift-modal-checkmark p-1 mr-2">
                            <svg className="icon" title="" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                <use xlinkHref="/img/icons/icon-defs.svg#icon-checkmark-round" />
                            </svg>
                        </div>
                        <span className="text-uppercase font-weight-bold h6 mb-0">{Lang.trans('uplift.low_rates')}</span>
                    </div>
                    <div className="d-flex align-items-center mr-4 justify-content-center my-4 my-md-0">
                        <div className="uplift-modal-checkmark p-1 mr-2">
                            <svg className="icon" title="" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                <use xlinkHref="/img/icons/icon-defs.svg#icon-checkmark-round" />
                            </svg>
                        </div>
                        <span className="text-uppercase font-weight-bold h6 mb-0">{Lang.trans('uplift.stress_free')}</span>
                    </div>
                    <div className="d-flex align-items-center mr-4 justify-content-center my-4 my-md-0">
                        <div className="uplift-modal-checkmark p-1 mr-2">
                            <svg className="icon" title="" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                <use xlinkHref="/img/icons/icon-defs.svg#icon-checkmark-round" />
                            </svg>
                        </div>
                        <span className="text-uppercase font-weight-bold h6 mb-0">{Lang.trans('uplift.instant_decision')}</span>
                    </div>
                </div>
                <button type="button" className="btn btn-primary btn-lg mt-4 modal-button d-md-inline-block" onClick={toggle}>{Lang.trans('uplift.modal_button')}</button>
            </ModalBody>
        </Modal>
    );
};

export default UpliftModalError;
