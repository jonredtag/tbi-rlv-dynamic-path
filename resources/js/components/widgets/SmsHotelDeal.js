import React, { Component } from 'react';
import PropType from 'prop-types';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Lang, { priceFormat } from 'libraries/common/Lang';


class SmsHotelDeal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            phone_number: '',
            response: null,
            hotel: props.hotel,
        };
        this.submit = this.submit.bind(this);
    }

    submit() {
        const url = '/api/hotel/sms';

        fetch(url, {
            method: 'POST',
            body: JSON.stringify({ phone_number: this.state.phone_number, url: window.location.href }),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => response.json()).then((data) => {
            this.setState({ response: data, phone_number: '' });
        });
    }

    render() {
        const { response, hotel } = this.state;
        const { hidePrice } = this.props;
        return (
            <div className="row no-gutters text-left justify-content-between border rounded box-shadow  p-2 mt-3 mt-md-0">
                <div className="col-12 col-sm-5 col-md-12  ">
                    <div className="exclusive-price primary-color d-inline-block mr-2">{priceFormat(hotel.roomResults[0].rate, 0)}</div>
                    <div className="d-inline-block">{Lang.trans('hotels.per_night')}</div>
                    <div className="mb-1 font-italic h6 exclusive-text"><div className="d-inline-block mr-1">Exclusive Sale.</div><div className="d-inline-block"> Limited Time Offer.</div></div>
                </div>
                { hidePrice && (<div className="payment-form col-12 col-sm-6 col-md-12 align-self-end">
                        <div className="h6 col-12 p-0">Get the deal on your phone today.</div>
                        <PhoneInput
                          country={'ca'}
                          value={this.state.phone_number}
                          onChange={phone_number => this.setState({ phone_number })}
                          containerClass=''
                          placeholder="Enter your number"
                        />
                        <button onClick={this.submit} type="button" className="btn btn-exclusive col-12 mt-2 btn-lg">
                            Send Deal
                        </button>
                        {(response !== null && response.success) && <div className="h6 text-center mt-3"><svg className="icon mr-1" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                <use xlinkHref="/img/icons/icon-defs.svg#icon-checkmark-thin" />
                        </svg>Deal Sent via SMS</div>}
                    </div>
                )}
            </div>
        );
    }
}


export default SmsHotelDeal;
