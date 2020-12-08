"""
app.py

Main backend codebase for Syllendar app
"""

# pylint: disable=no-member
# pylint: disable=invalid-name
# pylint: disable=singleton-comparison
# pylint: disable=too-many-arguments
# pylint: disable=too-many-instance-attributes
# pylint: disable=trailing-whitespace
# pylint: disable=line-too-long
# pylint: disable=fixme
# pylint: disable=invalid-envvar-default
# pylint: disable=wrong-import-position
# pylint: disable=bad-option-value
# pylint: disable=fatal

import twilio 
import os
from os.path import join, dirname
import dotenv
import flask
import flask_sqlalchemy
from sqlalchemy.sql import exists
import flask_socketio
import smtplib
import ssl
import time
from datetime import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import pytz
import threading 


app = flask.Flask(__name__)

socketio = flask_socketio.SocketIO(app)
socketio.init_app(app, cors_allowed_origins="*")

try:
    DOTENV_PATH = join(dirname(__file__), "sql_and_api_keys.env")
    dotenv.load_dotenv(DOTENV_PATH)
except AttributeError as error: 
    print("Handled error: " + str(error))
DATABASE_URI = os.environ["DATABASE_URL"]
TWILIO_ACCOUNT_SID = os.environ["TWILIO_ACCOUNT_SID"]
TWILIO_AUTH_TOKEN = os.environ["TWILIO_AUTH_TOKEN"]

app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URI

db = flask_sqlalchemy.SQLAlchemy(app)
db.init_app(app)
db.app = app

import models

db.create_all()
db.session.commit()
#TODO: load one event after they create an event, maybe just create the event in the frontend then send to db. 


# SOCKET ROOM STUFF 
@socketio.on("load events")
def load_events(data):
    """
    Get events from DB 
    """
    print("in loading events socket")
    email = data['email']
    year = data['year']
    month = data['month']
    
    results = db.session.query(models.Events).filter(models.Events.email == email and models.Events.year == year and models.Events.month == month).all()
    
    all_events = []
        
    for event in results:
        x = {
            'Name': event.name,
            'Event': event.event_title,
            'StartDate': event.event_start_date,
            'EndDate': event.event_end_date,
            'StartTime': event.event_start_time,
            'EndTime': event.event_end_time,
            'Location': event.location,
            'Description': event.description,
            'Month': event.month,
            'Year': event.year,
            'Day': event.day
        }
        all_events.append(x)
    
    socketio.emit(
        'received events', {
            'allEvents': all_events
        }    
    )

@socketio.on("add event")
def add_event(data):
    """
    Add event details to DB upon receiving new add event form request
    """
    name = data["name"]
    email = data["email"]
    title = data["title"]
    startdt = data["startdt"]
    starttm = data["starttm"]
    enddt = data["enddt"]
    endtm = data["endtm"]
    imp = data["imp"]
    location = data["location"]
    contact = data["contact"]
    des = data["des"]
    
    # figure out how to get the month and year automatically

    month = startdt.split('/')[0]
    year = startdt.split('/')[2]
    day = startdt.split('/')[1]

    print("adding new event!")

    # Add to database if event does not exist
    if (
        db.session.query(
            exists().where(
                models.Events.event_start_time == starttm
                and models.Events.event_start_date == startdt
                and models.Events.name == name
            )
        ).scalar()
    ) != True:
        db.session.add(
            models.Events(
                name, email, title, startdt, starttm, enddt, endtm, imp, 'False', location, contact, des, day, year, month
            )
        )

        db.session.commit()

        print("Added to the db")

@socketio.on("new login")  # image, email, name
def new_login(data):
    """
    Add user details to DB upon receiving new oAuth success
    """
    image_link = data["image"]
    name = data["name"]
    email = data["email"]

    # Add to database if user does not exist
    if (
        db.session.query(exists().where(models.Users.email == email)).scalar()
    ) is not True:
        db.session.add(models.Users(name, email, image_link))

        db.session.commit()

    socketio.emit("userinfo", {"image": image_link, "email": email, "name": name}, room=flask.request.sid)

    # emit_all_events

@app.route("/")
def index():
    """
    render index.html in flask app
    """
    return flask.render_template("index.html")

# NOTIFICATIONS STUFF
def db_update(t):
    while True:
        for db_event in db.session.query(models.Events).all():
            if db_event.imp_flag == 'true':
                # IF EXISTS, DO NOT ADD AGAIN!
                if (db.session.query(exists().where(
                        models.ImportantEvents.event_start_time == db_event.event_start_time
                        and models.ImportantEvents.event_start_date == db_event.event_start_date
                        and models.ImportantEvents.event_title == db_event.event_title
                        and models.ImportantEvents.name == db_event.name
                        and models.ImportantEvents.email == db_event.email
                    )
                ).scalar()) != True:
                    db.session.add(
                        models.ImportantEvents(
                            db_event.name, db_event.email, db_event.event_title, db_event.event_start_date, db_event.event_start_time, db_event.contact_number, 'False'
                        )
                    )
                    db.session.commit()
        time.sleep(60) 

def gmail_notify(t):
    print("GMAIL THREAD STARTED!")
    PORT_NUMBER = 587  # For starttls
    SMTP_SERVER = "smtp.gmail.com"
    SENDER_EMAIL = "syllendar.notifications@gmail.com"
    PASSWORD = os.environ["GMAIL_PASS"]
    
    while True:
        for db_event in db.session.query(models.Events).all():
            if db_event.email_notified == "False":
    
                # Get current date and time
                est = pytz.timezone("US/Eastern")
                ct = datetime.now(est)
    
                event_date_year = int(db_event.year)
                # print("event_date_year: ",event_date_year)
                event_date_month = int(db_event.month)
                # print("event_date_month: ",event_date_month)
                event_date_day = int(db_event.day)
                # print("event_date_day: ",event_date_day)
    
                if (
                    (event_date_year == int(ct.year))
                    and (event_date_month == int(ct.month))
                    and (event_date_day == int(ct.day))
                ):
                    print("GMAIL- Date Match")
                    now = datetime.now(est)
                    event_time = db_event.event_start_time
                    todayEventTime = now.replace(hour=int(event_time[:2]), minute=int(event_time[3:]), second=0, microsecond=0)
                    timedeltaa = todayEventTime - now 
                    if (int((timedeltaa.seconds/60))) < 10 and (
                        int((timedeltaa.seconds/60))
                    ) > 0:
                        print("GMAIL- Time Match")
                        receiver_email = db_event.email
    
                        # Create email object
                        message = MIMEMultipart("alternative")
                        message["Subject"] = "Upcoming event: " + db_event.event_title
                        message["From"] = SENDER_EMAIL
                        message["To"] = receiver_email
    
                        # Create the plain-text and HTML version of your message
                        TEXT = """\
                        
                        You have an event {}, coming up within next 10 minutes.
                        
                        - Syllendar Team""".format(
                            db_event.event_title
                        )
    
                        HTML = """\
                        <html>
                            <body>
                                <p>You have an event {}, coming up in the next 10 minutes.</p>
                                <p>- Syllendar Team</p>
                                <p><img src="https://i.ibb.co/cv61FQZ/SYLLENDAR.png" alt="App banner" width="600" height="200" /></p>
                            </body>
                        </html>
                        """.format(
                            db_event.event_title
                        )
    
                        # Turn these into plain/html MIMEText objects
                        part1 = MIMEText(TEXT, "plain")
                        part2 = MIMEText(HTML, "html")
    
                        # Add HTML/plain-text parts to MIMEMultipart message
                        # The email client will try to render the last part first
                        message.attach(part1)
                        message.attach(part2)
    
                        context = ssl.create_default_context()
                        with smtplib.SMTP(SMTP_SERVER, PORT_NUMBER) as server:
                            server.ehlo()  # Can be omitted
                            server.starttls(context=context)
                            server.ehlo()  # Can be omitted
                            server.login(SENDER_EMAIL, PASSWORD)
                            server.sendmail(
                                SENDER_EMAIL, receiver_email, message.as_string()
                            )
    
                        # Update sms_notified_flag in Important Events Table
    
                        # Create a copy of event before deletion with updated values
                        notified_event = models.Events(
                            db_event.name,
                            db_event.email,
                            db_event.event_title,
                            db_event.event_start_date,
                            db_event.event_start_time,
                            db_event.event_end_date,
                            db_event.event_end_time,
                            db_event.imp_flag,
                            "True",
                            db_event.location,
                            db_event.contact_number,
                            db_event.description,
                            db_event.day,
                            db_event.year,
                            db_event.month,
                        )
                        # Delete
                        db.session.delete(db_event)
                        db.session.commit()
                        # Add new record
                        db.session.add(notified_event)
                        db.session.commit()
        time.sleep(60)
        
def twilio_sms_notify(t):
    from twilio.rest import Client
    client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    print("TWILIO THREAD STARTED!")
    while True:
        for db_event in db.session.query(models.ImportantEvents).all():
            if db_event.sms_notified == 'False' :
                
                # Get current date and time 
                est = pytz.timezone('US/Eastern')
                ct = datetime.now(est)
                
                event_date = db_event.event_start_date
                event_date_year = int(event_date.split('/')[2])
                #print("event_date_year: ",event_date_year)
                event_date_month = int(event_date.split('/')[0])
                #print("event_date_month: ",event_date_month)
                event_date_day = int(event_date.split('/')[1])
                #print("event_date_day: ",event_date_day)
                
                if (event_date_year == int(ct.year)) and (event_date_month == int(ct.month)) and (event_date_day == int(ct.day)):
                    print('TWILIO- Date Match')
                    now = datetime.now(est)
                    event_time = db_event.event_start_time
                    todayEventTime = now.replace(hour=int(event_time[:2]), minute=int(event_time[3:]), second=0, microsecond=0)
                    timedeltaa = todayEventTime - now
                    if (int((timedeltaa.seconds/60))) < 10 and (int((timedeltaa.seconds/60))) > 0:
                        print('TWILIO- Time Match') 
                        contact_number = db_event.contact_number # Contact number should be verified on Twilio since we have a trial account. 
                        
                        msg_body = "Your event " + db_event.event_title + " is starting in the next 10 minutes"
                        message = client.messages \
                            .create(
                                body = msg_body,
                                from_ = '+18312170341',
                                to = contact_number)
            
                        print('Twilio Message Sent: ', message.sid)
                        
                        # Update sms_notified_flag in Important Events Table
                        
                        # Create a copy of event before deletion with updated values 
                        notified_event = models.ImportantEvents(db_event.name, db_event.email, db_event.event_title, db_event.event_start_date, db_event.event_start_time, db_event.contact_number, 'True')
                        # Delete 
                        db.session.delete(db_event)
                        db.session.commit()
                        # Add new record 
                        db.session.add(notified_event)
                        db.session.commit()
                
        time.sleep(60)

import threading 
if __name__ == "__main__":

    db_thread = threading.Thread(target=db_update, args=(1,), daemon=True)
    db_thread.start()
    gmail_thread = threading.Thread(target=gmail_notify, args=(2,), daemon=True)
    gmail_thread.start()
    twilio_thread = threading.Thread(target=twilio_sms_notify, args=(3,), daemon=True)
    twilio_thread.start()

    socketio.run(
        app,
        host=os.getenv("IP", "0.0.0.0"),
        port=int(os.getenv("PORT", 8080)),
        debug=True,
    )

    