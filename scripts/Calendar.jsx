import React, { useState } from 'react';
import CreateEvent from './CreateEvent';
import UpdateEvent from './UpdateEvent';
import { Socket } from './Socket';
import Modal from 'react-bootstrap/Modal';

export default class Calendar extends React.Component {
  constructor () {
    super();
    this.state = {
      z: [],
      currentMonth: new Date().getMonth() + 1,
      currentYear: new Date().getFullYear(),
      calMonth: new Date().toLocaleString("default", { month: "long" }),
      actualYear: new Date().getFullYear(),
      events: [],
      showUpdateEventContent: false,
      showAddEventContent: false,
      selectedDate: "",
      show: false
    }
  }
  
  makeCalendar(events = []) {
    let y = [];
    let century = parseFloat(this.state.currentYear.toString().slice(0, 2));
    let year = parseFloat(this.state.currentYear.toString().slice(-2));
    let monthMax;
    if (this.state.currentMonth === 12) {
      if (this.state.actualYear % 4 === 0) {
        monthMax = 29;
      } else {
        monthMax = 28;
      }
    } else if (
      this.state.currentMonth === 2 ||
      this.state.currentMonth === 4 ||
      this.state.currentMonth === 7 ||
      this.state.currentMonth === 9
    ) {
      monthMax = 30;
    } else {
      monthMax = 31;
    }

    let firstPart =
      1.0 +
      parseFloat((2.6 * this.state.currentMonth - 0.2).toString().slice(0, 4));
    let secondPart = 2.0 * parseFloat(century);
    let thirdPart = parseFloat((firstPart - secondPart).toString().slice(0, 8));
    let fourthPart = thirdPart + year + year / 4.0 + century / 4.0;
    let fifthPart = Math.trunc(fourthPart % 7);

    if (fifthPart < 0) {
      fifthPart = fifthPart + 7;
    }
    for (var i = 0; i < fifthPart; i++) {
      y.push(32);
    }

    for (var x = 1; x !== monthMax + 1; x++) {
      y[x + fifthPart - 1] = {day: x, eventsInDay: []};
        for (let i = 0; i < events.length; i ++) {
          if (parseInt(events[i].Day) == x) {
            y[x + fifthPart - 1].eventsInDay.push(events[i])
          } 
        }
    }

    for (x = 0; x < 7; x++) {
      if (y[x] === 32) {
        y[x] = {day: null, eventsInDay: []}
      }
    }
    
    this.setState({ z: y });
  }

  getMonthName(month) {
    const months = [
      "",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
      "January",
      "February"
    ];
    return months[month];
  }

  lastMonth() {
    if (this.state.currentMonth === 1) {
      this.setState(
        {
          currentMonth: this.state.currentMonth + 11,
          currentYear: this.state.currentYear - 1
        },
        () => {
          this.setState({
            calMonth: this.getMonthName(this.state.currentMonth)
          });
          this.makeCalendar();
        }
      );
    } else {
      this.setState({ currentMonth: this.state.currentMonth - 1 }, () => {
        if (this.state.currentMonth === 10) {
          this.setState({
            actualYear: this.state.actualYear - 1
          });
        }
        this.setState({
          calMonth: this.getMonthName(this.state.currentMonth)
        });
        this.makeCalendar(this.state.events);
      });
    }
  }

  nextMonth() {
    if (this.state.currentMonth === 12) {
      this.setState(
        { currentMonth: 1, currentYear: this.state.currentYear + 1 },
        () => {
          this.setState({
            calMonth: this.getMonthName(this.state.currentMonth)
          });
          this.makeCalendar(this.state.events);
        }
      );
    } else if (this.state.currentMonth < 12) {
      this.setState({ currentMonth: this.state.currentMonth + 1 }, () => {
        if (this.state.currentMonth === 11) {
          this.setState({
            actualYear: this.state.actualYear + 1
          });
        }
        this.setState({ calMonth: this.getMonthName(this.state.currentMonth) });
        this.makeCalendar(this.state.events);
      });
    }
  }
  
  renderEvents(events) {
    
    if (this.state.currentMonth > 2) {
      this.setState({ currentMonth: this.state.currentMonth - 2.0 }, () => {
        this.makeCalendar(events.allEvents);
      });
    } else {
      this.setState({ currentMonth: this.state.currentMonth + 10.0 }, () => {
        this.makeCalendar(events.allEvents);
      });
    }
  }
  
  getAllEventsFromDB() {
    let month;
    if (this.state.currentMonth > 10) {
      month = this.state.currentMonth - 10;
    } else {
      month = this.state.currentMonth + 2;
    }
    
    Socket.emit('load events', {
      email: window.sessionStorage.getItem('email'),
      year: this.state.actualYear,
      month: month,
    });
    
    Socket.on('received events', (data) => {
      this.setState({events: data})
      this.renderEvents(data)
    })
  }

  componentDidMount() {
    
    this.getAllEventsFromDB()
    //TODO: make it not hardcode
    
  }
  
  componentDidUpdate() {
    console.log(this.state)
  }
  
  openEventInfor(event) {
    //open modal here again to update the event and be able to see it
    console.log(event)
  }
  
  renderEvent(day) {
    if (day.eventsInDay && day.day !== null && day.eventsInDay.length > 0) {
       return (
        <div className="events">
          {day.eventsInDay.map((event, index) => (
            <div>
              <div key={index} className="event" onClick={() => this.setState({show: true, showUpdateEventContent: true})}>{event.Event}</div>
            </div>
          ))}
        </div>
      );
    }
  }

  render() {
    //TODO: Try do ternary if statements to render either add event, or update event based on the state.
    //have one modal component, 2 states: 1 for showing a modal, other for which content you want to see in the modal
    const { calMonth, actualYear } = this.state;
    return (
      <div className="Syllendar container-fluid">
        <div className="row">
          <div className="col-12 text-center">
              <div className="month">
                <h1>
                  <button id="left" onClick={() => this.lastMonth()}>
                    {" "}
                    &larr;{" "}
                  </button>
                  {calMonth} {actualYear}
                  <button id="right" onClick={() => this.nextMonth()}>
                    {" "}
                    &rarr;{" "}
                  </button>
                </h1>
              </div>
          </div>
        </div>
        <div className="week">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tues</div>
          <div>Wed</div>
          <div>Thurs</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>
        <div className="day">
          {this.state.z.map((day, index) => (
            <div className="dayBlock" key={index} >
              <div className="row">
                <div className="col-8 left">
                  <div>{day.day}</div>
                </div>
                <div className="col-4 right">
                  {day.day ? 
                  <div 
                    id="addEventBtn" 
                    className="btn btn-primary btn-sm" 
                    onClick={() => this.setState({show: true, showAddEventContent: true, selectedDate: day.day})}
                    >
                  +
                  </div> 
                  : 
                  <div></div> 
                  }
                </div>
              </div>
              <div>{this.renderEvent(day)}</div>
            </div>
          ))}
        </div>
        <Modal
          size="lg"
          show={this.state.show}
          onHide={() => this.setState({show: false, showAddEventContent: false, showUpdateEventContent: false})}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
              {this.state.showAddEventContent ? "Create Event" : "" }
              {this.state.showUpdateEventContent ? "Update Event" : "" }
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.showAddEventContent ? <CreateEvent date={this.state.selectedDate}/> : <div></div> }
            {this.state.showUpdateEventContent ? <UpdateEvent /> : <div></div> }
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}