import * as React from 'react';
import ReactDOM from 'react-dom';
import { Socket } from './Socket';
import { Content } from './Content';
import Calendar from './Calendar';
import ApiCalendar from 'react-google-calendar-api';


export function Content_main() {
  const [image, setImage] = React.useState([]);
  const [email, setEmail] = React.useState([]);
  const [name, setName] = React.useState([]);

  React.useEffect(() => {
    Socket.on('userinfo', (data) => {
      // console.log(`Received user image from server: ${data.image}`);
      setImage(data.image);
      // console.log(`Received user email address from server: ${data.email}`);
      setEmail(data.email);
      // console.log(`Received user name from server: ${data.name}`);
      setName(data.name);
      console.log(`Logged in with ${data.email}`)
    });
  });

  function handleSubmit(event) {
    ApiCalendar.handleSignoutClick();
    ReactDOM.render(<Content />, document.getElementById('content'));
  }
  
  function authenticate(response){
        ApiCalendar.handleAuthClick();
        console.log(response);
        console.log("Logged in");
  }
    
  function loadevents(){
    if (ApiCalendar.sign){
        ApiCalendar.listUpcomingEvents(25)
      .then(
        ({result}) => {
                            
          for (var i = 0; i < result.items.length; i++){
            let event = result.items[i]
            
            var title = event.summary;
            var startdt;
            var starttm;
            var enddt;
            var endtm;
            var location;
            var des;
                        
            if (event.start.date){  // If all day event
              startdt = event.start.date
              starttm = "00:00"
              enddt = event.end.date
              endtm = "23:59"
              
            }
            else{ // Not all day event
              startdt = event.start.dateTime;
              starttm = event.start.dateTime;
              enddt = event.start.dateTime;
              endtm = event.start.dateTime;
            }
            
            if (event.location){
              location = event.location;
            }        
            else {
              location = "N/A";
            }
            
            if (event.description){
              des = event.description;
            }
            else {
              des = "N/A";
            }
            
            let createdBy = event.creator.email;
            let id = event.id;

            var text = (
              "name: " + name + "\n"+
              "email: " + createdBy + "\n"+
              `title: ${title}` + "\n"+
              `startdt: ${startdt}`+ "\n"+
              `starttm: ${starttm}`+ "\n"+
              `enddt: ${enddt}`+ "\n"+
              `endtm: ${endtm}`+ "\n"+
              `location: ${location}`+ "\n"+
              `des: ${des}`+ "\n");
           
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
          
        });
        
    }
    else {
      window.alert("Need to authorize Calendar access");
    }
  }

  
  return (
    <div>
      <h2>My Calendar</h2>
      <Calendar />
      <div className="info">
        <img src={image} width="90" height="90" />
        <p>{email}</p>
        <p>{name}</p>
        <div className="buttonpostion">
        <button onClick={authenticate}> Auth G Calendar </button>
          <button onClick={loadevents}> Import from Google Calendar </button>
          <form onSubmit={handleSubmit}>
            <button>Sign Out</button>
          </form>
        </div>
      </div>
    </div>
  );
}
