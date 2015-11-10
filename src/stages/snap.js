define([
    'jquery',
    'proscenium',
    'snapsvg'
], function(
    $,
    Proscenium,
    Snap
) {

    var offset = {x: 0, y: 0},
        scale = 40; // pixels per meter

    function buildTranslationMatrix(point) {
        return new Snap.matrix().translate(
            scale * (point.x + offset.x),
            scale * (-1 * point.y - offset.y)
        );
    }

    function buildPathString(path) {
        var result = 'M' + path.origin.x * scale + ',' + path.origin.y * scale;
        path.points.forEach(function (point) {
            result += 'L' + point.x * scale + ',' + point.y * scale;
        });
        result += 'Z';
        return result;
    }

    function buildRectanglePath(box) {
        return {
            origin: {x: 0, y: 0},
            points: [{
                x: box.width, y: 0
            }, {
                x: box.width, y: box.height
            }, {
                x: 0, y: box.height
            }]
        };
    }

    return {
        init: function () {
            this.snap = Snap('#snap-stage');
        },
        prep: function () {
            var ceiling, floor, player, snap;

            ceiling = Proscenium.actors.ceiling;
            floor = Proscenium.actors.floor;
            player = Proscenium.actors.player;
            snap = this.snap;

            offset.y = -0.8 * $(this.snap.node).height() / scale;

            player.svg = this.snap.path(buildPathString(player.snap));

            Proscenium.roles.obstacle.members.forEach(function (obstacle) {
                obstacle.svg = snap.path(buildPathString(buildRectanglePath(obstacle.state)));
            });

            ceiling.svg.addClass('ceiling');
            floor.svg.addClass('floor');
        },
        evaluate: function () {
            var player, playerMatrix;

            player = Proscenium.actors.player;
            playerMatrix = buildTranslationMatrix(player.state);

            player.svg.transform(playerMatrix);

            Proscenium.roles.obstacle.members.forEach(function (obstacle) {
                var obstacleMatrix = buildTranslationMatrix(obstacle.state);
                obstacle.svg.transform(obstacleMatrix);
            });
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
