import * as React from 'react';
import { GoogleButton } from './GoogleButton';
import { Socket } from './Socket';



export function Content() {
    return (
        <div>
            <h1>Syllendar Landing Page </h1>
            <p>This page should be a login that will take us to the main page</p>
            <GoogleButton />
            <a href="https://accounts.google.com/signup/v2/webcreateaccount?hl=en&flowName=GlifWebSignIn&flowEntry=SignUp"><button>Sign Up</button></a>
        </div>
    );
}
