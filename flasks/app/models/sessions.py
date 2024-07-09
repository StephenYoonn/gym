from flasks.app.database import db
from sqlalchemy.orm import relationship



class Session(db.Model):
    __tablename__ = "sessions"
    id = db.Column(db.Integer, primary_key = True)
    userid = db.Column(db.Integer, db.ForeignKey("users.id"))

    sets = db.relationship("Set", backref="session_ref") 
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id
        }