import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import SigninOption from '../common/SigninOption';
import Modal from 'reactstrap/lib/Modal';
import Validation from 'libraries/profileValidation';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import {
    logout,
    forgetPassword,
    login,
    register,
    getUser,
    loginGoogleFacebook,
} from 'libraries/profileConnections';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                UserId: '',
                Name: '',
                Image: '',
                Gender: '',
                Location: '',
            },
            RegisterData: {
                FirstName: '',
                LastName: '',
                Password: '',
                Email: '',
                Mobile: '',
            },
            SignInData: {
                SignInPassword: '',
                SignInEmail: '',

            },
            SocialLogin: {
                FirstName: '',
                LastName: '',
                Email: '',
                LoginType: '',
                SocialToken: '',
            },
            ForgotData: {
                ForgotEmail: '',
            },
            SignInErrorMessage: '',
            SignInErrorStatus: false,

            RegisterErrorMessage: '',
            RegisterErrorStatus: false,

            ForgotErrorMessage: '',
            ForgotErrorStatus: false,

            FirstNameError: false,
            LastNameError: false,
            PasswordError: false,
            EmailError: false,
            MobileError: false,

            SignInPasswordError: false,
            SignInEmailError: false,

            ForgotEmailError: false,

            RegisterShow: false,
            SignInShow: false,
            ForgotPasswordShow: false,
            ConfirmRegisterShow: false,
            ConfirmForgotPasswordShow: false,
            ConfirmLogoutShow: false,

            ShowMenu: false,
            handleClickShowPassword: false,
            handleClickShowPasswordRegister: false,

            userLoggedOut: true,
            userLoading: false,
            SocialLoginFail: '',
        };

        this.close = this.close.bind(this);

        this.registerSubmit = this.registerSubmit.bind(this);
        this.signInSubmit = this.signInSubmit.bind(this);
        this.forgotSubmit = this.forgotSubmit.bind(this);

        this.openRegisterModel = this.openRegisterModel.bind(this);
        this.openSignInModel = this.openSignInModel.bind(this);
        this.openForgotPasswordModel = this.openForgotPasswordModel.bind(this);

        this.updateRegisterField = this.updateRegisterField.bind(this);
        this.updateSignInField = this.updateSignInField.bind(this);
        this.updateForgotField = this.updateForgotField.bind(this);
        this.logoutSubmit = this.logoutSubmit.bind(this);
        this.ShowMenu = this.ShowMenu.bind(this);
        this.handleClickShowPassword = this.handleClickShowPassword.bind(this);
        this.handleClickShowPasswordRegister = this.handleClickShowPasswordRegister.bind(this);
    }

    componentDidMount() {
        this.setState({ userLoading: true });
        this.loadPage();
    }

    handleSignInKeyPress = (event) => {
        if (event.key === 'Enter') {
            this.signInSubmit();
        }
    }

    handleRegisterSubmitKeyPress = (event) => {
        if (event.key === 'Enter') {
            this.registerSubmit();
        }
    }

    handleForgotSubmitKeyPress = (event) => {
        if (event.key === 'Enter') {
            this.forgotSubmit();
        }
    }

    handleClickShowPassword() {
        if (this.state.handleClickShowPassword === false) {
            this.setState({ handleClickShowPassword: true });
        } else {
            this.setState({ handleClickShowPassword: false });
        }
    }

    handleClickShowPasswordRegister() {
        if (this.state.handleClickShowPasswordRegister === false) {
            this.setState({ handleClickShowPasswordRegister: true });
        } else {
            this.setState({ handleClickShowPasswordRegister: false });
        }
    }

    logoutSubmit() {
        const promise = logout();
        promise.then((response) => {
            const data = response;
            if (data.status === true) {
                this.setState({ RegisterShow: false, SignInShow: false, ConfirmLogoutShow: true, userLoggedOut: true });
            }
        }).catch(() => {});
    }

    updateRegisterField(field, e) {
        let value = '';
        let RegisterErrorStatus = false;
        let RegisterErrorMessage = '';

        const { RegisterData } = this.state;

        const newData = Object.assign({}, RegisterData);

        value = e.target.value;

        newData[field] = value;

        if (field === 'Password' && value !== '' && !Validation.validPassword(value)) {
            RegisterErrorStatus = true;
            RegisterErrorMessage = 'Password must be at least minimum 6 characters long, one lowercase letter, one uppercase letter, one numeric and one special character';
            // focusArr[element + 'Error'] = true;
        }

        this.setState({ RegisterData: newData, RegisterErrorStatus, RegisterErrorMessage });
    }

    updateSignInField(field, e) {
        let value = '';

        const { SignInData } = this.state;
        const newData = Object.assign({}, SignInData);

        value = e.target.value;

        newData[field] = value;

        this.setState({ SignInData: newData });
    }

    updateForgotField(field, e) {
        let value = '';

        const { ForgotData } = this.state;
        const newData = Object.assign({}, ForgotData);

        value = e.target.value;

        newData[field] = value;

        this.setState({ ForgotData: newData });
    }

    ShowMenu() {
        const { ShowMenu } = this.state;
        this.setState({ ShowMenu: !ShowMenu });
    }

    openRegisterModel() {
        this.setState({ RegisterShow: true, SignInShow: false, ForgotPasswordShow: false });
    }

    openForgotPasswordModel() {
        this.setState({ ForgotPasswordShow: true, SignInShow: false });
    }

    openSignInModel() {
        this.setState({
            SignInShow: true,
            ConfirmRegisterShow: false,
            ConfirmLogoutShow: false,
            RegisterShow: false,
            ConfirmForgotPasswordShow: false,
        });
    }

    close() {
        const RegisterData = {
            FirstName: '',
            LastName: '',
            Password: '',
            Email: '',
            Mobile: '',
        };

        const SignInData = { SignInPassword: '', SignInEmail: '' };

        const ForgotData = { ForgotEmail: '' };

        this.setState({
            RegisterShow: false,
            SignInShow: false,
            ConfirmRegisterShow: false,
            ConfirmLogoutShow: false,
            ForgotPasswordShow: false,
            ConfirmForgotPasswordShow: false,
            RegisterData,
            SignInData,
            ForgotData,
            SignInErrorMessage: '',
            SignInErrorStatus: false,
            RegisterErrorMessage: '',
            RegisterErrorStatus: false,
            ForgotErrorMessage: '',
            ForgotErrorStatus: false,
            FirstNameError: false,
            LastNameError: false,
            PasswordError: false,
            EmailError: false,
            MobileError: false,
            SignInPasswordError: false,
            SignInEmailError: false,
            ForgotEmailError: false,
        });
    }

    forgotSubmit() {
        let ForgotEmailError = false;

        const { ForgotData } = this.state;

        if (Validation.isEmpty(ForgotData.ForgotEmail)) {
            ForgotEmailError = true;
        } else if (!Validation.validateEmail(ForgotData.ForgotEmail)) {
            ForgotEmailError = true;
        }

        if (ForgotEmailError) {
            this.setState({ ForgotEmailError });
        } else {
            this.setState({ ForgotEmailError });

            const forgetPasswordPromise = forgetPassword(JSON.stringify(ForgotData));
            forgetPasswordPromise.then((response) => {
                const data = response;
                if (data.status === false) {
                    this.setState({ ForgotErrorStatus: true, ForgotErrorMessage: data.message });
                } else {
                    this.setState({ ForgotPasswordShow: false, ConfirmForgotPasswordShow: true });
                }
            }).catch((error) => {
                console.log(error);
            });
        }
    }

    signInSubmit() {
        const SignInPasswordError = false;
        const SignInEmailError = false;

        const { SignInData } = this.state;

        const focusArr = [];

        const FieldsArray = ['SignInPassword', 'SignInEmail'];

        for (let index = 0; index < FieldsArray.length; index++) {
            const element = FieldsArray[index];
            if (Validation.isEmpty(SignInData[element])) {
                eval(element + 'Error' + '= ' + true + ';');
                focusArr[element + 'Error'] = true;
            } else if (element === 'SignInEmail' && !Validation.validateEmail(SignInData[element])) {
                eval(element + 'Error' + '= ' + true + ';');
                focusArr[element + 'Error'] = true;
            }
        }
        if (SignInPasswordError || SignInEmailError) {
            this.setState({ SignInPasswordError, SignInEmailError });
        } else {
            this.setState({ SignInPasswordError, SignInEmailError });

            const loginPromise = login(JSON.stringify(SignInData));
            loginPromise.then((data) => {
                if (data.status === false) {
                    this.setState({ SignInErrorStatus: true, SignInErrorMessage: data.message });
                } else {
                    this.setState({
                        SignInErrorStatus: false,
                        SignInErrorMessage: '',
                        SignInShow: false,
                        data,
                        userLoggedOut: false,
                    });
                }
            }).catch(() => {
                this.setState({ SignInErrorStatus: true, SignInErrorMessage: 'There was an issue with logging in, please try again' });
            });
        }
    }

    registerSubmit() {
        let FirstNameError = false;
        let LastNameError = false;
        let PasswordError = false;
        let EmailError = false;
        let MobileError = false;

        const { RegisterData } = this.state;

        const focusArr = [];

        const FieldsArray = ['FirstName', 'LastName', 'Password', 'Email'];

        for (let index = 0; index < FieldsArray.length; index++) {
            const element = FieldsArray[index];
            if (Validation.isEmpty(RegisterData[element])) {
                eval(element + 'Error' + '= ' + true + ';');
                focusArr[element + 'Error'] = true;
            } else if (element === 'Email' && !Validation.validateEmail(RegisterData[element])) {
                EmailError = true;
                focusArr.EmailError = true;
            } else if (element === 'Password' && !Validation.validPassword(RegisterData[element])) {
                PasswordError = true;
                focusArr.PasswordError = true;
                this.setState({ RegisterErrorStatus: true, RegisterErrorMessage: 'Password must be at least minimum 6 characters long, one lowercase letter, one uppercase letter, one numeric and one special character' });
            }
        }

        if (FirstNameError || LastNameError || PasswordError || EmailError || MobileError) {
            this.setState({ FirstNameError, LastNameError, PasswordError, EmailError, MobileError });
        } else {
            this.setState({
                FirstNameError,
                LastNameError,
                PasswordError,
                EmailError,
                MobileError,
            });

            const registerPromise = register(JSON.stringify(RegisterData));
            registerPromise.then((response) => {
                const data = response;
                if (data.status === false) {
                    this.setState({ RegisterErrorStatus: true, RegisterErrorMessage: data.message });
                } else {
                    this.setState({ ConfirmRegisterShow: true, RegisterShow: false, RegisterErrorStatus: false, userLoggedOut: true });
                    // window.location.href="/";
                }
            }).catch((error) => {
                console.log(error);
                window.location.href = '/';
            });
        }
    }

    loadPage() {
        const getUserpromise = getUser();
        getUserpromise.then((data) => {
            if (data.status) {
                this.setState({ data, userLoggedOut: false, userLoading: false });
            } else {
                this.setState({ data, userLoggedOut: true, userLoading: false });
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    responseGoogle(response) {
        // console.log('responseGoogle----', response);

        const { SocialLogin } = this.state;

        const newData = Object.assign({}, SocialLogin);
        const userName = response.profileObj.name.split(' ');
        ({ 0: newData.FirstName, 1: newData.LastName } = userName);
        newData.SocialToken = response.tokenObj.id_token;
        newData.Email = response.profileObj.email;
        newData.LoginType = response.tokenObj.idpId;

        this.setState({ SocialLogin: newData });

        const loginGooglePromise = loginGoogleFacebook(JSON.stringify(newData), 'Google');
        loginGooglePromise.then((response) => {
            const data = response;
            if (data.status === false) {
                console.log('error', data.message);
                this.setState({ SocialLoginFail: 'Oops! Something went wrong, Please try again' });
            } else {
                window.location.href = '/my-account/edit';
            }
        }).catch((error) => {
            console.log(error);
            window.location.href = '/';
        });
    }

    responseGoogleFail(response) {
        console.log('responseGoogleFail=====', response);
        this.setState({ SocialLoginFail: 'Oops! Something went wrong, Please try again'});
    }

    responseFacebook(response) {
        // console.log('responseFacebook----', response);

        const { SocialLogin } = this.state;

        const newData = Object.assign({}, SocialLogin);
        const userName = response.name.split(' ');
        ({ 0: newData.FirstName, 1: newData.LastName } = userName);
        newData.SocialToken = response.accessToken;
        newData.Email = response.email;
        newData.LoginType = response.graphDomain;

        this.setState({ SocialLogin: newData });

        const loginFacebookPromise = loginGoogleFacebook(JSON.stringify(newData), 'Facebook');
        loginFacebookPromise.then((response) => {
            const data = response;
            if (data.status === false) {
                console.log('error', data.message);
                this.setState({ SocialLoginFail: 'Oops! Something went wrong, Please try again' });
            } else {
                window.location.href = '/my-account/edit';
            }
        }).catch((error) => {
            console.log(error);
            window.location.href = '/';
        });
    }

    responseFacebookFail(response) {
        console.log('responseFacebookFail=====', response);
        this.setState({ SocialLoginFail: 'Oops! Something went wrong, Please try again'});
    }

    render() {
        // console.log('state===>', this.state);
        const {
            data,
            userLoggedOut,
            RegisterData,
            SignInData,
            ForgotData,
            ShowMenu,
            userLoading,
            RegisterShow,
            RegisterErrorStatus,
            RegisterErrorMessage,
            SocialLoginFail,
            FirstNameError,
            LastNameError,
            MobileError,
            EmailError,
            handleClickShowPasswordRegister,
            PasswordError,
            SignInShow,
            SignInErrorStatus,
            SignInErrorMessage,
            SignInEmailError,
            handleClickShowPassword,
            SignInPasswordError,
            ConfirmRegisterShow,
            ConfirmLogoutShow,
            ForgotPasswordShow,
            ForgotErrorStatus,
            ForgotErrorMessage,
            ForgotEmailError,
            ConfirmForgotPasswordShow,
        } = this.state;
        
        const { config, element } = this.props;

        const profileSection = document.getElementById(element);

        if (!userLoggedOut) {
            return createPortal((
                <>
                    {/* <div className="d-flex justify-content-end">
                <img className="rounded-circle article-img" src="img/user.png" style={{width: 50}} />
                <button className="btn btn-primary-outline px-4 py-2 mr-2 h6 mb-0" onClick={this.logoutSubmit}>Logout</button>
                </div> */}
                    <div className="d-lg-inline-block ">
                        <div className="right-panel">
                            <ul className="m-0 p-0 list-inline justify-content-end">
                                {/* Mobile View */}
                                <li className="nav-link-container ml-0 w-100 d-lg-none">
                                    <a className="nav-link nav-border-bottom w-100 bg-white" style={{ color: '#9b9a9b' }}>
                                        <svg className="icon d-lg-none">
                                            <use xlinkHref="/img/icons/icon-defs.svg#icon-user-account" />
                                        </svg>
                                        <span className="nav-title">{data.Name}</span>
                                        {/* <svg className="icon-arrow d-md-none">
                                            <use xlinkHref="/img/icons/icon-defs.svg#icon-chevron-right" />
                                        </svg> */}
                                    </a>
                                </li>
                                <li className="nav-link-container ml-0 w-100 d-lg-none">
                                    <a className="nav-link nav-border-bottom w-100 bg-white" style={{ cursor: 'pointer', color: '#9b9a9b' }} onClick={this.navigateTo}>
                                        <svg className="icon d-lg-none">
                                            <use xlinkHref="/img/icons/icon-defs.svg#icon-user-account" />
                                        </svg>
                                        <span className="nav-title">PROFILE</span>
                                        <svg className="icon-arrow d-md-none">
                                            <use xlinkHref="/img/icons/icon-defs.svg#icon-chevron-right" />
                                        </svg>
                                    </a>
                                </li>
                                <li className="nav-link-container ml-0 w-100 d-lg-none">
                                    <a className="nav-link nav-border-bottom w-100 bg-white" style={{ cursor: 'pointer', color: '#9b9a9b' }} onClick={this.logoutSubmit}>
                                        <svg className="icon d-lg-none">
                                            <use xlinkHref="/img/icons/icon-defs.svg#icon-logout" />
                                        </svg>
                                        <span className="nav-title">LOGOUT</span>
                                        <svg className="icon-arrow d-md-none">
                                            <use xlinkHref="/img/icons/icon-defs.svg#icon-chevron-right" />
                                        </svg>
                                    </a>
                                </li>
                            </ul>
                            <ul className="d-flex m-0 p-0 list-inline justify-content-end" onClick={this.ShowMenu}>
                                {/* Mobile View */}

                                <li className="bg-white d-none d-lg-block">
                                    <div className="d-flex align-items-center">
                                        <a href="#" className="rounded-circle d-none d-lg-block mr-2 mb-0 pb-0">
                                            <img className='circle w-100 h-100' src={data.image ? data.image : data.Gender ? data.Gender : '/img/no-avtar.png'} alt="User Profile" alt="User" />
                                        </a>
                                        <span className="font-weight-bold" style={{ cursor: 'pointer' }}>{data.firstName}</span>
                                    </div>
                                </li>
                                <li className="rounded-circle d-none d-lg-block">
                                    <a href="#" className="d-flex align-items-center justify-content-center p-0" >
                                        <svg width="30" height="28">
                                            <use xlinkHref="/img/icons/icon-defs.svg#icon-chevron-down" />
                                        </svg>
                                    </a>
                                    {this.state.ShowMenu == true ?
                                        <div className="profile-dropdown rounded w-100 p-2 px-3 position-absolute box-shadow bg-white" style={{ zIndex: 101 }} >
                                            <ul className="list-unstyled pb-0 mb-0">
                                                <li className="bg-white"><a style={{ cursor: 'pointer' }} onClick={this.navigateTo}>Profile</a></li>

                                                <li className="bg-white"><a style={{ cursor: 'pointer' }} onClick={this.logoutSubmit}>Logout</a></li>
                                            </ul>
                                        </div> : null
                                    }
                                </li>
                            </ul>
                        </div>
                    </div>
                </>),
            profileSection);
        }
        return createPortal((
            <div className="d-flex justify-content-center justify-content-md-end py-2 py-md-0">             
                {userLoading === true ? (
                    <>

                    </>
                ) : (
                    <>
                        <button type="button" className="btn btn-primary-outline px-4 py-2 mr-2 h6 mb-0" onClick={this.openRegisterModel}>Register</button>
                        <button type="button" className="btn btn-primary px-4 py-2 h6 mb-0" onClick={this.openSignInModel}>Sign In</button>
                    </>
                )}
                <Modal isOpen={RegisterShow}  className="signin-popup modal-dialog-centered my-3 ml-auto mr-auto">
                    <div className="" role="document">
                        <div className="modal-content shadow-none">
                            <button type="button" onClick={this.close} className="close position-absolute" data-dismiss="modal" aria-label="Close">
                                <svg className="icon">
                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-close" />
                                </svg>
                            </button>
                            <div className="row ">
                                <div className="col-md-6 text-center pr-md-0">
                                    <div className="px-4 px-lg-5 px-md-4 pt-5 py-4">
                                        <div className="row">
                                            <div className="col-md-12 mb-2">
                                                <div className="mb-4 mb-md-5 intro-color h3">
                                                    <span className="position-relative intro-color ">Become a member
                                                        {config.features.url !== '' && <img className="icon-md position-absolute right-negative-15 top-negative-10 loading" src={config.logo.url} alt={config.logo.alt}/>}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        {RegisterErrorStatus && (
                                            <div className="alert text-left alert-info mb-4 h6 font-weight-normal rounded-sm" role="alert">
                                                <svg className="mr-2 float-left" width="22" height="18">
                                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-exclamation-triangle" />
                                                </svg>
                                                <span className="d-block overflow-hidden">{RegisterErrorMessage}</span>
                                            </div>
                                        )}
                                        {SocialLoginFail && (
                                            <div className="col-md-12">
                                                <div className="alert text-left alert-error mb-4 h6 font-weight-normal" role="alert">
                                                    <svg className="mr-2 float-left" width="22" height="18">
                                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-exclamation-triangle" />
                                                    </svg>

                                                    <span className="d-block overflow-hidden">{SocialLoginFail}</span>

                                                </div>
                                            </div>
                                        )}
                                        <form action="" name="Registration" id="Registration">
                                            <div className="row gutter-20">
                                                <div className="col-md-6 mb-3">
                                                    <div className="element-container">
                                                        <input type="text" placeholder="First Name" className={FirstNameError ? 'error form-control bg-white shadow-none px-4 py-2' : "form-control bg-white shadow-none px-4 py-2"} value={RegisterData.FirstName} name="FirstName" id="FirstName" onChange={this.updateRegisterField.bind(null, 'FirstName')} onKeyPress={this.handleRegisterSubmitKeyPress} />
                                                    </div>
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <div className="element-container">
                                                        <input type="text" placeholder="Last Name" className={LastNameError ? 'error form-control bg-white shadow-none px-4 py-2' : "form-control bg-white shadow-none px-4 py-2"} value={RegisterData.LastName} name="LastName" id="LastName" onChange={this.updateRegisterField.bind(null, 'LastName')} onKeyPress={this.handleRegisterSubmitKeyPress} />
                                                    </div>
                                                </div>
                                                <div className="col-md-12 mb-3">
                                                    <div className="element-container">
                                                        <input type="text" placeholder="Mobile Number (optional)" className={MobileError ? 'error form-control bg-white shadow-none px-4 py-2 pr-5' : 'form-control bg-white shadow-none px-4 py-2 pr-5'} value={RegisterData.Mobile} name="Mobile" id="Mobile" onChange={this.updateRegisterField.bind(null, 'Mobile')} onKeyPress={this.handleRegisterSubmitKeyPress} />
                                                        <svg className="icon">
                                                            <use xlinkHref="/img/icons/icon-defs.svg#icon-phone" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="col-md-12 mb-3">
                                                    <div className="element-container">
                                                        <input type="text" placeholder="Email Address" className={EmailError ? 'error form-control bg-white shadow-none px-4 py-2 pr-5' : 'form-control bg-white shadow-none px-4 py-2 pr-5'} value={RegisterData.Email} name="Email" id="Email" onChange={this.updateRegisterField.bind(null, 'Email')} onKeyPress={this.handleRegisterSubmitKeyPress} />
                                                        <svg className="icon">
                                                            <use xlinkHref="/img/icons/icon-defs.svg#icon-mail" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="col-md-12 mb-3">
                                                    <div className="element-container">

                                                        <input
                                                            type={handleClickShowPasswordRegister === true ? 'text' : 'password'}
                                                            placeholder="Password"
                                                            className={PasswordError ? 'error form-control bg-white shadow-none px-4 py-2 pr-5' : 'form-control bg-white shadow-none px-4 py-2 pr-5'}
                                                            value={RegisterData.Password}
                                                            name="Password"
                                                            id="Password"
                                                            onChange={this.updateRegisterField.bind(null, 'Password')}
                                                            onKeyPress={this.handleRegisterSubmitKeyPress}
                                                        />
                                                        <svg className="icon" onClick={this.handleClickShowPasswordRegister} style={{ cursor: 'pointer' }}>
                                                            {handleClickShowPasswordRegister === true ? (
                                                                <use xlinkHref="/img/icons/icon-defs.svg#icon-open-eye" />
                                                            ) : (
                                                                <use xlinkHref="/img/icons/icon-defs.svg#icon-eye" />
                                                            )}
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                        <div className="row gutter-20">
                                            <div className="col-md-12">
                                                <input
                                                    type="button"
                                                    className="btn-secondary w-100 px-3 py-3 btn text-white font-weight-500 h6 mb-0"
                                                    onClick={this.registerSubmit}
                                                    value="Let's get started"
                                                />
                                            </div>
                                            <div className="col-md-12 py-4">
                                                <div className="divider">
                                                    <span className="bg-white position-relative px-2">or continue with</span>
                                                </div>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                { config.features.facebook && (
                                                    <FacebookLogin
                                                        appId={config.facebook_client_id}
                                                        fields="name,email,picture"
                                                        scope="public_profile, email, user_birthday"
                                                        callback={this.responseFacebook.bind(this)}
                                                        onFailure={this.responseFacebookFail.bind(this)}
                                                        returnScopes
                                                        textButton="Facebook"
                                                        cssClass="px-3 py-3 w-100 social-btn d-flex align-items-center justify-content-center bg-white"
                                                        icon={<img className="mr-2" src="https://redtag-travel-images.s3.us-east-1.amazonaws.com/icon-facebook.svg" alt="Facebook" />}

                                                    />
                                                )}
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                { config.features.google && (
                                                    <GoogleLogin
                                                        clientId={config.google_client_id}
                                                        render={(renderProps) => (
                                                            <button type="button" onClick={renderProps.onClick} disabled={renderProps.disabled} className="px-3 py-3 w-100 social-btn d-flex align-items-center justify-content-center bg-white">
                                                                <img className="mr-2" src="https://redtag-travel-images.s3.us-east-1.amazonaws.com/icon-google.svg" alt="Google" />
                                                                Google
                                                            </button>
                                                        )}
                                                        onSuccess={this.responseGoogle.bind(this)}
                                                        onFailure={this.responseGoogleFail.bind(this)}
                                                        cookiePolicy="single_host_origin"
                                                        // isSignedIn={true}
                                                    />
                                                )}
                                            </div>
                                            {/* <div className="col-md-6 mb-3">
                                                <a href="#" className="px-3 py-3 social-btn d-flex align-items-center justify-content-center">
                                                    <img className="mr-2" src="https://redtag-travel-images.s3.us-east-1.amazonaws.com/icon-apple.svg" alt="Apple" /> Apple
                                                </a>
                                            </div> */}
                                            <div className="col-md-12 font-weight-normal mb-2 text-left py-4">
                                                By signing in, I agree to Redtag.ca
                                                <a href="/terms-conditions"> Terms of Use</a> and
                                                <a href="/privacy-policy"> Privacy Policy</a>.
                                            </div>

                                            {/* <div className="col-md-12 font-weight-normal mb-2 text-left promotion-note">
                                        <div className="custom-control custom-checkbox">
                                            <input type="checkbox" className="custom-control-input" id="promotions" name="example1" />
                                            <label className="custom-control-label" for="promotions">I do not wish to receive Redtag’s exclusive promotions and deals.</label>
                                        </div>
                                    </div> */}

                                        </div>
                                    </div>

                                    <div className="px-4 px-lg-5 px-md-4 py-4 modal-footer d-block">
                                        <div className="row align-items-center py-2 gutter-20">
                                            <div className="col-md-5 mb-3 mb-md-0 text-center px-md-0">
                                                <a onClick={this.openSignInModel} href="#" className="h5 link font-weight-normal">Already have an account?</a>
                                            </div>
                                            <div className="col-md-7 pl-2 pl-md-5">

                                                <input type="button" onClick={this.openSignInModel} className="btn-secondary-outline w-100 px-3 py-2 mb-0 btn font-weight-500 h5" value="Sign In" />
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className="col-md-6 pl-0">
                                    <div className="signin-image h-100 w-100" style={{ backgroundImage: 'url(https://redtag-travel-images.s3.us-east-1.amazonaws.com/signin-bg.jpg)' }} />
                                </div>
                            </div>

                        </div>
                    </div>
                </Modal>

                <Modal isOpen={SignInShow} className="signin-popup modal-dialog-centered py-2 ml-auto mr-auto">
                    <div className="" role="document">
                        <div className="modal-content shadow-none">
                            <button type="button" className="close position-absolute" data-dismiss="modal" aria-label="Close" onClick={this.close}>
                                <svg className="icon">
                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-close" />
                                </svg>
                            </button>
                            <div className="row ">
                                <div className="col-md-6 text-center">
                                    <div className="px-4 px-lg-5 px-md-4 pt-5 py-4">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="mb-4 mb-md-5 intro-color h3">
                                                    <span className="position-relative intro-color ">Welcome Back
                                                        {config.logo.url !== '' && <img className="icon-md position-absolute right-negative-15 top-negative-10 loading" src={config.logo.url} alt={config.logo.alt} />}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <form action="" name="Login">
                                            <div className="row gutter-20">
                                                {SignInErrorStatus && (
                                                    <div className="col-md-12">
                                                        <div className="alert text-left alert-error mb-4 h6 font-weight-normal" role="alert">
                                                            <svg className="mr-2 float-left" width="22" height="18">
                                                                <use xlinkHref="/img/icons/icon-defs.svg#icon-exclamation-triangle" />
                                                            </svg>

                                                            <span className="d-block overflow-hidden">{SignInErrorMessage}</span>

                                                        </div>
                                                    </div>
                                                )}
                                                {SocialLoginFail && (
                                                    <div className="col-md-12">
                                                        <div className="alert text-left alert-error mb-4 h6 font-weight-normal" role="alert">
                                                            <svg className="mr-2 float-left" width="22" height="18">
                                                                <use xlinkHref="/img/icons/icon-defs.svg#icon-exclamation-triangle" />
                                                            </svg>

                                                            <span className="d-block overflow-hidden">{SocialLoginFail}</span>

                                                        </div>
                                                    </div>
                                                )}
                                                <div className="col-md-12 mb-4">
                                                    <div className="element-container">
                                                        <input type="text" placeholder="Email Address" className={SignInEmailError ? 'error form-control bg-white shadow-none px-4 py-2 pr-5' : 'form-control bg-white shadow-none px-4 py-2 pr-5'} value={SignInData.SignInEmail} name="Email" id="Email" onChange={this.updateSignInField.bind(null, 'SignInEmail')} onKeyPress={this.handleSignInKeyPress} />
                                                        <svg className="icon">
                                                            <use xlinkHref="/img/icons/icon-defs.svg#icon-mail" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="col-md-12 mb-4">
                                                    <div className="element-container">
                                                        <input type={handleClickShowPassword === true ? 'text' : 'password'} placeholder="Password" className={SignInPasswordError ? 'error form-control bg-white shadow-none px-4 py-2 pr-5' : 'form-control bg-white shadow-none px-4 py-2 pr-5'} value={SignInData.SignInPassword} name="Password" id="Password" onChange={this.updateSignInField.bind(null, 'SignInPassword')} onKeyPress={this.handleSignInKeyPress} />
                                                        <svg className="icon" onClick={this.handleClickShowPassword} style={{ cursor: 'pointer' }}>
                                                            {handleClickShowPassword === true ? (
                                                                <use xlinkHref="/img/icons/icon-defs.svg#icon-open-eye" />
                                                            ) : (
                                                                <use xlinkHref="/img/icons/icon-defs.svg#icon-eye" />
                                                            )}
                                                        </svg>
                                                    </div>

                                                    <div className="d-flex justify-content-end">
                                                        <a href="#" className="mt-2 forgot-link" onClick={this.openForgotPasswordModel}>Forgot your password?</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                        <div className="row gutter-20">
                                            <div className="col-md-12">
                                                <input type="button" className="btn-secondary w-100 px-3 py-3 btn text-white font-weight-500 h6 mb-0" onClick={this.signInSubmit} value="Sign In" />
                                            </div>
                                            <div className="col-md-12 py-4">
                                                <div className="divider">
                                                    <span className="bg-white position-relative px-2">or continue with</span>
                                                </div>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                { config.features.facebook && (
                                                    <FacebookLogin
                                                        appId={config.facebook_client_id}
                                                        fields="name,email,picture"
                                                        scope="public_profile, email, user_birthday"
                                                        callback={this.responseFacebook.bind(this)}
                                                        onFailure={this.responseFacebookFail.bind(this)}
                                                        returnScopes
                                                        textButton="Facebook"
                                                        cssClass="px-3 py-3 w-100 social-btn d-flex align-items-center justify-content-center bg-white"
                                                        icon={<img className="mr-2" src="https://redtag-travel-images.s3.us-east-1.amazonaws.com/icon-facebook.svg" alt="Facebook" />}
                                                    />
                                                )}
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                { config.features.google && (
                                                    <GoogleLogin
                                                        clientId={config.google_client_id}
                                                        render={(renderProps) => (
                                                            <button type="button" onClick={renderProps.onClick} disabled={renderProps.disabled} className="px-3 py-3 w-100 social-btn d-flex align-items-center justify-content-center bg-white">
                                                                <img className="mr-2" src="https://redtag-travel-images.s3.us-east-1.amazonaws.com/icon-google.svg" alt="Google" />
                                                                Google
                                                            </button>
                                                        )}
                                                        onSuccess={this.responseGoogle.bind(this)}
                                                        onFailure={this.responseGoogleFail.bind(this)}
                                                        cookiePolicy="single_host_origin"
                                                        // isSignedIn={true}
                                                    />
                                                )}
                                            </div>                                            <div className="col-md-12 font-weight-normal mb-2 py-4">
                                                By signing in, I agree to Redtag.ca
                                                <a href={config.links.terms}> Terms of Use</a> and
                                                <a href={config.links.policy}> Privacy Policy</a>.
                                            </div>
                                        </div>
                                    </div>
                                    <div className="border-top px-4 px-lg-5 px-md-4 py-4">
                                        <div className="row align-items-center py-2 gutter-20">
                                            <div className="col-md-5 mb-3 mb-md-0 text-center text-md-right">
                                                <a href="#" onClick={this.openRegisterModel} className="h5 link font-weight-normal">No account yet?</a>
                                            </div>
                                            <div className="col-md-7 pl-2 pl-md-5">
                                                <a href="#" onClick={this.openRegisterModel} className=" btn-secondary-outline w-100 px-3 py-2 mb-0 btn font-weight-500 h5">Sign Up</a>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className="col-md-6 pl-0">
                                    <div className="signin-image h-100 w-100" style={{ backgroundImage: 'url(https://redtag-travel-images.s3.us-east-1.amazonaws.com/signin-bg.jpg)' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>

                <Modal isOpen={ConfirmRegisterShow} className="modal signin-popup forgot-password-popup signin-popup modal-dialog-centered my-3 ml-auto mr-auto">
                    <div className="" role="document">
                        <div className="modal-content shadow-none">
                            <button type="button" onClick={this.close} className="close position-absolute" data-dismiss="modal" aria-label="Close">
                                <svg className="icon">
                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-close" />
                                </svg>
                            </button>
                            <div className="row ">
                                <div className="col-md-12 text-center">
                                    <div className="px-4 px-md-5 px-md-4 py-4 py-md-5">
                                        <div className="row">
                                            <div className="col-7 col-md-12 mt-4 ml-auto mr-auto">
                                                <img className="mw-100" src="https://redtag-travel-images.s3.us-east-1.amazonaws.com/mail.jpg" alt="Mail" />
                                            </div>
                                            <div className="col-md-12 mt-4 mt-md-5">
                                                <h3 className="mb-6 4 font-weight-bold heading">
                                                    Registered successfully!
                                                    {/* <img className="cap" src="https://redtag-travel-images.s3.us-east-1.amazonaws.com/redtag-cap.svg" alt="Redtag Cap"/> */}

                                                </h3>
                                                <h4>Please check your email for activate your account.</h4>
                                            </div>
                                            <div className="col-md-12 my-4 my-md-5 " />
                                            <div className="col-md-12 mb-2 mb-md-5">
                                                <button type="button" className="btn-secondary w-100 px-3 py-3 btn text-white font-weight-500 h6 mb-0" onClick={this.openSignInModel}>
                                                    Login
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </Modal>

                <Modal isOpen={ConfirmLogoutShow} className="modal-dialog modal-dialog-centered my-3 ml-auto mr-auto">
                    <div className="" role="document">
                        <div className="modal-content shadow-none">
                            <div className="row ">
                                <div className="col-md-12 text-center">
                                    <div className="px-4 px-md-5 px-md-4 py-4 py-md-5">
                                        <div className="row">
                                            <div className="col-7 col-md-12 mt-4 ml-auto mr-auto">
                                                <img className="mw-100" src="https://redtag-travel-images.s3.us-east-1.amazonaws.com/mail.jpg" alt="Mail" />
                                            </div>
                                            <div className="col-md-12 mt-4 mt-md-5">
                                                <h3 className="mb-0 4 font-weight-bold heading">
                                                    Logout successfully!
                                                    {/* <img className="cap" src="https://redtag-travel-images.s3.us-east-1.amazonaws.com/redtag-cap.svg" alt="Redtag Cap"/> */}

                                                </h3>
                                            </div>
                                            <div className="col-md-12 my-4 my-md-5 " />
                                            <div className="col-md-12 mb-2 mb-md-5">
                                                <button type="button" className="btn-secondary w-100 px-3 py-3 btn text-white font-weight-500 h6 mb-0" onClick={this.close}>
                                                    Close
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>

                <Modal isOpen={ForgotPasswordShow} className="modal signin-popup forgot-password-popup signin-popup modal-dialog-centered my-3 ml-auto mr-auto">
                    <div className="" role="document">
                        <div className="modal-content shadow-none">
                            <button type="button" className="close position-absolute" onClick={this.close} data-dismiss="modal" aria-label="Close">
                                <svg className="icon">
                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-close" />
                                </svg>
                            </button>
                            <div className="row ">
                                <div className="col-md-12 text-center">
                                    <div className="px-4 px-md-5 px-md-4 py-4 py-md-5">
                                        <div className="row">
                                            <div className="col-md-12 mb-3 mt-5">
                                                <h3 className="mb-4 mb-md-4 mt-4 font-weight-bold heading">
                                                    Trouble Loggin In?
                                                    {/* <img className="cap" src="https://redtag-travel-images.s3.us-east-1.amazonaws.com/redtag-cap.svg" alt="Redtag Cap"/> */}
                                                </h3>
                                            </div>
                                            <div className="col-md-12 mb-4 mb-md-5 ">
                                                <div className="tag-line mb-3">
                                                    Enter your email address and we’ll send you a<br /> link to reset your password
                                                </div>
                                            </div>
                                        </div>

                                        {ForgotErrorStatus && (
                                            <div className="col-md-12" id="ForgotPasswordError">
                                                <div className="alert text-left alert-error mb-4 h6 font-weight-normal" role="alert">
                                                    <svg className="mr-2 float-left" width="22" height="18">
                                                        <use xlinkHref="/img/icons/icon-defs.svg#icon-exclamation-triangle" />
                                                    </svg>
                                                    <span className="d-block overflow-hidden">{ForgotErrorMessage}</span>
                                                </div>
                                            </div>
                                        )}
                                        <form action="" name="ForgotPassword" id="ForgotPassword">
                                            <div className="row gutter-20">
                                                <div className="col-md-12 mb-4">
                                                    <div className="element-container">
                                                        <input
                                                            type="text"
                                                            id="ForgotEmail"
                                                            className={`form-control bg-white shadow-none px-4 py-2 pr-5 ${ForgotEmailError ? 'error' : ''}`}
                                                            placeholder="Email Address"
                                                            value={ForgotData.ForgotEmail}
                                                            name="ForgotEmail"
                                                            onChange={this.updateForgotField.bind(null, 'ForgotEmail')}
                                                            onKeyPress={this.handleForgotSubmitKeyPress}
                                                        />
                                                        <svg className="icon">
                                                            <use xlinkHref="/img/icons/icon-defs.svg#icon-mail" />
                                                        </svg>
                                                    </div>
                                                </div>

                                            </div>
                                        </form>
                                        <div className="row gutter-20">
                                            <div className="col-md-12 mt-2">
                                                <input
                                                    type="button"
                                                    className="btn-secondary w-100 px-3 py-3 btn text-white font-weight-500 h6 mb-0"
                                                    onClick={this.forgotSubmit}
                                                    value="Reset Password"
                                                />
                                            </div>
                                        </div>
                                        <div className="row align-items-center py-2 gutter-20">
                                            <div className="col-md-12 mb-3 mt-4 mt-md-5">
                                                <span className="h6 link font-weight-normal">DON’T HAVE AN ACCOUNT?</span>
                                            </div>
                                            <div className="col-md-12">
                                                <button
                                                    type="button"
                                                    onClick={this.openRegisterModel}
                                                    className=" btn-secondary-outline w-100 px-3 py-2 mb-0 btn font-weight-500 h5"
                                                >
                                                    Sign Up
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                </Modal>

                <Modal isOpen={ConfirmForgotPasswordShow} className="modal signin-popup forgot-password-popup signin-popup modal-dialog-centered my-3 ml-auto mr-auto">
                    <div className="" role="document">
                        <div className="modal-content shadow-none">
                            <button type="button" onClick={this.close} className="close position-absolute" data-dismiss="modal" aria-label="Close">
                                <svg className="icon">
                                    <use xlinkHref="/img/icons/icon-defs.svg#icon-close" />
                                </svg>
                            </button>
                            <div className="row ">
                                <div className="col-md-12 text-center">
                                    <div className="px-4 px-md-5 px-md-4 py-4 py-md-5">
                                        <div className="row">
                                            <div className="col-7 col-md-12 mt-4 ml-auto mr-auto">
                                                <img className="mw-100" src="https://redtag-travel-images.s3.us-east-1.amazonaws.com/mail.jpg" alt="Mail" />
                                            </div>
                                            <div className="col-md-12 mt-4 mt-md-5">
                                                <h3 className="mb-0 4 font-weight-bold heading">
                                                    Check your mailbox!
                                                    {/* <img className="cap" src="https://redtag-travel-images.s3.us-east-1.amazonaws.com/redtag-cap.svg" alt="Redtag Cap"/> */}

                                                </h3>
                                            </div>
                                            <div className="col-md-12 my-4 my-md-5 ">
                                                <div className="tag-line">
                                                    We have sent a password recover instructions<br /> to your email.
                                                </div>
                                            </div>
                                            <div className="col-md-12 mb-2 mb-md-5">
                                                <button type="button" className="btn-secondary w-100 px-3 py-3 btn text-white font-weight-500 h6 mb-0" onClick={this.close}>Done</button>
                                            </div>
                                            <div className="col-md-12 mb-3 mt-4 mt-md-5">
                                                <span className="h6 link font-weight-normal">Return to</span>
                                            </div>
                                            <div className="col-md-12">
                                                <button
                                                    type="button"
                                                    className=" btn-secondary-outline w-100 px-3 py-2 mb-0 btn font-weight-500 h5"
                                                    onClick={this.openSignInModel}
                                                >
                                                    Sign in
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>),
        profileSection);
    }
}

export default Profile;

