import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import AriaModal from 'react-aria-modal';
import Select from '../selectors/Select';
import ErrorText from 'components/snippets/errorText';
import QuestionList from './questionList';
import Lang, { priceFormat } from 'libraries/common/Lang';
import uniqueID from '../../helpers/uniqueID';


const QuestionResult = forwardRef(({ list }, ref) => {
    const refArr = [];
    const [error, setError] = useState(false);

    const results = Object.values(list);
    let haveQuestion = false;
    const mdlList = [];
    for (let i = 0; i < results.length; i++) {
        refArr.push(useRef());
        const mdl = results[i];
        if (Object.prototype.hasOwnProperty.call(mdl, 'questions') && mdl.questions.length) {
            haveQuestion = true;
            mdlList.push(mdl);
        }
    }

    const checkError = () =>{
        let error = false;
        for (let i = 0; i < mdlList.length; i++) {
            if (refArr[i].current.errorCheck()) {
                error = true;
            }
        }
        setError(error);
        return error;
    };

    useImperativeHandle(ref, () => ({
        validate: () => {
           return checkError();
        },
        getAnswers: () => {
            const answers = {};
            for(let i = 0; i < mdlList.length; i++){
                const key = mdlList[i]['selectId'];
                answers[key] = refArr[i].current.getAnswers();
            }
            return answers;
        },

    }));

    return haveQuestion && (<div className='rounded-sm p-3 mb-3 box-shadow color-pop bg-white'>
                {error && (
                    <div className="error-container w-100 mb-2">
                        <ErrorText key='act-question' error={{message:'Please complete all the questions here'}} />
                    </div>
                )}
                <div className="border-top pt-3 mt-3">
                    {mdlList.map((item,i)=>(<QuestionList
                                                validate={checkError}
                                                ref={refArr[i]}
                                                mdl={item}
                                            />))}
                </div>
            </div>);

});

export default QuestionResult;
