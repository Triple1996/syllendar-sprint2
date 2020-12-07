import * as React from 'react';
import ReactDOM from 'react-dom';
import { ContentMain } from './ContentMain';


export function LandingPage() {
    function goBack(){
        ReactDOM.render(<ContentMain />, document.getElementById('content'));
    }
  return (
    <div className="design">
    <button type="button" onClick={goBack}>Back</button>
    <h1>Landing Page</h1>
    </div>
  );
}

