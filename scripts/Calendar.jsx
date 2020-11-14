import React, { useState } from 'react';
import Modal from './Modal';
import useModal from './useModal';

export default function Calendar() {
  const { isShowing, toggle } = useModal();
  const [date, setDate] = useState('');

  let y = [];
  let currentTime = new Date();
  let currentMonth = currentTime.getMonth() + 1;
  let currentYear = currentTime.getFullYear();
  let century = parseFloat(currentYear.toString().slice(0, 2));
  let year = parseFloat(currentYear.toString().slice(-2));
  let calMonth = currentTime.toLocaleString("default", { month: "long" });
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

  if (currentMonth > 2) {
    currentMonth = currentMonth - 2.0;
  } else {
    currentMonth = currentMonth + 10.0;
  }
  let firstPart =
    1.0 + parseFloat((2.6 * currentMonth - 0.2).toString().slice(0, 4));
  let secondPart = 2.0 * parseFloat(century);
  let thirdPart = parseFloat((firstPart - secondPart).toString().slice(0, 8));
  let fourthPart = thirdPart + year + year / 4 + century / 4;
  let fifthPart = Math.trunc(fourthPart % 7);
  monthMax = monthMax + fifthPart;

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

  function daySelected(day) {
    // TODO - Logic for figureing out what the date is accoridng the number they chose. I will start
    // this object can contain the email that we get from the google login. we need to avoid the user to input
    // so much information
    const obj = {
      month: currentMonth,
      day,
      year,
    };

    setDate(obj);
    toggle();
    if (day == null) {
      return;
    }
    return <button id="dayEvent" />;
  }

  return (
    <div className="Syllendar">
      <div className="month">
        <h3>
          {calMonth}
          {' '}
          {currentYear}
        </h3>
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
        {y.map((day, index) => (
          <div id="dateBox" key={index}>
            <div>{day}</div>
            <button id="dayEvent" onClick={() => daySelected(day)} />
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
