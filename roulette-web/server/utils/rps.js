const { determineOutcome, generateRandomSeed, hash } = require('./seed');

const choices = ['rock', 'paper', 'scissors'];

function playRPS(serverSeed, clientSeed, nonce, userChoice) {
    const outcome = determineOutcome(serverSeed, clientSeed, nonce, choices);
    const result = getRPSResult(userChoice, outcome);

    return {
        userChoice,
        computerChoice: outcome,
        result
    };
}

function getRPSResult(userChoice, computerChoice) {
    if (userChoice === computerChoice) return 'Draw';
    if (
        (userChoice === 'rock' && computerChoice === 'scissors') ||
        (userChoice === 'paper' && computerChoice === 'rock') ||
        (userChoice === 'scissors' && computerChoice === 'paper')
    ) {
        return 'Win';
    }
    return 'Lose';
}

module.exports = {
    playRPS
};
