define([
    'proscenium',
    'snapsvg'
], function(
    Proscenium,
    Snap
) {

    var offset = {x: 0, y: -300},
        scale = 1;

    return {
        init: function () {
            this.snap = Snap('#snap-stage');
        },
        prep: function () {
            var player;
            player = Proscenium.actors.player;
            player.svg = this.snap.path('M-10,-10'
                + 'L0,0'
                + 'L10,-10'
                + 'L10,0'
                + 'L0,10'
                + 'L-10,0'
                + 'Z'
            );
        },
        evaluate: function () {
            var player, playerMatrix;

            player = Proscenium.actors.player;
            playerMatrix = new Snap.matrix();
            playerMatrix.translate(
                scale * (player.state.x + offset.x),
                -1 * scale * (player.state.y + offset.y)
            );
            player.svg.transform(playerMatrix);
        },
        clear: function (scene) {
            scene.actors.forEach(function (actor) {
                if (actor.svg && 'function' === typeof actor.svg.remove) {
                    actor.svg.remove();
                }
            });
        }
    };
});
