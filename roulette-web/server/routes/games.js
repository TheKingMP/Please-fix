const express = require('express');
const router = express.Router();
const { playBlackjack } = require('../utils/blackjack');
const { rollDice } = require('../utils/dice');
const { playRPS } = require('../utils/rps');
const { generateRandomSeed, hash } = require('../utils/seed');

router.post('/blackjack', (req, res) => {
    const { amount } = req.body;
    const serverSeed = generateRandomSeed();
    const clientSeed = req.body.clientSeed || generateRandomSeed();
    const nonce = req.body.nonce || Math.floor(Math.random() * 10000);

    const result = playBlackjack(serverSeed, clientSeed, nonce, amount);

    res.json({
        ...result,
        serverSeed: serverSeed,
        clientSeed: clientSeed,
        nonce: nonce,
        hashedServerSeed: hash(serverSeed)
    });
});

router.post('/dice', (req, res) => {
    const serverSeed = generateRandomSeed();
    const clientSeed = req.body.clientSeed || generateRandomSeed();
    const nonce = req.body.nonce || Math.floor(Math.random() * 10000);

    const roll = rollDice(serverSeed, clientSeed, nonce);

    res.json({
        roll,
        serverSeed: serverSeed,
        clientSeed: clientSeed,
        nonce: nonce,
        hashedServerSeed: hash(serverSeed)
    });
});

router.post('/rps', (req, res) => {
    const { choice } = req.body;
    const serverSeed = generateRandomSeed();
    const clientSeed = req.body.clientSeed || generateRandomSeed();
    const nonce = req.body.nonce || Math.floor(Math.random() * 10000);

    const result = playRPS(serverSeed, clientSeed, nonce, choice);

    res.json({
        ...result,
        serverSeed: serverSeed,
        clientSeed: clientSeed,
        nonce: nonce,
        hashedServerSeed: hash(serverSeed)
    });
});

module.exports = router;
