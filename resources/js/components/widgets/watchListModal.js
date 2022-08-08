import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'reactstrap/lib/Modal';
import Stars from 'components/widgets/stars';
import TrustYouSummary from 'components/widgets/trustYouSummary';
import formSerialize from 'helpers/formSerialize';
import Lang from 'libraries/common/Lang';

const watchListModal = (props) => {
    const {
        show,
        toggleModal,
        hotelData,
        flightData,
        searchParameters,
        sid,
        watcher,
        onSubmit,
    } = props;

    const [disabled, setDisabled] = useState(false);
    const [showMessage, setShow] = useState(false);

    const submit = (event) => {
        event.preventDefault();

        const query = formSerialize(event.target);

        if (sid !== null) {
            query.sid = sid;
            query.hotelID = hotelData.id;
        } else {
            query.productData = { hotel: hotelData, flight: flightData };
        }
        query.searchParameters = searchParameters;

        query.key = localStorage.getItem('userKey');

        fetch('/api/profile/addWatch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(query),
        })
            .then((response) => response.json())
            .then((data) => {
                localStorage.setItem('userKey', data.key);
                setShow(true);
                onSubmit(hotelData);
            });

        setDisabled(true);
    };

    return (
        <Modal isOpen={show} className="modal-dialog-centered" size="md">
            <div className="d-flex justify-content-between align-items-center px-3 px-md-4 pt-3 pt-md-4">
                <div className="blumine-color">
                    <svg className="icon-lg align-middle mr-2" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                        <use xlinkHref="/img/icons/icon-defs.svg#icon-bell" />
                    </svg>
                    <span className="h4 mb-0 align-middle font-weight-bold">{Lang.trans('common.add_watchlist')}</span>
                </div>
                <button type="button" className="close theme-2" onClick={toggleModal} aria-label="Close">
                    <svg className="icon" aria-hidden="true" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                        <use xlinkHref="/img/icons/icon-defs.svg#icon-close" />
                    </svg>
                </button>
            </div>
            <div className="modal-body px-3 px-md-4 pb-3 pb-md-4">
                <div className="red-text h6 mb-0 font-weight-bold mb-0">{Lang.trans('common.intro_watchlist', { site: window.site })}</div>
                <div className="font-weight-bold h5 primary-color mb-3">Access to these exclusive benefits</div>
                <ul className="m-0 font-weight-normal list-unstyled ">
                    <li className="d-flex mb-2">
                        <svg className="icon-md white-check-bg-green mr-2" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                            <use xlinkHref="/img/icons/icon-defs.svg#icon-checkmark-round" />
                        </svg>
                        <div>
                            <div className="h6 mb-0"><b>Unlimited vacations</b></div>
                            <div>Fill your watchlist with as many destinations as you’d like.</div>
                        </div>
                    </li>
                    <li className="d-flex mb-2">
                        <svg className="icon-md white-check-bg-green mr-2" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                            <use xlinkHref="/img/icons/icon-defs.svg#icon-checkmark-round" />
                        </svg>
                        <div>
                            <div className="h6 mb-0"><b>Zero commitment</b></div>
                            <div>Stay on top of the best travel deals without putting any money down.</div>
                        </div>
                    </li>
                    <li className="d-flex mb-2">
                        <svg className="icon-md white-check-bg-green mr-2" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                            <use xlinkHref="/img/icons/icon-defs.svg#icon-checkmark-round" />
                        </svg>
                        <div>
                            <div className="h6 mb-0"><b>Price watch</b></div>
                            <div>Be the first to know if the price of your trip changes.</div>
                        </div>
                    </li>
                </ul>
                <div className="pl-5 pr-5">
                    <hr />
                </div>
                <div className="product-component product-component border-0 shadow-none">
                    <div className="d-flex flex-column">
                        <div><span className="product-title d-block">{hotelData.name}</span></div>
                        <div className="d-flex flex-column flex-sm-row flex-md-column flex-lg-row">
                            <span className="rating align-self-sm-center align-self-md-start align-self-lg-center d-inline-block mt-2 mb-3 m-sm-0" title="4 stars">
                                <Stars
                                    component={`HotelResult-${hotelData.id}`}
                                    rating={hotelData.rating}
                                />
                            </span>
                            {hotelData.reviews && (
                                <TrustYouSummary data={hotelData.reviews} />
                            )}
                        </div>
                    </div>
                    <div className="my-3">
                        <div className="mb-2">
                            <svg className="icon mr-2" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                <use xlinkHref="/img/icons/icon-defs.svg#icon-plane-ascend-right" />
                            </svg>
                            <span className="text-underline">{flightData.depDate}</span>
                            {(flightData.legStops[0] !== 0 && (
                                <span className="red-text ml-1">
                                    <small>({flightData.legStops[0]} Stop(s))</small>
                                </span>
                            )) || (
                                <span className="green-text ml-1">
                                    <small>(Non-stop)</small>
                                </span>
                            )}
                        </div>
                        <div className="d-block mb-2">
                            <svg className="icon mr-2" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                <use xlinkHref="/img/icons/icon-defs.svg#icon-plane-ascend-left" />
                            </svg>
                            <span className="text-underline">{flightData.retDate}</span>
                            {(flightData.legStops[1] !== 0 && (
                                <span className="red-text ml-1">
                                    <small>({flightData.legStops[1]} Stop(s))</small>
                                </span>
                            )) || (
                                <span className="green-text ml-1">
                                    <small>(Non-stop)</small>
                                </span>
                            )}
                        </div>
                    </div>
                    <form className="custom-form-element mt-4" onSubmit={submit}>
                        <div className="row">
                            <div className="col-12 mb-3">
                                <div className="element-container">
                                    <input type="text" defaultValue={watcher.name} className="form-control h6 mb-0 border-2" name="name" placeholder="Name" required />
                                </div>
                            </div>
                            <div className="col-12 mb-3">
                                <div className="element-container">
                                    <svg className="icon-md icon-btn right mr-2" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-phone" />
                                    </svg>
                                    <input type="tel" defaultValue={watcher.phone} className="form-control h6 mb-0 border-2 pr-5" name="phone" placeholder="Mobile Number (optional)" />
                                </div>
                            </div>
                            <div className="col-12 mb-3">
                                <div className="element-container">
                                    <svg className="icon-md icon-btn right mr-2" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-mail" />
                                    </svg>
                                    <input type="email" defaultValue={watcher.email} className="form-control h6 mb-0 border-2 pr-5" name="email" placeholder="Email Address" required />
                                </div>
                            </div>
                            <div className="col-12">
                                <button type="submit" className="btn btn-secondary h6 mb-0 py-3 font-weight-500" disabled={disabled}>Add to watch list</button>
                                {showMessage && (
                                    <div className="alert alert-success my-3">{Lang.trans('common.watchlist_success')}</div>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
};

watchListModal.propTypes = {
    show: PropTypes.bool.isRequired,
    toggleModal: PropTypes.func.isRequired,
    hotelData: PropTypes.instanceOf(Object).isRequired,
    flightData: PropTypes.instanceOf(Object).isRequired,
    watcher: PropTypes.instanceOf(Object).isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default watchListModal;
