from your_app import db
from your_app.models import User  # Adjust if your model file is elsewhere

def reset_password():
    email = 'yoon.stephen@outlook.com'
    new_hashed_pw = 'scrypt:32768:8:1$KvrMz3gFxsuJEF5e$71715d0bdad14de97bced2f2dc54ab3df1d4c03942fa51ac887e08b3ce0266c028d8a015e15400d35e6c6137085aa78023754ea2bf6a4fa01dd9544e3ad39fdc'

    user = User.query.filter_by(email=email).first()

    if user:
        user.pw = new_hashed_pw
        db.session.commit()
        print(f"Password reset for {email}")
    else:
        print(f"User with email {email} not found.")

if __name__ == '__main__':
    reset_password()
