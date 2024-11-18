from flask import Flask, render_template, jsonify
from flask_sqlalchemy import SQLAlchemy
from models import db, Goals, Disciplinary, KeyStats,Attacking,Defending,GoalKeeping

app = Flask(__name__)

# Configure the MySQL database
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/uefa'  # Update with your credentials
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Home route to render the main page
@app.route('/')
def index():
    return render_template('players.html')

# API route to fetch player data (for the table)
@app.route('/api/players', methods=['GET'])
def get_players():
    players = KeyStats.query.all()  # Fetch all players from KeyStats
    result = []
    for player in players:
        result.append({
            'player_name': player.player_name,
            'club': player.club,
            'position': player.position,
            'minutes_played': player.minutes_played,
            'match_played': player.match_played,
            'goals': player.goals,
            'assists': player.assists,
            'distance_covered': player.distance_covered
        })
    return jsonify(result)

# API route to fetch goals data (for ranking)
@app.route('/api/goals', methods=['GET'])
def get_goals():
    goals = Goals.query.order_by(Goals.goals.desc()).limit(3).all()
    goals_data = [
        {
            'rank': idx + 1,
            'player_name': goal.player_name,
            'club': goal.club,
            'goals': goal.goals
        }
        for idx, goal in enumerate(goals)
    ]
    return jsonify(goals_data)

# API route to fetch discipline data for a specific player
@app.route('/api/discipline/<player_name>', methods=['GET'])
def get_player_discipline(player_name):
    # Fetch the disciplinary data for the specified player
    player = Disciplinary.query.filter_by(player_name=player_name).first()
    
    if player:
        discipline_data = {
            'player_name': player.player_name,
            'fouls_committed': player.fouls_committed,
            'fouls_suffered': player.fouls_suffered,
            'red': player.red,
            'yellow': player.yellow
        }
        return jsonify(discipline_data)
    else:
        return jsonify({'error': 'Player not found'}), 404


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

# API route to fetch total goals by club
@app.route('/api/total_goals_by_club', methods=['GET'])
def total_goals_by_club():
    # Aggregate total goals per club
    total_goals = db.session.query(Goals.club, db.func.sum(Goals.goals).label('total_goals')).group_by(Goals.club).all()
    
    # Sort the clubs by total goals in descending order
    sorted_goals = sorted(total_goals, key=lambda x: x[1], reverse=True)
    
    # Structure the data for the frontend
    result = [{'club': club, 'total_goals': total_goals} for club, total_goals in sorted_goals]

    return jsonify(result)

@app.route('/clubs')
def clubs():
    return render_template('clubs.html')


# API route to fetch goals by position and club
@app.route('/api/goals_by_position', methods=['GET'])
def goals_by_position():
    goals = db.session.query(Goals.club, Goals.position, db.func.sum(Goals.goals).label('total_goals')).group_by(Goals.club, Goals.position).all()
    
    club_position_data = {}
    for club, position, total_goals in goals:
        if club not in club_position_data:
            club_position_data[club] = {'Forward': 0, 'Midfielder': 0, 'Defender': 0}
        club_position_data[club][position] = total_goals

    result = [{'club': club, **positions} for club, positions in club_position_data.items()]
    return jsonify(result)


# API route to fetch defending stats
@app.route('/api/defending', methods=['GET'])
def get_defending_stats():
    defending_stats = Defending.query.all()  # Fetch all defending stats
    result = []
    for stat in defending_stats:
        result.append({
            'player_name': stat.player_name,
            'club': stat.club,
            'position': stat.position,
            'balls_recovered': stat.balls_recovered,
            'tackles': stat.tackles,
            't_won': stat.t_won,
            't_lost': stat.t_lost,
            'clearance_attempted': stat.clearance_attempted,
            'match_played': stat.match_played
        })
    return jsonify(result)

# API route to fetch attacking stats
@app.route('/api/attacking', methods=['GET'])
def get_attacking_stats():
    attacking_stats = Attacking.query.all()  # Fetch all attacking stats
    result = []
    for stat in attacking_stats:
        result.append({
            'player_name': stat.player_name,
            'club': stat.club,
            'position': stat.position,
            'assists': stat.assists,
            'corner_taken': stat.corner_taken,
            'offsides': stat.offsides,
            'dribbles': stat.dribbles,
            'total_attempts': stat.total_attempts,
            'match_played': stat.match_played
        })
    return jsonify(result)

# API route to fetch goalkeeping stats
@app.route('/api/goalkeeping', methods=['GET'])
def get_goalkeeping_stats():
    goalkeeping_stats = GoalKeeping.query.all()  # Fetch all goalkeeping stats
    result = []
    for stat in goalkeeping_stats:
        result.append({
            'player_name': stat.player_name,
            'club': stat.club,
            'position': stat.position,
            'saved': stat.saved,
            'conceded': stat.conceded,
            'saved_penalties': stat.saved_penalties,
            'cleansheets': stat.cleansheets,
            'punches_made': stat.punches_made,
            'match_played': stat.match_played
        })
    return jsonify(result)


if __name__ == '__main__':
    app.run(debug=True)












