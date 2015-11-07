define([
    'proscenium',
    'snapsvg'
], function(
    Proscenium,
    Snap
) {

    var offset = {x: 0, y: 0},
        scale = 40; // meters per pixel

    function buildPathString(path) {
        var result = 'M' + path.origin.x * scale + ',' + path.origin.y * scale;
        path.points.forEach(function (point) {
            result += 'L' + point.x * scale + ',' + point.y * scale;
        });
        result += 'Z';
        return result;
    }

    return {
        init: function () {
            this.snap = Snap('#snap-stage');
        },
        prep: function () {
            var player;
            player = Proscenium.actors.player;
            player.svg = this.snap.path(buildPathString(player.snap));
            offset.y = -0.8 * $(this.snap.node).height() / scale;
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
