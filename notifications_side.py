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

class Users(db.Model):
    '''
    Users table schema
    '''
    # id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120))
    email = db.Column(db.String(120), primary_key=True, unique=True)
    imageurl = db.Column(db.String(500))

    def __init__(self, name, email, image_url):
        self.name = name
        self.email = email
        self.imageurl = image_url

    def __repr__(self):
        return "<name: {}, email: {}>".format(self.name, self.email)
        
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
    day = db.Column(db.String(10))
    year = db.Column(db.String(10))
    month = db.Column(db.String(10))

    def __init__(
        self, name, email, title, startdt, starttm, enddt, endtm, imp, email_notif, location, contact, des, day, year, month
    ):
        self.name = name
        self.email = email
        self.event_title = title
        self.event_start_date = startdt
        self.event_start_time = starttm
        self.event_end_date = enddt
        self.event_end_time = endtm
        self.imp_flag = imp
        self.email_notified = email_notif
        self.location = location
        self.contact_number = contact
        self.description = des
        self.day = day
        self.year = year
        self.month = month
        
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
        
db.create_all()
db.session.commit()

from twilio.rest import Client
client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

import models

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
                event_time = db_event.event_start_time
                EVENT_TIME_24 = int(str(event_time[:2] + str(event_time[3:])))
    
                CURRENT_TIME = str(ct.hour) + str(ct.minute)
                CURRENT_TIME_24 = int(CURRENT_TIME)
    
                if (
                    (event_date_year == int(ct.year))
                    and (event_date_month == int(ct.month))
                    and (event_date_day == int(ct.day))
                ):
                    print("GMAIL- Date Match")
                    if (int(EVENT_TIME_24 - CURRENT_TIME_24)) < 10 and (
                        int(EVENT_TIME_24 - CURRENT_TIME_24)
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
                                <p><img src="https://lh3.googleusercontent.com/IdlRQbxkrKVxONiT6RkBYUiExTM2q9c4J_uDKh43Igd2R-MgngDbjZ6mCDMX_L_aA44-g5S8-h5jqu9jWDiWeMWP2VpCxb9kWwxTSbt10AzOaxzehOT5nXBXLZdA2N-bQVrK52XACIK6BuSmcvIg9phB6cy835IBHfluUb0jhYl3FlNOd2o2Xi9L77dDg4gCt5vCStJs8FypD_EI8bBgMCG8Hn36oFlDk007C3U3aCDUW7bWSGsiKNq9FQXmvHTUitV80pUrNE4BNDO_482DsyhN2dmqdpuCxzb68v-pIeGWck7Rpj_i6_URXiiDtGAy7LfsBtWageEpuquEVNI0dXMQ3tYaGMTQjTqFOByYjRG4eUsbVcfQ6_uTjjrlqDWWbe_BsP9oC9ks1QfbF5807EmGtpeWo69eu0KulFMNeAt5MsJP47ZLNxVYnxq2cjMeFxCMscUlWbCp5NxRyADQboMUykgIbWG9WUkxlCfmTelHOQmnmRmnAlUbamozlDL9mmgLLBjaWsNtplUrF-XLHh_shfmnQN99SqkumyOsmVwfV93lIgieZrOhdtqnA2u4Gd7DxqLorkm7ai9jxNNafzWJwtwt_oTMGVEQeodHwAVB0DaQpsu9Yge7Ho-Mv5OVV_V97lHZQ-TK1uLzmY9LguhWqfIkOieas74uI7QPEXsaAooSEN8nCUOj8unYpdc=w600-h200-no?authuser=0" alt="App banner" width="600" height="200" /></p>
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
                    print('TWILIO- Date Match')
                    if (int(event_time_24 - current_time_24)) < 10 and (int(event_time_24 - current_time_24)) > 0:
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
        
    
db_thread = threading.Thread(target=db_update, args=(1,))
db_thread.start()
gmail_thread = threading.Thread(target=gmail_notify, args=(2,))
gmail_thread.start()
twilio_thread = threading.Thread(target=twilio_sms_notify, args=(3,))
twilio_thread.start()
