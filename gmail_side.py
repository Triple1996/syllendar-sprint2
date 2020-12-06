"""
gmail_side.py

Gmail Account: syllendar.notifications@gmail.com

Scans for events under Events, and sends email reminder using SMTPLib
- Event time in the next 10 minutes
- No duplicate reminder emails
- Runs every 61 seconds
"""
# pylint: disable=no-member
# pylint: disable=wrong-import-position

import os
from os.path import join, dirname
import smtplib
import ssl
import time
from datetime import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import flask
import flask_sqlalchemy
import flask_socketio
import pytz

import dotenv

app = flask.Flask(__name__)

socketio = flask_socketio.SocketIO(app)
socketio.init_app(app, cors_allowed_origins="*")

try:
    DOTENV_PATH = join(dirname(__file__), "sql_and_api_keys.env")
    dotenv.load_dotenv(DOTENV_PATH)
except AttributeError as error:
    print("Handled error: " + str(error))

DATABASE_URI = os.environ["DATABASE_URL"]

app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URI

db = flask_sqlalchemy.SQLAlchemy(app)
db.init_app(app)
db.app = app

import models

# MAIL STUFF
  # Simple Mail Transfer Protocol (SMTP)

PORT_NUMBER = 587  # For starttls
SMTP_SERVER = "smtp.gmail.com"
SENDER_EMAIL = "syllendar.notifications@gmail.com"
RECEIVER_EMAIL = "sakshambanga1998@gmail.com"
# dont persist password
password = os.environ["GMAIL_PASS"]



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
                print("Date Match")
                if (int(EVENT_TIME_24 - CURRENT_TIME_24)) < 10 and (
                    int(EVENT_TIME_24 - CURRENT_TIME_24)
                ) > 0:
                    print("Time Match")
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
                        server.login(SENDER_EMAIL, password)
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
                        db_event.descirption,
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
time.sleep(61)
