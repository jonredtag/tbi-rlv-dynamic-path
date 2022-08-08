import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import Helper from 'libraries/common/Helper';
import Lang from 'libraries/common/Lang';
import PropTypes from 'prop-types';


const InsuranceCIBC = forwardRef((props,ref) => {
    const [insurance, setInsurance] = useState(props.default);
    const [errors, setErrors] = useState({});
    const [refresh, setRefresh] = useState(false);
    const { shadow } = props;

    const updateErrorState = () =>{
        Object.keys(insurance).forEach((key) => {
            const model = `insurance.${key}`;
            if (insurance[key] == 0) {
                const e = { id: model, message: Lang.trans(`error_insurance.${model.replace(/\./g, '_')}`) };
                errors[model] = Helper.error(e);
            } else {
                delete errors[model];
            }
        });
        setErrors(errors);
        setRefresh(!refresh);
        return errors;
    };

    useImperativeHandle(ref, () => ({
        validateInsurace: () => {
            const errorState = updateErrorState();
            return { cibcInsInvalid: Object.keys(errorState).length > 0, cibcInsInfo: insurance };
        },
    }));

  
    function selectInsurance(e) {
        insurance[e.target.name] = e.target.value;
        setInsurance(insurance);
        updateErrorState();
    }

    return (        
            <div ref={ref} className={`border rounded p-3 mb-3 ${shadow ? 'box-shadow' : ''} `}>
                <div className="d-flex justify-content-between mb-2">
                    <div className="d-flex align-items-center">
                        <div className="mr-2">
                            <svg className="icon-md" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                <use xlinkHref={`${IMG_ICONS}icon-defs.svg#icon-hand-umbrella`} />
                            </svg>
                        </div>
                        <h1 className="m-0 h5">{Lang.trans('insurance.travel_insurance_info')}</h1>
                    </div>
                </div>


                <div className="border-top pt-3 my-3">
                    <div className="mb-3">
                        <div className="payment-section-sub-header">{Lang.trans('insurance.pls_select')}</div>
                    </div>
                </div>

                        

                <div className="rounded color-pop p-2 mt-3">
                    {errors['insurance.trip_cancel'] !== undefined && (
                    <>
                        <span role="alert" className="sr-only">{Lang.trans('insurance.protect_insurance')} Errors Found</span>
                        <div className="error-container w-100 mb-2">{errors['insurance.trip_cancel']}</div>
                    </>
                    )}
                    <div className="row gutter-10 align-items-center">
                        <div className="col-md-7">
                            <h6>Contact me regarding {Lang.trans('insurance.trip_cancellation_ins')}<span aria-hidden="true" className="asterix">*</span></h6>
                        </div>
                        <div className="col-md-5">
                            <div className="element-container input-chevron-down">
                                <div>
                                    <select onBlur={(e) => selectInsurance(e)} required="required" name="trip_cancel" onChange={selectInsurance} className={`form-control default-select bg-white`}>
                                        <option value="0">-</option>
                                        <option value="1">No, thank you</option>
                                        <option value="2">Yes, please</option>
                                    </select>
                               </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="rounded color-pop p-2 mt-3">
                    {errors['insurance.medical'] !== undefined && (
                    <>
                        <span role="alert" className="sr-only">{Lang.trans('insurance.protect_insurance')} Errors Found</span>
                        <div className="error-container w-100 mb-2">{errors['insurance.medical']}</div>
                    </>
                    )}
                    <div className="row gutter-10 align-items-center">
                        <div className="col-md-7">
                            <h6>Contact me regarding {Lang.trans('insurance.travel_med_ins')}<span aria-hidden="true" className="asterix">*</span></h6>
                        </div>
                        <div className="col-md-5">
                            <div className="element-container input-chevron-down">
                                <div>
                                    <select onBlur={(e) => selectInsurance(e)} onChange={selectInsurance} name="medical" className={`form-control default-select bg-white`}>
                                        <option value="0">-</option>
                                        <option value="1">No, thank you</option>
                                        <option value="2">Yes, please</option>
                                    </select>
                               </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
       
    );
});


InsuranceCIBC.propTypes = {
    default: PropTypes.instanceOf(Object),
    onChange: PropTypes.func.isRequired,
    shadow: PropTypes.bool,
};

InsuranceCIBC.defaultProps = {
    default: {trip_cancel: '0', medical: '0'},
    shadow: false,
};

export default InsuranceCIBC;
