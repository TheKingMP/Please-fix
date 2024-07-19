$(document).ready(function() {
    $('#dice-form').submit(function(event) {
        event.preventDefault();

        const bet = $('#bet').val();

        $.ajax({
            url: '/roll_dice',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ bet }),
            success: function(data) {
                // Apply shake animation to dice
                $('#player-dice').addClass('dice-animation');
                $('#house-dice').addClass('dice-animation');

                setTimeout(function() {
                    // Remove animation class after animation is done
                    $('#player-dice').removeClass('dice-animation');
                    $('#house-dice').removeClass('dice-animation');

                    // Update dice images
                    $('#player-dice').attr('src', 'dice_images/dice' + data.player_roll + '.png');
                    $('#house-dice').attr('src', 'dice_images/dice' + data.house_roll + '.png');

                    // Update game status
                    $('#player-roll').text('Your Roll: ' + data.player_roll);
                    $('#house-roll').text('House Roll: ' + data.house_roll);
                    $('#game-message').text(data.message);
                }, 600); // Match duration of the animation
            }
        });
    });
});
