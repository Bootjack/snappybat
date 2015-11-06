define([
    'proscenium'
], function(
    Proscenium
) {

    var gravity = -9.8;

    return {
        init: function () {},
        prep: function () {},
        evaluate: function (interval) {
            var force, player, seconds, velocity, x, y;

            player = Proscenium.actors.player;
            seconds = interval / 1000;
            force = gravity + player.state.acceleration;

            // Delta velocity equals 1/2 acceleration * time squared
            velocity = player.state.velocity + force * seconds;

            y = player.state.y + velocity * seconds;

            player.set('velocity', velocity);
            player.set('y', y);
        },
        clear: function () {}
    }
});
