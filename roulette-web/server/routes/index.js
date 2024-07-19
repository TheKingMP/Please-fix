const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const gamesRoutes = require('./routes/games');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/games', gamesRoutes);

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
