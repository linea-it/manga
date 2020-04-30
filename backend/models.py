from app import app, db

class GalaxyModel(db.Model):
  __tablename__ = "galaxy"

  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(128), nullable=True)
  type = db.Column(db.String(64), nullable=True)
  ra = db.Column(db.Float, nullable=True)
  dec = db.Column(db.Float, nullable=True)
  cube = db.Column(db.String(128), nullable=True)

  comments = db.relationship('Comment', backref='comment')
  ratings = db.relationship('Rating', backref='rating')

  def __init__(self, name, type, ra, dec, cube):
    self.name = name
    self.type = type
    self.ra = ra
    self.dec = dec
    self.cube = cube
    self.comments = comments
    self.ratings = ratings

class CommentModel(db.Model):
  __tablename__ = "comment"

  id = db.Column(db.Integer, primary_key=True)
  id_galaxy = db.Column(db.Integer, db.ForeignKey('galaxy.id'))
  content = db.Column(db.UnicodeText)

  def __init__(self, id_galaxy, content):
    self.id_galaxy = id_galaxy
    self.content = content

class RatingModel(db.Model):
  __tablename__ = "rating"

  id = db.Column(db.Integer, primary_key=True)
  id_galaxy = db.Column(db.Integer, db.ForeignKey('galaxy.id'))
  score = db.Column(db.Integer)

  def __init__(self, id_galaxy, score):
    self.name = name
    self.id_galaxy = id_galaxy
    self.score = score
