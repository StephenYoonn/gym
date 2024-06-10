from flask import Blueprint, render_template, request, redirect, url_for, flash
from . import db
from .models import Exercise

main = Blueprint('main', __name__)

@main.route('/')
def index():
    exercises = Exercise.query.all()  # Assuming you have a model called Exercise
    return render_template('index.html', exercises=exercises)

@main.route('/add', methods=['POST'])
def add_exercise():
    if request.method == 'POST':
        exercise_name = request.form.get('exercise_name')
        sets = request.form.get('sets')
        reps = request.form.get('reps')
        weight = request.form.get('weight')
        
        # Create new Exercise instance
        new_exercise = Exercise(name=exercise_name, sets=sets, reps=reps, weight=weight)
        db.session.add(new_exercise)
        db.session.commit()
        
        flash('Exercise added successfully!')
        return redirect(url_for('main.index'))
    
@main.route('/summary')
def summary():
    exercises = Exercise.query.all()  # Fetch all exercises
    return render_template('summary.html', exercises=exercises)
