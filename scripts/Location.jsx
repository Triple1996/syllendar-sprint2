import React from 'react';

export default class Location extends React.Component {
    
    componentDidMount() {
        console.log("In Location, props =", this.props)
    }
    
    render () {
    return (
      <div 
        className={this.props.open 
          ? "content-wrapper content-open"
          : "content-wrapper"}
      >
        <i className="fa fa-times-circle" 
           onClick={this.props.buttonClick}
        ></i>
        <p className="modal-content">
           {this.props.bodyText}
        </p>
      </div>
    );
  }
}
