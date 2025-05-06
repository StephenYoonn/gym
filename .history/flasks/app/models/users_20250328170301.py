from flasks.app.database import db
from flask_login import UserMixin
from sqlalchemy.orm import relationship

class User(db.Model, UserMixin):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100), unique = True)
    password = db.Column(db.String(100))

    sessions = db.relationship('Session', backref='user')

    def to_dict(self):
        return{
            'email': self.email,
            'id':self.id,
            'name':self.name,
            'pw':self.id,
            
        }
