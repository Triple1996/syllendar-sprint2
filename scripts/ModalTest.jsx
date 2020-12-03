import React from 'react';
import Location from './Location';

export default class ModalTest extends React.Component {
    
    componentDidMount() {
        console.log("In ModalTest props =", this.props)
    }
    
    render () {
      return (
        <div 
          className={this.props.open 
            ? "inner-modal inner-modal-open"
            : "inner-modal"}
        >
          <Location 
            open={this.props.open}
            bodyText={this.props.bodyText}
            buttonClick={this.props.buttonClick} 
          />
        </div>
      );
    }
}