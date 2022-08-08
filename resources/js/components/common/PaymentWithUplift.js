import React, { Component } from 'react';
import moment from 'moment';
import UpliftModalError from 'components/common/UpliftModalError';
import Lang, { priceFormat } from 'libraries/common/Lang';

class PaymentWithUplift extends Component {
  constructor(props) {
    super(props);
    this.state = {
      applicable: true,
      showUpliftOption: true,
      paxInfoReady: false,
      monthlyAmount: 0,
      disable: false,
      paymentReady: false,
      tripInfo: null,
      cardInfor:null,
      reasonCode: null,
      showModal: false,
    };
    
    const { touroptCode, depDate } = this.props;
    if (touroptCode) {
      const upliftFilterTourOps = ['HOL', 'CAH'];
      if (upliftFilterTourOps.includes(touroptCode)) {
        this.state.applicable = false;
      }
    }

    if (this.state.applicable) {
      const diffDays = Math.abs(moment().diff(depDate, "days"));     
      if (diffDays < 2) {
        this.state.disable = true;
      }     
    }   

    if (!this.state.applicable) {
        this.state.showUpliftOption = false;
    }
    
    this.cardInfor = null;
    this.startUplift = this.startUplift.bind(this);
    this.myTripInfoBuilder = this.myTripInfoBuilder.bind(this);
    this.handleMonthlyPaymentOption = this.handleMonthlyPaymentOption.bind(this);
    this.onParameterUpdate = this.onParameterUpdate.bind(this);
    this.myOnChangeCallback = this.myOnChangeCallback.bind(this);
    this.getInfo = this.getInfo.bind(this);
    this.closeModal = this.closeModal.bind(this);   
  }

  componentDidMount(prevProps, prevState, prevContext) {

    const { minDepositOnly, upliftEnable } = this.props;
    if (UPLIFT_FEATURE  && upliftEnable && !minDepositOnly && this.state.applicable) {
      this.startUplift();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // only update trip order if the data has changed
    if (prevProps.totalAmount != this.props.totalAmount) {
      this.onParameterUpdate('price');
    } else if (
      JSON.stringify(prevProps.passengers) !=
      JSON.stringify(this.props.passengers)
    ) {
      this.onParameterUpdate('pax');
    }
  }

  getInfo() {
    
    const { cardInfor } = this.state;
    const creditCard = cardInfor
      ? {
          amount: this.props.totalAmount,
          ccNumber: cardInfor.card_number,
          ccName: cardInfor.name_on_card,
          ccExpiry: `${
            cardInfor.expiration_month < 10
              ? `0${cardInfor.expiration_month}`
              : cardInfor.expiration_month
          }/${cardInfor.expiration_year}`,
          ccCVV: cardInfor.card_ccv,
          address: cardInfor.contact.street_address,
          city: cardInfor.contact.city,
          country: 'CA',
          province: cardInfor.contact.region,
          postalZip: cardInfor.contact.postal_code,
        }
      : null;
    return creditCard;
  }

  startUplift() {
      UpliftLibInit();
      const that = this;
      // Uplift.Payments.init takes an object with the following required keys
      window.upReady = function () {
        Uplift.Payments.init({
          apiKey: UPLIFT_API_KEY,
          checkout: true,
          locale:  SITE_KEY=='copolo'?'en-US':(window.Locale === 'fr' ? 'fr-CA' : 'en-CA'),
          currency: SITE_KEY=='copolo'? "USD":'CAD',
          container: '#up-pay-monthly-container',
          onChange: that.myOnChangeCallback   
        });
        // Load trip information
        const tripInfo = that.myTripInfoBuilder();
        that.setState({ tripInfo });
        Uplift.Payments.load(tripInfo);
    };
  }

  
  myOnChangeCallback(response) {
    const that =  this;
    const { offer, reason, token }  =  response;
    const { monthly_payment_amount } = offer;
    const monthlyAmount = parseFloat(monthly_payment_amount/100).toFixed(2);
    this.setState({ cardInfor:null, monthlyAmount });

    var statusHandlers = {
      OFFER_AVAILABLE: function(){
        // 1. show payment selectors
        // 2. show monthly pricing node in the selector
        // 3. hide "NOT AVAILABLE" node in the selector
        // 4. enable Pay Monthly selector
        // 5. disable Purchase/Book button
        let disable = false;
        const paxs = that.props.getPaxInfo();
        if (paxs.valid) {
          const paxParsed = that.buildTripPaxs(paxs.passengers);
          if (paxParsed.travelers.length == 0) {
            disable = true;
          }
        }

        that.setState({ disable, showUpliftOption: true}, () => {
          if (disable && that.props.paymentCheck == "radioPayMonthly") {
            that.props.handleOtherPaymentChange("radioPayFull");
          }
          that.props.sidebarMonthlyShowCallback(that.state);
        });
      },
      TOKEN_AVAILABLE: function(){
        // 1. show payment selectors
        // 2. enable Pay Monthly selector
        // 3. enable Purchase/Book button
        that.setState({disable:false}, () => {
          Uplift.Payments.getToken();
          that.props.sidebarMonthlyShowCallback(that.state);
        });
      },
      TOKEN_RETRIEVED: function(){
        // retrieve and utilize the token:
        that.setState({ cardInfor: token }, () => {
          that.props.sidebarMonthlyShowCallback(that.state);
        });  
      },

      OFFER_UNAVAILABLE: function(){
        // A Pay Monthly offer is not available for this tripInfo
        // 1. show payment selectors
        // 2. show "NOT AVAILABLE" node in the selector
        // 3. hide monthly pricing node in the selector
        // 4. disable Pay Monthly selector
        // 5. change payment option selection, if Pay Monthly option is selected
        that.setState({ reasonCode: reason? reason[0]:null, disable: true},
              () => {
                if( that.props.paymentCheck == "radioPayMonthly"){
                  that.props.handleOtherPaymentChange("radioPayFull");
                  Uplift.Payments.deselect("radioPayFull");
                }
                that.props.sidebarMonthlyShowCallback(that.state);
              }
        );
      },
      SERVICE_UNAVAILABLE: function(){
        // Uplift API is not available
        // do not show payment selectors
        that.setState({ showUpliftOption:false, disable: true },
              () => {
                if( that.props.paymentCheck === "radioPayMonthly"){
                  that.props.handleOtherPaymentChange("radioPayFull");
                  Uplift.Payments.deselect("radioPayFull");
                }
                that.props.sidebarMonthlyShowCallback(that.state);
              }
          );
        
      }
    };
    statusHandlers[response.status]();
  }


  onParameterUpdate(paramTag) {
    const { disable } =  this.state;
    if (typeof Uplift !== "undefined") {
      let checkPaxs = null;

      if (this.props.paymentCheck == "radioPayMonthly") {
        checkPaxs = this.props.checkValidPaxInfo();
      } else {
        checkPaxs = this.props.getPaxInfo();
      }

      const tripInfo = this.myTripInfoBuilder(checkPaxs.passengers, paramTag);
      if (paramTag === 'pax') {
        if(this.props.paymentCheck === "radioPayMonthly") {
            if (!checkPaxs.valid){
              this.setState({ showModal: true });
              this.props.handleOtherPaymentChange("radioPayFull");
            }
            console.log('>> tripInfo',tripInfo);
            window.Uplift.Payments.load(tripInfo);
          } //pay monthly 
          else if(checkPaxs.valid){
             console.log('>> tripInfo',tripInfo);
             window.Uplift.Payments.load(tripInfo); //check it is available ?
          }
      } else {
        console.log('>> tripInfo',tripInfo);
        window.Uplift.Payments.load(tripInfo);  
      }      
    }
  }

  handleMonthlyPaymentOption(e) {
    const val = e.target.value;
    const that = this;
    if (val == 'radioPayMonthly') {
      const checkPaxs = this.props.checkValidPaxInfo();
      if (checkPaxs.valid) {
        const tripInfo = this.myTripInfoBuilder(checkPaxs.passengers);
        Uplift.Payments.select();
        that.props.handleOtherPaymentChange("radioPayMonthly");
      } else {
        this.setState({ showModal: true });
      }
    } else {
       if(this.props.paymentCheck == 'radioPayMonthly'){
         Uplift.Payments.deselect(val);
       }
      that.props.handleOtherPaymentChange(val);
    }
  }

 

  buildTripPaxs(passengerInfo) {
    let phone = '';
    let email = '';
    const travelers = [];
    let passenger;
    let validPaxId = 0;
    let paxInfoCompleted = true;
    let completed;

    for (let id = 0; id < passengerInfo.length; id++) {
      passenger = passengerInfo[id];
      if (id == 0 && (passenger.phone == '' || passenger.email == '')) {
        paxInfoCompleted = false;
        break;
      }
      completed = !(
        passenger.title == '' ||
        passenger.first == '' ||
        passenger.last == '' ||
        passenger.day == '' ||
        passenger.month == '' ||
        passenger.year == ''
      );
      if (!completed) {
        paxInfoCompleted = false;
        break;
      }
    }

    for (let id = 0; id < passengerInfo.length; id++) {
      passenger = passengerInfo[id];
      let isAdult = true;
      if (Object.prototype.hasOwnProperty.call(passenger, 'adult')) {
        isAdult = passenger.adult;
      } else if (Object.prototype.hasOwnProperty.call(passenger, 'type')) {
        isAdult = passenger.type.toLowerCase() == 'adult';
      }

      if (isAdult) {
        if (id == 0 && passenger.phone !== '' && passenger.email !== '') {
          phone = passenger.phone;
          email = passenger.email;
        }
        if (paxInfoCompleted) {
          if (passenger.day.indexOf('0') === -1 && passenger.day < 10) {
            passenger.day = `0${passenger.day}`;
          }
          const age = moment().diff(
            passenger.day == ''
              ? '1975-01-01'
              : `${passenger.year}-${passenger.month}-${passenger.day}`,
            'years'
          );
          if (age > 18) {
            const first_name = passenger.first;
            const last_name = passenger.last;
            const date_of_birth = `${passenger.month}/${passenger.day}/${passenger.year}`;
            travelers.push({
              first_name,
              last_name,
              date_of_birth,
              id: validPaxId,
            });
            validPaxId++;
          }
        } else {
          const first_name = `first-${id}`;
          const last_name = `last-${id}`;
          const date_of_birth = '01/02/1975';
          travelers.push({
            first_name,
            last_name,
            date_of_birth,
            id: validPaxId,
          });
          validPaxId++;
        }
      }
    }
    return { travelers, phone, email };
  }

  myTripInfoBuilder(paxs, buildType = 'full') {
    const { passengers, totalAmount } = this.props;
    let billing_contact = {};
    let paxParsed = null;
    let passengerInfo = passengers;
    if (typeof paxs !== 'undefined') {
      passengerInfo = paxs;
    }
    paxParsed = this.buildTripPaxs(passengerInfo);

    billing_contact = {
      phone: paxParsed.phone,
      email: paxParsed.email,
    };

    
    let myorder = this.props.buildProductOrder();
   
    myorder = Object.assign({}, myorder, {
      travelers: paxParsed.travelers,
      billing_contact,
    });
   
    myorder = Object.assign({}, myorder, {
      order_amount: parseInt(totalAmount * 100),
    });
  
    this.setState({tripInfo: myorder});
    return myorder;
  }

  closeModal() {
    // this.props.gotoFirstErrorField();
    this.setState({ showModal: false }, () => {});
  }

  render() {
    const {
      paxInfoReady,
      disable,
      monthlyAmount,
      showUpliftOption,
      reasonCode,
      showModal,
    } = this.state;
    const { totalAmount, paymentCheck, minDepositAmount, minDepositOnly } = this.props;
    const numOfPax = this.props.passengers.length;
    const monthlyRadioShow = !showUpliftOption? "hide" : "";
    const optStyle = {
      display: paymentCheck === "radioPayMonthly"
          ? "block"
          : "none",
      height: paymentCheck === "radioPayMonthly" ? "auto" : "0px",
    };

    const dueAmount = minDepositAmount
      ? totalAmount - minDepositAmount
      : 0;

    const paymentReady = (monthlyAmount -  parseInt(monthlyAmount)) > 0 ?true:false;
    const hideStyle = {
           display:"none",
    };

    const upliftErrorMessage =  {
      1:'Treat yourself! Upgrade your package, or add trip insurance to get your total over $500',
      2:'Your total is too high! Pay Monthly is only available for trips from $500 to $15000.',
      4:'Your departure date is too soon! Itineraries must have a departure date at least 3 day(s) away in order to be eligible for Uplift Pay Monthly.',
    }; 

    return (
      <div className='border rounded p-3 mb-3 box-shadow color-pop'>
        <div className='d-flex justify-content-between points-section'>
          <div className='d-flex align-items-center primary-color am-h'>
            <div className='mr-2 mt-2'>
              <svg
                className='icon-md'
                width='100%'
                height='100%'
                xmlns='http://www.w3.org/2000/svg'
                xmlnsXlink='http://www.w3.org/1999/xlink'
              >
                <use xlinkHref={`${IMG_ICONS}icon-defs.svg#icon-hand-dollar`} />
              </svg>
            </div>

            <h5 className='m-0'>
              {Lang.trans(
                `${minDepositOnly
                    ? 'common.book_now_pay_later'
                    : 'common.payment_option'
                }`
              )}
            </h5>
          </div>
        </div>
        <div className='border-top pt-3 mt-3'>
          {!minDepositOnly && (
            <div className='payment-section-sub-header mb-3 '>
              {Lang.trans('payments_vacations.flexible_payment_options')}
            </div>
          )}
          <div className='d-flex flex-column mb-3'>
            {!minDepositOnly && (
              <div className='border rounded p-2 my-1 bg-white'>
                <div className='styled-radio theme-2'>
                  <input
                    type='radio'
                    id='radioPayFull'
                    name='radioPaymentOption'
                    value='radioPayFull'
                    onChange={(e) => this.handleMonthlyPaymentOption(e)}
                    checked={this.props.paymentCheck == 'radioPayFull'}
                  />
                  <label
                    className='w-100 d-flex flex-column justify-content-between align-items-center text-left'
                    htmlFor='radioPayFull'
                  >
                    <div>
                      {Lang.trans('uplift.radio_pay_in_full')}{' '}
                      {priceFormat(`${this.props.totalAmount}`)}
                    </div>
                  </label>
                </div>
              </div>
            )}

            {this.props.minDepositAmount ? (
              <div className='border rounded p-2 my-1 bg-white'>
                <div className='styled-radio theme-2 w-100'>
                  <input
                    type='radio'
                    id='radioPayDeposit'
                    name='radioPaymentOption'
                    value='radioPayMinimum'
                    onChange={(e) => this.handleMonthlyPaymentOption(e)}
                    checked={this.props.paymentCheck == 'radioPayMinimum'}
                  />
                  <label
                    className='w-100 d-flex flex-wrap align-items-center justify-content-between text-left'
                    htmlFor='radioPayDeposit'
                  >
                    <div className='pl-0 col-12 col-md'>
                        <div>
                          {Locale == 'fr' ? 'Solde de' : 'Balance of'}{' '}
                          {priceFormat(`${dueAmount}`)}{' '}
                          {Locale == 'fr' ? 'dû le' : 'due by'}{' '}
                          {this.props.dueDate}
                        </div>
                      </div>
                  </label>
                </div>
              </div>
            ) : null}
            {UPLIFT_FEATURE && window.Uplift && !minDepositOnly ? (
              <div className={`${monthlyRadioShow}  border rounded p-2 my-1 bg-white`}>
                <div
                  className={
                    disable
                      ? `styled-radio theme-2 w-100 decline `
                      : `styled-radio theme-2 w-100`
                  }
                >
                  <input
                    type='radio'
                    role="radio"
                    id='radioPayMonthly'
                    disabled={disable}
                    name='radioPaymentOption'
                    value='radioPayMonthly'
                    onChange={(e) => this.handleMonthlyPaymentOption(e)}
                    aria-checked={this.props.paymentCheck == "radioPayMonthly"}
                    checked={this.props.paymentCheck == 'radioPayMonthly'}
                  />
                  <label
                    className='w-100 align-items-center d-flex flex-wrap justify-content-between text-left'
                    htmlFor='radioPayMonthly'
                  >
                    <div className='pl-0 col-12 col-md'>
                      <span className='mr-1'>
                        {Lang.trans('uplift.radio_pay_monthly')}
                      </span>
                      <span data-up-error="" className={`${!disable?'hide':''} error`}>
                          {Lang.trans("uplift.not_available")}
                          <span data-up-tooltip="">{Object.prototype.hasOwnProperty.call(upliftErrorMessage, reasonCode)?upliftErrorMessage[reasonCode]:''}</span>
                           <button className="btn-unstyled ml-2 align-top" onClick={e=>{}} >
                                <svg className="icon" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                    <use xlinkHref={`${IMG_ICONS}icon-defs.svg#icon-info-circle`} />
                                </svg>
                            </button>
                      </span>
                      <button className={disable?'':"d-inline-block btn-unstyled"} style={disable?hideStyle:{}}
                          data-up-price-value={this.props.totalAmount*100} 
                          data-up-price-type='total' 
                          data-up-comparison-type="" 
                          data-up-price-model='total' 
                          data-up-taxes-included='true'
                      >
                        <div className="mr-1 d-inline-block">
                          {Lang.trans("uplift.from")}
                        </div>
                        <span className="up-from-currency" data-up-from-currency="">$</span>
                        <span data-up-from-currency-unit-major="" className="mb-0" id="up-monthly-price">
                        </span>
                        /{Lang.trans("uplift.month")}
                        <svg className="icon align-top" role="" title="" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                            <use xlinkHref={`${IMG_ICONS}icon-defs.svg#icon-info-circle`} />
                        </svg>
                      </button> 
                    </div>
                    <div className='align-self-end py-1 text-sm-right'>
                      {Lang.trans('common.powered_by')}{' '}
                      <img
                        className='uplift-logo-2'
                        src='https://s3-us-west-2.amazonaws.com/travel-img-assets/logos/uplift.svg'
                      />
                    </div>
                  </label>
                </div>
              </div>
            ) : null}
          </div>
          <div id='up-pay-monthly-container' style={optStyle} />
        </div>
        <UpliftModalError
          showModal={showModal}
          toggle={this.closeModal}
          closeCallback={() => {
            this.props.gotoFirstErrorField();
          }}
        />
      </div>
    );
  }
}

export default PaymentWithUplift;
