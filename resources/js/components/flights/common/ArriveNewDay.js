
import React, { Component } from 'react';
import Tooltip from 'reactstrap/lib/Tooltip';

class ArriveNewDay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
        };
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({ show: !this.state.show }) ;
    }

    render(){

        const  {fid, arrivalDate } = this.props;
            let message = `Flight arrives ${arrivalDate}`;
            return (
                    <Tooltip placement="top" isOpen={this.state.show} target={fid} toggle={this.toggle} >
                        {message}
                    </Tooltip>
            );



    }
}

export default ArriveNewDay;

