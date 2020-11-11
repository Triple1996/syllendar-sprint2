import * as React from "react";
import "./styles.css";

export default function App() {
  //const [days, setDays] = React.useState([]);
  let i = [];
  let x = 1;
  //TODO add function to put the correct date on the correct day
  while (x !== 32) {
    i[x] = x;
    x++;
  }
  return (
    <div class="Syllendar">
      <div class="month"> </div>
      <div class="week">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tues</div>
        <div>Wed</div>
        <div>Thurs</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>
      <div class="day">
        {i.map((day, index) => (
          <button key={index}>
            <div>{day}</div>
            <button id="dayEvent"></button>
          </button>
        ))}
      </div>
      {/* <button id="addEvent">Add Event</button> */}
    </div>
  );
}
