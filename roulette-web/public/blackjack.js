$(document).ready(function() {
    let deck = [];
    let playerHand = [];
    let dealerHand = [];
    let gameOver = false;

    // Card names and suits mapping
    const cardSuits = {
        'C': 'C',
        'D': 'D',
        'H': 'H',
        'S': 'S'
    };
    const cardValues = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

    const cardImageBaseUrl = '/public/cards/';

    function getCardImage(card) {
        const [value, suit] = card.split('-'); // e.g., '2-C' => value: '2', suit: 'C'
        return `${cardImageBaseUrl}${value}-${suit}.png`; // e.g., '/public/cards/2-C.png'
    }

    function initializeDeck() {
        deck = cardValues.flatMap(value =>
            Object.keys(cardSuits).map(suit => `${value}-${suit}`)
        ).flatMap(card => [card, card, card, card]); // Example duplication for each card
        shuffleDeck();
    }

    function shuffleDeck() {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }

    function calculateHandTotal(hand) {
        let total = 0;
        let aceCount = 0;
        hand.forEach(card => {
            const value = card.split('-')[0]; // Get the value part of the card
            if (value === 'J' || value === 'Q' || value === 'K') {
                total += 10;
            } else if (value === 'A') {
                aceCount++;
                total += 11;
            } else {
                total += parseInt(value);
            }
        });
        while (total > 21 && aceCount > 0) {
            total -= 10;
            aceCount--;
        }
        return total;
    }

    function updateHands() {
        $('#player-hand').empty();
        $('#dealer-hand').empty();

        playerHand.forEach(card => {
            $('#player-hand').append(`<div class="card"><img src="${getCardImage(card)}" alt="${card}"></div>`);
        });

        dealerHand.forEach(card => {
            $('#dealer-hand').append(`<div class="card"><img src="${getCardImage(card)}" alt="${card}"></div>`);
        });
    }

    function startGame() {
        initializeDeck();
        playerHand = [deck.pop(), deck.pop()];
        dealerHand = [deck.pop(), deck.pop()];

        updateHands();
        $('#game-message').text('Game started. Place your bets!');
        $('#controls').show();
        $('#blackjack-form').hide();
        $('#restart').hide(); // Hide restart button initially
        gameOver = false;
    }

    function hit() {
        if (gameOver) return;

        playerHand.push(deck.pop());
        updateHands();

        const playerTotal = calculateHandTotal(playerHand);
        if (playerTotal > 21) {
            $('#game-message').text('Busted! You lose.');
            gameOver = true;
            $('#restart').show(); // Show restart button
        }
    }

    function stand() {
        if (gameOver) return;

        let dealerTotal = calculateHandTotal(dealerHand);
        while (dealerTotal < 17) {
            dealerHand.push(deck.pop());
            dealerTotal = calculateHandTotal(dealerHand);
        }

        updateHands();

        const playerTotal = calculateHandTotal(playerHand);
        if (dealerTotal > 21 || playerTotal > dealerTotal) {
            $('#game-message').text('You win!');
        } else if (playerTotal < dealerTotal) {
            $('#game-message').text('Dealer wins!');
        } else {
            $('#game-message').text('It\'s a tie!');
        }
        gameOver = true;
        $('#restart').show(); // Show restart button
    }

    function doubleDown() {
        if (gameOver) return;

        playerHand.push(deck.pop());
        updateHands();
        stand(); // Automatically stand after doubling down
    }

    function restartGame() {
        $('#blackjack-form').show();
        $('#controls').hide();
        $('#restart').hide();
        $('#game-message').text('');
        playerHand = [];
        dealerHand = [];
        gameOver = false;
        startGame();
    }

    $('#blackjack-form').on('submit', function(e) {
        e.preventDefault();
        startGame();
    });

    $('#hit-button').on('click', hit);
    $('#stand-button').on('click', stand);
    $('#double-button').on('click', doubleDown);
    $('#restart-button').on('click', restartGame);
});
