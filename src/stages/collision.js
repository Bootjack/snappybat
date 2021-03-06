define([
    'jquery',
    'proscenium',
    'snapsvg'
], function(
    $,
    Proscenium,
    Snap
) {

    var obstacleIndex = 0,
        offset = {x: 0, y: 0},
        scale = 40; // pixels per meter

    function buildTranslationMatrix(point) {
        return new Snap.matrix().translate(
            scale * (point.x + offset.x),
            scale * (-1 * point.y - offset.y)
        );
    }

    return {
        evaluate: function () {
            var collision, obstacle, obstacles, obstacleAbsolute, obstacleMatrix,
                player, playerAbsolute, playerMatrix;

            player = Proscenium.actors.player;
            playerMatrix = buildTranslationMatrix(player.state);

            playerAbsolute = Snap.path.map(player.svg, playerMatrix);


            obstacles = Proscenium.roles.obstacle.members;
            obstacle = obstacles[obstacleIndex++] || obstacles[obstacleIndex = 0];

            obstacleMatrix = buildTranslationMatrix(obstacle.state);
            obstacleAbsolute = Snap.path.map(obstacle.svg, obstacleMatrix);

            collision = Snap.path.isPointInside(obstacleAbsolute, playerMatrix.x(player.state.x, player.state.y), playerMatrix.y(player.state.x, player.state.y));
            collision = collision || Snap.path.intersection(playerAbsolute, obstacleAbsolute).length;

            if (collision) {
                Proscenium.actors.player.set('isDead', true);
            }
        }
    };
});
