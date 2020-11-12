import React, { useState } from "react";
import Modal from './Modal';
import useModal from './useModal';

export default function Calendar() {
  //const [days, setDays] = React.useState([]);
  const {isShowing, toggle} = useModal();
  const [date, setDate] = useState("")
  
  function daySelected(date) {
    toggle();
    setDate(date)
  }
  
  let i = [];
  let x = 1;
  //TODO add function to put the correct date on the correct day
  //TODO need to remove hard coded 32 and figure out how to get the proper amount of days in the month
  while (x !== 32) {
    i[x] = x;
    x++;
  }
  
  return (
    <div className="Syllendar">
      <div className="month"> </div>
      <div className="week">
        <div className="center">Sun</div>
        <div className="center">Mon</div>
        <div className="center">Tues</div>
        <div className="center">Wed</div>
        <div className="center">Thurs</div>
        <div className="center">Fri</div>
        <div className="center">Sat</div>
      </div>
      <div className="day">
        {i.map((day, index) => (
          <div id="dateBox" key={index}>
            <div>{day}</div>
            <button id="dayEvent" onClick={() => daySelected(day)}></button>
          </div>
        ))}
      </div>
      <div className="app">
      <Modal
        isShowing={isShowing}
        hide={toggle}
        date={date}
      />
      </div>
    </div>
  );
}
