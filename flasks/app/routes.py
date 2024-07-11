from flask import request, jsonify
from . import db
from .models import User, Exercise, Session, Set
from flask_cors import CORS
from flask_cors import cross_origin
import re
#from .models import to_dict


def init_routes(app):

    #################################### USERS ######################################

    @app.route("/user",methods = ["POST","GET"])
    @cross_origin()
    def user():
        data = request.get_json()

        search = User.query.filter_by(email = data['email']).first()
        if search:
            print("User Already Exists")
            return jsonify({'message': f'User with email {data['email']} already exists'}), 201

        newuser = User(
            name = data['name'],
            email = data['email'],
            password = data['password']
            
        )
        db.session.add(newuser)
        db.session.commit()


        return jsonify({'message': 'User created'}), 201
    
    @app.route("/getuser", methods = ["GET"])
    def get_user():
        data = request.get_json()
        search = User.query.filter_by(email =data['email']).first()
        if search:
            return jsonify({'message': f'existing email:  {search.to_dict()}'}), 201
        else:
            return jsonify({'message': 'User does not exist'})
    #################################### SESSIONS ######################################


    #################################### EXERCISES ######################################
    @app.route('/exercise', methods=['POST'])
    def create_exercise():
        # Implementation
        data = request.get_json()
        exists = Exercise.query.filter_by(name = data['name']).first()

        if(exists):
            return jsonify({'message': 'Exercise already exists'}), 201


        else:
            new_exercise = Exercise(
            name=data['name'].strip().lower(),
            muscle_group=data['muscle_group'],
            )

            db.session.add(new_exercise)
            db.session.commit()

        # Add sets if provided
        if 'sets' in data and data['sets']:
            sets_data = data['sets']
            for set_data in sets_data:
                new_set = Set(
                    weight=set_data.get('weight', 0),
                    reps=set_data.get('reps', 0),
                    session_id=set_data.get('session_id'),
                    exercise_id=new_exercise.id
                )
                db.session.add(new_set)

        db.session.commit()
        return jsonify({'message': 'Exercise created'}), 201

    @app.route('/getexercise', methods=['GET'])
    def get_exercise():
        data = request.get_json()
        exercise = Exercise.query.filter_by(name = f"{data['name']}").first()

        if(exercise):
            return jsonify(exercise.to_dict()), 201
            #return jsonify(exercise), 200
        else:
            return jsonify({'message': 'Exercise does not exist'}), 404
        
    @app.route('/searchexercise', methods = ['GET'])
    def search_exercise():
        name = request.args.get('name')
        if name:
            exercise = Exercise.query.filter_by(name=name).first()
            if exercise:
                return jsonify({
                    'name': exercise.name,
                    'muscle_group': exercise.muscle_group,
                    'sets': [set.to_dict() for set in exercise.set_entries]
                })
            else:
                return jsonify({'message': 'Exercise not found'}), 404
        else:
            return jsonify({'message': 'Name parameter is required'}), 400
        
    @app.route('/deleteexercise', methods = ['DELETE'])
    def delete_exercise():
        data = request.get_json()
        exercise = Exercise.query.filter_by(name = data['name']).first()
        if(exercise):
            db.session.delete(exercise)
            db.session.commit()
            return "Exercise deleted"
        else:
            return "Exercise does not exist"
        
    @app.route('/getmusclegroups', methods = ['GET'])
    def get_muscle_groups():
        muscle_groups = ['Chest', 'Back', 'Legs', 'Triceps', 'Biceps', 'Shoulders', 'Core', 'Forearm']
        return jsonify(muscle_groups)





    #################################### SETS ######################################
 

    @app.route('/sets', methods=['POST'])
    def create_set():
        data = request.get_json()
        exercise_search = Exercise.query.filter_by(name = data['exercise_name'].strip().lower())

        if(exercise_search):
            new_set = Set(
                weight=data['weight'],
                reps=data['reps'],
                session_id=data['session_id'],
                exercise_id= exercise_search.id
            )
        else:
            #print would you like to create new exercise, search by similarity
            #1: search by first few letters of all exercises?
            #2: would you like to create this exercise?
            #3: search again (new search)
            return jsonify({'message':f'exercise name {data['exercise_name']} does not exist'})
        
        db.session.add(new_set)
        db.session.commit()

        return jsonify(new_set.to_dict()), 201
    
    

    # Similar endpoints for update and delete, and for sessions

    

