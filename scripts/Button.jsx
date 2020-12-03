import React from 'react';
import ModalTest from './ModalTest';

export default class Button extends React.Component {
    
    componentDidMount() {
        console.log("in Button props =", this.props)
    }
    
    render () {
        return (
          <div>
            <button
              className="button"
              onClick={this.props.buttonClick}
              open={this.props.open}
            > {this.props.buttonName}
            </button>
            <ModalTest 
              open={this.props.open}
              buttonClick={this.props.buttonClick}
              bodyText={this.props.bodyText}
            />
          </div>
        );
  }
}