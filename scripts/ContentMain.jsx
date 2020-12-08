import * as React from 'react';
import ReactDOM from 'react-dom';
import ApiCalendar from 'react-google-calendar-api';
import { Socket } from './Socket';
import { Content } from './Content';
import Calendar from './Calendar';
import { parseData } from './GcalendarHelper';
import { LandingPage } from './LandingPage';

export function ContentMain() {
  const [image, setImage] = React.useState([]);
  const [email, setEmail] = React.useState([]);
  const [name, setName] = React.useState([]);

  React.useEffect(() => {
    Socket.on('userinfo', (data) => {
      setImage(data.image);
      setEmail(data.email);
      setName(data.name);
      window.sessionStorage.setItem('email', data.email)
      console.log(`Logged in with ${data.email}`);
    });
  });

  function Logout() {
    ApiCalendar.handleSignoutClick();
    ReactDOM.render(<Content />, document.getElementById('content'));
  }

  function authenticate(response) {
    ApiCalendar.handleAuthClick();
    console.log(response);
    console.log('Logged in');
  }

  function loadevents() {
    if (ApiCalendar.sign) {
      ApiCalendar.listUpcomingEvents(document.getElementById("num-events").value ? 
          document.getElementById("num-events").value : 25)
        .then(
          ({ result }) => {
            for (let i = 0; i < result.items.length; i += 1) {
              const event = result.items[i];

              const { id } = event;
              
              var EventData = parseData(event);
              const text = (
                `name: ${name}
                email: ${EventData["createdBy"]}
                title: ${EventData["title"]}
                startdt: ${EventData["startdt"]}
                starttm: ${EventData["starttm"]}
                enddt: ${EventData["enddt"]}
                endtm: ${EventData["endtm"]}
                imp: ${EventData["imp"]}
                location: ${EventData["location"]}
                contact: ${EventData["contact"]}
                des: ${EventData["des"]}`
              );

              console.log(text);

              Socket.emit('add event', {
                name,
                email : `${EventData["createdBy"]}`,
                title: `${EventData["title"]}`,
                startdt: `${EventData["startdt"]}`,
                starttm: `${EventData["starttm"]}`,
                enddt: `${EventData["enddt"]}`,
                endtm: `${EventData["endtm"]}`,
                imp: "false",
                location: `${EventData["location"]}`,
                contact: "N/A",
                des: `${EventData["des"]}`
              });

            }
          },
        );
    } else {
      window.alert('Need to authorize Calendar access');
    }
  }

  function imports() {
    const uploadedFile = document.getElementById('uploadedFile').files;
    if (uploadedFile.length <= 0) {
      return false;
    }

    const readFiles = new FileReader();
    readFiles.onload = function (e) {
      console.log(e);
      const output = JSON.parse(e.target.result);
      const format = JSON.stringify(output, null, 2);
      document.getElementById('result').value = format;
      
      Socket.emit('import', {
        import: output,
      });
     console.log(output);
    };

    readFiles.readAsText(uploadedFile.item(0));
  }
  
  function AboutPage() {
     ReactDOM.render(<LandingPage />, document.getElementById('content'));
  }
    

  return (
    <div>
      <h2>My Calendar</h2>
      <button type="button" onClick={AboutPage}>About Us</button>
      <Calendar />
      <div className="info">
        <img src={image} alt="" width="90" height="90" />
        <p>{email}</p>
        <p>{name}</p>
        <br />
        <input type="file" id="uploadedFile" />
        <br />
        <button type="button" onClick={imports}>Import</button>
        <textarea id="result" />
        <div id="import-events-form">
          <br/>
          <h5> Google Calendar</h5>
          <label htmlFor="num-events"> Get
            <span><input id="num-events" type="number" placeholder="25"></input></span> 
          Events</label>
          <input type="button" onClick={loadevents} value="Import Events"></input>
          <button type="button" onClick={authenticate}> Auth G Calendar </button>
        </div>
        <br/>
        <div className="buttonpostion">
          <form onSubmit={Logout}>
            <button type="button">Sign Out</button>
          </form>
        </div>
      </div>
    </div>
  );
}
