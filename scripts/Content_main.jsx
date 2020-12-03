import * as React from 'react';
import ReactDOM from 'react-dom';
import ApiCalendar from 'react-google-calendar-api';
import { Socket } from './Socket';
import { Content } from './Content';
import Calendar from './Calendar';

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

  function handleSubmit() {
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

              const title = event.summary;
              let startdt;
              let starttm;
              let enddt;
              let endtm;
              const location = (event.location ? event.location : 'N/A');
              const des = (event.description ? event.description : 'N/A');

              if (event.start.date) { // If all day event
                const startdtsplit = event.start.date.split('-');
                startdt = [startdtsplit[1], startdtsplit[2], startdtsplit[0]].join('/');
                starttm = '00:00';
                const enddtsplit = event.end.date.split('-');
                enddt = [enddtsplit[1], enddtsplit[2], enddtsplit[0]].join('/');
                endtm = '00:00';
              } else { // Not all day event
              // take datetime object convert to time and date
                const rawStartDateTimeSplit = event.start.dateTime.split('M').join(',').split('T').join(',')
                  .split('W')
                  .join(',')
                  .split('F')
                  .join(',')
                  .split('S')
                  .join(',')
                  .split(',');
                const rawEndDateTimeSplit = event.end.dateTime.split('M').join(',').split('T').join(',')
                  .split('W')
                  .join(',')
                  .split('F')
                  .join(',')
                  .split('S')
                  .join(',')
                  .split(',');

                const startdtsplit = rawStartDateTimeSplit[0].split('-');
                startdt = [startdtsplit[1], startdtsplit[2], startdtsplit[0]].join('/');
                starttm = rawStartDateTimeSplit[1].split('-')[0].substring(0, 5);
                const enddtsplit = rawEndDateTimeSplit[0].split('-');
                enddt = [enddtsplit[1], enddtsplit[2], enddtsplit[0]].join('/');
                endtm = rawEndDateTimeSplit[1].split('-')[0].substring(0, 5);
              }

              const createdBy = event.creator.email;
              const { id } = event;

              const text = (
                `name: ${name}
                email: ${createdBy}
                title: ${title}
                startdt: ${startdt}
                starttm: ${starttm}
                enddt: ${enddt}
                endtm: ${endtm}
                location: ${location}
                des: ${des}`);

              console.log(text);

              // Socket.emit('add event', {
              //   name,
              //   email: createdBy,
              //   title: summary,
              //   startdt,
              //   starttm,
              //   enddt,
              //   endtm,
              //   location,
              //   des

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
          <form onSubmit={handleSubmit}>
            <button type="button">Sign Out</button>
          </form>
        </div>
      </div>
    </div>
  );
}
