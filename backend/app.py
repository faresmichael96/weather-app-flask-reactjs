import json
from flask import Flask, jsonify, request
import requests
from flask_cors import CORS, cross_origin
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
from sqlalchemy.pool import NullPool
from dotenv import load_dotenv
from datetime import date, timedelta
import models
import psycopg2
import os

from flask_jwt_extended import create_access_token, current_user, jwt_required, JWTManager

load_dotenv()

weather_api_base_url = "http://api.weatherapi.com/v1"

app = Flask(__name__)

SQLALCHEMY_DATABASE_URI = "postgresql://{username}:{password}@{hostname}/{databasename}".format(
    username = os.getenv('DATABASE_USERNAME'),
    password = os.getenv('DATABASE_PASSWORD'),
    hostname = os.getenv('DATABASE_URL'),
    databasename = os.getenv('DATABASE'),
)
app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI

engine = create_engine(
          'postgresql://{username}:{password}@{hostname}/{databasename}',
          pool_size=200, max_overflow=0)

app.config["JWT_SECRET_KEY"] = os.getenv('SECRET_KEY')
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

jwt = JWTManager(app)
db = SQLAlchemy(app)
db.app = app

# CORS implemented so that we don't get errors when trying to access the server from a different server location
cors = CORS(app, supports_credentials=True)
app.config['CORS_HEADERS'] = 'Content-Type'

# Register a callback function that takes whatever object is passed in as the
# identity when creating JWTs and converts it to a JSON serializable format.
@jwt.user_identity_loader
def user_identity_lookup(user):
    return user

# Register a callback function that loads a user from your database whenever
# a protected route is accessed. This should return any python object on a
# successful lookup, or None if the lookup failed for any reason (for example
# if the user has been deleted from the database).
@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    return models.User.query.filter_by(username=identity).one_or_none()

# function toconnect to db
def get_db_connection():
    conn = psycopg2.connect(host='localhost',
    database = 'weather-app',
    user = os.getenv('DATABASE_USERNAME'),
    password = os.getenv('DATABASE_PASSWORD'))
    return conn

# get all countries
@app.route('/api/get-countries', methods=["GET"])
def countries():
    countries = []
    all_countries = models.Countries.query.all()
    for country in all_countries:
        countries.append({'id': country.id, 'name': country.nicename})
    return jsonify(countries)

@app.route('/api/register', methods = ['POST'])
def register():
    name = request.json.get('fullName')
    country = request.json.get('country')
    username = request.json.get('username')
    password = request.json.get('password')

    exist_user = models.User.query.filter_by(username=username).first()
    if exist_user is not None:
        return jsonify({'message':'This account already exists'}), 409
    
    if(name == '' or country == '' or username == '' or password == ''):
        return jsonify({'message':'All fields are required'}), 422
    elif(len(password) < 8):
        return jsonify({'message':'Password must be minimum length of 8'}), 422
    elif(len(name) > 255):
        return jsonify({'message':'Your full name is too long'}), 422
    elif(len(username) > 255):
        return jsonify({'message':'Your username is too long'}), 422

    new_user = models.User(name, country, username, password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'success': True})
        

@app.route("/api/login", methods=["POST"])
def login():
    username = request.json.get("username", None)
    password = request.json.get("password", None)

    if(username == '' or password == ''):
        return jsonify({'message':'All fields are required'}), 422
    elif(len(password) < 8):
        return jsonify({'message':'Password must be minimum length of 8'}), 422
    elif(len(username) > 255):
        return jsonify({'message':'Your full name is too long'}), 422

    user = models.User.query.filter_by(username=username).one_or_none()
    if not user or not user.check_password(password):
        return jsonify({'message':'Wrong username or password'}), 401
    
    user_data = [{'id': user.id, 'full_name': user.full_name, 'country': user.country, 'username': user.username}]
    user_data = json.dumps(user_data)
    
    # Notice that we are passing in the actual sqlalchemy user object here
    access_token = create_access_token(identity = username)
    return jsonify({'token': access_token, 'user': user_data})

# Protect a route with jwt_required, which will kick out requests
# without a valid JWT present.
@app.route("/api/user", methods=["GET"])
@jwt_required()
def protected():
    # We can now access our sqlalchemy User object via `current_user`.
    return jsonify(
        id = current_user.id,
        name = current_user.full_name,
        country = current_user.country,
        username = current_user.username
    )

@app.route("/api/get-weather", methods=["GET"])
@jwt_required()
def getUserLocationWeather():
    user_country = current_user.country

    today = date.today()
    yesterday = today - timedelta(days = 1)
    tomorrow = today + timedelta(days = 1)

    yesterdayWeather = requests.get(weather_api_base_url + '/history.json?key=a6f4b2851e70482ebdf122527221404&q='+ user_country + '&dt=' + str(yesterday))
    todayWeather = requests.get(weather_api_base_url + '/current.json?key=a6f4b2851e70482ebdf122527221404&q='+ user_country + '&dt=' + str(today))
    tomorrowWeather = requests.get(weather_api_base_url + '/forecast.json?key=a6f4b2851e70482ebdf122527221404&q='+ user_country + '&dt=' + str(tomorrow))
    
    return {
        "yesterdayWeather" : yesterdayWeather.json(),
        "todayWeather" : todayWeather.json(),
        "tomorrowWeather" : tomorrowWeather.json()
    }


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)