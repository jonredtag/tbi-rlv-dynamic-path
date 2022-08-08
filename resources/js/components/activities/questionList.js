import React, { useState, forwardRef, useImperativeHandle } from 'react';
import AriaModal from 'react-aria-modal';
import Select from '../selectors/Select';
import Lang, { priceFormat } from 'libraries/common/Lang';
import uniqueID from '../../helpers/uniqueID';

const QuestionList = forwardRef((props,ref) => {
    const { mdl, validate } = props;
    const { questions, name, thumbImg, selectDate, destination } = mdl;
    const questionsKeys = questions.map((item) => item.key);
    const [optQuestions, setOptQuestions] = useState([]);

    const [errors, setErrors] = useState({});
    const addError = (id) =>{ 
        errors[id] = true;
        setErrors({...errors});
    };

    const clearError = (id) => {
        if (Object.prototype.hasOwnProperty.call(errors, id)) {
            delete errors[id];
        }
        setErrors({...errors});
    };

    const check = () =>{
        const errorCheck = {};
        if (questionsKeys.length) {
            for (let i = 0; i < questionsKeys.length; i++) {
                const key = questionsKeys[i];
                if (!Object.prototype.hasOwnProperty.call(optQuestions, key) 
                    || optQuestions[key].trim() ==='') { 
                    addError(key);
                }
            }
        }
    };

    const onChangeQuestion = (key, e) => {
        const { value } = e.target;
        clearError(key);
        optQuestions[key] = value;
        setOptQuestions({ ...optQuestions});
        validate();
    };

    useImperativeHandle(ref, () => ({
        errorCheck: () => {
            check();
            const errorKeys = Object.keys(errors);
            return errorKeys.length;
        },
        getAnswers: () =>{
            return optQuestions; 
        },
    }));

    const errorKeys = Object.keys(errors);

    return (<>
                <div className="row padding">
                    <div><strong>Compulsory Information</strong></div>
                    <div className="alert alert-success mt-2 mt-lg-0">
                        <p className="m-0">Please note: If the incorrect details are provided, the provider will not be held responsible for correct service provision and you may be subject to cancellation/no-show fees.</p>
                    </div>
                </div>

                {questions.map((item) => (
                    <div
                        className=""
                        key={item.key}
                    >

                        <span>{item.text}</span>
                        <div>
                            <input
                                id={item.key}
                                type="text"
                                value={
                                    Object.prototype.hasOwnProperty.call(
                                        optQuestions,
                                        item.key
                                    )
                                        ? optQuestions[item.key]
                                        : ''
                                }
                                className={errorKeys.includes(item.key)?"form-control border  error-highlight":"form-control border"} 
                                onChange={(e) =>
                                    onChangeQuestion(item.key, e)
                                }
                            />

                        </div>
                    </div>
                ))}
            </>
        );
});

export default QuestionList;
