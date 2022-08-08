import React from 'react';
import Modal from 'reactstrap/lib/Modal';
import ModalBody from 'reactstrap/lib/ModalBody';

const SessionExpiredModal = (props) => {
    const { open, action } = props;
    return (
        <Modal size="lg" isOpen={open} toggle={action}>
            <div className="modal-header modal-solid-header-bar">
                <h5 className="modal-title h4">
                    Session Expired
                    <button type="button" className="close close-lg pt-3" onClick={action} aria-label="Close">
                        <span className="pt-md-1 d-inline-block" aria-hidden="true">×</span>
                    </button>
                </h5>
            </div>
            <ModalBody>
                <div>
                    <p>Click reload below to resume your search.</p>
                    <button type="button" className="btn btn-lg btn-secondary" onClick={action}>Reload Search</button>
                </div>
            </ModalBody>
        </Modal>
    );
};

export default SessionExpiredModal;
