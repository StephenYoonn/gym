from flasks.app.database import db
from sqlalchemy.orm import relationship


class Set(db.Model):
    __tablename__ = "sets"
    id = db.Column(db.Integer, primary_key = True)
    weight = db.Column(db.Integer)
    reps = db.Column(db.Integer)
    session_id = db.Column(db.Integer, db.ForeignKey('sessions.id'), nullable=False)
    exercise_id = db.Column(db.Integer, db.ForeignKey('exercises.id'), nullable=False)
 
    session = db.relationship('Session', backref='set_entries')  # Renaming backref to avoid conflict
    exercise = db.relationship('Exercise', backref='set_entries') 

    def __repr__(self):
        return '<Set {} reps of {} at {}>'.format(self.reps, self.exercise.name, self.weight)

    def to_dict(self):
        return {
            'id': self.id,
            'weight': self.weight,
            'reps': self.reps,
            'session_id': self.session_id,
            'exercise_id': self.exercise_id
        }