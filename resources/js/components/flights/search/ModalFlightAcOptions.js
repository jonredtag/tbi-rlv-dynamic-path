
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'reactstrap/lib/Button';
import Modal from 'reactstrap/lib/Modal';
import ModalHeader from 'reactstrap/lib/ModalHeader';
import ModalFooter from 'reactstrap/lib/ModalFooter';
import ModalBody from 'reactstrap/lib/ModalBody';
import Lang from 'libraries/common/Lang';


class ModalFlightAcOptions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: true,
        };
        this.closeOptionsModal = this.closeOptionsModal.bind(this);
    }

    closeOptionsModal() {
        this.setState({ show: false }) ;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(!prevState.show){
            this.setState({ show: true }) ;
        }

    }

    render(){
        const fareFamilyDetails =  this.props.fareFamilyDetails;
        const farefamily =  this.props.farefamily;

        //console.log(fareFamilyDetails);
        return (
            <Modal isOpen={this.state.show} toggle={this.closeOptionsModal} className="modal-lg modal-session-timeout">
                <ModalHeader toggle={this.closeOptionsModal} className="modal-solid-header-bar">
                    <span className="header-icon header-icon-large d-none d-md-inline">
                        <svg className="icon icon-lg mr-2 " width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                            <use xlinkHref="/img/icons/icon-defs.svg#icon-exclamation-circle" />
                        </svg>
                    </span>
                    <div className="header-text">
                        {farefamily}
                    </div>
                </ModalHeader>
                <ModalBody className="modal-main">
                    <div className="modal-intro">
                        1st checked bag free<br/>Changes permitted (a fee may apply)<br/>115% Aeroplan Miles<br/>Free standard and Preferred seat selection<br/>Free premium beverage<br/>Free same-day standby
                    </div>
                    <Button className="btn btn-primary btn-lg modal-button d-md-inline-block" onClick={this.closeOptionsModal}>{Lang.trans('buttons.ok')}</Button>
                </ModalBody>
            </Modal>
        );
    }
}

export default ModalFlightAcOptions;



