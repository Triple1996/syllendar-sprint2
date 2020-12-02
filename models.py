
'''
models.py

Defines DB tables schema for the Syllendar app
'''

# pylint: disable=too-many-arguments
# pylint: disable=too-many-instance-attributes
# pylint: disable=too-few-public-methods
# pylint: disable=no-member
# pylint: disable=unused-import
# pylint: disable=fixme
# pylint: disable=bad-option-value

from datetime import datetime
import flask_sqlalchemy
from app import db

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
    day = db.Column(db.String(120))
    year = db.Column(db.String(120))
    month = db.Column(db.String(120))

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
