const crypto = require('crypto');

function generateRandomSeed() {
    return crypto.randomBytes(16).toString('hex');
}

function hash(seed) {
    return crypto.createHash('sha256').update(seed).digest('hex');
}

function determineOutcome(serverSeed, clientSeed, nonce, outcomes) {
    const combinedSeed = serverSeed + clientSeed + nonce;
    const hashValue = crypto.createHash('sha256').update(combinedSeed).digest('hex');
    const decimalValue = parseInt(hashValue.substring(0, 8), 16) / 0xffffffff;

    const index = Math.floor(decimalValue * outcomes.length);
    return outcomes[index];
}

module.exports = {
    generateRandomSeed,
    hash,
    determineOutcome
};
