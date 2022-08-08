import React, { Component } from 'react';
import { render } from 'react-dom';
import moment from 'moment';
import Helper from 'libraries/common/Helper';
import Modal from 'libraries/common/Modal';
import Collapse from 'libraries/common/Collapse';
import axios from 'axios';
import Passenger from 'components/common/Passenger';
import CreditCards from 'components/common/CreditCards';
import VerifyFlightDetails from 'components/flights/verify/VerifyFlightDetails';
import ExtraOptions from 'components/flights/payment/ExtraOptions';
import BrandedFares from 'components/flights/payment/BrandedFares';
import Insurance from 'components/common/Insurance';
import Loader from 'libraries/common/Loader';
import Lang from 'libraries/common/Lang';
import Terms from 'components/common/Terms';
import AirmilesWidget from 'components/common/AirmilesWidget';

class PaymentForm extends Component {
    constructor(props) {
        super(props);
        this.UIModals = new Modal();
        this.state = {
            passengers: [],
            payments: [{ isPrimary : true } ],
            cartResult:props.paymentData.cartResult,
            verifiedData: null,
            sessionData: null,
            extraOptions: null,
            totalAmount: 0,
            insAmount: 0,
            insQuote: null,
            insError: null,
            insbreakdown: [],
            cartId:null,
            rowId:null,
            insuranceLoader: true,
            displayPurchaseButton: false,
            displayInsuranceSection: false,
            displayPaymentSection: false,
            selectedExtraOtions: null,
            selectedBrandedFares: null,
            province: 'ON',
            brandedfarecallStatus: props.paymentData.cartResult.brandedfarecallStatus,
            brandedfaresData: null,
            brandedfaresLoader: true,
        };

        this.airmilesServiceFee = 33.9;

        this.ageCheckDate =  null;//props.paymentData.cartResult.products.rateInfo.ageCheckDate;
        this.insuranceChangeCallback =  this.insuranceChangeCallback.bind(this);
        this.insuranceReQuote = this.insuranceReQuote.bind(this);
        this.selectFlightOptions = this.selectFlightOptions.bind(this);
        this.requotePriceWithExtraoptions = this.requotePriceWithExtraoptions.bind(this);
        this.requotePriceWithBrandedfares = this.requotePriceWithBrandedfares.bind(this);
        this.generateInsurance = this.generateInsurance.bind(this);
        this.getBrandedFares = this.getBrandedFares.bind(this);
        this.generateTerms = this.generateTerms.bind(this);
        this.airmilesChangeCallback = this.airmilesChangeCallback.bind(this);
    }

    componentDidMount(prevProps, prevState, prevContext) {
        this.buildPassengers();
        this.verifyFlightDetails();
        //this.UICollapse.init();
        // this.updateStatePricing();
        //this.listenCouponModal();
    }

    airmilesChangeCallback(amount){
        this.setState({airmilesRedeemAmount: amount},()=>this.updateStatePricing());
    }

    selectFlightOptions(displayButtonStatus) {
        this.setState({ displayPurchaseButton: displayButtonStatus, displayInsuranceSection: displayButtonStatus, displayPaymentSection: displayButtonStatus });
    }

    requotePriceWithExtraoptions(selectedExtraOtions) {
        var selectedExtraOtions = selectedExtraOtions.departExtraOptions.join("|")+'DEPSPLIT'+selectedExtraOtions.returnExtraOptions.join("|");
        this.setState({ selectedExtraOtions: selectedExtraOtions, }, () => {
            this.verifyFlightDetails();
        });
    }

    requotePriceWithBrandedfares(selectedBrandedFares) {
        this.setState({ selectedBrandedFares: selectedBrandedFares, brandedfarecallStatus: false, }, () => {
            this.verifyFlightDetails();
        });
    }

    generatePassengers() {
        this.passengers = [];
        const formPaxs = [];
        const passengers = this.state.passengers.map((passengerData, index) => {
            const { isPrimary, id, ...info } = passengerData;
            const key = `passengers-${index}`;
            return (<Passenger key={key}  ref={(element) => { formPaxs.push(element); }}  insuranceReQuoteCallback={this.insuranceReQuote} ageCheckDate={this.ageCheckDate} isPrimary={isPrimary}  idx={id.toString()} info={info} />);
        });
        this.passengers =  formPaxs;
        return passengers;
    }

    generatePayments(){
        this.paymentCards = [];
        const formPays = [];
        const initTotal = this.state.totalAmount;
        this.paymentCards =  formPays;
        return (
                <CreditCards product="flights" idx="0" initTotal={initTotal} ref={(element) =>formPays.push(element) } />
            );
    }

    insuranceReQuote() {
        this.setState({ insuranceLoader : true, insQuote : null, insError : null });

        var postParam = this.state.verifiedData;

        this.passengers.map((passenger, index) => {
            const { birthInfo } = passenger.getDateBirthInfo();
            if(birthInfo.day != '' && birthInfo.month != '' && birthInfo.year != '')
            {
                postParam.cartResult.passengerInfo[index].age = (moment().diff(moment(birthInfo.year+birthInfo.month+birthInfo.day, 'YYYYMMDD'), 'years') == 0) ? 1 : moment().diff(moment(birthInfo.year+birthInfo.month+birthInfo.day, 'YYYYMMDD'), 'years');
                postParam.cartResult.passengerInfo[index].dob = birthInfo.year+'-'+birthInfo.month+'-'+birthInfo.day;
            }
        });

        if(typeof this.insurance == 'undefined' || this.insurance == null) {
            postParam.province = 'ON';
        }
        else {
            postParam.province = this.insurance.getInfo().province;
            this.setState({ province : postParam.province });
        }

        const insuranceGetQuoteUrl = document.getElementById('SECUREBASEURL').value+'insurance/getQuote/';

        axios.post(insuranceGetQuoteUrl, {
            formData: postParam,
        }).then((response) => {
            this.setState({ insQuote : (typeof response.data.insuranceResult.quote != 'undefined' ? response.data.insuranceResult.quote : null), insError: (typeof response.data.insuranceResult.error != 'undefined' ? response.data.insuranceResult.error : null), displayInsuranceSection : true, insuranceLoader: false });
        }).catch((error) => {
            this.setState({ insuranceLoader: false });
        });
    }

    insuranceChangeCallback(amount, paxOptions) {

        var i;
        var j;
        var insbreakdown = {};
        for(i=0; i<paxOptions.length; i++){

            if(paxOptions[i].amount > 0)
            {
                if(typeof insbreakdown[paxOptions[i].insCode] == 'undefined')
                {
                    insbreakdown[paxOptions[i].insCode] = {
                            adult: (this.state.passengers[paxOptions[i].id-1].type=='ADT') ? 1 : 0,
                            child: (this.state.passengers[paxOptions[i].id-1].type!='ADT') ? 1 : 0,
                            planname: paxOptions[i].planName,
                            perDay: paxOptions[i].perDay,
                            amount: paxOptions[i].amount,
                            base: paxOptions[i].base,
                            tax: paxOptions[i].tax,
                    };
                }
                else
                {
                    if(this.state.passengers[paxOptions[i].id-1].type=='ADT') insbreakdown[paxOptions[i].insCode].adult = parseInt(insbreakdown[paxOptions[i].insCode].adult)+1;
                    else if(this.state.passengers[paxOptions[i].id-1].type!='ADT') insbreakdown[paxOptions[i].insCode].child = parseInt(insbreakdown[paxOptions[i].insCode].child)+1;
                }
            }
        }

        var insbreakdownHTML = '';

        Object.keys(insbreakdown).map(function (val, key) {

            if(insbreakdown[val].adult > 0)
            insbreakdownHTML+= '<div className="col-12">'+insbreakdown[val].planname+' Adult: '+insbreakdown[val].adult+' x '+Lang.priceFormat(insbreakdown[val].amount)+'</div>';
            if(insbreakdown[val].child > 0)
            insbreakdownHTML+= '<div className="col-12">'+insbreakdown[val].planname+' Child: '+insbreakdown[val].child+' x '+Lang.priceFormat(insbreakdown[val].amount)+'</div>';

        });

        document.getElementById('insurance_total_div').innerHTML = Lang.priceFormat(amount);
        document.getElementById('insurancePriceBreakdown').innerHTML = insbreakdownHTML;
        this.setState({insAmount: amount});
        document.getElementById('flight_total_price').innerHTML = Lang.priceFormat(parseFloat(this.state.totalAmount)+parseFloat(amount));
    }


    buildPassengers() {

        var passengerInfo = this.state.cartResult.passengerInfo;
        const passengers = [];

        var adtCount = 0;
        var chldCount = 0;

        for (let i = 0; i < passengerInfo.length; i++) {
            var paxId = 0;

            if(passengerInfo[i].type=='ADT')
            {
                adtCount = adtCount+1;
                paxId = adtCount;
            }
            else
            {
                chldCount = chldCount+1;
                paxId = chldCount;
            }

            passengers.push({
                id: paxId,
                adult: (passengerInfo[i].type=='ADT') ? true : false,
                type: passengerInfo[i].type,
                title: '',
                first: '',
                middle: '',
                last: '',
                year: '',
                month: '',
                day: '',
                age: passengerInfo[i].age,
                email: '',
                phone: '',
                isPrimary: (adtCount === 1 && passengerInfo[i].type=='ADT') ? true : false,
            });

        }
        this.setState({ passengers });
    }


    verifyFlightDetails(){

        this.setState({verifiedData : null, displayPurchaseButton: false, displayPaymentSection: false, totalAmount : 0});

        var postParam = this.props.paymentData.postParam;

        if(this.state.selectedExtraOtions!=null) postParam.ePotionsVal = this.state.selectedExtraOtions;
        if(this.state.selectedBrandedFares!=null) postParam.brandedFaresVal = this.state.selectedBrandedFares;

        const verifyFlightDetailsUrl = document.getElementById('SECUREBASEURL').value+'verify/flightdetails/';

        axios.post(verifyFlightDetailsUrl, {
            formData: postParam,
        }).then((response) => {
            if(Object.prototype.hasOwnProperty.call(response.data, 'error'))
            {
                document.getElementById('flightVerifyErrorModalText').innerHTML = response.data.error.long_description;
                this.UIModals.show("#mdl-verify-error");
            }
            else if(typeof response.data.cartResult.products.flight.slices == "undefined")
            {
                this.UIModals.show("#mdl-session-timeout");
            }
            else
            {
                this.setState({verifiedData : response.data, cartId : response.data.cartResult.products.flight.resultId,  rowId : response.data.cartResult.products.flight.rowId, sessionData : response.data.session,  extraOptions : (typeof response.data.cartResult.products.flight.extraOptions != "undefined" ? response.data.cartResult.products.flight.extraOptions : null),  displayPurchaseButton: true, displayPaymentSection: true, totalAmount : response.data.cartResult.products.flight.rateInfo.pricingInfo.total});
                this.insuranceReQuote();
                if(this.state.brandedfarecallStatus == true) this.getBrandedFares();
            }

        }).catch((error) => {
            console.log(error);
        });


    }

    getBrandedFares(){

        var postParam = { uid : this.props.paymentData.postParam.uid, noofticket : document.getElementById('noOfTickets').value};

        axios.post(document.getElementById('SECUREBASEURL').value+'verify/brandedfares/', {
            formData: postParam,
        }).then((response) => {
            this.setState({brandedfaresLoader : false});
            if(Object.prototype.hasOwnProperty.call(response.data.brandedFareResults, 'error'))
            {
                console.log(response.data.error);
            }
            else
            {
                this.setState({brandedfaresData : response.data});
            }

        }).catch((error) => {
            console.log(error);
        });
    }

    generateInsurance(){
        return (
            <Insurance province={this.state.province} quote={this.state.insQuote} error={this.state.insError} insuranceReQuoteCallback={this.insuranceReQuote}
                    insuranceChangeCallback={this.insuranceChangeCallback} ref={(element) =>{this.insurance =  element} } />
        )
    }

    generateTerms() {
         return (<Terms  ref={(element) =>this.terms =  element }  />);
    }

    generateAirmiles(){
        const minDepositPay = parseFloat(this.state.totalAmount) + parseFloat(this.state.insAmount) + parseFloat(this.state.airmilesRedeemAmount > 0 ? this.airmilesServiceFee : 0 )
            + parseFloat(this.state.opcAmount);

        return ( SITE_KEY =='airmiles'? (
            <AirmilesWidget serviceFee={this.airmilesServiceFee} airmilesChangeCallback={this.airmilesChangeCallback} bonusPoint={this.state.bonusPointTotal} minDepositCheck={this.state.minDepositCheck} minDepositAmount={minDepositPay} totalBase={this.state.verifiedData.cartResult.products.flight.rateInfo.pricingInfo.totalBase} grandTotal={this.state.totalAmount} airmilesAccount = {this.props.paymentData.airmilesAccount} ref={(element) =>{this.airmiles =  element} } />
        ): null);
    }

    submit() {
        let errorsCount = 0;
        const that  = this;
        const paxs = this.passengers.map((passenger, index) => {
            const { data, errorStatus } = passenger.getInfo();
            if(errorStatus){
              errorsCount++;
            }
            return Object.assign({}, that.state.passengers[index], data);
        });

        const creditCards = this.paymentCards.map((card, index) => {
            const { data, errorStatus } = card.getInfo();
            if(errorStatus){
              errorsCount++;
            }
            return Object.assign({}, this.paymentCards[index], data);
        });
        const { errorStatus } = this.terms.getInfo();
            if(errorStatus){
              errorsCount++;
            }

        //As insurance has default always, no need check error here
        let insuranceSelected = null;
        if (this.insurance && this.state.insQuote!=null){
           const insRetInfo = this.insurance.getInfo();
           if ( insRetInfo.paxOptions ){
                insuranceSelected = {
                    quoteId: this.state.insQuote.quoteId,
                    province: insRetInfo.province,
                    passengers: insRetInfo.paxOptions,
                    total: this.state.insAmount,
                };
            }
        }

        if (errorsCount === 0) {
            this.UIModals.show('#mdl-book');
            let phone, email;
            const ageCheckDate = new moment(this.ageCheckDate);

            const session = this.state.sessionData;

            const chargeOnBook = {
                total: parseFloat(this.state.opcAmount > 0 ? this.opcAmount : 0 ) + parseFloat(this.state.airmilesRedeemAmount > 0 ? this.airmilesServiceFee : 0 ),
                detail: [
                   this.state.airmilesRedeemAmount > 0? { amount: this.airmilesServiceFee , campaignCode:'ARMSRV', name: Lang.trans('airmiles.airmiles_service_fee') }:null,
                   this.state.opcAmount > 0? { amount: this.state.opcAmount , campaignCode:'OPC', name:'OPC'}:null,
                ],
            };


            const passengers =  paxs.map((pax, index)=>{
                const paxDatebirth  =  pax['year']+'-'+pax['month']+'-'+(pax['day'] < 10 ? '0'+pax['day'] : pax['day']);
                const paxAge =  ageCheckDate.diff(paxDatebirth, 'years');
                if( index === 0 ){
                    phone =  pax['phone'];
                    email = pax['email'];
                }
                return {
                    "id": (index+1),
                    "type": pax['type'],
                    "lastName": pax['last'],
                    "firstName": pax['first'],
                    "middleName": pax['middle'],
                    "title": pax['title'],
                    "dob": paxDatebirth,
                    "age": paxAge
                };
            });

            const brandedFares =  this.state.selectedBrandedFares;

            const cubavisit = {
              "cubaVisitPurposeStatus": this.state.cartResult.products.flight.extras.cubaVisit.cubaVisitPurposeStatus,
              "cuba_visit_purpose": (this.state.cartResult.products.flight.extras.cubaVisit.cubaVisitPurposeStatus) ? document.getElementById('cuba_visit_purpose').value : ''
            };

            const mainAddress = {
              "street": creditCards[0]['address'],
              "city": creditCards[0]['city'],
              "postalCode": creditCards[0]['postalZip'],
              "province": creditCards[0]['province'],
              "country": creditCards[0]['country']
            };

            const payment = {
                "cardHolder": creditCards[0]['ccName'],
                "ccNumber": creditCards[0]['ccNumber'].replace(/[^\d]/g, ''),
                "ccExpiry": creditCards[0]['ccExpiry'].slice(0, 2)+'-'+creditCards[0]['ccExpiry'].slice(-4),
                "ccType": Helper.checkCardType(creditCards[0]['ccNumber']),
                "ccCVV": creditCards[0]['ccCVV'],
                "ccAddress": mainAddress,
                "methodType": "CC",
            };

            const contact = {
                "dayTimePhone": phone,
                "eveningPhone": "",
                "email": email,
                "address": mainAddress,
            };

            const earnMiles = Math.floor(parseFloat(this.state.verifiedData.cartResult.products.flight.rateInfo.pricingInfo.totalBase)/20);
            const airmiles =  this.state.airmilesRedeemAmount > 0? {
                    earn: earnMiles,
                    redeemDollarAmount: this.state.airmilesRedeemAmount,
                    serviceFee: this.airmilesServiceFee,
                }:{earn: earnMiles };


            const formData = {
                session,
                'bookRQ' : {
                    "version": "v1",
                    'inputs' : {
                                    'cartID' : this.state.cartId,
                                    passengers,
                                    contact,
                                    payment,
                                    insurance: insuranceSelected,
                                    brandedFares,
                                    cubavisit,
                                    additional: {
                                      saveTotal: parseFloat(this.state.airmilesRedeemAmount),
                                      airmiles: airmiles,
                                      chargeOnBook,
                                    },
                    }
                }
            };

            const mdlLoader = new Loader({ bar: document.getElementById('mdl_book_loaderbar'), loader: document.getElementById('mdl_book_loader'), interval: 20 });
            mdlLoader.start();

            new Promise((resolve, reject) => {
                    fetch(BOOK_LINK, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({formData})
                    }).then(response => response.json())
                        .then((data) => {
                            mdlLoader.end();
                            this.UIModals.close('#mdl-book');
                            if (!Object.prototype.hasOwnProperty.call(data, 'error')) {
                                //redirect to confirmation page
                                console.log(data);
                                console.log(CONFIRM_LINK);
                                window.location = CONFIRM_LINK+'?uid='+data.uid;

                            } else {
                                // process error
                                this.UIModals.show("#mdl-book-error"); console.log('error');
                                document.getElementById('book_model_display_text').innerHTML = data.error.long_description;
                            }

                        }).catch(error => {
                            this.UIModals.close('#mdl-book');
                            alert("System Exception");
                            reject(error);
                        });
            });


        }

        return false;
    }

    render() {

        const { loader } = this.state;

        return (
            <div className="container pl-md-0 pr-md-0">
                <div className="row">
                    {
                    <div className="container border-bottom d-lg-none pl-md-0 pr-md-0 pt-2 pb-2 d-flex justify-content-between">
                        <div className="payment-mobile-price">{Lang.trans('common.total')} C{Lang.priceFormat(`${this.state.totalAmount}`)}</div>
                        <button className="btn-underline-link" data-toggle='collapse' data-target="#price-sidebar">
                            <span className="open-details">Confirm Details</span>
                            <span className="close-details d-none">{Lang.trans('flights.close_details')}</span>
                        </button>
                    </div>
                    }
                    {/* Vacation Sidebar Package Details */}
                    {
                        this.state.verifiedData == null ? (
                        <div className="col-lg-5 col-xl-4 mt-3 loader-booking-path-flight-details">
                            <div className="loader-background loader-filter-container">
                                <div className="loader-background-masker rounded-top loader-title-top"></div>
                                <div className="loader-background-masker loader-title-left"></div>
                                <div className="loader-background-masker loader-title-right"></div>
                                <div className="loader-background-masker loader-title-bottom"></div>

                                <div className="loader-background-masker loader-airline1-left"></div>
                                <div className="loader-background-masker loader-airline1-right"></div>
                                <div className="loader-background-masker loader-airline1-bottom"></div>

                                <div className="loader-background-masker loader-flight-number1-left"></div>
                                <div className="loader-background-masker loader-flight-number1-right"></div>
                                <div className="loader-background-masker loader-flight-number1-bottom"></div>

                                <div className="loader-background-masker loader-depart1-city-left"></div>
                                <div className="loader-background-masker loader-depart1-city-middle"></div>
                                <div className="loader-background-masker loader-depart1-city-right"></div>
                                <div className="loader-background-masker loader-depart1-city-bottom"></div>

                                <div className="loader-background-masker loader-arrive1-city-left"></div>
                                <div className="loader-background-masker loader-arrive1-city-right"></div>
                                <div className="loader-background-masker loader-arrive1-city-bottom"></div>

                                <div className="loader-background-masker loader-line-left"></div>
                                <div className="loader-background-masker loader-line-right"></div>
                                <div className="loader-background-masker loader-line-bottom"></div>

                                <div className="loader-background-masker loader-airline2-left"></div>
                                <div className="loader-background-masker loader-airline2-right"></div>
                                <div className="loader-background-masker loader-airline2-bottom"></div>

                                <div className="loader-background-masker loader-flight-number2-left"></div>
                                <div className="loader-background-masker loader-flight-number2-right"></div>
                                <div className="loader-background-masker loader-flight-number2-bottom"></div>

                                <div className="loader-background-masker loader-depart2-city-left"></div>
                                <div className="loader-background-masker loader-depart2-city-middle"></div>
                                <div className="loader-background-masker loader-depart2-city-right"></div>
                                <div className="loader-background-masker loader-depart2-city-bottom"></div>

                                <div className="loader-background-masker loader-arrive2-city-left"></div>
                                <div className="loader-background-masker loader-arrive2-city-right"></div>
                                <div className="loader-background-masker loader-arrive2-city-bottom"></div>

                                <div className="loader-background-masker loader-price-summary-title-top"></div>
                                <div className="loader-background-masker loader-price-summary-title-left"></div>
                                <div className="loader-background-masker loader-price-summary-title-right"></div>
                                <div className="loader-background-masker loader-price-summary-title-bottom"></div>

                                <div className="loader-background-masker loader-price-summary-left"></div>
                                <div className="loader-background-masker loader-price-summary-right"></div>
                                <div className="loader-background-masker loader-price-summary-bottom"></div>

                                <div className="loader-background-masker loader-price-summary-cost-left"></div>
                                <div className="loader-background-masker loader-price-summary-cost-right"></div>
                                <div className="loader-background-masker loader-price-summary-cost-bottom"></div>

                                <div className="loader-background-masker loader-total-price-top"></div>
                                <div className="loader-background-masker loader-total-price-left"></div>
                                <div className="loader-background-masker loader-total-price-middle"></div>
                                <div className="loader-background-masker loader-total-price-right"></div>
                                <div className="loader-background-masker rounded-bottom loader-total-price-bottom"></div>
                            </div>
                        </div>
                        ) : (<VerifyFlightDetails verifiedData={this.state.verifiedData} searchParams={this.state.cartResult.products.flight.extras.searchParams} />)
                    }

                    <input type="hidden" id="brandedfarecallStatus" value={this.state.brandedfarecallStatus}/>

                    <div className="col-12 col-lg-7 col-xl-8 pt-3 order-lg-first payment-form-section payment-form">

                        <div className="border rounded p-3 mb-3 custom-form-element box-shadow">
                            <div className="d-flex align-items-center primary-color">
                                <div className="mr-2">
                                    <svg className="icon-md" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-users-multiple" />
                                    </svg>
                                </div>
                                <h5>{Lang.trans('customer.traveller_information')}</h5>
                            </div>
                            <article className="collapse show border-top pt-3 mt-3 accord-segment">
                                {this.generatePassengers()}
                            </article>
                        </div>

                        {/* cuba visit purpose */}
                        {
                            this.state.cartResult.products.flight.extras.cubaVisit.cubaVisitPurposeStatus === true ?
                            (
                                <div className="sub-container">
                                    <div className="alert cuba margin-top-20">
                                        <div className="row-fluid">
                                            <div className="span6">
                                                <div>{Lang.trans('flights.cuba_reason_headline')}</div>
                                                <div className="border-top">{Lang.trans('flights.cuba_reason_headline1')} <a href="https://cu.usembassy.gov/u-s-citizen-services/local-resources-of-u-s-citizens/traveling-to-cuba/">{Lang.trans('flights.link')}</a></div>
                                            </div>
                                            <div className="select-arrow span6">
                                                <select name="cuba_visit_purpose" id="cuba_visit_purpose" className="" aria-invalid="false">
                                                    <option selected="" value={Lang.trans('flights.cuba_reason1')}>{Lang.trans('flights.cuba_reason1')}</option>
                                                    <option value={Lang.trans('flights.cuba_reason2')}>{Lang.trans('flights.cuba_reason2')}</option>
                                                    <option value={Lang.trans('flights.cuba_reason3')}>{Lang.trans('flights.cuba_reason3')}</option>
                                                    <option value={Lang.trans('flights.cuba_reason4')}>{Lang.trans('flights.cuba_reason4')}</option>
                                                    <option value={Lang.trans('flights.cuba_reason5')}>{Lang.trans('flights.cuba_reason5')}</option>
                                                    <option value={Lang.trans('flights.cuba_reason6')}>{Lang.trans('flights.cuba_reason6')}</option>
                                                    <option value={Lang.trans('flights.cuba_reason7')}>{Lang.trans('flights.cuba_reason7')}</option>
                                                    <option value={Lang.trans('flights.cuba_reason8')}>{Lang.trans('flights.cuba_reason8')}</option>
                                                    <option value={Lang.trans('flights.cuba_reason9')}>{Lang.trans('flights.cuba_reason9')}</option>
                                                    <option value={Lang.trans('flights.cuba_reason10')}>{Lang.trans('flights.cuba_reason10')}</option>
                                                    <option value={Lang.trans('flights.cuba_reason11')}>{Lang.trans('flights.cuba_reason11')}</option>
                                                    <option value={Lang.trans('flights.cuba_reason12')}>{Lang.trans('flights.cuba_reason12')}</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : null
                        }


                        {/*Extra options*/}
                        {
                            (this.state.extraOptions != null && this.state.extraOptions != '') ? <ExtraOptions extraOptions={this.state.extraOptions} selectFlightOptions={this.selectFlightOptions} requotePriceWithExtraoptions={this.requotePriceWithExtraoptions}  /> : null
                        }

                        {/*branded fares Data*/}

                        {
                            (this.state.brandedfarecallStatus == true) ? (

                                (this.state.brandedfaresData != null && this.state.brandedfaresData != '') ? (<BrandedFares brandedfaresData={this.state.brandedfaresData} requotePriceWithBrandedfares={this.requotePriceWithBrandedfares}  />) : (

                                    <div className="col-12 col-lg-7 col-xl-8 pt-3 ">
                                        <div className="border rounded p-3 mb-3 custom-form-element box-shadow seat-selection-loader">
                                            <div>
                                                <div className="row">
                                                    <div className="col-2">
                                                        <div className="loader-background py-2 lh-lg"></div>
                                                    </div>
                                                    <h5 className="col-8"><div className="loader-background py-2 lh-md lw-200" ></div></h5>
                                                </div>
                                                <div className="row">
                                                    <div className="col-3" ><div className="loader-background py-5 mt-3 " ><div className="py-3"></div></div></div>
                                                    <div className="col-7">
                                                        <div className="row">
                                                            <div className="col-12" ><div className="loader-background py-2 mt-3 " ></div></div>
                                                            <div className="col-12" ><div className="loader-background py-2 mt-3 " ></div></div>
                                                            <div className="col-12" ><div className="loader-background py-2 mt-3 " ></div></div>
                                                            <div className="col-12" ><div className="loader-background py-2 mt-3 " ></div></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-2"><div className="loader-background py-2 mt-3 " ></div></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )

                            ) : ''

                        }



                        {/*Insurance */}
                        {
                            this.state.insuranceLoader ? (
                            <div className="rounded-sm p-3 mb-3 box-shadow bg-white">
                                <div className="row align-items-center">
                                    <div className=" col-2">
                                      <div className="loader-background px-3 py-3" />
                                    </div>
                                    <div className="col-7">
                                      <div className="loader-background  py-3" />
                                    </div>
                                    <div className="col-3">
                                      <div className="loader-background  py-4" />
                                    </div>
                                </div>
                                <div className>
                                    <div className="row">
                                      <div className="col-12 mt-3 ">
                                        <div className="col-12  ">
                                          <div className="row align-items-center border py-3 rounded">
                                            <div className="col-7
                                                      ">
                                              <div className="loader-background py-2" />
                                            </div>
                                            <div className="col-5
                                                      ">
                                              <div className="loader-background py-3 rounded">
                                                <div className="my-2" />
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="row gutter-10 mt-3 ">
                                      <div className="col-12 col-sm-6 mb-3 ">
                                        <div className="border p-3 rounded">
                                          <div className="loader-background my-2 py-2 col-5">
                                          </div>
                                          <div className="loader-background my-2 py-3 col-8">
                                          </div>
                                          <div className="loader-background mt-3 py-2 col-6">
                                          </div>
                                          <div className="loader-background mt-4 py-2 col-3">
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-12 col-sm-6 mb-3 ">
                                        <div className="border p-3 rounded">
                                          <div className="loader-background my-2 py-2 col-5">
                                          </div>
                                          <div className="loader-background my-2 py-3 col-8">
                                          </div>
                                          <div className="loader-background mt-3 py-2 col-6">
                                          </div>
                                          <div className="loader-background mt-4 py-2 col-3">
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-12 col-sm-6 mb-3 ">
                                        <div className="border p-3 rounded">
                                          <div className="loader-background my-2 py-2 col-5">
                                          </div>
                                          <div className="loader-background my-2 py-3 col-8">
                                          </div>
                                          <div className="loader-background mt-3 py-2 col-6">
                                          </div>
                                          <div className="loader-background mt-4 py-2 col-3">
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-12 col-sm-6 mb-3 ">
                                        <div className="border p-3 rounded">
                                          <div className="loader-background my-2 py-2 col-5">
                                          </div>
                                          <div className="loader-background my-2 py-3 col-8">
                                          </div>
                                          <div className="loader-background mt-3 py-2 col-6">
                                          </div>
                                          <div className="loader-background mt-4 py-2 col-3">
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="row gutter-10">
                                      <div className=" col-12 col-sm-6 mb-2">
                                        <div className="loader-background py-2 col-4 mb-3" />
                                        <div className="loader-background py-4 col-12 mb-3" />
                                      </div>
                                      <div className=" col-12 col-sm-6 mb-2">
                                        <div className="loader-background py-2 col-4 mb-3" />
                                        <div className="loader-background py-4 col-12 mb-3" />
                                      </div>
                                    </div>
                              </div>
                            </div>
                            ) : null
                        }
                        {
                            ((this.state.insQuote || this.state.insError) && this.state.displayInsuranceSection) ? this.generateInsurance() : null
                        }

                        {
                            SITE_KEY =='airmiles' ?
                            (<div className="rounded-sm p-3 mb-3 box-shadow bg-white">
                                <div className="d-flex justify-content-between">
                                    <div className="d-flex align-items-center primary-color">
                                        <div className="mr-2">

                                            <img className="booking-airmiles-logo" src="//s3.amazonaws.com/redtag-ca/img/airmiles/airmiles-logo.svg"/>

                                        </div>
                                        <h5 className="m-0">{Lang.trans('airmiles.airmiles_information')}</h5>
                                    </div>
                                </div>
                                <div className="border-top pt-3 mt-3">
                                    {this.generateAirmiles()}
                                </div>
                            </div>) : null
                        }



                        {/* Credit cards section*/}

                        <div className="rounded-sm p-3 mb-3 box-shadow bg-white">
                            <div className="d-flex justify-content-between">
                                <div className="d-flex align-items-center primary-color">
                                    <div className="mr-2">
                                        <svg className="icon-md mt-2" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                            <use xlinkHref="/img/icons/icon-defs.svg#icon-dollar-sign-circle" />
                                        </svg>
                                    </div>
                                    <h5 className="m-0">Payment Information</h5>
                                </div>
                                <button className="btn-underline-link">close tab</button>
                            </div>
                            <div className="collapse show border-top pt-3 mt-3">
                                {this.generatePayments()}
                            </div>
                        </div>


                        {this.generateTerms()}

                        {
                            (this.state.displayPurchaseButton) ? (<button onClick={(e)=>this.submit()} type="button" className="btn btn-lg p-3 btn-primary col-12 col-md-6"> {Lang.trans('common.complete_your_purchase')}</button>) : (<div className="button-price-section"><div className="loader-background col-6 py-4 rounded"></div></div>)
                        }

                    </div>
                </div>
            </div>

        );
    }


}

export default PaymentForm;
