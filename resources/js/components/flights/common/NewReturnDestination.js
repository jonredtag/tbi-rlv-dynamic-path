
import React, { Component } from 'react';
import Tooltip from 'reactstrap/lib/Tooltip';

class NewReturnDestination extends Component {
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

        const { nlid, keyItinerary }  = this.props;
        //const element = document.getElementById('"' + nlid + '"');
        //console.log(element);
        //if( element.classList.contains(divClassName) ) {}
            let tripType, message;
            keyItinerary>0 ? tripType = "departure" : tripType = "return";
            message =  `Different than ${tripType} airport`;
            return (
                    <Tooltip placement="top" isOpen={this.state.show} target={nlid} toggle={this.toggle} >
                        {message}
                    </Tooltip>
            );



    }
}

export default NewReturnDestination;

