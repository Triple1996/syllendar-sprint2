import * as React from 'react';
import ReactDOM from 'react-dom';
import GoogleLogin from 'react-google-login';
import { Socket } from './Socket';
import { ContentMain } from './ContentMain';

function responseGoogle(response) {
  const url = response.profileObj.imageUrl;
  const { email } = response.profileObj;
  const { name } = response.profileObj;

  Socket.emit('new login', {
    image: url,
    email,
    name,
  });

  ReactDOM.render(<ContentMain />, document.getElementById('content'));
}

export function GoogleButton() {
  return (
    <GoogleLogin
      className="googleButton"
      clientId="347824852945-g2jnnb98davd2dag3a3619enrkha24ac.apps.googleusercontent.com"
      buttonText="Login"
      onSuccess={responseGoogle}
      onFailure={responseGoogle}
      cookiePolicy="single_host_origin"
    />
  );
}
