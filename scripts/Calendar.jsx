import React, { useState } from "react";
import Modal from './Modal';
import useModal from './useModal';

export default function Calendar() {
  const {isShowing, toggle} = useModal();
  const [date, setDate] = useState("");
  
  function daySelected(date) {
    toggle();
    setDate(date);
    if (date == null) {
      return;
    }
    return <button id="dayEvent"></button>;
  }
  
  let y = [];
  let currentTime = new Date();
  let currentDate = currentTime.getDate();
  let currentMonth = currentTime.getMonth() + 1;
  let currentYear = currentTime.getFullYear();
  let century = parseFloat(currentYear.toString().slice(0, 2));
  let year = parseFloat(currentYear.toString().slice(-2));
  let calMonth = currentTime.toLocaleString("default", { month: "long" });
  let firstPart =
    currentDate + parseFloat((2.6 * currentMonth - 0.2).toString().slice(0, 4));
  let secondPart = 2.0 * parseFloat(century);
  let thirdPart = parseFloat((firstPart - secondPart).toString().slice(0, 4));
  let fourthPart = thirdPart + year + year / 4 + century / 4;
  let fifthPart = Math.trunc(fourthPart % 7);
  var i = 0;
  let x = 1;
  for (i; i < fifthPart - 1; i++) {
    y.push(null);
  }
  let monthMax;
  if (currentMonth === 2) {
    if (currentYear % 4 === 0) {
      monthMax = 29;
    } else {
      monthMax = 28;
    }
  } else if (
    currentMonth === 4 ||
    currentMonth === 6 ||
    currentMonth === 9 ||
    currentMonth === 11
  ) {
    monthMax = 30;
  } else {
    monthMax = 31;
  }

  while (x !== monthMax + 1) {
    y[x] = x;
    x++;
  }

  return (
    <div className="Syllendar">
      <div class="month">
        <h1>
          {calMonth} {currentYear}
        </h1>
      </div>
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
