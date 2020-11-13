import * as React from 'react';
import ReactDOM from 'react-dom';
import GoogleLogin from 'react-google-login';
import { Socket } from './Socket';
import { Content_main } from './Content_main';

function responseGoogle(response) {
  console.log(response);
  const url = response.profileObj.imageUrl;
  const { email } = response.profileObj;
  const { name } = response.profileObj;

  Socket.emit('new login', {
    image: url,
    email,
    name,
  });

  console.log('Sent the user data to the server!');
  console.log(`Sent the image link ${url} to the server!`);
  console.log(`Sent the email address ${email} to the server!`);
  console.log(`Sent the name ${name} to the server!`);

  ReactDOM.render(<Content_main />, document.getElementById('content'));
}

export function GoogleButton() {
  return (
    <GoogleLogin
      className="googleButton"
      clientId="937687230071-bd0c377ob6uqgudp394na6gk8h0h38pi.apps.googleusercontent.com"
      buttonText="Login"
      onSuccess={responseGoogle}
      onFailure={responseGoogle}
      cookiePolicy="single_host_origin"
    />
  );
}
