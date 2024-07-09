from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from flasks.app.database import db


class users(db.Model):
    __tablename__ = "users"
    _id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100), unique = True)
    password = db.Column(db.String(100))
    sessions = relationship("session", backref = "user")

class exercise(db.Model):
    __tablename__ = "exercises"
    name = db.Column(db.String, primary_key = True)
    muscleGroup = db.Column(db.String(10))
    sets = relationship("set", backref = "exercise")

class set(db.Model):
    __tablename__ = "sets"
    num = db.Column(db.Integer, primary_key = True)
    weight = db.Column(db.Integer)
    reps = db.Column(db.Integer)
    sessionId = db.Column(db.Integer, db.ForeignKey("sessions._id"))
    exerciseId = db.Column(db.Integer, db.ForeignKey("exercises.name"))

class session(db.Model):
    __tablename__ = "sessions"
    _id = db.Column(db.Integer, primary_key = True)
    userid = db.Column(db.Integer, db.ForeignKey("users._id"))
    sets = relationship("set", backref = "session")

