import React from 'react';
import Button from './Button';

export default class NewModal extends React.Component {
    constructor() {
        super();
        this.state = {
            open: false
        }
    }
    
    componentDidMount() {
        console.log("Mounted state =", this.state)
    }
    
    componentDidUpdate() {
        console.log(this)
    }
    
    buttonClick () {
        console.log(this.state)
        this.setState({open: !this.state.open}); 
    }
  
    render () {
        const bodyText = "Hello World";
        const buttonName = "Click";
        
        return (
          <Button
            buttonClick={this.buttonClick}
            open={this.state.open}
            bodyText={bodyText}
            buttonName={buttonName}
          />
        );
    }
}

