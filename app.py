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
# pylint: disable=bad-continuation


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

DOTENV_PATH = join(dirname(__file__), "sql.env")
load_dotenv(DOTENV_PATH)

DATABASE_URI = os.environ["DATABASE_URL"]

app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URI

db = flask_sqlalchemy.SQLAlchemy(app)
db.init_app(app)
db.app = app

import models

db.create_all()
db.session.commit()


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
    location = data["location"]
    des = data["des"]

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
                name, email, title, startdt, starttm, enddt, endtm, location, des
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

    socketio.emit("userinfo", {"image": image_link, "email": email, "name": name})

    # emit_all_events


@app.route("/")
def index():
    """
    render index.html in flask app
    """
    return flask.render_template("index.html")


if __name__ == "__main__":
    socketio.run(
        app,
        host=os.getenv("IP", "0.0.0.0"),
        port=int(os.getenv("PORT", 8080)),
        debug=True,
    )
