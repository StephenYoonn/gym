from flask import Blueprint

# Import specific Blueprints
from .users import users_bp
from .exercises import exercises_bp

def init_api(app):
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(exercises_bp, url_prefix='/api/exercises')
