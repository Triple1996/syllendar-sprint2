# app.py
from os.path import join, dirname
from dotenv import load_dotenv
import os
import flask
import flask_sqlalchemy
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
    name = db.Column(db.String(120), primary_key=True)
    email = db.Column(db.String(120), primary_key=True, unique=True)
    imageurl = db.Column(db.String(500))
    
    def __init__(self, a, b, c):
        self.name = a
        self.email = b
        self.imageurl = c
        
    def __repr__(self):
        return '<name: {}, email: {}>'.format(self.name, self.email)

db.create_all()
db.session.commit()

@socketio.on('new login') # image, email, name
def new_login(data):
    imageLink=(data['image'])
    fullname = (data['name'])
    email = (data['email'])
    
    # TODO - Add to database if user does not exist 
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
