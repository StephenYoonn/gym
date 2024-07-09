from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from flasks.app import create_app


#users api route
#@app.route("/user")
#def user():
#    return{"users": ["user1", "user2", "user3"]}
app = create_app()


if __name__ == "__main__":
      # This will create the database file if it doesn't exist when you first run the app.
    app.run(debug=True, port=5000)
#.\\venv\Scripts\activate
