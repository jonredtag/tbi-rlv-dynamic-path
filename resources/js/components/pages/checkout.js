import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import UncontrolledPopover from 'reactstrap/lib/UncontrolledPopover';
import PopoverBody from 'reactstrap/lib/PopoverBody';
import PriceDropAlert from 'components/widgets/priceDropAlert';
import TravellerInformation from 'components/widgets/travellerInformation';
import InsuranceOptions from 'components/widgets/insuranceOptions';
import CreditCards from 'components/widgets/CreditCards';
import SidebarLoader from 'components/widgets/sidebarLoader';
import HotelSummary from 'components/widgets/hotelSummary';
import FlightSummary from 'components/widgets/flightSummary';
import TransferSummary from 'components/widgets/transferSummary';
import PriceSummary from 'components/widgets/priceSummary';
import CarSummary from 'components/cars/paymentSummary';
import WhyBook from 'components/widgets/whyBook';
import AirmilesAccept from 'components/widgets/airmilesAccept';
import PetroAccept from 'components/widgets/petroAccept';
import HsbcRedeemWidget from 'components/widgets/HsbcRedeemWidget';
import CibcRedeemWidget from 'components/widgets/CibcRedeemWidget';
import CibcInsurance from 'components/widgets/InsuranceCIBC';
import Profile from 'components/widgets/profile';
import CouponInput from 'components/snippets/couponInput';
import ErrorText from 'components/snippets/errorText';
import Lang, { priceFormat } from 'libraries/common/Lang';
import moment from 'moment';
import errorModal from 'helpers/errorModal';
import customModal from 'helpers/customModal';
import PaymentWithUplift from 'components/common/PaymentWithUplift';
import UpliftSidebarWidget from 'components/common/UpliftSidebarWidget';
import InformationSection from 'components/widgets/informationSection';
import ActivitySummary from 'components/widgets/activitySummary';
import ActivityPaymentDetail from 'components/widgets/activityPaymentDetail';
import ActivityCancelPolicy from 'components/activities/cancelPolicy';
import BookingSteps from 'components/common/BookingSteps';
import buildQueryString from 'helpers/buildQueryString';
import WatchListModal from 'components/widgets/watchListModal';
import checkCookie from 'helpers/checkCookie';
import Collapse from 'reactstrap/lib/Collapse';
import Modal from 'reactstrap/lib/Modal';
import ModalHeader from 'reactstrap/lib/ModalHeader';
import ModalBody from 'reactstrap/lib/ModalBody';
import ModalFooter from 'reactstrap/lib/ModalFooter';
import TabContent from 'reactstrap/lib/TabContent';
import TabPane from 'reactstrap/lib/TabPane';


class Checkout extends Component {
    constructor(props) {
        super(props);
        const { tripInformation, parameters } = props;
        const isActivityStandalone = parameters.selectedProducts === 'A';
        const passengers = [];
        this.membershipAccount = createRef();
        this.refActQuest = createRef();

        const paxBasic = {
            first: '',
            middle: '',
            last: '',
            plan: '',
            type: 'adult',
        };
        const paxExt = isActivityStandalone ? {
            title: '',
            year: '',
            month: '',
            day: '',
        } : {
            title: '',
            year: '',
            month: '',
            day: '',
        };

        this.upliftEnable = !isActivityStandalone;
        if (this.upliftEnable && ['hsbc','cibc'].includes(SITE_KEY)) {
            this.upliftEnable = false;
        }

        for (let i = 0; i < tripInformation.passengers.adults; i++) {
            passengers.push({
                ...paxBasic,
                ...paxExt,
                index: i,
                email: i === 0 && window.points === 'cibc' ? props.user.preferEmail : '',
                phone: '',
                isPrimary: i === 0,
            });
        }
        for (let i = 0; i < tripInformation.passengers.children; i++) {
            passengers.push({
                ...paxBasic,
                ...paxExt,
                index: i,
                type: 'child',
                isPrimary: false,
                age: tripInformation.passengers.ages[i],
            });
        }
        this.state = {
            passengerInformation: passengers,
            insuranceInformation: {},
            province: 'ON',
            verifyInformation: {},
            errors: {},
            shouldValidate: false,
            choose: true,
            hasFlight: true,
            paymentInformation: {
                price: 0,
                terms: '',
                airmiles: '',
                petroInformation: {
                    redeemDollarAmount: 0,
                    petroCard: '',
                    name: '',
                },
            },
            insuranceSummary: {
                total: 0,
                taxes: 0,
                base: 0,
                plans: [],
            },
            scrollToError: false,
            paymentCheck: 'radioPayFull',
            showMultiPayment: true,
            monthlyPaymentStatus: {
                monthlyAmount: 0,
                disable: false,
                approval: false,
            },
            showDetails: false,
            twoPaymentCheck: false,
            disableMultiCard: true,
            payments: [{ isPrimary: true }],
            cardsAmount: [0, 0],
            isBooking: false,
            terms: [],
            redbook: [],
            termsModalOpen: false,
            activeTermsTab: 'redbook',
            redeemAmount: 0,
            membershipAccountRedeemAmount: 0,
        };

        if (window.points === 'cibc') {
            this.state = { ...this.state, cibcInsurance: { trip_cancel: '0', medical: '0' } };
        }

        this.membershipAccount = createRef();
        this.profile = createRef();
        this.MonthlyPayment = createRef();

        this.updatePassengerInformation = this.updatePassengerInformation.bind(this);
        this.updatePassengerInsurance = this.updatePassengerInsurance.bind(this);
        this.updatePaymentInformation = this.updatePaymentInformation.bind(this);
        this.changeProvince = this.changeProvince.bind(this);
        this.submitPurchase = this.submitPurchase.bind(this);
        this.setTerms = this.setTerms.bind(this);
        this.toggleDetails = this.toggleDetails.bind(this);
        this.toggleWishModal = this.toggleWishModal.bind(this);
        this.updatePetroInformation = this.updatePetroInformation.bind(this);
        this.fetchCarTerms = this.fetchCarTerms.bind(this);
        this.toggleTermsModal = this.toggleTermsModal.bind(this);
        this.setActiveTermsTab = this.setActiveTermsTab.bind(this);
        this.changeCoupon = this.changeCoupon.bind(this);
        /* Added for uplift feature */
        /* Begin */
        this.sidebarMonthlyShowCallback = this.sidebarMonthlyShowCallback.bind(this);
        this.getPaxInfo = this.getPaxInfo.bind(this);
        this.checkValidPaxInfo = this.checkValidPaxInfo.bind(this);
        this.gotoFirstErrorField = this.gotoFirstErrorField.bind(this);
        this.handleOtherPaymentChange = this.handleOtherPaymentChange.bind(this);
        this.buildProductOrder = this.buildProductOrder.bind(this);
        /* End */
        /* Multiple payment */
        this.generatePayments = this.generatePayments.bind(this);
        this.handleCreditCardCheck = this.handleCreditCardCheck.bind(this);
        this.mainCardAmountChangeCallback = this.mainCardAmountChangeCallback.bind(this);
        this.updateCardsAmount = this.updateCardsAmount.bind(this);
        this.membershipAccountChangeCallback = this.membershipAccountChangeCallback.bind(this);
        this.setChoose = this.setChoose.bind(this);
        this.updateStatePricing = this.updateStatePricing.bind(this);
        this.discoverWatcher = this.discoverWatcher.bind(this);
        /**/
    }

    componentDidMount() {
        const { features, parameters, sid } = this.props;
        const isStandalone = parameters.selectedProducts.length === 1;

        if (features.manulife && parameters.selectedProducts.length !== 1) {
            const insurance = fetch(`/api/checkout/getQuote?sid=${sid}`);
            insurance
                .then((response) => response.json())
                .then((insuranceInformation) => {
                    if (!Object.prototype.hasOwnProperty.call(insuranceInformation, 'error')) {
                        this.setState({ insuranceInformation });
                    } else {
                        this.addError('insurance', {
                            id: 'failed',
                            message: Lang.trans('insurance.insurance_not_available'),
                        });
                    }
                });
        }
        const verify = fetch(`/api/checkout/validation?sid=${sid}`);

        verify
            .then((response) => response.json())
            .then((verifyInformation) => {
                if (!Object.prototype.hasOwnProperty.call(verifyInformation, 'error')) {
                    this.setState({ verifyInformation }, () => {
                        this.updateCardsAmount();
                    });
                    const { hasDeposit } = verifyInformation;
                    if (hasDeposit) {
                        this.setState({
                            disableMultiCard: true,
                        });
                        this.handleOtherPaymentChange('radioPayMinimum');
                    }

                    if (
                        verifyInformation.coupon !== undefined &&
                        verifyInformation.coupon.error !== undefined
                    ) {
                        customModal({
                            message: verifyInformation.coupon.error.message,
                        });
                    }
                    // Google Datalayer
                    const googleData = {
                        event: 'view_item_list',
                        ecommerce: {
                            items: [],
                        },
                    };

                    if (verifyInformation.hotel !== undefined) {
                        googleData.ecommerce.items.push({
                            item_name: verifyInformation.hotel.name,
                            price: verifyInformation.cost.total,
                            item_brand: '',
                            item_category: 'hotel',
                            index: 1,
                        });
                    }

                    if (verifyInformation.flight !== undefined) {
                        const departSegments = [];
                        const returnSegments = [];

                        verifyInformation.flight[0].legs.forEach((leg) => {
                            departSegments.push(`${leg.carrierCode}${leg.flightNumber}`);
                        });
                        verifyInformation.flight[1].legs.forEach((leg) => {
                            returnSegments.push(`${leg.carrierCode}${leg.flightNumber}`);
                        });

                        googleData.ecommerce.items.push({
                            item_name: `${departSegments.join('')}|${returnSegments.join('')}`,
                            price: verifyInformation.cost.total,
                            item_brand: '',
                            item_category: 'flight',
                            index: 2,
                        });
                    }

                    console.log(googleData);
                    dataLayer.push({ ecommerce: null });  // Clear the previous ecommerce object.
                    dataLayer.push(googleData);
                    // Google Datalayer

                    if(isStandalone && verifyInformation &&  Object.prototype.hasOwnProperty.call(verifyInformation, 'addon') &&
                                Object.prototype.hasOwnProperty.call(verifyInformation.addon, 'activity')){
                        this.setState({showMultiPayment:false});     
                    }
                    import('modules/urgency');
                } else if (verifyInformation.error.code === 'V1') {
                    customModal({
                        message: verifyInformation.error.message,
                        buttons: [
                            {
                                text: 'Change product',
                                onClick: () => {
                                    window.location.href = `${verifyInformation.error.route}?sid=${sid}`;
                                },
                                type: 'secondary',
                            },
                        ],
                    });
                } else {
                    errorModal(verifyInformation.error);
                }
            });

        this.discoverWatcher();
    }

    componentDidUpdate() {
        const errorElement = document.querySelector('.error-container');

        if (errorElement !== null && this.state.scrollToError) {
            const postions = errorElement.getBoundingClientRect();
            const currentTop = window.pageYOffset;

            window.scrollTo({
                top: currentTop + postions.top - 75,
                behavior: 'smooth',
            });

            this.setState({ scrollToError: false });
        }
    }

    handleOtherPaymentChange(val) {
        const { passengerInformation, verifyInformation } = this.state;

        const newVerifyInformation = Object.assign({}, verifyInformation);
        const newCosts = Object.assign({}, verifyInformation.cost);
        const numberPassengers = passengerInformation.length;

        if (val === 'radioPayMinimum') {
            newCosts.deposit = 50 * numberPassengers;
        } else {
            delete newCosts.deposit;
        }

        newVerifyInformation.cost = newCosts;
        this.setState(
            { paymentCheck: val, verifyInformation: newVerifyInformation, choose: false },
            () => {
                this.updateCardsAmount();
            }
        );
    }

    handleCreditCardCheck() {
        const {
            verifyInformation,
            insuranceSummary,
            payments,
            twoPaymentCheck,
            choose,
        } = this.state;

        const discountRate = Object.prototype.hasOwnProperty.call(verifyInformation, 'coupon') && verifyInformation.coupon.costs !== undefined ? verifyInformation.coupon.costs.value : 0;
        const totalAmount = Math.max((verifyInformation.cost ? verifyInformation.cost.total : 0) + discountRate, 0);
        const deposit = verifyInformation.cost.deposit || 0;
        let amount = deposit || totalAmount;
        let cardsAmount = [amount + insuranceSummary.total + (choose && verifyInformation.choose ? verifyInformation.choose.price : 0), 0];
        if (twoPaymentCheck) {
            payments.pop();
        } else {
            payments.push({ isPrimary: false });
            if (insuranceSummary.total < amount) {
                amount += insuranceSummary.total + (choose && verifyInformation.choose ? verifyInformation.choose.price : 0);
                cardsAmount = [amount / 2, amount / 2];
            } else {
                cardsAmount = [insuranceSummary.total, amount];
            }
        }
        this.setState({ twoPaymentCheck: !twoPaymentCheck, payments, cardsAmount });
    }

    setTerms(event) {
        const { target } = event;
        const { paymentInformation: curPayment } = this.state;
        const paymentInformation = Object.assign({}, curPayment);

        paymentInformation.terms = target.checked ? target.value : '';

        this.clearError('terms.terms');

        this.setState({ paymentInformation }, () => {
            this.validateField('terms.terms');
        });
    }

    setChoose(event) {
        const { target } = event;

        this.setState({ choose: target.checked }, () => {
            this.updateCardsAmount();
        });
    }

    getPaxInfo() {
        let valid = true;
        // check Passengers correctness
        const { passengerInformation } = this.state;
        passengerInformation.forEach((passenger, index) => {
            const { title, first, last, year, month, day, email, phone } = passenger;
            if (
                title === '' ||
                first === '' ||
                !/^[A-Za-z-'\u007D-\u00FF\s]+$/i.test(first) ||
                last === '' ||
                !/^[A-Za-z-'\u007D-\u00FF\s]+$/i.test(last) ||
                year === '' ||
                month === '' ||
                day === ''
            ) {
                valid = false;
            }

            if (
                valid &&
                index === 0 &&
                (email === '' ||
                !/^\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}\b$/i.test(email) ||
                phone === '' ||
                !/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/i.test(phone))
            ) {
                valid = false;
            }
            if (!valid) return;
        });
        return { valid, passengers: passengerInformation };
    }

    discoverWatcher() {
        const key = localStorage.getItem('userKey');
        if(key){
            fetch(`/api/profile/discoverWatcher?key=${key}`)
            .then((response) => response.json())
            .then((watcher) => {
                this.setState({ watcher });
            });    
        }
    }

    updateStatePricing() {}

    generateCibc() {
        const { verifyInformation, insuranceSummary } = this.state;
        const totalBase = verifyInformation.cost.baseRate;
        const totalAmount = verifyInformation.cost.total + insuranceSummary.total;
        return (
            <CibcWidget
                productName='Hotels'
                cibcChangeCallback={this.membershipAccountChangeCallback}
                bonusPoint={0}
                minDepositAmount={0}
                grandTotal={totalAmount}
                totalBase={totalBase}
                cibcAccount={verifyInformation.cibcAccount}
                ref={(element) => {
                    this.membershipAccount = element;
                }}
            />
        );
    }

    membershipAccountChangeCallback(amount) {
        this.setState({ redeemAmount: amount }, () => {
            this.updateCardsAmount();
        });
    }

    updatePassengerInformation(passenger, key) {
        const {
            shouldValidate,
            passengerInformation: curPassengers,
            province,
        } = this.state;
        const { insuranceOptions, features } = this.props;
        const [element, field] = key.split('.');
        const [, index] = element.split('-');

        let passengerInformation = [];
        if (passenger !== null) {
            passengerInformation = [
                ...curPassengers.slice(0, parseInt(index, 10)),
                passenger,
                ...curPassengers.slice(parseInt(index, 10) + 1),
            ];
        } else {
            passengerInformation = [
                ...curPassengers.slice(0, parseInt(index, 10)),
                ...curPassengers.slice(parseInt(index, 10) + 1),
            ];
        }

        this.clearError(key);

        this.setState({ passengerInformation }, () => {
            if (field === 'birth') {
                // need to handle running a insurance requote once all passenger birthdays are entered
                let incomplete = false;
                passengerInformation.forEach((passenger) => {
                    if (passenger.year === '' || passenger.month === '' || passenger.day === '') {
                        incomplete = true;
                    }
                });

                if (features.manulife && !incomplete && this.props.parameters.selectedProducts.length !== 1 && insuranceOptions.provinces.includes(province)) {
                    const insurance = fetch(`/api/checkout/getQuote?sid=${this.props.sid}&passengers=${JSON.stringify(passengerInformation)}&province=${province}`);

                    insurance
                        .then((response) => response.json())
                        .then((insuranceInformation) => {
                            if (!Object.prototype.hasOwnProperty.call(insuranceInformation, 'error')) {
                                this.setState({ insuranceInformation });
                                this.clearError('insurance.failed');
                            } else {
                                const { passengerInformation } = this.state;

                                passengerInformation.forEach((passenger) => {
                                    passenger.plan = 'DECLINED';
                                });

                                this.setState({ passengerInformation });
                                this.addError('insurance', {
                                    id: 'failed',
                                    message: Lang.trans('insurance.insurance_not_available'),
                                });
                            }
                        });
                }
            }
            if (shouldValidate) {
                this.validateField(key);
            }

            // Add uplift callback when pax get updated
            if (this.state.paymentCheck === 'radioPayMonthly' && this.MonthlyPayment.current) {
                this.MonthlyPayment.current.onParameterUpdate('pax');
            }
        });
    }

    updatePassengerInsurance(updatedPassenger, key) {
        const {
            insuranceInformation,
            passengerInformation: curPassengers,
            shouldValidate,
        } = this.state;
        const [, field] = key.split('.');
        const [, index] = field.split('-');

        const passengerInformation = [
            ...curPassengers.slice(0, parseInt(index, 10)),
            updatedPassenger,
            ...curPassengers.slice(parseInt(index, 10) + 1),
        ];

        const insuranceSummary = {
            total: 0,
            plans: [],
            taxes: 0,
            base: 0,
        };
        if (insuranceInformation) {
            passengerInformation.forEach((passenger, index) => {
                const insurancePlan = insuranceInformation.plans.find((plan) => plan.planCode === passenger.plan);
                if (insurancePlan !== undefined) {
                    let summaryPlan = insuranceSummary.plans.find((plan) => plan.code === passenger.plan);
                    if (summaryPlan !== undefined) {
                        summaryPlan.numberPassengers += 1;
                    } else {
                        summaryPlan = {
                            text: insurancePlan.planName,
                            numberPassengers: 1,
                            costPer: insurancePlan.passengers[0].planTotal,
                            code: insurancePlan.planCode,
                        };

                        insuranceSummary.plans.push(summaryPlan);
                    }
                    const passengerPlan = insurancePlan.passengers.find((plan) => plan.id === index);
                    insuranceSummary.total += parseFloat(passengerPlan.planTotal) || 0;
                    insuranceSummary.taxes += parseFloat(passengerPlan.planTaxes) || 0;
                    insuranceSummary.base += parseFloat(passengerPlan.planPrice) || 0;
                }
            });
        }

        insuranceSummary.total = Math.round(insuranceSummary.total * 100) / 100;
        insuranceSummary.taxes = Math.round(insuranceSummary.taxes * 100) / 100;
        insuranceSummary.base = Math.round(insuranceSummary.base * 100) / 100;

        this.clearError(key);

        this.setState({ passengerInformation, insuranceSummary }, () => {
            if (shouldValidate) {
                this.validateField(key);
            }

            /* Add uplift callback when price get updated */
            if (this.MonthlyPayment.current) {
                this.MonthlyPayment.current.onParameterUpdate('price');
            }
            this.updateCardsAmount();
        });
    }

    updatePetroInformation(petroData) {
        const { paymentInformation: curPayment } = this.state;

        const paymentInformation = Object.assign({}, curPayment);
        const petroInformation = Object.assign({}, paymentInformation.petroInformation, petroData);

        paymentInformation.petroInformation = petroInformation;
        this.setState({ paymentInformation });
    }

    updatePaymentInformation(newPayment, key) {
        const { paymentInformation: curPayment, shouldValidate } = this.state;

        const paymentInformation = Object.assign({}, curPayment, newPayment);

        this.clearError(key);

        this.setState({ paymentInformation }, () => {
            if (shouldValidate) {
                this.validateField(key);
            }
        });
    }

    toggleDetails() {
        this.setState({ showDetails: !this.state.showDetails });
    }

    toggleWishModal() {
        const { showWishModal } = this.state;

        if (checkCookie('PassportUserToken') !== null) {
            this.setState({ showWishModal: !showWishModal });
        } else {
            this.profile.current.toggleModal();
        }
    }

    changeProvince(province) {
        const { passengerInformation } = this.state;
        const { insuranceOptions } = this.props;

        let incomplete = false;
        passengerInformation.forEach((passenger) => {
            if (passenger.year === '' || passenger.month === '' || passenger.day === '') {
                incomplete = true;
            }
        });

        const insuranceSummary = {
            total: 0,
            plans: [],
            taxes: 0,
            base: 0,
        };
        const stateValues = { province };
        if (insuranceOptions.provinces.includes(province)) {
            const insurance = fetch(`/api/checkout/getQuote?sid=${this.props.sid}${!incomplete ? `&passengers=${JSON.stringify(passengerInformation)}` : ''}&province=${province}`);

            insurance
                .then((response) => response.json())
                .then((insuranceInformation) => {
                // const stateValues = {};
                    if (!Object.prototype.hasOwnProperty.call(insuranceInformation, 'error')) {
                        passengerInformation.forEach((passenger, index) => {
                            const insurancePlan = insuranceInformation.plans.find((plan) => plan.planCode === passenger.plan);
                            if (insurancePlan !== undefined) {
                                let summaryPlan = insuranceSummary.plans.find((plan) => plan.code === passenger.plan);
                                if (summaryPlan !== undefined) {
                                    summaryPlan.numberPassengers += 1;
                                } else {
                                    summaryPlan = {
                                        text: insurancePlan.planName,
                                        numberPassengers: 1,
                                        costPer: insurancePlan.passengers[0].planTotal,
                                        code: insurancePlan.planCode,
                                    };

                                    insuranceSummary.plans.push(summaryPlan);
                                }
                                const passengerPlan = insurancePlan.passengers.find(
                                    (plan) => plan.id === index
                                );
                                insuranceSummary.total += parseFloat(passengerPlan.planTotal) || 0;
                                insuranceSummary.taxes += parseFloat(passengerPlan.planTaxes) || 0;
                                insuranceSummary.base += parseFloat(passengerPlan.planPrice) || 0;
                            }
                        });
                        insuranceSummary.total = Math.round(insuranceSummary.total * 100) / 100;
                        insuranceSummary.taxes = Math.round(insuranceSummary.taxes * 100) / 100;
                        insuranceSummary.base = Math.round(insuranceSummary.base * 100) / 100;
                        stateValues.insuranceInformation = insuranceInformation;
                    } else {
                        errorModal(insuranceInformation.error);
                    }
                    stateValues.insuranceSummary = insuranceSummary;

                    this.setState(stateValues);
                });
        } else {
            stateValues.insuranceSummary = insuranceSummary;
            stateValues.insuranceInformation = {};
            this.clearError('insurance');
        }

        this.setState(stateValues);
    }

    validateField(entity) {
        const [key, field] = entity.split('.');
        const parts = key.split('-');
        const { passengerInformation, paymentInformation, province } = this.state;
        const { insuranceOptions } = this.props;

        if (field === 'title') {
            if (passengerInformation[parseInt(parts[1], 10)].title === '') {
                this.addError(key, {
                    id: field,
                    message: `${Lang.trans('customer.title')} ${Lang.trans('error.is_required')}`,
                });
            }
        } else if (field === 'first') {
            const { first } = passengerInformation[parseInt(parts[1], 10)];
            if (first === '' || !/^[A-Za-z-'\u007D-\u00FF\s]+$/i.test(first)) {
                this.addError(key, {
                    id: field,
                    message: `${Lang.trans('customer.first')} ${Lang.trans('error.is_required')}`,
                });
            }
        } else if (field === 'middle') {
            const { middle } = passengerInformation[parseInt(parts[1], 10)];
            if (middle != '' && !/^[A-Za-z-'\u007D-\u00FF\s]+$/i.test(middle)) {
                this.addError(key, {
                    id: field,
                    message: `${Lang.trans('customer.middle')} ${Lang.trans('error.is_invalid')}`,
                });
            }
        } else if (field === 'last') {
            const { last } = passengerInformation[parseInt(parts[1], 10)];
            if (last === '' || !/^[A-Za-z-'\u007D-\u00FF\s]+$/i.test(last)) {
                this.addError(key, {
                    id: field,
                    message: `${Lang.trans('customer.last')} ${Lang.trans('error.is_required')}`,
                });
            }
        } else if (field === 'birth') {
            const passenger = passengerInformation[parseInt(parts[1], 10)];
            if (
                passenger.year === '' ||
                passenger.month === '' ||
                passenger.day === ''
            ) {
                this.addError(key, {
                    id: 'birth',
                    message: `${Lang.trans('customer.date_of_birth')} ${Lang.trans(
                        'error.is_required'
                    )}`,
                });
            }
        } else if (field === 'email') {
            const passenger = passengerInformation[parseInt(parts[1], 10)];
            if (
                passenger.email === '' ||
                !/^\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}\b$/i.test(passenger.email)
            ) {
                this.addError(key, {
                    id: field,
                    message: `${Lang.trans('customer.email')} ${Lang.trans(
                        'error.is_required'
                    )}`,
                });
            }
        } else if (field === 'additional_email') {
            const passenger = passengerInformation[parseInt(parts[1], 10)];
            if (
                passenger.additional_email && passenger.additional_email !== '' &&
                !/^\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}\b$/i.test(passenger.additional_email)
            ) {
                this.addError(key, {
                    id: field,
                    message: `${Lang.trans('customer.additional_email')} ${Lang.trans(
                        'error.is_required'
                    )}`,
                });
            }
        } else if (field === 'phone') {
            const passenger = passengerInformation[parseInt(parts[1], 10)];
            if (
                passenger.phone === '' ||
                !/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/i.test(passenger.phone)
            ) {
                this.addError(key, {
                    id: field,
                    message: `${Lang.trans('customer.phone')} ${Lang.trans(
                        'error.is_required'
                    )}`,
                });
            }
        } else if (field.substring(0, 5) === 'plan-') {
            const [, index] = field.split('-');
            const passengerID = parseInt(index, 10);
            if (
                passengerInformation[passengerID].plan === '' &&
                insuranceOptions.provinces.includes(province)
            ) {
                this.addError(key, {
                    id: field,
                    message: `${
                        ((passengerInformation[passengerID].first ||
                        passengerInformation[passengerID].last) &&
                        `${passengerInformation[passengerID].first} ${passengerInformation[passengerID].last}`) ||
                        `${Lang.trans('common.passenger')} ${passengerID + 1}`
                    } plan ${Lang.trans('error.is_required')}`,
                });
            }
        } else if (field === 'airmiles') {
            const cardnumber = paymentInformation.airmiles.replace(/\D/g, '');
            let valid = true;
            const cardnumberLength = cardnumber.length;
            if (cardnumberLength > 0) {
                if (cardnumberLength > 11 || cardnumberLength < 11) {
                    valid = false;
                } else {
                    let checkDigit;
                    const digitFormulaTotal =
                        parseInt(cardnumber[0], 10) * 6 +
                        parseInt(cardnumber[1], 10) * 5 +
                        parseInt(cardnumber[2], 10) * 4 +
                        parseInt(cardnumber[3], 10) * 3 +
                        parseInt(cardnumber[4], 10) * 8 +
                        parseInt(cardnumber[5], 10) * 7 +
                        parseInt(cardnumber[6], 10) * 6 +
                        parseInt(cardnumber[7], 10) * 5 +
                        parseInt(cardnumber[8], 10) * 4 +
                        parseInt(cardnumber[9], 10) * 3;
                    const remainder = digitFormulaTotal % 11;
                    if (remainder < 2) {
                        checkDigit = 0;
                    } else {
                        checkDigit = 11 - remainder;
                    }
                    if (checkDigit !== parseInt(cardnumber[10], 10)) {
                        valid = false;
                    }
                }
            }
            if (!valid) {
                this.addError(key, {
                    id: field,
                    message: Lang.trans('airmiles.airmiles_number_error'),
                });
            }
        } else if (field === 'terms') {
            if (paymentInformation.terms === '') {
                this.addError(key, {
                    id: field,
                    message: Lang.trans('error.need_check_terms_first'),
                });
            }
        } else if (key === 'act') {
            const checkQuestError = this.refActQuest.current.validate();
            if (checkQuestError) {
                this.addError(key, {
                    id: field,
                    message: '',
                });
            } else {
                this.clearError(key);
            }
        }
    }

    addError(key, error) {
        const { errors } = this.state;
        // const errors = Object.assign({}, curErrors);

        // add error to key array
        if (!Object.prototype.hasOwnProperty.call(errors, key)) {
            errors[key] = {};
        }

        errors[key][error.id] = error;

        // replace state
        this.setState({
            errors,
        });
    }

    clearError(entity) {
        const { errors: curErrors } = this.state;
        const [key, field] = entity.split('.');
        const errors = Object.assign({}, curErrors);

        if (
            Object.prototype.hasOwnProperty.call(errors, key) &&
            Object.prototype.hasOwnProperty.call(errors[key], field)
        ) {
            delete errors[key][field];

            const keys = Object.keys(errors[key]);
            if (keys.length === 0) {
                delete errors[key];
            }
        } else if (field === undefined) {
            delete errors[key];
        }
        this.setState({
            errors,
        });
    }

    changeCoupon(code) {
        const {
            verifyInformation: currentVerifyInformation,
            passengerInformation,
        } = this.state;
        const { sid } = this.props;

        const verifyInformation = Object.assign({}, currentVerifyInformation);

        if (code === '') {
            const couponRequest = fetch('/api/coupon/remove-coupon', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sid: sid }),
            });

            couponRequest
                .then((response) => response.json())
                .then((data) => {
                    if (data.error) {
                        errorModal(data.error);
                    }
                });

            delete verifyInformation.coupon;
            this.setState({ verifyInformation }, () => {
                this.updateCardsAmount();
            });
        } else {
            // here is where the API request will be
            const couponRequest = fetch(`/api/coupon/verify-coupon?sid=${sid}&couponCode=${code}&validate=true`);

            couponRequest
                .then((response) => response.json())
                .then((data) => {
                    if (data.error) {
                        errorModal(data.error);
                    } else {
                        const coupon = {
                            code: data.content.code,
                            costs: {
                                base: 0,
                                value: -data.content.value,
                                taxes: 0,
                                fare: -data.content.value / passengerInformation.length,
                            },
                        };
                        verifyInformation.coupon = coupon;

                        this.setState({ verifyInformation }, () => {
                            this.updateCardsAmount();
                        });
                    }
                });
        }
    }

    fetchCarTerms() {
        const { terms, verifyInformation } = this.state;

        if (terms.length === 0 && verifyInformation.car) {
            const { sid } = this.props;
            const params = {
                resultId: verifyInformation.car.resultId,
                inclusive: verifyInformation.car.rate.inclusive,
                sid,
            };

            const queryString = buildQueryString(params);
            const url = `/api/car/terms?${queryString}`;

            fetch(url).then((response) => response.json())
                .then((data) => {
                    this.setState({ terms: data.terms, redbook: data.redbook });
                });
        }
        this.setState({ termsModalOpen: true });
    }

    toggleTermsModal() {
        const { termsModalOpen } = this.state;
        const toggled = !termsModalOpen;

        const updateState = {
            termsModalOpen: toggled,
        };

        if (!toggled) {
            updateState.terms = [];
            updateState.redbook = [];
        }

        this.setState(updateState);
    }

    setActiveTermsTab(activeTermsTab) {
        this.setState({ activeTermsTab });
    }

    submitPurchase() {
        const {
            passengerInformation,
            insuranceInformation,
            insuranceSummary,
            province,
            verifyInformation,
            errors,
            cardsAmount,
            paymentCheck,
            redeemAmount,
            choose,
        } = this.state;
        const { sid, parameters, features } = this.props;

        // const isActivityStandalone = parameters.selectedProducts === 'A';

        // Validate Passengers
        passengerInformation.forEach((passenger, index) => {
            // if (!isActivityStandalone) {
            //     this.validateField(`passenger-${index}.title`);
            //     this.validateField(`passenger-${index}.birth`);
            // }
            this.validateField(`passenger-${index}.title`);
            this.validateField(`passenger-${index}.birth`);
            this.validateField(`passenger-${index}.first`);
            this.validateField(`passenger-${index}.middle`);
            this.validateField(`passenger-${index}.last`);
            if (features.manulife && parameters.selectedProducts.length !== 1) {
                this.validateField(`insurance.plan-${index}`);
            }
        });
        this.validateField('passenger-0.email');
        this.validateField('passenger-0.phone');
        this.validateField('airmiles.airmiles');
        if (window.points === 'cibc') {
            this.validateField('passenger-0.additional_email');
        }

        if (this.refActQuest.current) {
            this.validateField('act.questions');
        }

        let addInsCheck = true;
        let addInsInfo = null;
        if (this.refCibcInsurance) {
            const { cibcInsInvalid, cibcInsInfo } = this.refCibcInsurance.validateInsurace();
            addInsCheck = !cibcInsInvalid;
            addInsInfo = cibcInsInfo;
        }

        let upliftError = false;
        let creditCards = null;
        let paymentErrorCount = 0;
        if (this.MonthlyPayment.current && paymentCheck === 'radioPayMonthly') {
            /* Uplift Check  */
            const monthlyPayment = this.MonthlyPayment.current.getInfo();
            if (!monthlyPayment) {
                upliftError = true;
                const error = {
                    message: 'Please complete your monthly payment application first!',
                };
                errorModal(error);
            } else {
                creditCards = [monthlyPayment];
            }
        } else {
            creditCards = this.paymentCards.map((card, index) => {
                const { data, errorStatus } = card.getInfo();
                if (errorStatus) {
                    paymentErrorCount += 1;
                }
                return Object.assign({}, { amount: cardsAmount[index] }, data);
            });
        }
        this.validateField('terms.terms');

        const keys = Object.keys(errors);
        if (
            (keys.length === 0 ||
                (keys.length === 1 &&
                keys[0] === 'insurance' &&
                Object.prototype.hasOwnProperty.call(errors.insurance, 'failed'))) &&
            paymentErrorCount === 0 &&
            !upliftError && addInsCheck
        ) {
            const { paymentInformation } = this.state;
            const paymentDetail = Object.assign(
                {},
                { paymentMethod: paymentCheck === 'radioPayMonthly' ? 'loan' : 'normal' },
                paymentInformation,
                { creditCards },
                { redeemAmount },
            );

            insuranceSummary.province = province;

            const insInfo = addInsInfo || insuranceInformation;
            const costs = {};
            if (choose && Object.prototype.hasOwnProperty.call(verifyInformation, 'choose')) {
                costs.choose =  verifyInformation.choose.price;
            }

            if (Object.prototype.hasOwnProperty.call(verifyInformation, 'addon')) {
               costs.addon = verifyInformation.addon.totalAmount;   
            }
            
            const request = {
                passengerInformation,
                paymentInformation: paymentDetail,
                costs: Object.assign(costs, verifyInformation.cost),
                insuranceInformation: insInfo,
                insuranceSummary,
                sid,
            };

            if (this.refActQuest.current) {
                const answers = this.refActQuest.current.getAnswers();
                if (Object.keys(answers).length) {
                    request.activityAnswers = answers;
                }
            }

            // request.costs.total += insuranceSummary.total;
            this.setState({ isBooking: true });
            // Adobe Launch
            _satellite.track('cart - checkout');
            // Adobe Launch
            fetch('/api/checkout/book', {
                method: 'POST',
                body: JSON.stringify(request),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (
                        typeof data === 'object' &&
                        Object.prototype.hasOwnProperty.call(data, 'error')
                    ) {
                        if (data.error.code === 'V1') {
                            customModal({
                                message: data.error.message,
                                buttons: [
                                    {
                                        text: 'Submit',
                                        type: 'secondary',
                                        onClick: () => {
                                            const form = document.getElementById('ses_exiredForm');
                                            form.submit();
                                        },
                                    },
                                ],
                            });
                        } else {
                            errorModal(data.error);
                            this.setState({ isBooking: false });
                        }
                    } else {
                        window.location.href = `${data}?sid=${sid}`;
                    }
                });
        } else {
            this.setState({ shouldValidate: true, scrollToError: true });
        }
    }

    /* Uplift Part added functions  */
    /* Start */
    sidebarMonthlyShowCallback(monthlyPaymentStatus) {
        this.setState({ monthlyPaymentStatus });
    }
    /* Uplift added end */

    checkValidPaxInfo() {
        const { passengerInformation } = this.state;
        // Validate Passengers
        passengerInformation.forEach((passenger, index) => {
            this.validateField(`passenger-${index}.title`);
            this.validateField(`passenger-${index}.first`);
            this.validateField(`passenger-${index}.middle`);
            this.validateField(`passenger-${index}.last`);
            this.validateField(`passenger-${index}.birth`);
        });
        this.validateField('passenger-0.email');
        this.validateField('passenger-0.phone');
        return this.getPaxInfo();
    }

    gotoFirstErrorField() {
        this.setState({ shouldValidate: true, scrollToError: true });
    }

    buildProductOrder() {
        const { verifyInformation, insuranceSummary } = this.state;
        const { flight, hotel, car } = verifyInformation;
        const myorder = {};

        const insAmount = insuranceSummary.total;
        const { plans } =  insuranceSummary;
        let numOfPaxIns = 0;
        const insSelectedNames = [];
        plans.forEach(item=>{
            numOfPaxIns += item.numberPassengers;
            for(var i=0; i<item.numberPassengers; i++){
                insSelectedNames.push('travel');
            }

        });

        if (hotel !== undefined) {
            const checkinDate = moment(hotel.checkin).format('YYYYMMDD');
            const checkoutDate = moment(hotel.checkout).format('YYYYMMDD');
            myorder.hotel_reservations = [
                {
                    hotel_name: hotel.name,
                    check_in: checkinDate, // String in YYYMMDD format. Generally, check_in date must be > 10 days out from current date to receive an offer
                    check_out: checkoutDate,
                    number_of_rooms: 1,
                    reservation_type: 'standard',
                    hotel_rating:hotel.rating,
                    room_type:hotel.room,
                },
            ];
        }

        if (flight !== undefined) {
            const outBound = flight[0];
            const inBound = flight[1];
            const itineraryOut = outBound.legs.map(airOutBound=> {
                const deptDate =   airOutBound["departureDatetime"].split("T")[0].replace(/-/g,'');
                const arrvDate =   airOutBound["arrivalDatetime"].split("T")[0].replace(/-/g,'');
                return {
                    departure_apc: airOutBound["departureCode"], // 3-letter airport code
                    arrival_apc: airOutBound["destinationCode"], // 3-letter airport code
                    departure_time: deptDate, // YYYYMMDD
                    arrival_time: arrvDate, // YYYYMMDD
                    fare_class: airOutBound["class"],
                    carrier_code: airOutBound["carrierCode"],
                    airline_name: airOutBound["carrier"],
                  };
            });

            const itineraryIn = inBound.legs.map(airOutBound=>{
                const deptDate =   airOutBound["departureDatetime"].split("T")[0].replace(/-/g,'');
                const arrvDate =   airOutBound["arrivalDatetime"].split("T")[0].replace(/-/g,'');
                return {
                        departure_apc: airOutBound["departureCode"], // 3-letter airport code
                        arrival_apc: airOutBound["destinationCode"], // 3-letter airport code
                        departure_time: deptDate, // YYYYMMDD
                        arrival_time: arrvDate, // YYYYMMDD
                        fare_class: airOutBound["class"],
                        carrier_code: airOutBound["carrierCode"],
                        airline_name: airOutBound["carrier"],
                      };
                });
            const air_reservations = [
              {
                trip_type: "roundtrip",
                itinerary: [...itineraryOut,...itineraryIn],
                insurance: [
                  {
                    "types":insSelectedNames,
                    "price_per_person": insAmount? parseInt(insAmount * 100/numOfPaxIns):0,
                    "price": parseInt(insAmount * 100)
                  }
                ]   
              },
            ];
            myorder.air_reservations = air_reservations;
        }

        if (car !== undefined) {
            myorder.car_reservations = [{
                car_name: car.name,
                pickup: car.pickupDate,
                dropoff: car.dropoffDate,
            }];
        }

        // Adobe Launch
        if (hotel !== undefined) {
            window.digitalData.product = [];
            window.digitalData.product.push({
                productId: verifyInformation.hotel.id,
                productName: verifyInformation.hotel.name,
                productCategory: 'hotels',
            });
        }
        if (flight !== undefined) {
            let flightId = '';
            verifyInformation.flight.forEach((flightData, flightIndex) => {
                flightData.legs.forEach((flightLegs) => {
                    flightId = flightId + flightLegs.carrierCode + flightLegs.flightNumber;
                });
                flightId += flightIndex;
            });
            window.digitalData.product.push({
                productId: flightId,
                productName: flightId,
                productCategory: 'flights',
            });
            _satellite.track('cart_view', window.digitalData.product);
        } else if (hotel !== undefined) {
            _satellite.track('cart_view', verifyInformation.hotel.id);
        }

        // Adobe Launch
        return myorder;
    }
    /* Uplift added end */

    /* Multiple Payment */
    mainCardAmountChangeCallback(amount) {
        /* Airmiles will not call this at all  */
        const {
            verifyInformation,
            insuranceSummary,
            redeemAmount,
            twoPaymentCheck,
            choose,
        } = this.state;

        if (twoPaymentCheck) {
            const discountRate = Object.prototype.hasOwnProperty.call(verifyInformation, 'coupon') && verifyInformation.coupon.costs !== undefined ? verifyInformation.coupon.costs.value : 0;
            const addonRate = Object.prototype.hasOwnProperty.call(verifyInformation, 'addon') ? verifyInformation.addon.totalAmount : 0;
            const totalAmount = Math.max((verifyInformation.cost ? verifyInformation.cost.total : 0) + discountRate + addonRate, 0) + insuranceSummary.total + (choose && verifyInformation.choose ? verifyInformation.choose.price : 0);
            const deposit = verifyInformation.cost.deposit ? verifyInformation.cost.deposit + insuranceSummary.total + (choose && verifyInformation.choose ? verifyInformation.choose.price : 0) : 0;
            let newTotal = deposit || totalAmount;
            if (redeemAmount > 0) {
                newTotal -= redeemAmount;
            }
            const otherPayment = newTotal - amount;
            const cardsAmount = [amount, otherPayment.toFixed(2)];
            this.setState({ cardsAmount });
        }
    }

    updateCardsAmount() {
        const {
            verifyInformation,
            insuranceSummary,
            redeemAmount,
            twoPaymentCheck,
            choose,
        } = this.state;
        
        const discountRate = Object.prototype.hasOwnProperty.call(verifyInformation, 'coupon') && verifyInformation.coupon.costs !== undefined ? verifyInformation.coupon.costs.value : 0;
        const deposit = verifyInformation.cost.deposit || 0;
        const addonRate = Object.prototype.hasOwnProperty.call(verifyInformation, 'addon') ? verifyInformation.addon.totalAmount : 0;
        const totalAmount = Math.max((verifyInformation.cost ? verifyInformation.cost.total : 0) + discountRate + addonRate, 0);
        let amount = deposit || totalAmount;
        // insuranceSummary.total
        if (redeemAmount > 0) {
            amount -= redeemAmount;
        }

        let cardsAmount = [amount + insuranceSummary.total + (choose && verifyInformation.choose ? verifyInformation.choose.price : 0), 0];
        if (twoPaymentCheck) {
            if (insuranceSummary.total < amount) {
                amount += insuranceSummary.total;
                cardsAmount = [amount / 2, amount / 2];
            } else {
                cardsAmount = [insuranceSummary.total, amount];
            }
        }
        this.setState({ cardsAmount });
    }

    generatePayments() {
        const {
            verifyInformation,
            insuranceSummary,
            twoPaymentCheck,
            cardsAmount,
            payments,
            choose,
        } = this.state;
        const { localization, site, parameters } = this.props;
        const isStandalone = parameters.selectedProducts.length === 1;
        this.paymentCards = [];
        const formPays = [];
        const discountRate = Object.prototype.hasOwnProperty.call(verifyInformation, 'coupon') && verifyInformation.coupon.costs !== undefined ? verifyInformation.coupon.costs.value : 0;
        const addonRate = Object.prototype.hasOwnProperty.call(verifyInformation, 'addon')
            ? verifyInformation.addon.fare
            : 0;
        const totalAmount = Math.max((verifyInformation.cost ? verifyInformation.cost.total : 0) + discountRate + addonRate, 0) + insuranceSummary.total + (choose && verifyInformation.choose ? verifyInformation.choose.price : 0);
        const deposit = verifyInformation.cost.deposit ? verifyInformation.cost.deposit + insuranceSummary.total + (choose && verifyInformation.choose ? verifyInformation.choose.price : 0) : 0;

        let cardTotalAmount = cardsAmount[0] + cardsAmount[1];
        cardTotalAmount = parseFloat(cardTotalAmount.toFixed(2), 2);

        const paymentElements = payments.map((payment, index) => {
            const key = `paymentcard-${index}`;
            return index === 0 || (index === 1 && twoPaymentCheck) ? (
                <CreditCards
                    ref={(element) => {
                        formPays.push(element);
                    }}
                    key={key}
                    idx={index}
                    min={insuranceSummary.total}
                    max={deposit || totalAmount}
                    initTotal={cardsAmount[index]}
                    vendor={null}
                    localization={localization}
                    currency={verifyInformation.cost.currency}
                    mainCardAmountChangeCallback={this.mainCardAmountChangeCallback}
                    twoPaymentCheck={twoPaymentCheck}
                    isStandalone={isStandalone}
                />
            ) : null;
        });
        this.paymentCards = formPays;

        return cardTotalAmount > 0 ? (
            <section className="rounded-sm p-3 mb-3 box-shadow bg-white">
                <div className="d-flex justify-content-between">
                    <div className="d-flex align-items-center primary-color">
                        <div className="mr-2 mt-2 d-none">
                            <svg
                                className="icon-md"
                                width="100%"
                                height="100%"
                                xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                            >
                                <use xlinkHref="/img/icons/icon-defs.svg#icon-dollar-sign-circle" />
                            </svg>
                        </div>
                        <h5 className="m-0 font-weight-bold">{Lang.trans('billing.payment_information')}</h5>
                    </div>
                    <div className="text-right">
                        <span className="mr-1">{Lang.trans('billing.secured_by')}</span>
                        <a
                            className="mr-2"
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            href={`https://www.mcafeesecure.com/RatingVerify?ref=www.${site}`}
                        >
                            <img
                                className="mcafee"
                                src="//images.scanalert.com/meter/www.redtag.ca/13.gif"
                                alt=""
                            />
                        </a>
                    </div>
                </div>
                <div className="text-capitalize mt-3 payment-section-heading">
                    <img className="icon mr-2" src="https://travel-img-assets.s3-us-west-2.amazonaws.com/logos/secure-transmission.svg" alt="Secure Transmission" />
                    We use secure transmission &amp; protect your personal information
                </div>
                <div className="my-3">
                    <div className="payment-section-sub-header">We accept all major credit cards</div>
                    <div className="mt-2">
                        <img className="mr-1" width="60" height="60" src="https://travel-img-assets.s3-us-west-2.amazonaws.com/logos/visa.svg" alt="Visd" />
                        <img className="mr-1" width="60" height="60" src="https://travel-img-assets.s3-us-west-2.amazonaws.com/logos/mastercard.svg" alt="Master Card" />
                        {/*<img className="mr-1" width="60" height="60" src="https://travel-img-assets.s3-us-west-2.amazonaws.com/logos/discover.svg" alt="Discover" />*/}
                        <img className="mr-1" width="60" height="60" src="https://travel-img-assets.s3-us-west-2.amazonaws.com/logos/american-express.svg" alt="American Express" />
                    </div>
                </div>
                {!this.state.disableMultiCard ? (
                    <div className="mb-3 mt-3">
                        <div className="styled-checkbox theme-3 ">
                            <input
                                type="checkbox"
                                id="creditCard"
                                name=""
                                value=""
                                checked={this.state.twoPaymentCheck}
                                onChange={this.handleCreditCardCheck}
                            />
                            <label htmlFor="creditCard">
                                <span>{Lang.trans('billing.pay_with_separate_cards')}</span>
                            </label>
                        </div>
                    </div>
                ) : null} 
                {paymentElements}
            </section>
        ) : null;
    }
    /*  Multiple Payment End */

    render() {
        const {
            passengerInformation,
            verifyInformation,
            insuranceInformation,
            paymentInformation,
            insuranceSummary,
            errors,
            monthlyPaymentStatus,
            paymentCheck,
            province,
            showDetails,
            isBooking,
            redbook,
            choose,
            termsModalOpen,
            terms,
            activeTermsTab,
            redeemAmount,
            cibcInsurance,
            showWishModal,
            showMultiPayment,
            membershipAccountRedeemAmount,
            watcher,
        } = this.state;

        let { hasFlight } = this.state;
        if (!Object.prototype.hasOwnProperty.call(verifyInformation, 'flight')) hasFlight = false;

        const {
            parameters,
            tripInformation,
            sid,
            insuranceOptions,
            breadcrumbs,
            user,
            site,
            features,
            profileConfig,
        } = this.props;

        const {
            coupon = {},
            hasDeposit = false,
            depositDuration = 5,
        } = verifyInformation;

        const products = Object.keys(breadcrumbs);

        if (features.addon) {
            breadcrumbs.review = true;
        }

        const isStandalone = parameters.selectedProducts.length === 1;
        const departureParts = !isStandalone && parameters.departure !== undefined ? parameters.departure.text2.split(', ') : '';
        const destinationParts = parameters.destination !== undefined ? parameters.destination.text.split(', ') : '';

        const {showUpliftOption, disable, cardInfor} = monthlyPaymentStatus;
        const showUpliftSidebar = !showUpliftOption || disable ? "hide": "";
        const discountRate = Object.prototype.hasOwnProperty.call(verifyInformation, 'coupon') && verifyInformation.coupon.costs !== undefined ? verifyInformation.coupon.costs.value : 0;
        const addonRate = Object.prototype.hasOwnProperty.call(verifyInformation, 'addon')? verifyInformation.addon.totalAmount: 0;
        const totalAmount = Math.max((verifyInformation.cost ? verifyInformation.cost.total : 0) + discountRate + addonRate, 0) + insuranceSummary.total + (choose && verifyInformation.choose ? verifyInformation.choose.price : 0);
        const depositAmount = hasDeposit ? 50 * passengerInformation.length + insuranceSummary.total : 0;

        let dueDate = moment(parameters.depDate).subtract(depositDuration, 'days');
        const today = moment();
        if (dueDate.format('YYYY-MM-DD') < today.format('YYYY-MM-DD')) {
            dueDate = today;
        }

        const refundableDate = verifyInformation.hotel !== undefined && verifyInformation.hotel.refundable !== undefined ? moment(verifyInformation.hotel.refundable) : null;

        const flightData = {};
        if (verifyInformation.flight) {
            const depFlight = verifyInformation.flight[0];
            const depDate = new Date(depFlight.departureDatetime);
            const retFlight = verifyInformation.flight[1];
            const retDate = new Date(retFlight.departureDatetime);

            flightData.depDate = `${depDate.toDateString()} at ${depDate.toLocaleTimeString('en-US')}`;
            flightData.retDate = `${retDate.toDateString()} at ${retDate.toLocaleTimeString('en-US')}`;
            flightData.legStops = [(depFlight.legs.length - 1), (retFlight.legs.length - 1)];
        }

        // uplift vars needed
        // const minDepositAmount = 100;
        // const dueDate = moment().format('MMM Do YYYY');

        let enableChoose = features.choose;
        if (paymentCheck === 'radioPayMonthly') {
            enableChoose = false;
        }

        let grandTotalFromCard = totalAmount;
        if (redeemAmount > 0) {
            grandTotalFromCard -= redeemAmount;
            grandTotalFromCard = parseFloat(grandTotalFromCard.toFixed(2), 2);
        }

        let disablePurchaseBtn = false;
        if (paymentCheck === 'radioPayMonthly' && !cardInfor) {
            disablePurchaseBtn = true;
        }

        let showActCancelPolicy = false;
        let activityResults = [];
        if (isStandalone && verifyInformation && Object.prototype.hasOwnProperty.call(verifyInformation, 'addon') && Object.prototype.hasOwnProperty.call(verifyInformation.addon, 'activity')) {
            activityResults = Object.values(verifyInformation.addon.activity.results);
            for (let i = 0; i < activityResults.length; i++) {
                const item = activityResults[i];
                if (item.selectDate.cancellationPolicies && item.selectDate.cancellationPolicies.length) {
                    showActCancelPolicy = true;
                    break;
                }
            }
        }

        return (
            <>
                {(features !== undefined && profileConfig !== undefined && features.profile) && (
                    <>
                        <Profile element="pro_section" config={profileConfig}/>
                        <Profile element="pro_section_mobile" config={profileConfig}/>
                    </>
                )}
                <BookingSteps steps={breadcrumbs} active="checkout" isStandalone={isStandalone} />
                <div className="border-top py-4 bg-white">
                    <div className="container pl-md-0 pr-md-0 pt-2 pb-2">
                        <div className="h1 font-weight-bold text-secondary">
                            {!isStandalone && (
                                <>
                                    {departureParts[0]}
                                    <svg className="icon-md mx-3">
                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-double-arrow" />
                                    </svg>
                                </>
                            )}
                            {destinationParts[0]}
                        </div>
                        <div className="payment-package-text h6">
                            <div className="d-inline-flex align-items-center">
                                <svg className="icon">
                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-wall-clock" />
                                </svg>
                                <span className="ml-2">
                                    <strong>Act Fast! </strong>
                                    Price and Availability May Change
                                </span>
                            </div>
                            {isStandalone && refundableDate && (
                                <div className="d-inline-flex align-items-center ml-md-3">
                                    <svg className="icon">
                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-free-cancle" />
                                    </svg>
                                    <span className="ml-2">
                                        <strong>Free Cancellation </strong>
                                        Until {refundableDate.format('MMMM. DD, YYYY')}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="container pl-md-0 pr-md-0">
                    <div className="row">
                        <div className="container border-bottom d-lg-none pl-md-0 pr-md-0 pt-2 pb-2 d-flex justify-content-between">
                            <div className="payment-mobile-price">
                                {verifyInformation.cost &&
                                `Total U${priceFormat(totalAmount)}`}
                            </div>
                            <button
                                type="button"
                                className="btn-underline-link"
                                onClick={this.toggleDetails}
                            >
                                <span className="open-details">
                                    {Lang.trans('common.confirm_details')}
                                </span>
                                <span className="close-details d-none">Close Details</span>
                            </button>
                        </div>
                        <Collapse
                            isOpen={showDetails}
                            id="price-sidebar"
                            className="col-12 col-lg-5 col-xl-4 order-lg-last d-lg-inline-block mt-3"
                        >
                            <div className="d-none d-lg-block">
                                {verifyInformation.cost && (
                                    <PriceDropAlert paymentInformation={verifyInformation} />
                                )}
                            </div>
                            {verifyInformation.cost && UPLIFT_FEATURE && showMultiPayment &&  (
                                <UpliftSidebarWidget
                                    mobile={false}
                                    upliftEnable={this.upliftEnable}
                                    minDepositOnly={hasDeposit}
                                    showUpliftSidebar={showUpliftSidebar}
                                    minDepositAmount={depositAmount}
                                    dueDate={dueDate.format('MMM Do YYYY')}
                                    totalAmount={totalAmount.toFixed(2)}
                                    watchedParams={{ toggle: this.toggleWishModal, isWatched: (verifyInformation.hotel && verifyInformation.hotel.watched) }}
                                    
                                />
                            )}
                            {(verifyInformation.cost && (
                                <div className="rounded-sm box-shadow bg-white">
                                    <div className="p-3">
                                        {verifyInformation.hotel && (
                                            <HotelSummary
                                                sid={sid}
                                                hotelDetails={verifyInformation.hotel}
                                                isStandalone={isStandalone}
                                                customHotelDates={parameters.customHotelDates}
                                            />
                                        )}
                                        {!isStandalone && (
                                            <FlightSummary
                                                sid={sid}
                                                flightDetails={verifyInformation.flight}
                                                notes={verifyInformation.notes.flights || []}
                                            />
                                        )}
                                        {verifyInformation.car && (<CarSummary sid={sid} car={verifyInformation.car} notes={verifyInformation.notes.cars || []} />)}
                                    </div>
                                    {
                                        Object.prototype.hasOwnProperty.call(verifyInformation, 'addon') &&
                                        Object.prototype.hasOwnProperty.call(verifyInformation.addon, 'transfer') && (
                                            <TransferSummary
                                                step="payment"
                                                sid={sid}
                                                selectedList={verifyInformation.addon.transfer}
                                            />
                                        )
                                    }
                                    
                                    <PriceSummary
                                        showUpliftSidebar={paymentCheck === "radioPayMonthly"?showUpliftSidebar:'hide'}
                                        redeemAmount={redeemAmount}
                                        pointsConvertRate={SITE_KEY === 'cibc' ? 100 : (SITE_KEY === 'hsbc' ? 1000 : 0)}
                                        packageInformation={verifyInformation.cost}
                                        addonInformation={Object.prototype.hasOwnProperty.call(verifyInformation, 'addon') ? verifyInformation.addon : null}
                                        discounts={paymentInformation.petroInformation.redeemDollarAmount}
                                        chooseInformation={Object.prototype.hasOwnProperty.call(verifyInformation, 'choose') && choose && verifyInformation.choose ? verifyInformation.choose : null}
                                        discountDueDate={dueDate.format('MMMM Do YYYY')}
                                        coupon={verifyInformation.coupon || {}}
                                        transfer={verifyInformation.transfer || null}
                                        activity={verifyInformation.activity || null}
                                        insuranceInformation={features.manulife ? insuranceSummary : null}
                                        products={products}
                                        isStandalone={isStandalone}
                                    />
                                </div>
                            )) || <SidebarLoader />}
                            {/* <div className="mb-5">
                                <CouponInput
                                    onChange={this.changeCoupon}
                                    coupon={coupon.code || ''}
                                />
                            </div> */}
                            <WhyBook isStandalone={isStandalone} site={site} />
                        </Collapse>
                        <div className="col-12 col-lg-7 col-xl-8 pt-3 order-lg-first payment-form-section payment-form">
                            <div className="d-lg-none">
                                {verifyInformation.cost && (
                                    <PriceDropAlert paymentInformation={verifyInformation} />
                                )}
                            </div>
                            {verifyInformation.cost && UPLIFT_FEATURE && (
                                <UpliftSidebarWidget
                                    mobile
                                    minDepositOnly={hasDeposit}
                                    upliftEnable={this.upliftEnable}
                                    showUpliftSidebar={showUpliftSidebar}
                                    minDepositAmount={depositAmount}
                                    dueDate={dueDate.format('MMM Do YYYY')}
                                    totalAmount={totalAmount.toFixed(2)}
                                    watchedParams={{ toggle: this.toggleWishModal, isWatched: (verifyInformation.hotel && verifyInformation.hotel.watched) }}
                                />
                            )}
                            { verifyInformation.cost && window.points === 'cibc' && this.generateCibc()}
                            { Object.prototype.hasOwnProperty.call(verifyInformation, 'addon') &&
                                Object.prototype.hasOwnProperty.call(verifyInformation.addon, 'activity') && (
                                    <ActivityPaymentDetail
                                        step="payment"
                                        sid={sid}
                                        isStandalone={isStandalone}
                                        selectedList={verifyInformation.addon.activity}
                                        removeOpt={null}
                                        ref={this.refActQuest}
                                    />
                                )
                            }
                            
                            <TravellerInformation
                                passengerInformation={passengerInformation}
                                onPassengerUpdate={this.updatePassengerInformation}
                                errors={errors}
                                isStandalone={isStandalone}
                                selectedProducts={this.props.parameters.selectedProducts}
                            />
                            {features.manulife && !isStandalone && (
                                <InsuranceOptions
                                    insuranceOptions={insuranceOptions}
                                    insuranceInformation={insuranceInformation}
                                    passengerInformation={passengerInformation}
                                    onPassengerUpdate={this.updatePassengerInsurance}
                                    updateProvince={this.changeProvince}
                                    province={province}
                                    errors={errors.insurance || {}}
                                />
                            )}
                            
                            {verifyInformation.cost && window.points === 'airmiles' && !isStandalone && (
                                <AirmilesAccept
                                    baseRate={Math.max(0, verifyInformation.cost.baseRate)}
                                    cardNumber={paymentInformation.airmiles}
                                    errors={errors.airmiles}
                                    onChange={this.updatePaymentInformation}
                                />
                            )}
                            {verifyInformation.cost && window.points === 'petro' && (
                                // <PetroAccept baseRate={verifyInformation.cost.baseRate} cardNumber={paymentInformation.petro} errors={errors.petro} onChange={this.updatePaymentInformation} onSubmit={this.submitPetro} />
                                <PetroAccept
                                    totalBase={verifyInformation.cost.baseRate}
                                    minDepositCheck={false}
                                    minDepositAmount={0}
                                    petroChangeCallback={this.updatePetroInformation}
                                    grandTotal={verifyInformation.cost.total + insuranceSummary.total}
                                />
                            )}

                            {window.points === 'hsbc' && verifyInformation.cost && (
                                <HsbcRedeemWidget
                                    memberAccount={user}
                                    totalBase={parseFloat(verifyInformation.cost.total, 2)}
                                    grandTotal={parseFloat(grandTotalFromCard, 2)}
                                    redeemChange={this.membershipAccountChangeCallback}
                                />
                            )}
                            {window.points === 'cibc' && verifyInformation.cost && (
                                <CibcRedeemWidget
                                    memberAccount={user}
                                    totalBase={parseFloat(verifyInformation.cost.total, 2)}
                                    grandTotal={parseFloat(verifyInformation.cost.total, 2)}
                                    redeemChange={this.membershipAccountChangeCallback}
                                />
                            )}

                            {window.points === 'cibc' && (
                                <CibcInsurance
                                    ref={(e) => this.refCibcInsurance = e}
                                    shadow
                                    default={cibcInsurance}
                                />
                            )}

                            {enableChoose && verifyInformation.choose && (
                                <div className=" rounded-sm p-3 mb-3 box-shadow bg-white">
                                    <div className="">
                                        <div className="d-flex align-items-center primary-color">
                                            <h5 className="m-0 font-weight-bold">Offset Your Carbon Footprint</h5>
                                        </div>
                                        <div>
                                            <p className="my-2">
                                                We have partnered with the climate company CHOOOSE to make it easy for you to offset your carbon footprint when flying with us. Your contribution will be used to directly support CO2- reducing projects certified by the United Nations and Gold Standard. <a href="https://www.copolo.com/climate-change" target="_blank" rel="noreferrer">Read More</a>
                                            </p>
                                            <div className="w-100 align-items-center d-flex justify-content-between">
                                                <div className="styled-checkbox theme-3">
                                                    <input
                                                        type="checkbox"
                                                        id="chs_accept"
                                                        value="confirmed"
                                                        checked={choose}
                                                        onChange={this.setChoose}
                                                    />
                                                    <label htmlFor="chs_accept">
                                                        <span>
                                                            Yes, I want to offset the carbon footprint of my {hasFlight ? 'flight' : 'hotel'} by paying USD {priceFormat(verifyInformation.choose.price)}.
                                                        </span>
                                                    </label>
                                                </div>
                                                <div className="pt-2 pt-md-0">
                                                    <img width="120" height="31" src="https://travel-img-assets.s3.us-west-2.amazonaws.com/logos/logo-choose.png" alt="choose logo" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {UPLIFT_FEATURE && verifyInformation.cost && grandTotalFromCard > 0 && showMultiPayment && (
                                <PaymentWithUplift
                                    ref={this.MonthlyPayment}
                                    sidebarMonthlyShowCallback={this.sidebarMonthlyShowCallback}
                                    upliftEnable={this.upliftEnable}
                                    minDepositOnly={hasDeposit}
                                    minDepositAmount={depositAmount}
                                    dueDate={dueDate.format('MMM Do YYYY')}
                                    totalAmount={grandTotalFromCard.toFixed(2)}
                                    handleOtherPaymentChange={this.handleOtherPaymentChange}
                                    paymentCheck={paymentCheck}
                                    passengers={passengerInformation}
                                    getPaxInfo={this.getPaxInfo}
                                    checkValidPaxInfo={this.checkValidPaxInfo}
                                    buildProductOrder={this.buildProductOrder}
                                    depDate={parameters.depDate}
                                    touroptCode={null}
                                    gotoFirstErrorField={this.gotoFirstErrorField}
                                />
                            )}

                            {verifyInformation.cost && (
                                <>
                                    {paymentCheck !== 'radioPayMonthly' && this.generatePayments()}
                                    {verifyInformation.hotel && verifyInformation.hotel.mandatory.length > 0 && (
                                        <InformationSection
                                            title={Lang.trans('vacations.mandatory_info')}
                                            content={verifyInformation.hotel.mandatory}
                                        />
                                    )}
                                    {verifyInformation.hotel && verifyInformation.hotel.checkInInstructions.length > 0 && (
                                        <InformationSection
                                            title="Check-in Instructions"
                                            content={verifyInformation.hotel.checkInInstructions}
                                        />
                                    )}

                                    {isStandalone && verifyInformation.hotel && verifyInformation.hotel.cancellationPolicy.length > 0 && (
                                        <InformationSection
                                            title={Lang.trans('dynamic.cancellation_policy')}
                                            content={verifyInformation.hotel.cancellationPolicy}
                                        />
                                    )}
                                </>
                            )}

                            <div>
                                <p className="ml-0">
                                    <strong>
                                        {Lang.trans('vacations.review_and_book_your_trip')}
                                    </strong>
                                </p>
                            </div>
                            <div className="mb-5">
                                {errors.terms && (
                                    <div className="error-container w-100 mb-2">
                                        <ErrorText
                                            key={errors.terms.terms.id}
                                            error={errors.terms.terms}
                                        />
                                    </div>
                                )}
                                <div className={`styled-checkbox theme-3 ${Object.prototype.hasOwnProperty.call(errors, 'terms') ? 'error-highlight' : ''}`}>
                                    <input
                                        type="checkbox"
                                        id="read-confirm"
                                        value="confirmed"
                                        onChange={this.setTerms}
                                    />
                                    <label htmlFor="read-confirm">
                                        <span>
                                            {' '}
                                            {Lang.trans('terms.read_terms', { xsitex: site.toLowerCase() })}
                                        </span>
                                        &nbsp;
                                        <a
                                            className=""
                                            target="_blank"
                                            href={window.TERMS_URL}
                                            rel="noreferrer noopener"
                                        >
                                            <strong>
                                                {Lang.trans('terms.terms_and_conditions')}
                                            </strong>
                                        </a>
                                        <span>
                                            &nbsp;and&nbsp;
                                            <a
                                                className=""
                                                target="_blank"
                                                href="https://developer.expediapartnersolutions.com/terms/en"
                                                rel="noreferrer"
                                            >
                                                <strong>Providers terms & conditions</strong>
                                            </a>
                                            .
                                        </span>
                                        {!isStandalone && (
                                            <span>
                                                &nbsp;and&nbsp;
                                                <a
                                                    className=""
                                                    target="_blank"
                                                    href={isRefundablePath ? REFUNDABLE_TERMS_URL : `/airline-terms?sid=${sid}`}
                                                    rel="noreferrer"
                                                >
                                                    <strong>{isRefundablePath ? 'Book with Confidence Terms and Conditions' : 'airline terms & conditions'}</strong>
                                                </a>
                                                .
                                            </span>
                                        )}
                                        {showActCancelPolicy && (
                                            <>
                                                <span>
                                                    &nbsp;and&nbsp;
                                                    <a
                                                        className=""
                                                        id="activity-cancel-policy"
                                                        target="_blank"
                                                        onClick={(e)=>{e.preventDefault()}}
                                                        href="#"
                                                        rel="noreferrer"
                                                    >
                                                        <strong>cancellation policy conditions</strong>
                                                    </a>
                                                    .
                                                </span>
                                                <UncontrolledPopover
                                                    trigger='hover'
                                                    placement='top'
                                                    target={`activity-cancel-policy`}
                                                >
                                                    <PopoverBody>
                                                        { activityResults.map((item,index) => 
                                                          <ActivityCancelPolicy totalAmount={verifyInformation.addon.activity.fare} key={`cancel-policy-${index}`} item={item} />                 
                                                          )
                                                        }                                         
                                                    </PopoverBody>
                                                </UncontrolledPopover>
                                            </>
                                        )}
                                    </label>
                                </div>
                            </div>
                            { hasDeposit > 0 && verifyInformation.cost && false && (
                                <div className="d-inline-block col-12 col-md-6">
                                    <button
                                        type="button"
                                        className="btn p-3 btn-watch-list w-100"
                                        onClick={this.toggleWishModal}
                                        disabled={verifyInformation.hotel.watched}
                                    >
                                        <svg className="icon-lg mr-2" title="" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                            <use xlinkHref="/img/icons/icon-defs.svg#icon-eye-plus" />
                                        </svg>
                                        <span className="text-left font-weight-500 h6 mb-0 align-self-center">{Lang.trans(verifyInformation.hotel.watched ? 'common.added_watchlist' : 'common.add_watchlist')}</span>
                                    </button>
                                </div>
                            )}
                            {(!isBooking && (
                                <button
                                    type="button"
                                    disabled={disablePurchaseBtn} 
                                    className="btn btn-lg p-3 btn-primary col-12 col-md-6 col-lg-7 col-xl-5 font-weight-bold text-uppercase"
                                    onClick={this.submitPurchase}
                                >
                                    {Lang.trans('common.confirm_purchase')}
                                </button>
                            )) || (
                                <div className="btn-lg p-3 btn-primary col-12 col-md-6 col-lg-7 col-xl-5 font-weight-bold text-uppercase">
                                    {Lang.trans('common.confirm_purchase')}
                                    <svg
                                        className="icon ani-pulse ml-1"
                                        width="100%"
                                        height="100%"
                                        xmlns="http://www.w3.org/2000/svg"
                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                    >
                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-spinner" />
                                    </svg>
                                </div>
                            )}
                            <div className="container payment-options-section my-4">
                                <div className="row pb-3">
                                    <div className="col-md-12">
                                        <div className="row justify-content-md-start justify-content-center">
                                            <div className="text-center">
                                                <div className="footer-payment-title trusted">
                                                    <div className="row align-items-center mx-0 gutter-10">
                                                        <div className="col-md-3 col-3 payment-options-line" />
                                                        <span className="title col-md-5 col-6">
                                                            {Lang.trans('common.trusted_shopping')}
                                                        </span>
                                                        <div className="col-md-3 col-3 payment-options-line" />
                                                    </div>
                                                </div>
                                                <div className="text-center mt-2">
                                                    {/*<a
                                                        className="mr-3"
                                                        href="https://members.tico.ca/TICO/Search/DirectoryDetails.aspx?ID=50012834"
                                                        target="_blank"
                                                        rel="nofollow noopener noreferrer"
                                                    >
                                                        <img
                                                            className="tico mb-3 loading"
                                                            src="https://travel-img-assets.s3-us-west-2.amazonaws.com/logos/tico.png"
                                                            alt="Travel Industry Council of Ontario"
                                                            hspace={0}
                                                            vspace={0}
                                                            border={0}
                                                            data-was-processed="true"
                                                        />
                                                    </a>*/}
                                                    {/*<a
                                                        className="mr-3"
                                                        target="_blank"
                                                        href="//www.bbb.org/kitchener/business-reviews/travel-agencies-and-bureaus/red-tag-vacations-in-mississauga-on-1133538"
                                                        rel="nofollow noopener noreferrer"
                                                    >
                                                        <img
                                                            className="bbb loading mt-n3"
                                                            title="Click to verify BBB accreditation and to see a BBB report."
                                                            border={0}
                                                            src="https://travel-img-assets.s3-us-west-2.amazonaws.com/logos/bbb-logo.svg"
                                                            alt="Click to verify BBB accreditation and to see a BBB report for Redtag.ca."
                                                            data-was-processed="true"
                                                        />
                                                    </a>*/}
                                                    <a
                                                        className="mr-3"
                                                        target="_blank"
                                                        href={`https://www.mcafeesecure.com/RatingVerify?ref=www.${site}`}
                                                        rel="nofollow noopener noreferrer"
                                                    >
                                                        <img
                                                            className="mcafee loading mt-n2"
                                                            src="//images.scanalert.com/meter/www.redtag.ca/13.gif"
                                                            data-was-processed="true"
                                                            alt=""
                                                        />
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <div className="footer-payment-title payment-options ml-xl-5 pl-xl-4 mt-md-0 mt-4">
                                                    <div className="row align-items-center mx-0 gutter-10">
                                                        <div className="col-md-3 col-2 payment-options-line" />
                                                        <span className="title col-md-6 col-8">
                                                            {Lang.trans('common.payment_options')}
                                                        </span>
                                                        <div className="col-md-3 col-2 payment-options-line" />
                                                    </div>
                                                    <div className="text-center mt-2">
                                                        <img
                                                            className="visa loading mr-3"
                                                            src="https://travel-img.s3.amazonaws.com/visa.png"
                                                            alt="Travel Industry Council of Ontario"
                                                            hspace={0}
                                                            vspace={0}
                                                            border={0}
                                                            data-was-processed="true"
                                                        />
                                                        <img
                                                            className="mastercard loading mr-3"
                                                            src="https://travel-img.s3.amazonaws.com/mastercard.png"
                                                            alt="Travel Industry Council of Ontario"
                                                            hspace={0}
                                                            vspace={0}
                                                            border={0}
                                                            data-was-processed="true"
                                                        />
                                                        <img
                                                            className="amex loading"
                                                            src="https://travel-img.s3.amazonaws.com/amex.png"
                                                            alt="Travel Industry Council of Ontario"
                                                            hspace={0}
                                                            vspace={0}
                                                            border={0}
                                                            data-was-processed="true"
                                                        />
                                                    </div>
                                                    <Modal size="lg" isOpen={termsModalOpen} toggle={this.toggleTermsModal}>
                                                        <ModalHeader className="modal-header modal-solid-header-bar" toggle={this.toggleTermsModal}><span className="h5">{Lang.trans('terms.terms_and_conditions').toUpperCase()}</span></ModalHeader>
                                                        <ModalBody>
                                                            <div className="d-flex mb-2">
                                                                <button type="button" key="redbook-modal-btn" onClick={() => this.setActiveTermsTab('redbook')} className={`mx-1 rounded btn ${activeTermsTab === 'redbook' ? 'btn-secondary' : 'btn-default'}`}>
                                                                    {Lang.trans('cars.local_fees_and_info')}
                                                                    {redbook.length === 0 && (
                                                                        <svg className="icon ani-pulse ml-1" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                                                            <use xlinkHref="/img/icons/icon-defs.svg#icon-spinner" />
                                                                        </svg>
                                                                    )}
                                                                </button>
                                                                <button type="button" key="terms-tab-btn-terms" onClick={() => this.setActiveTermsTab('terms')} className={`mx-1 rounded btn ${activeTermsTab === 'terms' ? 'btn-secondary' : 'btn-default'}`}>
                                                                    Terms
                                                                    {terms.length === 0 && (
                                                                        <svg className="icon ani-pulse ml-1" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                                                            <use xlinkHref="/img/icons/icon-defs.svg#icon-spinner" />
                                                                        </svg>
                                                                    )}
                                                                </button>
                                                            </div>
                                                            <TabContent activeTab={activeTermsTab}>
                                                                <TabPane key="terms-tabpane-terms" tabId="terms">
                                                                    <div dangerouslySetInnerHTML={{ __html: terms }} />
                                                                </TabPane>
                                                                <TabPane tabId="redbook">
                                                                    <div className="p-2">
                                                                        {(redbook !== null && redbook.length > 0) && (
                                                                            redbook.map((tab) => (
                                                                                tab.items.map((item, i) => {
                                                                                    if (item.description === '<p>   </p>') {
                                                                                        return null;
                                                                                    }
                                                                                    return (
                                                                                        <div key={`redbook-item-${i}`} className="row gutter-10 justify-content-between mb-3 border-bottom py-2">
                                                                                            <div className="col-12">
                                                                                                <h6 className="m-0">{item.name}</h6>
                                                                                                <div className="">
                                                                                                    <div dangerouslySetInnerHTML={{ __html: item.description }} />
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    );
                                                                                })
                                                                            ))
                                                                        )}
                                                                    </div>
                                                                </TabPane>
                                                            </TabContent>
                                                        </ModalBody>
                                                        <ModalFooter>
                                                            <button type="button" className="btn-secondary btn-lg" onClick={this.toggleTermsModal}>Close</button>
                                                        </ModalFooter>
                                                    </Modal>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {showWishModal && (
                        <WatchListModal watcher={watcher} show={showWishModal} toggleModal={this.toggleWishModal} hotelData={verifyInformation.hotel} flightData={flightData} searchParameters={parameters} sid={sid} />
                    )}
                </div>
            </>
        );
    }
}

Checkout.propTypes = {
    sid: PropTypes.string.isRequired,
    tripInformation: PropTypes.instanceOf(Object).isRequired,
    parameters: PropTypes.instanceOf(Object).isRequired,
    breadcrumbs: PropTypes.instanceOf(Object).isRequired,
    insuranceOptions: PropTypes.instanceOf(Object).isRequired,
    features: PropTypes.instanceOf(Object).isRequired,
    site: PropTypes.string.isRequired,
    localization: PropTypes.string,
};

Checkout.defaultProps = {
    localization: 'ca',
};

export default Checkout;
