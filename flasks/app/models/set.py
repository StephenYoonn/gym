from flasks.app.database import db
from sqlalchemy.orm import relationship


class Set(db.Model):
    __tablename__ = "sets"
    id = db.Column(db.Integer, primary_key = True)
    weight = db.Column(db.Integer)
    reps = db.Column(db.Integer)
    exercise_id = db.Column(db.Integer, db.ForeignKey('exercises.id'), nullable=False)
    failure = db.Column(db.Boolean, default=False)
    dropset_weight = db.Column(db.Integer, nullable=True)
    dropset_reps = db.Column(db.Integer, nullable=True)
    partial_reps = db.Column(db.Integer, nullable=True)
    def to_dict(self):
        return {
            'id': self.id,
            'weight': self.weight,
            'reps': self.reps,
            'session_id': self.session_id,
            'exercise_id': self.exercise_id
        }