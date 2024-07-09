from . import db
from sqlalchemy.orm import relationship

class User(db.Model):
    __tablename__ = "users"
    _id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100), unique = True)
    password = db.Column(db.String(100))
    sessions = relationship("session", backref = "user")

    def __repr__(self):
        return '<User {}>'.format(self.username)
