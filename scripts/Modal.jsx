import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Socket } from './Socket';

export default function Modal({isShowing, hide, date}) {
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [startdt, setStartdt] = useState("");
  const [starttm, setStarttm] = useState("");
  const [enddt, setEnddt] = useState("");
  const [endtm, setEndtm] = useState("");
  const [location, setLocation] = useState("");
  const [des, setDes] = useState("");
  
  function handleSubmit() {
    Socket.emit('add event', {
      'name': name,
      'email': email,
      'title': title,
      'startdt': startdt,
      'starttm': starttm,
      'enddt': enddt,
      'endtm': endtm,
      'location': location,
      'des': des
    })
  }
  
  if (isShowing) {
    return (
      ReactDOM.createPortal(
        <React.Fragment>
          <div className="modal-overlay"/>
          <div className="modal-wrapper" aria-modal aria-hidden tabIndex={-1} role="dialog">
            <div className="modal">
              <div className="modal-header">
                <button type="button" className="modal-close-button" data-dismiss="modal" aria-label="Close" onClick={hide}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="form-group">
                <h3>Create an event</h3>
                <div className="row">
                  <div className="col-10 text-center">
                    <input 
                      className="form-group"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Name"
                    />
                  </div>
                  <div className="col-10 text-center">
                    <input 
                      className="form-group"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                    />
                  </div>
                  <div className="col-10 text-center">
                    <input 
                      className="form-group"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Title"
                    />
                  </div>
                  <div className="col-10 text-center">
                    <input 
                      className="form-group"
                      value={startdt}
                      onChange={(e) => setStartdt(e.target.value)}
                      placeholder="Start Date"
                    />
                  </div>
                  <div className="col-10 text-center">
                    <input 
                      className="form-group"
                      value={starttm}
                      onChange={(e) => setStarttm(e.target.value)}
                      placeholder="Start Time"
                    />
                  </div>
                  <div className="col-10 text-center">
                    <input 
                      className="form-group"
                      value={enddt}
                      onChange={(e) => setEnddt(e.target.value)}
                      placeholder="End Date"
                    />
                  </div>
                  <div className="col-10 text-center">
                    <input 
                      className="form-group"
                      value={endtm}
                      onChange={(e) => setEndtm(e.target.value)}
                      placeholder="End Time"
                    />
                  </div>
                  <div className="col-10 text-center">
                    <input 
                      className="form-group"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Location"
                    />
                  </div>
                  <div className="col-10 text-center">
                    <input 
                      className="form-group"
                      value={des}
                      onChange={(e) => setDes(e.target.value)}
                      placeholder="Destination"
                    />
                  </div>
                </div>
                <button className="btn btn-primary" onClick={handleSubmit}>Submit</button>
              </div>
            </div>
          </div>
        </React.Fragment>, document.body
      )
    )
  } else {
    return (
      <div></div>
    )
  }
}