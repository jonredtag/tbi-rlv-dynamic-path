import React from 'react';

const SigninOption = (props) => {
    const{ profileRef } = props;

    return (
        <div className="container rounded my-3 signin-container">
            <div className="row gutter-10 m-0 py-3">
                <div className="col-xs-9 col-md-10 signin-text-innercontainer">
                    <svg className="icon-md mr-2 icon-lg icon-md fill-primary" width="50px" height="50px" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" >
                        <use xlinkHref="/img/icons/amenities-icon-defs.svg#icon-gift" />
                    </svg>
                    <div>
                        <div className="signin-title">
                            Sign-In And Get Exclusive Discounts!
                        </div>
                        <div className="signin-secondary">
                        Sign-In And Unlock all the exclusive offers
                        </div>
                    </div>
            
                </div>
                <div className="col-xs-3 col-md-2">
                        <div className="button-container">
                            <button className='btn btn-primary-outline w-100 signin-button ' onClick={profileRef.current.openSignInModel}  >Sign In</button>
                        </div>
                </div>
            </div>
            </div>
    );
};

export default SigninOption;