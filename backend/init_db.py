from dotenv import load_dotenv
import psycopg2
import os

load_dotenv()

# PostgreSQL Database credentials loaded from the .env file
DATABASE = os.getenv('DATABASE')
DATABASE_USERNAME = os.getenv('DATABASE_USERNAME')
DATABASE_PASSWORD = os.getenv('DATABASE_PASSWORD')

conn = psycopg2.connect(host='localhost',
    database = 'weather-app',
    user = os.getenv('DATABASE_USERNAME'),
    password = os.getenv('DATABASE_PASSWORD'))

# Open a cursor to perform database operations
cur = conn.cursor()

# Execute a command: this creates a new table
cur.execute('DROP TABLE IF EXISTS users;')
cur.execute('CREATE TABLE users (id serial PRIMARY KEY,'
                'full_name varchar (150) NOT NULL,'
                'country varchar (150) NOT NULL,'
                'username varchar (150) UNIQUE NOT NULL,'
                'password varchar (150) NOT NULL);'
        )

conn.commit()

cur.close()
conn.close()