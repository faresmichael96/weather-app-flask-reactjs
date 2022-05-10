from app import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(150), nullable=False)
    country = db.Column(db.String(150), nullable=False)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)

    def __init__(self, fullName, country, username, password):
        self.full_name = fullName
        self.country = country
        self.username = username
        self.set_password(password)

    def __repr__(self):
        return f'<User {self.full_name}>'

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

class Countries(db.Model):
    __tablename__ = 'countries'
    id = db.Column(db.Integer, primary_key=True)
    iso = db.Column(db.CHAR(2), nullable=False)
    name = db.Column(db.String(150), nullable=False)
    nicename = db.Column(db.String(150), nullable=False)
    iso3 = db.Column(db.CHAR(3), nullable=True)
    numcode = db.Column(db.SMALLINT, nullable=True)
    phonecode = db.Column(db.Integer, nullable=False)

def init_db():
    db.create_all()

if __name__ == '__main__':
    init_db()