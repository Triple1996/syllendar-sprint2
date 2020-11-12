# app.py
from os.path import join, dirname
from dotenv import load_dotenv
import os
import flask
import flask_sqlalchemy
from sqlalchemy.sql import exists 
import flask_socketio
# import models 

app = flask.Flask(__name__)

socketio = flask_socketio.SocketIO(app)
socketio.init_app(app, cors_allowed_origins="*")

dotenv_path = join(dirname(__file__), 'sql.env')
load_dotenv(dotenv_path)

database_uri = os.environ['DATABASE_URL']

app.config['SQLALCHEMY_DATABASE_URI'] = database_uri

db = flask_sqlalchemy.SQLAlchemy(app)
db.init_app(app)
db.app = app

class Users(db.Model):
    # id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120))
    email = db.Column(db.String(120), primary_key=True, unique=True)
    imageurl = db.Column(db.String(500))
    
    def __init__(self, a, b, c):
        self.name = a
        self.email = b
        self.imageurl = c
        
    def __repr__(self):
        return '<name: {}, email: {}>'.format(self.name, self.email)

class Events(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120))
    email = db.Column(db.String(120))
    event_title = db.Column(db.String(120))
    event_start_date = db.Column(db.String(50), nullable = False)
    event_start_time = db.Column(db.String(50), nullable = False)
    event_end_date = db.Column(db.String(50), nullable = False)
    event_end_time = db.Column(db.String(50), nullable = False)
    location = db.Column(db.String(120))
    description = db.Column(db.String(1000))
    
    def __init__(self, name, email, title, startdt, starttm, enddt, endtm, location, des):
        self.name = name
        self.email = email
        self.event_title = title
        self.event_start_date = startdt
        self.event_start_time = starttm
        self.event_end_date = enddt
        self.event_end_time = endtm
        self.location = location
        self.description = des
        
    def __repr__(self):
        return '<name: {}, event: {}>, start_date: {}, start_time: {}, end_time: {}'.format(self.name, self.event_title, self.event_start_date, self.event_start_time, self.event_end_time)

db.create_all()
db.session.commit()

# Add test record into events table
# db.session.add(Events('First Last','mail@domain.com','Test Event', '01/29/20', '14:32:00', '01/29/20', '15:32:00', 'N/A', 'N/A' ))
# db.session.commit()

@socketio.on('new login') # image, email, name
def new_login(data):
    imageLink=(data['image'])
    fullname = (data['name'])
    email = (data['email'])
    
    # TODO - Add to database if user does not exist 
    if (db.session.query(exists().where(Users.email == email)).scalar()) != True:
        db.session.add(Users(fullname, email, imageLink))
        db.session.commit()

@socketio.on('new image')
def new_image(data):
    imageLink=(data['image'])
    socketio.emit('imageLinks', {
        'image': imageLink
    })
    
@socketio.on('new email')
def new_email(data):
    emailAddress=(data['email'])
    socketio.emit('emailAddress', {
        'email': emailAddress
    })

@socketio.on('new name')
def new_name(data):
    realName=(data['name'])
    socketio.emit('realname', {
        'name': realName
    })

@app.route('/')
def index():
    return flask.render_template("index.html")

if __name__ == '__main__': 
    socketio.run(
        app,
        host=os.getenv('IP', '0.0.0.0'),
        port=int(os.getenv('PORT', 8080)),
        debug=True
    )
