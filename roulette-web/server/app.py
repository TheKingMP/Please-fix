from flask import Flask, request, jsonify, render_template
import random

app = Flask(__name__, static_folder='../public', template_folder='../public')

# Utility functions
def calculate_hand_total(hand):
    total = 0
    ace_count = 0
    for card in hand:
        if card in ['J', 'Q', 'K']:
            total += 10
        elif card == 'A':
            ace_count += 1
            total += 11
        else:
            total += int(card)
    while total > 21 and ace_count:
        total -= 10
        ace_count -= 1
    return total

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/roulette.html')
def roulette():
    return render_template('roulette.html')

@app.route('/blackjack.html')
def blackjack():
    return render_template('blackjack.html')

@app.route('/dice.html')
def dice():
    return render_template('dice.html')

@app.route('/rps.html')
def rps():
    return render_template('rps.html')

@app.route('/header.html')
def header():
    return render_template('header.html')

# Blackjack endpoints
@app.route('/start_blackjack', methods=['POST'])
def start_blackjack():
    data = request.get_json()
    bet = data['bet']

    deck = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'] * 4
    random.shuffle(deck)

    player_hand = [deck.pop(), deck.pop()]
    dealer_hand = [deck.pop(), deck.pop()]

    player_total = calculate_hand_total(player_hand)
    dealer_total = calculate_hand_total(dealer_hand)

    message = 'Game started. Place your bets!'

    return jsonify({
        'player_hand': player_hand,
        'dealer_hand': dealer_hand,
        'player_total': player_total,
        'dealer_total': dealer_total,
        'message': message,
        'game_over': False,
        'deck': deck
    })

@app.route('/hit', methods=['POST'])
def hit():
    data = request.get_json()
    deck: list = data['deck']
    player_hand: list = data['player_hand']
    dealer_hand: list = data['dealer_hand']

    player_hand.append(deck.pop())
    player_total = calculate_hand_total(player_hand)

    message = 'Player hits.'

    if player_total > 21:
        message = 'Player busts. You lose.'
        return jsonify({
            'player_hand': player_hand,
            'dealer_hand': dealer_hand,
            'player_total': player_total,
            'dealer_total': calculate_hand_total(dealer_hand),
            'message': message,
            'game_over': True,
            'deck': deck
        })

    return jsonify({
        'player_hand': player_hand,
        'dealer_hand': dealer_hand,
        'player_total': player_total,
        'dealer_total': calculate_hand_total(dealer_hand),
        'message': message,
        'game_over': False,
        'deck': deck
    })

@app.route('/stand', methods=['POST'])
def stand():
    data = request.get_json()
    deck = data['deck']
    player_hand = data['player_hand']
    dealer_hand = data['dealer_hand']

    player_total = calculate_hand_total(player_hand)
    dealer_total = calculate_hand_total(dealer_hand)

    while dealer_total < 17:
        dealer_hand.append(deck.pop())
        dealer_total = calculate_hand_total(dealer_hand)

    if dealer_total > 21 or player_total > dealer_total:
        message = 'You win!'
    elif player_total < dealer_total:
        message = 'Dealer wins. You lose.'
    else:
        message = 'It\'s a tie.'

    return jsonify({
        'player_hand': player_hand,
        'dealer_hand': dealer_hand,
        'player_total': player_total,
        'dealer_total': dealer_total,
        'message': message,
        'game_over': True,
        'deck': deck
    })

@app.route('/double', methods=['POST'])
def double():
    data = request.get_json()
    deck = data['deck']
    player_hand = data['player_hand']
    dealer_hand = data['dealer_hand']

    player_hand.append(deck.pop())
    player_total = calculate_hand_total(player_hand)

    message = 'Player doubles down.'

    if player_total > 21:
        message = 'Player busts. You lose.'
        return jsonify({
            'player_hand': player_hand,
            'dealer_hand': dealer_hand,
            'player_total': player_total,
            'dealer_total': calculate_hand_total(dealer_hand),
            'message': message,
            'game_over': True,
            'deck': deck
        })

    while calculate_hand_total(dealer_hand) < 17:
        dealer_hand.append(deck.pop())

    dealer_total = calculate_hand_total(dealer_hand)

    if dealer_total > 21 or player_total > dealer_total:
        message = 'You win!'
    elif player_total < dealer_total:
        message = 'Dealer wins. You lose.'
    else:
        message = 'It\'s a tie.'

    return jsonify({
        'player_hand': player_hand,
        'dealer_hand': dealer_hand,
        'player_total': player_total,
        'dealer_total': dealer_total,
        'message': message,
        'game_over': True,
        'deck': deck
    })

# Dice endpoints
@app.route('/roll_dice', methods=['POST'])
def roll_dice():
    data = request.get_json()
    bet = data['bet']

    player_roll = random.randint(1, 6)
    house_roll = random.randint(1, 6)

    if player_roll > house_roll:
        message = 'You win!'
    elif player_roll < house_roll:
        message = 'You lose!'
    else:
        message = 'It\'s a tie!'

    return jsonify({
        'player_roll': player_roll,
        'house_roll': house_roll,
        'message': message
    })

# Rock Paper Scissors endpoints
@app.route('/play_rps', methods=['POST'])
def play_rps():
    data = request.get_json()
    player_choice = data['choice']
    choices = ['rock', 'paper', 'scissors']
    house_choice = random.choice(choices)

    if player_choice == house_choice:
        message = 'It\'s a tie!'
    elif (player_choice == 'rock' and house_choice == 'scissors') or \
         (player_choice == 'scissors' and house_choice == 'paper') or \
         (player_choice == 'paper' and house_choice == 'rock'):
        message = 'You win!'
    else:
        message = 'You lose!'

    return jsonify({
        'player_choice': player_choice,
        'house_choice': house_choice,
        'message': message
    })

if __name__ == '__main__':
    app.run(debug=True)
