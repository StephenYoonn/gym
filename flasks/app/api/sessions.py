from . import db
from sqlalchemy.orm import relationship



class session(db.Model):
    __tablename__ = "sessions"
    _id = db.Column(db.Integer, primary_key = True)
    userid = db.Column(db.Integer, db.ForeignKey("users._id"))
    sets = relationship("set", backref = "session")

    def __repr__(self):
        return '<Session on {}>'.format(self.date)