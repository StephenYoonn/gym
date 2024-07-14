from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from .database import db
from flask_cors import CORS
from flask_login import LoginManager
from .models.users import User

login_manager = LoginManager()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///gym.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    #used to sign session cookies, so they are not tampered with, if signature doesn't match, data discarded
    app.config['SECRET_KEY'] = 'lebron'


    login_manager.init_app(app)
    login_manager.login_view = 'login'
    db.init_app(app)
    CORS(app)
    
    with app.app_context():
        from .models import User, Exercise, Session, Set
        db.create_all() 
    from .routes import init_routes
    init_routes(app)

    return app



@login_manager.user_loader
def load_user(user_id):
    #reloaads the user object from the user ID stored in the session
    return User.query.get(int(user_id))