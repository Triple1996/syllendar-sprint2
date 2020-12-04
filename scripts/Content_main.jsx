import * as React from 'react';
import ReactDOM from 'react-dom';
import ApiCalendar from 'react-google-calendar-api';
import { Socket } from './Socket';
import { Content } from './Content';
import Calendar from './Calendar';
import { parseData } from './GcalendarHelper';

export function Content_main() {
  const [image, setImage] = React.useState([]);
  const [email, setEmail] = React.useState([]);
  const [name, setName] = React.useState([]);

  React.useEffect(() => {
    Socket.on('userinfo', (data) => {
      setImage(data.image);
      setEmail(data.email);
      setName(data.name);
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
      ApiCalendar.listUpcomingEvents(25)
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
                location: ${EventData["location"]}
                des: ${EventData["des"]}`
              );

              console.log(text);

            //   Socket.emit('add event', {
            //     name,
            //     email : `${EventData["createdBy"]}`,
            //     title: `${EventData["title"]}`,
            //     startdt: `${EventData["startdt"]}`,
            //     starttm: `${EventData["starttm"]}`,
            //     enddt: `${EventData["enddt"]}`,
            //     endtm: `${EventData["endtm"]}`,
            //     location: `${EventData["location"]}`,
            //     des: `${EventData["des"]}`
            // });
             
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
    };

    readFiles.readAsText(uploadedFile.item(0));
  }

  return (
    <div>
      <h2>My Calendar</h2>
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
        <div className="buttonpostion">
          <button type="button" onClick={authenticate}> Auth G Calendar </button>
          <button type="button" onClick={loadevents}> Import from Google Calendar </button>
          <form onSubmit={Logout}>
            <button type="button">Sign Out</button>
          </form>
        </div>
      </div>
    </div>
  );
}
