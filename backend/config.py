import os

basedir = os.path.abspath(os.path.dirname(__file__))

class Config(object):

  SQLALCHEMY_DATABASE_URI = 'postgresql+psycopg2://{user}:{pwd}@database/{db}'.format(
    user=os.environ['POSTGRES_USER'],
    pwd=os.environ['POSTGRES_PASSWORD'],
    db=os.environ['POSTGRES_DB']
  )

  SQLALCHEMY_TRACK_MODIFICATIONS = False
