from . import db
from sqlalchemy.orm import relationship


class set(db.Model):
    __tablename__ = "sets"
    num = db.Column(db.Integer, primary_key = True)
    weight = db.Column(db.Integer)
    reps = db.Column(db.Integer)
    sessionId = db.Column(db.Integer, db.ForeignKey("sessions._id"))
    exerciseId = db.Column(db.Integer, db.ForeignKey("exercises.name"))

    def __repr__(self):
        return '<Set {} reps of {} at {}>'.format(self.reps, self.exercise.name, self.weight)
