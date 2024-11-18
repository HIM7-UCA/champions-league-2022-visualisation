from flask import Flask, render_template, jsonify
from flask_sqlalchemy import SQLAlchemy
from models import db, Goals

app = Flask(__name__)
# Configure the MySQL database
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/uefa'  # Update with your credentials
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
# Home route to render the main page
@app.route('/')
def index():
    return render_template('bar.html')

@app.route('/api/goals_by_club', methods=['GET'])
def get_goals_by_club():
    # Get all distinct clubs for dropdown
    all_clubs = db.session.query(Goals.club).distinct().all()
    clubs_list = [club[0] for club in all_clubs]  # Flatten the list of tuples
    
    return jsonify({'clubs': clubs_list})

@app.route('/api/goals_by_club/<club_name>', methods=['GET'])
def get_goals_for_club(club_name):
    # Get all players and goals for the selected club
    players = db.session.query(Goals).filter(Goals.club == club_name).all()
    
    player_data = [{
        'player_name': player.player_name,
        'goals': player.goals,
        'position': player.position  # Add other fields as needed
    } for player in players]

    return jsonify({'club': club_name, 'players': player_data})

if __name__ == '__main__':
    app.run(debug=True)