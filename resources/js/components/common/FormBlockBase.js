import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Lang from 'libraries/common/Lang';



class FormBlockBase extends Component {
    constructor(props) {
        super(props);
        this.getInfo = this.getInfo.bind(this);
        this.changeInput = this.changeInput.bind(this);
        this.changeCheckbox = this.changeCheckbox.bind(this);
        this.blur =  this.blur.bind(this);
        this.blurExpiry =  this.blurExpiry.bind(this);
        this.state = {
            errors: {},
        };

    }


    getInfo() { }


    changeInput(e) {
        const modelKey = e.target.dataset.model;
        const model = modelKey.split('.');
        const data = this.state;
        const v = e.target.value;
        // console.log(model[0], model[1], v);
        data[model[0]][model[1]] = v;
        const errors =  this.state.errors;
        if(Object.prototype.hasOwnProperty.call(errors, modelKey)){
            this.setState(data, () => this.validate(modelKey));
        } else {
            this.setState(data);
        }
    }

    changeCheckbox(e) {
        const modelKey = e.target.dataset.model;
        const model = modelKey.split('.');
        const data = this.state;
        const v = e.target.value;
        // console.log(model[0], model[1], v);
        data[model[0]][model[1]] = e.target.checked?v:'';
        const errors =  this.state.errors;
        if(Object.prototype.hasOwnProperty.call(errors, modelKey)){
            this.setState(data, () => this.validate(modelKey));
        } else {
            this.setState(data);
        }
    }

    validate(modelKey){
        const model = modelKey.split('.');
        const v = this.state[model[0]][model[1]];

        if(v == '' && this.state.optionals !== undefined && this.state.optionals.indexOf(modelKey) < 0){
            this.addError(modelKey, {
                    id: modelKey,
                    message: Lang.trans(`${modelKey}`) + ' ' + Lang.trans('error.is_required'),
            });
        } else{
            this.clearError(modelKey);
        }

    }

     addError(key, error) {
        const errors = this.state.errors;
        // add error to key array
        errors[key] = error;

        // replace state
        this.setState({
            errors,
        });

    }

    clearError(key) {
        const errors = this.state.errors;
        if (Object.prototype.hasOwnProperty.call(errors, key)) {
            delete errors[key];
            this.setState({
                errors,
            });
        }
    }


    blur(e) {
        this.validate(e.target.dataset.model);
    }

    blurExpiry(e) {
        this.validate(e.target.dataset.model);
    }

}

export default FormBlockBase;
