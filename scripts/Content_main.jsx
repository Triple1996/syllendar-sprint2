   
import * as React from 'react';
import { Socket } from './Socket';
import ReactDOM from 'react-dom';


function handleSubmit(event) {
    
    
     ReactDOM.render(<Content />, document.getElementById('content'));
}


export function Content_main() {
    return (
        <div>
             <h1>My Calendar</h1>
             <form onSubmit={handleSubmit}>
             <button>Sign Out</button>
        </form>
        </div>
    );
}