from . import db
from sqlalchemy.orm import relationship

class Exercise(db.Model):
    __tablename__ = "exercises"
    name = db.Column(db.String, primary_key = True)
    muscleGroup = db.Column(db.String(10))
    sets = relationship("set", backref = "exercise")

    def __repr__(self):
        return '<Exercise {}>'.format(self.name)
