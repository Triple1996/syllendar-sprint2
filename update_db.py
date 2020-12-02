'''
update_db.py 

Python script to transfer important flagged events from Events table to Important Events table, for SMS notifications
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

class ImportantEvents(db.Model):
    '''
    Important events for SMS notifications
    '''
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120))
    email = db.Column(db.String(120))
    event_title = db.Column(db.String(120))
    event_start_date = db.Column(db.String(50), nullable=False)
    event_start_time = db.Column(db.String(50), nullable=False)
    contact_number = db.Column(db.String(20))
    sms_notified = db.Column(db.String(10))
    
    def __init__(
        self, name, email, title, startdt, starttm, contact, sms
    ):
        self.name = name
        self.email = email
        self.event_title = title
        self.event_start_date = startdt
        self.event_start_time = starttm
        self.contact_number = contact
        self.sms_notified = sms

    def __repr__(self):
        return "<name: {}, event: {}>, start_date: {}, start_time: {}, notified: {}".format(
            self.name,
            self.event_title,
            self.event_start_date,
            self.event_start_time,
            self.sms_notified,
        )
        

import models

db.create_all()
db.session.commit()

import time

# IF IMPORTANT FLAG = TRUE, COPY EVENT TO IMPORTANT EVENTS TABLE 
while True:
    for db_event in db.session.query(models.Events).all():
        if db_event.imp_flag == 'True':
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
    time.sleep(61) 
    