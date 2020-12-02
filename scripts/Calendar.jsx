import React, { useState } from 'react';

export default class Calendar extends React.Component {
  constructor () {
    super();
    this.state = {
      z: [],
      currentMonth: new Date().getMonth() + 1,
      currentYear: new Date().getFullYear(),
      calMonth: new Date().toLocaleString("default", { month: "long" }),
      actualYear: new Date().getFullYear()
    }
  }
  
  makeCalendar() {
    // TODO: Read from socket? then
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
      y[x + fifthPart - 1] = x;
    }

    for (x = 0; x < 7; x++) {
      if (y[x] === 32) {
        y[x] = null;
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
        this.makeCalendar();
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
          this.makeCalendar();
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
        this.makeCalendar();
      });
    }
  }

  isEvent(day) {
    //TODO -- check for event and add event button with event name if exists
    if (day === null) {
      return;
    }
    return <button id="dayEvent"></button>;
  }

  componentDidMount() {
    if (this.state.currentMonth > 2) {
      this.setState({ currentMonth: this.state.currentMonth - 2.0 }, () => {
        this.makeCalendar();
      });
    } else {
      this.setState({ currentMonth: this.state.currentMonth + 10.0 }, () => {
        this.makeCalendar();
      });
    }
  }

  render() {
    const { calMonth, actualYear } = this.state;
    return (
      <div className="Syllendar">
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
            <div className="dayBlock" key={index}>
              <div>{day}</div>
              {this.isEvent(day)}
            </div>
          ))}
        </div>
      </div>
    );
  }
}