import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DynamicEngine from 'components/engines/dynamicEngine';
import Profile from 'components/widgets/profile';
import BookingSteps from 'components/common/BookingSteps';
import 'react-dates/initialize';

class Index extends Component {
    constructor(props) {
        super(props);

        this.state = {
            steps: [
                {
                    visible: false,
                    status: 'default',
                },
                {
                    visible: false,
                    status: 'default',
                },
                {
                    visible: false,
                    status: 'default',
                },
                {
                    visible: true,
                    status: 'default',
                },
                {
                    visible: true,
                    status: 'default',
                },
            ],
        };

        this.submit = this.submit.bind(this);
    }

    submit(request) {
        const form = document.getElementById('ses_exiredForm');
        const formRequest = document.getElementById('ses_reqestData');

        formRequest.value = JSON.stringify(request);
        form.submit();
    }

    render() {
        const { steps } = this.state;
        const { features, parameters, profileConfig } = this.props;
        return (
            <div>
                {(features !== undefined && profileConfig !== undefined && features.profile) && (
                    <>
                        <Profile element="pro_section" config={profileConfig}/>
                        <Profile element="pro_section_mobile" config={profileConfig}/>
                    </>
                )}
                <BookingSteps steps={steps} />
                <DynamicEngine submitRequest={this.submit} parameters={parameters} />
            </div>
        );
    }
}

Index.propTypes = {
    parameters: PropTypes.instanceOf(Object).isRequired,
    features: PropTypes.instanceOf(Object).isRequired,
};

export default Index;
