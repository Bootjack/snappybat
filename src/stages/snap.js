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
            var ceiling, floor, player;

            ceiling = Proscenium.actors.ceiling;
            floor = Proscenium.actors.floor;
            player = Proscenium.actors.player;

            offset.y = -0.8 * $(this.snap.node).height() / scale;

            ceiling.svg = this.snap.path(buildPathString(buildRectanglePath(ceiling.state))).addClass('ceiling');
            floor.svg = this.snap.path(buildPathString(buildRectanglePath(floor.state))).addClass('floor');
            player.svg = this.snap.path(buildPathString(player.snap));
        },
        evaluate: function () {
            var ceiling, floor, player, playerAbsolute, playerMatrix;

            ceiling = Proscenium.actors.ceiling;
            floor = Proscenium.actors.floor;
            player = Proscenium.actors.player;
            playerMatrix = buildTranslationMatrix(player.state);

            ceiling.svg.transform(buildTranslationMatrix(ceiling.state));
            floor.svg.transform(buildTranslationMatrix(floor.state));
            player.svg.transform(playerMatrix);

            playerAbsolute = Snap.path.map(player.svg, playerMatrix);

            Proscenium.roles.obstacle.members.forEach(function (obstacle) {
                var collision, obstacleAbsolute, obstacleMatrix;

                obstacleMatrix = buildTranslationMatrix(obstacle.state);
                obstacleAbsolute = Snap.path.map(obstacle.svg, obstacleMatrix);

                collision = Snap.path.isPointInside(obstacleAbsolute, playerMatrix.x(player.state.x, player.state.y), playerMatrix.y(player.state.x, player.state.y));
                collision = collision || Snap.path.intersection(playerAbsolute, obstacleAbsolute).length;

                if (collision) {
                    console.log('Die!');
                    Proscenium.actors.player.set('isDead', true);
                    return true;
                }
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
