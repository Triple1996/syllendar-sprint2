import React, { useState } from 'react';
import { Socket } from './Socket';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import 'date-fns';

export default function CreateEvent({ date, closeModal }) {
  
  const [title, setTitle] = useState('');
  const [startdt, setStartdt] = useState(date);
  const [enddt, setEnddt] = useState('');
  const [starttm, setStarttm] = useState('2014-08-18T21:11:54');
  const [endtm, setEndtm] = useState('2014-08-18T22:11:54');
  const [imp, setImp] = useState(false);
  const [location, setLocation] = useState('');
  const [contact, setContact] = useState("");
  const [des, setDes] = useState('');
  const [sameDayEvent, setSameDayEvent] = useState(true);
  
  const [actualEndTm, setActualEndTm] = useState("");
  const [actualStartTm, setActualStartTm] = useState("");

  function formatTime(e, type) {
    let string = e.toString();
    string = string.split(" ");
    let fulltime = string[4];
    fulltime = fulltime.split(":");
    let time = fulltime[0] + ":" + fulltime[1];
    
    if(type === "endtm") {
      setActualEndTm(time);
    } else {
      setActualStartTm(time);
    }
    
    
    let rtn = '2014-08-18T' + time + ':00';
    return rtn;
  }


  function handleSubmit() {
    
    let email = window.sessionStorage.getItem('email');
    let name = window.sessionStorage.getItem('name');
    
    if (sameDayEvent) {
      setEnddt(startdt);
    }
    
    console.log(actualStartTm, actualEndTm);
    
    Socket.emit('add event', {
      name,
      email,
      title,
      startdt,
      actualStartTm,
      actualEndTm,
      endtm,
      imp,
      location,
      contact,
      des,
    });
    
    //TODO: figure out how to close the modal when done!!!!!

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
                      value={startdt}
                      onChange={(e) => setStartdt(e.target.value)}
                      placeholder="Start Date"
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
                    <div></div> 
                    :  
                    <div className="col-10 text-center">
                      <label>End Date</label>
                      <input className="form-control form-group" type="date" name="endDate" placeholder="End Date" value={enddt} onChange={(e) => setEnddt(e.target.value)}/>
                    </div>
                  }
                  <div className="col-10">
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardTimePicker
                          ampm={false}
                          margin="normal"
                          id="start-time-picker"
                          label="Start Time"
                          value={starttm}
                          onChange={(e) => setStarttm(formatTime(e, "starttm"))}
                          KeyboardButtonProps={{
                            'aria-label': 'change time',
                          }}
                        />
                    </MuiPickersUtilsProvider>  
                  </div>
                  <div className="col-10">
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardTimePicker
                          ampm={false}
                          margin="normal"
                          id="end-time-picker"
                          label="End Time"
                          value={endtm}
                          onChange={(e) => setEndtm(formatTime(e, "endtm"))}
                          KeyboardButtonProps={{
                            'aria-label': 'change time',
                          }}
                        />
                    </MuiPickersUtilsProvider>  
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
