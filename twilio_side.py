'''
twilio_side.py 

Scans for events under Important Events, and sends SMS reminder using Twilio API
- Event time in the next 10 minutes 
- No duplicate reminder SMS
- Runs every 61 seconds 
'''
import twilio 
import os
from os.path import join, dirname
import dotenv
import flask
import flask_sqlalchemy
from sqlalchemy.sql import exists
import flask_socketio

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

class Events(db.Model):
    '''
    Events table schema
    '''
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120))
    email = db.Column(db.String(120))
    event_title = db.Column(db.String(120))
    event_start_date = db.Column(db.String(50), nullable=False)
    event_start_time = db.Column(db.String(50), nullable=False)
    event_end_date = db.Column(db.String(50), nullable=False)
    event_end_time = db.Column(db.String(50), nullable=False)
    imp_flag = db.Column(db.String(10))
    email_notified = db.Column(db.String(10))
    location = db.Column(db.String(120))
    contact_number = db.Column(db.String(20))
    description = db.Column(db.String(1000))

    def __init__(
        self, name, email, title, startdt, starttm, enddt, endtm, imp, location, contact, des
    ):
        self.name = name
        self.email = email
        self.event_title = title
        self.event_start_date = startdt
        self.event_start_time = starttm
        self.event_end_date = enddt
        self.event_end_time = endtm
        self.imp_flag = imp
        self.email_notified = 'False'
        self.location = location
        self.contact_number = contact
        self.description = des

    def __repr__(self):
        return "<name: {}, event: {}>, start_date: {}, start_time: {}, end_time: {}".format(
            self.name,
            self.event_title,
            self.event_start_date,
            self.event_start_time,
            self.event_end_time,
        )

db.create_all()
db.session.commit()

from twilio.rest import Client
client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

import models
import time 
import pytz
from datetime import datetime 

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
            
            event_time = db_event.event_start_time
            event_time_24 = int(str(event_time[:2]+str(event_time[3:])))
            
            current_time = str(ct.hour) + str(ct.minute)
            current_time_24 = int(current_time)
            
            if (event_date_year == int(ct.year)) and (event_date_month == int(ct.month)) and (event_date_day == int(ct.day)):
                print('Date Match')
                if (int(event_time_24 - current_time_24)) < 10 and (int(event_time_24 - current_time_24)) > 0:
                    print('Time Match') 
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
            
    time.sleep(61)

