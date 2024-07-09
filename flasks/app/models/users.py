from flasks.app.database import db

from sqlalchemy.orm import relationship

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100), unique = True)
    password = db.Column(db.String(100))
    sessions = db.relationship('Session', backref='user')

    def __repr__(self):
        return '<User {}>'.format(self.username)
    
    def to_dict(self):
        return{
            'email': self.email
            
        }
