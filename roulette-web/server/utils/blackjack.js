const { determineOutcome, generateRandomSeed, hash } = require('./seed');

const cards = [
    '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'
];
const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];

function getCardValue(card) {
    if (card === 'A') return 11;
    if (['J', 'Q', 'K'].includes(card)) return 10;
    return parseInt(card, 10);
}

function drawCard() {
    const card = cards[Math.floor(Math.random() * cards.length)];
    const suit = suits[Math.floor(Math.random() * suits.length)];
    return { card, suit, value: getCardValue(card) };
}

function calculateHandValue(hand) {
    let value = hand.reduce((sum, card) => sum + card.value, 0);
    let aces = hand.filter(card => card.card === 'A').length;

    while (value > 21 && aces > 0) {
        value -= 10;
        aces--;
    }

    return value;
}

function playBlackjack(serverSeed, clientSeed, nonce, bet) {
    const outcomes = ['Win', 'Lose', 'Draw'];

    const outcome = determineOutcome(serverSeed, clientSeed, nonce, outcomes);

    const playerHand = [drawCard(), drawCard()];
    const dealerHand = [drawCard(), drawCard()];

    const playerValue = calculateHandValue(playerHand);
    const dealerValue = calculateHandValue(dealerHand);

    let result;
    if (playerValue > 21) {
        result = 'Lose';
    } else if (dealerValue > 21 || playerValue > dealerValue) {
        result = 'Win';
    } else if (playerValue < dealerValue) {
        result = 'Lose';
    } else {
        result = 'Draw';
    }

    return {
        result,
        playerHand,
        dealerHand
    };
}

module.exports = {
    playBlackjack
};
