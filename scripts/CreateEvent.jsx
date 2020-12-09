import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Socket } from './Socket';
import { Form } from 'react-bootstrap';


export default function CreateEvent({ date, closeModal }) {
  // TODO - Figure out which one we need from the user, which one we can generate with the info of the date selected
  // example of how to access the day
  //console.log(date.day); // this will print out the number of which of the boxes in the calendar component got selected.
  // we can create the date something like this
  //const currentDate = `${date.month}/${date.day}/${date.year}`;
  // then we can pass this as the startdate and remove the whole startdt useState hook, I will comment it out .
  console.log("in createEvent date = ", date)

  const [title, setTitle] = useState('');
  const [startdt, setStartdt] = useState(date);
  const [starttm, setStarttm] = useState('');
  const [enddt, setEnddt] = useState('');
  const [endtm, setEndtm] = useState('');
  const [imp, setImp] = useState(false);
  const [location, setLocation] = useState('');
  const [contact, setContact] = useState("")
  const [des, setDes] = useState('');
  const [sameDayEvent, setSameDayEvent] = useState(true)
  

  function handleSubmit() {
    
    let email = window.sessionStorage.getItem('email');
    let name = window.sessionStorage.getItem('name');
    
    if (sameDayEvent) {
      setEnddt(startdt)
    }
    
    Socket.emit('add event', {
      name,
      email,
      title,
      startdt,
      starttm,
      enddt,
      endtm,
      imp,
      location,
      contact,
      des,
    });

  }
  
  function handleChooseDate(e) {
    console.log(e)
  }

    return (
        <div>
              <div className="form-group">
                <div className="row">
                  <div className="col-10 text-center">
                    <input
                      className="form-control form-group"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Event Name"
                    />
                  </div>
                  <div className="col-10 text-center">
                    <input
                      className="form-control form-group"
                      value={starttm}
                      onChange={(e) => setStarttm(e.target.value)}
                      placeholder="Start Time"
                    />
                  </div>
                  <div className="col-10 text-center">
                    <input
                      className="form-control form-group"
                      value={startdt}
                      onChange={(e) => setStartdt(e.target.value)}
                      placeholder="Start Date (get as a prop!!!)"
                    />
                  </div>
                  
                  
                  <div className="col-10 text-center">
                    <div className="row">
                      <div className="col-1">
                      <input
                        name="Important"
                        className="form-control form-group"
                        type="checkbox"
                        checked={sameDayEvent}
                        onChange={(e) => setSameDayEvent(e.target.checked)}
                      />
                      </div>
                      <div className="col-8 text-left">
                        <p>Same Day Event</p>
                      </div>
                    </div>
                  </div>
                  
                  {sameDayEvent ? 
                    "" 
                    :  
                    <div className="col-10 text-center">
                      <label>End Date</label>
                      <input className="form-control form-group" type="date" name="endDate" placeholder="End Date" value={enddt} onChange={(e) => setEnddt(e.target.value)}/>
                    </div>
                  }
                  
                 
                  
                  
                  
                  
                  <div className="col-10 text-center">
                    <input
                      className="form-control form-group"
                      value={endtm}
                      onChange={(e) => setEndtm(e.target.value)}
                      placeholder="End Time"
                    />
                  </div>
                  <div className="col-10 text-center">
                    <input
                      className="form-control form-group"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Location"
                    />
                  </div>
                  <div className="col-10 text-center">
                    <input
                      className="form-control form-group"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="Phone Number ex: +1..."
                    />
                  </div>
                  <div className="col-10 text-center">
                    <input
                      className="form-control form-group"
                      value={des}
                      onChange={(e) => setDes(e.target.value)}
                      placeholder="Description"
                    />
                  </div>
                  <div className="col-10 text-center">
                    <div className="row">
                      <div className="col-1">
                        <input
                          name="Important"
                          className="form-control form-group"
                          type="checkbox"
                          checked={imp}
                          onChange={(e) => setImp(e.target.checked)}
                        />
                      </div>
                      <div className="col-8 text-left">
                        <p>SMS Notification</p>
                      </div>
                    </div>
                  </div>
                <button className="btn btn-primary" onClick={handleSubmit}>Submit</button>
          </div>
        </div>
        </div>
      )
}
