import * as React from 'react';
import ReactDOM from 'react-dom';
import { ContentMain } from './ContentMain';

export function LandingPage() {
  function goBack() {
    ReactDOM.render(<ContentMain />, document.getElementById('content'));
  }
  return (
    <div id="all">
      <button type="button" onClick={goBack}>Back</button>
      <div id="question1">
        <p1>
          As a team, we aimed to develop a schedule-managing app that is accessible from the
          browser. What the app does is, it allows the authenticated user to view their
          calendar. Beyond that, the user can add/remove an event, which will be saved in a
          database. Also, the user will be able to read a JSON file after it’s being uploaded,
          and the user will be able to import from an existing Google calendar. Most importantly
          this app will help you not miss an important date when you’re overwhelmed with other
          stuff on your plate.
        </p1>
        <br />
      </div>
      <p3>Team Members:</p3>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <div className="firstmember">
        <img
          src="/static/pictureBrijesh.PNG"
          alt="/static/blankProfilePic.jpg"
          width="150"
          height="150"
          className="center"
        />
        <h1>Brijesh Naik</h1>
        <p> Worked with Front-End</p>
        <p>Student at New Jersey Institute of Technology</p>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        />
        <a href="https://www.linkedin.com/in/brijesh-naik-563a4a158/">
          <i className="fa fa-linkedin" />
          {' '}
        </a>
      </div>
      <div className="secondmember">
        <img
          src="/static/pictureAdam.jpg"
          alt="/static/blankProfilePic.jpg"
          width="150"
          height="150"
          className="center"
        />
        <h1>Adam Awany</h1>
        <p> Worked with Back-End</p>
        <p>Student at New Jersey Institute of Technology</p>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        />
        <a href="https://www.linkedin.com/in/adam-awany/">
          <i className="fa fa-linkedin" />
          {' '}
        </a>
      </div>
      <div className="thirdmember">
        <img
          src="/static/pictureSaksham.png"
          alt="/static/blankProfilePic.jpg"
          width="150"
          height="150"
          className="center"
        />
        <h1>Saksham Banga</h1>
        <p> Worked with Back-End</p>
        <p>Student at New Jersey Institute of Technology</p>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        />
        <a href="https://www.linkedin.com/in/saksham-banga-47aab516b/">
          <i className="fa fa-linkedin" />
          {' '}
        </a>
      </div>
      <div className="fourthmember">
        <img
          src="/static/pictureSam.jpg"
          alt="/static/blankProfilePic.jpg"
          width="150"
          height="150"
          className="center"
        />
        <h1>Samuel Mota</h1>
        <p> Worked with Front-End</p>
        <p>Student at New Jersey Institute of Technology</p>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        />
        <a href="https://www.linkedin.com/in/samuel-mota-55a406201">
          <i className="fa fa-linkedin" />
          {' '}
        </a>
      </div>
      <div className="fifthmember">
        <img
          src="/static/Ray-pic.jpeg"
          alt="/static/blankProfilePic.jpg"
          width="150"
          height="150"
          className="center"
        />
        <h1>Raymundo Ojeda</h1>
        <p> Worked with Front-End</p>
        <p>Student at New Jersey Institute of Technology</p>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        />
        <a href="#top">
          <i className="fa fa-linkedin" />
          {' '}
        </a>
      </div>
      <p2>Technologies used:</p2>
      <div className="techUse">
        <p4>•Amazon Web Services (AWS)</p4>
        <a href="https://aws.amazon.com/">
          <img
            src="https://miro.medium.com/max/4000/1*b_al7C5p26tbZG4sy-CWqw.png"
            alt="/static/imageFailedToLoad.jpg"
            width="50"
            height="50"
          />
        </a>
        <p4>  •Python</p4>
        <a href="https://www.python.org/">
          <img
            src="https://assets.stickpng.com/images/5848152fcef1014c0b5e4967.png"
            alt="/static/imageFailedToLoad.jpg"
            width="50"
            height="50"
          />
        </a>
        <p4>  •JavaScript (React)</p4>
        <a href="https://www.javascript.com/">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png"
            alt="/static/imageFailedToLoad.jpg"
            width="50"
            height="50"
          />
        </a>
        <p4>  •HTML/CSS</p4>
        <img
          src="https://www.pngkey.com/png/detail/366-3669912_html-websites-can-never-go-out-of-fashion.png"
          alt="/static/imageFailedToLoad.jpg"
          width="50"
          height="50"
        />
        <p4>  •PostgresSQL</p4>
        <a href="https://www.postgresql.org/">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Postgresql_elephant.svg/1200px-Postgresql_elephant.svg.png"
            alt="/static/imageFailedToLoad.jpg"
            width="50"
            height="50"
          />
        </a>
        <p4>  •Heroku</p4>
        <a href="https://www.heroku.com/">
          <img
            src="https://assets.stickpng.com/images/58480873cef1014c0b5e48ea.png"
            alt="/static/imageFailedToLoad.jpg"
            width="50"
            height="50"
          />
        </a>
      </div>
      <p5>Our App:</p5>
      <div id="question4">
        <a href="https://syllendar-sprint2.herokuapp.com/">Syllendar</a>
      </div>
    </div>

  );
}
