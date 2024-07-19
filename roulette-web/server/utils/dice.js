const { determineOutcome, generateRandomSeed, hash } = require('./seed');

function rollDice(serverSeed, clientSeed, nonce) {
    const outcomes = [1, 2, 3, 4, 5, 6];
    const roll = determineOutcome(serverSeed, clientSeed, nonce, outcomes);
    return roll;
}

module.exports = {
    rollDice
};
