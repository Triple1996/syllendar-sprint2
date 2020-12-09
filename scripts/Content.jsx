import * as React from 'react';
import { GoogleButton } from './GoogleButton';
import { Socket } from './Socket';

export function Content() {
  return (
    <div className="col-12 text-center">
    <div className="container">
      <img src="/static/Syllendar.jpg" className="center"/>
      <a href="https://accounts.google.com/signup/v2/webcreateaccount?hl=en&flowName=GlifWebSignIn&flowEntry=SignUp" className="center"><button>Sign Up</button></a> 
      <GoogleButton />
    </div>
    </div>
  );
}
