import datetime
from flask import request, jsonify, redirect, url_for
from . import db
from .models import User, Exercise, Session, Set
from flask_cors import CORS
from flask_cors import cross_origin
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import check_password_hash, generate_password_hash
import re
#from .models import to_dict


def init_routes(app):

    #################################### USERS ######################################
    @app.route('/login', methods = ['POST'])
    def login():
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")
        user = User.query.filter_by(email=email).first()

        if user and check_password_hash(user.password, password):
            login_user(user, remember=True)
            return jsonify({'message':'Login Successful'}), 200
        else:
            return jsonify({'message':'Login unsuccessful'}), 401




    @app.route("/user",methods = ["POST","GET"])
    #@cross_origin()
    def user():
        data = request.get_json()

        search = User.query.filter_by(email = data['email']).first()
        if search:
            print("User Already Exists")
            return jsonify({'message': f'User with email {data['email']} already exists'}), 201

        hashed_password = generate_password_hash(data.get('password'), method ='pbkdf2:sha256')
        newuser = User(
            name = data['name'],
            email = data['email'],
            password = hashed_password
            
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
        

    @app.route('/getusers', methods=['GET'])
    def get_all_users():
        users = User.query.all()
        return jsonify([user.to_dict() for user in users])
    #################################### SESSIONS ######################################

    @app.route('/session', methods = ['GET', 'POST'])
    def session():
        data = request.get_json()
        search = Session.query.filter_by(date = data['date']).first()

        if (search):
            current_id = search.id
            return jsonify({'sessionid':current_id})
        else:
            new_session = Session(
                userid = data.get("userid"),
                date = data['date']
            )
        
            db.session.add(new_session)
            db.session.commit()

            return jsonify({'sessionid':new_session.id})

    #################################### EXERCISES ######################################
    @app.route('/exercise', methods=['POST'])
    #@login_required
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
                    exercise_id=new_exercise.id
                )
                
                db.session.add(new_set)

        db.session.commit()
        return jsonify({'message': 'Exercise created'}), 201

    @app.route('/getexercise', methods=['GET'])
    #@login_required
    def get_exercise():

        data = request.get_json()
        exercise = Exercise.query.filter_by(name = f"{data['name']}").first()

        if(exercise):
            return jsonify(exercise.to_dict()), 201
            #return jsonify(exercise), 200
        else:
            return jsonify({'message': 'Exercise does not exist'}), 404
        
    @app.route('/searchexercise', methods = ['GET'])
    #@login_required
    def search_exercise():
        name = request.args.get('name')
        if name:
            exercise = Exercise.query.filter_by(name=name).first()
            if exercise:
                return jsonify({
                    'name': exercise.name,
                    'muscle_group': exercise.muscle_group,
                    'session_id': exercise.session_id
                })
            else:
                return jsonify({'message': 'Exercise not found'}), 404
        else:
            return jsonify({'message': 'Name parameter is required'}), 400
        
    @app.route('/deleteexercise', methods = ['DELETE'])
    #@login_required
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
    #@login_required
    def create_set():
        data = request.get_json()
        exercise_search = Exercise.query.filter_by(name = data['exercise_name'].strip().lower()).first()
        session_id_date=Exercise.query.filter_by(date = data['date'])
      
        if(exercise_search):
            if(session_id_date):
                new_set = Set(
                    weight=data['weight'],
                    reps=data['reps'],
                    exercise_id= exercise_search.id
                )
            else:
                new_set = Set(
                    weight=data['weight'],
                    reps=data['reps'],
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
    
        #################################### Taking in Notes ######################################
    
    @app.route('/log', methods=['POST'])
    def log():
        data = request.get_json()
        notes = data.get('notes', '')
        date_str = data.get('date', '')
        #user_id = current_user.id

        # Convert the date string to a date object
        try:
            current_date = datetime.datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'message': 'Invalid date format'}), 400

        set_pattern = re.compile(r'(\d+(\.\d+)?[a-zA-Z]*)')
        lines = notes.split('\n')
        current_muscle_group = None
        current_exercise = None

        # Create or get the current session for the user
        current_session = Session.query.filter_by( date=current_date).first()
        if not current_session:
            current_session = Session( date=current_date)
            db.session.add(current_session)
            db.session.commit()

        for line in lines:
            line = line.strip()

            if '->' in line:
                # This line contains a muscle group and exercise
                parts = line.split('->')
                current_muscle_group = parts[0].strip()
                current_exercise_name = parts[1].strip().lower()
                print('current exercise name: ' + current_exercise_name)
                current_exercise = Exercise.query.filter_by(name=current_exercise_name, muscle_group=current_muscle_group,session_id=current_session.id).first()

                if not current_exercise:
                    current_exercise = Exercise(name=current_exercise_name, muscle_group=current_muscle_group,session_id=current_session.id)
                    db.session.add(current_exercise)
                    db.session.commit()

            elif set_pattern.findall(line):
                # This line contains sets
                set_details = set_pattern.findall(line)
                for set_detail in set_details:
                    weight_reps = set_detail[0].split('.')
                    weight = int(weight_reps[0])
                    reps = int(weight_reps[1]) if len(weight_reps) > 1 else 0
                    failure = 'f' in set_detail[0]
                    dropset = 'ds' in set_detail[0]
                    partial = 'p' in set_detail[0]

                    # Create a new set
                    new_set = Set(
                        weight=weight,
                        reps=reps,
                        failure=failure,
                        dropset_weight=weight if dropset else None,
                        dropset_reps=reps if dropset else None,
                        partial_reps=reps if partial else None,
                        exercise_id=current_exercise.id,
                        #session_id=current_session.id
                    )
                    db.session.add(new_set)
                    db.session.commit()

        return jsonify({'message': "Workout logged successfully"})



    # Similar endpoints for update and delete, and for sessions


    #################################### Visualization ######################################


    

