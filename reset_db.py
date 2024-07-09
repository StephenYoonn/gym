from flasks.app import create_app
from flasks.app.database import db

app = create_app()

with app.app_context():
    db.drop_all()  # Drop all tables
    db.create_all()