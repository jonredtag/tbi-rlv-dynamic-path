import React, { Component } from 'react';
import PropTypes from 'prop-types';
import WatchHotelResult from 'components/widgets/watchHotelResult';
import Modal from 'reactstrap/lib/Modal';


class WatchList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            results: null,
            showModal: false,
            toRemove: null,
        };

        this.toggleModal = this.toggleModal.bind(this);
        this.removeWatch = this.removeWatch.bind(this);
        this.setRemoveWatch = this.setRemoveWatch.bind(this);
    }

    componentDidMount() {
        const { hash, email } = this.props;
        fetch(`/api/profile/getList/${hash}/${email}`)
            .then((response) => response.json())
            .then((data) => {
                if (!data.error) {
                    this.setState({ results: data });
                }
            });
    }

    setRemoveWatch(id) {
        this.toggleModal();

        this.setState({ toRemove: id });
    }

    removeWatch() {
        const { hash } = this.props;
        const { toRemove } = this.state;

        fetch(`/api/profile/removeWatch/${hash}/${toRemove}`, {
            method: 'POST',
        })
            .then((response) => response.json())
            .then((data) => {
                const { results } = this.state;
                if (data.success) {
                    const index = results.findIndex((result) => result.id === toRemove);
                    const newResults = [...results.slice(0, index), ...results.slice(index + 1)];

                    this.setState({ results: newResults, showModal: false });
                }
            });
    }

    toggleModal() {
        const { showModal } = this.state;

        this.setState({ showModal: !showModal });
    }

    render() {
        const { results, showModal } = this.state;

        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-8 profile-page-content mt-5 mx-auto ">
                        <div className="profile-underline-title">
                            <div className="profile-icon-container">
                                <div className="profile-icon-round-sm-down">
                                    <svg className="icon" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-bell" />
                                    </svg>
                                </div>
                            </div>
                            My Watch List
                        </div>
                        {results && results.map((result) => (<WatchHotelResult products={result.productData} parameters={result.searchParameters} id={result.id} setRemove={this.setRemoveWatch} />))}
                    </div>
                </div>
                <Modal isOpen={showModal} centered size="md">
                    <div className="d-flex justify-content-between align-items-center px-3 px-md-4 pt-3 pt-md-4">
                        <div className="blumine-color">
                            <span className="h4 mb-0 align-middle font-weight-bold">Remove from watch list</span>
                        </div>
                        <button type="button" className="close theme-2 pb-2" onClick={this.toggleModal} aria-label="Close">
                            <span className="d-inline-block " aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body px-3 px-md-4 pb-3 pb-md-4">
                        <div className="custom-form-element mt-4">
                            <div className="row">
                                <div className="col-6">
                                    <button type="button" className="btn btn-secondary-outline h6 mb-0 py-3 font-weight-500 w-100" onClick={this.toggleModal}>Cancel</button>
                                </div>
                                <div className="col-6">
                                    <button type="button" className="btn btn-secondary h6 mb-0 py-3 font-weight-500 w-100" onClick={this.removeWatch}>Remove</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

WatchList.propTypes = {
    hash: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
};

export default WatchList;
