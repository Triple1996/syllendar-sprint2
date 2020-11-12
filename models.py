# models.py
import flask_sqlalchemy
from app import db

# TODO Add tables

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

