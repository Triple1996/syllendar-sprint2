   
import * as React from 'react';
import { Socket } from './Socket';
import ReactDOM from 'react-dom';
import Calendar from './Calendar'


export function Content_main () {
    const [image, setImage] = React.useState([]);
    const [email, setEmail] = React.useState([]);
    const [name, setName] = React.useState([]);
    
    function getImage() {
        React.useEffect(() => {
            Socket.on('imageLinks', (data) => {
                 console.log("Received user image from server: " + data['image']);
                 setImage(data['image']);
            })
        });
    }
    getImage();
    
    function getEmail() {
        React.useEffect(() => {
            Socket.on('emailAddress', (data) => {
                console.log("Received user email address from server: " + data['email']);
                setEmail(data['email']);
            })
        });
    }
    getEmail();
    
    function getName() {
        React.useEffect(() => {
            Socket.on('realname', (data) => {
                 console.log("Received user name from server: " + data['name']);
                 setName(data['name']);
            })
        });
    }
    getName();
    
    function handleSubmit(event) {
    
     ReactDOM.render(<Content />, document.getElementById('content'));
}
    

    return (
        <div>
        <h2>My Calendar</h2>
        <Calendar />
        <div className="info">
        <img src={image} width="90" height="90"/>
        <p>{email}</p>
        <p>{name}</p>
        <div className="buttonpostion">
        <form onSubmit={handleSubmit}>
        <button>Sign Out</button>
        </form>
        </div></div></div>
    );
}
