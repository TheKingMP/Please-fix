$(document).ready(function() {
    $('#header').load('header.html');
});

document.getElementById('roulette-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const amount = document.getElementById('amount').value;
    const bet_choice = document.getElementById('bet_choice').value;

    fetch('/spin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount, bet_choice })
    })
    .then(response => response.json())
    .then(data => {
        const animationDiv = document.getElementById('animation');
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = '';

        const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14"];
        const colors = ["🟩", "🟥", "⬛", "🟥", "⬛", "🟥", "⬛", "🟥", "⬛", "🟥", "⬛", "🟥", "⬛", "🟥", "⬛"];

        let index = 0;
        const interval = setInterval(() => {
            animationDiv.innerHTML = numbers.map((num, idx) => idx === index ? `<strong>${num}</strong>` : num).join(' ') + '<br>' + colors.join(' ');
            index = (index + 1) % numbers.length;
        }, 100);

        setTimeout(() => {
            clearInterval(interval);
            const outcomeIndex = numbers.indexOf(data.outcome.number);
            animationDiv.innerHTML = numbers.map((num, idx) => idx === outcomeIndex ? `<strong>${num}</strong>` : num).join(' ') + '<br>' + colors.join(' ');

            resultDiv.innerHTML = `
                <p>${data.result_message}</p>
                <p>Server Seed (hashed): ${data.hashed_server_seed}</p>
                <p>Server Seed: ${data.server_seed}</p>
                <p>Client Seed: ${data.client_seed}</p>
                <p>Nonce: ${data.nonce}</p>
                <p>Outcome: ${data.outcome.number} (${data.outcome.color})</p>
            `;
        }, 3000);
    });
});
