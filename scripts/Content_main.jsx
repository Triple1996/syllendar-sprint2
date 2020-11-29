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
      console.log(`Received user image from server: ${data.image}`);
      setImage(data.image);
      console.log(`Received user email address from server: ${data.email}`);
      setEmail(data.email);
      console.log(`Received user name from server: ${data.name}`);
      setName(data.name);
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
        ApiCalendar.listUpcomingEvents()
      .then(
        ({result}) => {
                            
          for (var i = 0; i < result.items.length; i++){
            let event = result.items[i]
                        
            var start;
            var end;
                        
            if (event.start.date){
              start = "All day"
              end = "All day"
            }
            else{
              start = event.start.dateTime;
              end = event.start.dateTime;
            }
                        
            let createdBy = event.creator.email;
            let id = event.id;
            let summary = event.summary;
                        
            var element = document.createElement("li");
            var text = document.createTextNode(
              "created by: " + createdBy + "\n"+
              "start: "+ start+ "\n"+  // undefined if "All day"
              "end: "+ end+ "\n"+      // undefined if "All day"
              "summary: "+ summary);
            console.log(text);
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
