# app.py
# pylint: disable=missing-function-docstring
# pylint: disable=invalid-name
# pylint: disable=wrong-import-position
# pylint: disable=invalid-envvar-default
# pylint: disable=no-member
# pylint: disable=missing-module-docstring
# pylint: disable=missing-class-docstring
# pylint: disable=too-few-public-methods
# pylint: disable=singleton-comparison
# pylint: disable=too-many-arguments
# pylint: disable=too-many-instance-attributes
import os
from os.path import join, dirname
from dotenv import load_dotenv
import flask
import flask_sqlalchemy
from sqlalchemy.sql import exists
import flask_socketio


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

import models

db.create_all()
db.session.commit()

# Add test record into events table
# db.session.add(Events('First Last','mail@domain.com','Test Event', '01/29/20', '14:32:00', '01/29/20', '15:32:00', 'N/A', 'N/A' ))
# db.session.commit()

@socketio.on('add event')
def add_event(data):
    name = data['name']
    email = data['email']
    title = data['title']
    startdt = data['startdt']
    starttm = data['starttm']
    enddt = data['enddt']
    endtm = data['endtm']
    location = data['location']
    des = data['des']

    print("adding new event!")

    # Add to database if event does not exist
    if (db.session.query(exists().where(models.Events.event_start_time == starttm and models.Events.event_start_date == startdt and models.Events.name == name)).scalar()) != True:
        db.session.add(models.Events(name, email, title, startdt, starttm, enddt, endtm, location, des ))
        db.session.commit()


    #TODO update event - idea: if already exists, delete event and rewrite with new info
    
    print("Added to the db")

@socketio.on('new login') # image, email, name
def new_login(data):
    imageLink=(data['image'])
    name = (data['name'])
    email = (data['email'])

    # Add to database if user does not exist
    if (db.session.query(exists().where(models.Users.email == email)).scalar()) != True:
        db.session.add(models.Users(name, email, imageLink))
        db.session.commit()

    socketio.emit('userinfo', {
        'image': imageLink,
        'email': email,
        'name': name
    })

    # TODO emit_all_events
    
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
