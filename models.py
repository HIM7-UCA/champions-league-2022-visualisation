from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()  # Just create the instance, don't bind it yet

# Define your models

class GoalKeeping(db.Model):
    __tablename__ = 'goalkeepings'
    serial = db.Column(db.Integer, primary_key=True)
    player_name = db.Column(db.String(100))
    club = db.Column(db.String(100))
    position = db.Column(db.String(50))
    saved = db.Column(db.Integer)
    conceded = db.Column(db.Integer)
    saved_penalties = db.Column(db.Integer)
    cleansheets = db.Column(db.Integer)
    punches_made = db.Column(db.Integer)
    match_played = db.Column(db.Integer)

class Attacking(db.Model):
    __tablename__ = 'attackings'
    serial = db.Column(db.Integer, primary_key=True)
    player_name = db.Column(db.String(100))
    club = db.Column(db.String(100))
    position = db.Column(db.String(50))
    assists = db.Column(db.Integer)
    corner_taken = db.Column(db.Integer)
    offsides = db.Column(db.Integer)
    dribbles = db.Column(db.Integer)
    total_attempts = db.Column(db.Integer)
    match_played = db.Column(db.Integer)

class Defending(db.Model):
    __tablename__ = 'defendings'
    serial = db.Column(db.Integer, primary_key=True)
    player_name = db.Column(db.String(100))
    club = db.Column(db.String(100))
    position = db.Column(db.String(50))
    balls_recovered = db.Column(db.Integer)
    tackles = db.Column(db.Integer)
    t_won = db.Column(db.Integer)
    t_lost = db.Column(db.Integer)
    clearance_attempted = db.Column(db.Integer)
    match_played = db.Column(db.Integer)

class Distribution(db.Model):
    __tablename__ = 'distributions'
    serial = db.Column(db.Integer, primary_key=True)
    player_name = db.Column(db.String(100))
    club = db.Column(db.String(100))
    position = db.Column(db.String(50))
    pass_accuracy = db.Column(db.Float)
    pass_attempted = db.Column(db.Integer)
    pass_completed = db.Column(db.Integer)
    cross_accuracy = db.Column(db.Float)
    cross_attempted = db.Column(db.Integer)
    cross_completed = db.Column(db.Integer)
    freekicks_taken = db.Column(db.Integer)
    match_played = db.Column(db.Integer)

class Attempts(db.Model):
    __tablename__ = 'attempts'
    serial = db.Column(db.Integer, primary_key=True)
    player_name = db.Column(db.String(100))
    club = db.Column(db.String(100))
    position = db.Column(db.String(50))
    total_attempts = db.Column(db.Integer)
    on_target = db.Column(db.Integer)
    off_target = db.Column(db.Integer)
    blocked = db.Column(db.Integer)
    match_played = db.Column(db.Integer)

class Goals(db.Model):
    __tablename__ = 'goals'
    id = db.Column(db.Integer, primary_key=True)
    serial = db.Column(db.Integer)
    player_name = db.Column(db.String(100))
    club = db.Column(db.String(100))
    position = db.Column(db.String(50))
    goals = db.Column(db.Integer)
    right_foot = db.Column(db.Integer)
    left_foot = db.Column(db.Integer)
    headers = db.Column(db.Integer)
    others = db.Column(db.Integer)
    inside_area = db.Column(db.Integer)
    outside_area = db.Column(db.Integer)
    penalties = db.Column(db.Integer)
    match_played = db.Column(db.Integer)
    createdAt = db.Column(db.DateTime)
    updatedAt = db.Column(db.DateTime)
class KeyStats(db.Model):
    __tablename__ = 'key_stats'
    player_name = db.Column(db.String(100), primary_key=True)
    club = db.Column(db.String(100))
    position = db.Column(db.String(50))
    minutes_played = db.Column(db.Integer)
    match_played = db.Column(db.Integer)
    goals = db.Column(db.Integer)
    assists = db.Column(db.Integer)
    distance_covered = db.Column(db.Float)

class Disciplinary(db.Model):
    __tablename__ = 'disciplinaries'
    serial = db.Column(db.Integer, primary_key=True)
    player_name = db.Column(db.String(100))
    club = db.Column(db.String(100))
    position = db.Column(db.String(50))
    fouls_committed = db.Column(db.Integer)
    fouls_suffered = db.Column(db.Integer)
    red = db.Column(db.Integer)
    yellow = db.Column(db.Integer)
    minutes_played = db.Column(db.Integer)
    match_played = db.Column(db.Integer)
