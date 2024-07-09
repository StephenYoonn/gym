from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from .database import db
from flask_cors import CORS


def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///gym.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    CORS(app)
    
    with app.app_context():
        from .models import User, Exercise, Session, Set
        db.create_all() 
    from .routes import init_routes
    init_routes(app)

    return app
