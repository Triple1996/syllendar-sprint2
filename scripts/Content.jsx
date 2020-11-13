import * as React from 'react';
import { GoogleButton } from './GoogleButton';
import { Socket } from './Socket';

export function Content() {
    return (
         <div className="container">
            <h1>Syllendar</h1>
            <GoogleButton />
            <a href="https://accounts.google.com/signup/v2/webcreateaccount?hl=en&flowName=GlifWebSignIn&flowEntry=SignUp"><button>Sign Up</button></a>
        </div>
    );
}
