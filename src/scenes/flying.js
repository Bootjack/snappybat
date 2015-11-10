define([
    'jquery',
    'proscenium'
], function(
    $,
    Proscenium
) {

    var levelDefinition,
        obstacleHeightNorm = 8,
        obstacleSpacingNorm = 12,
        obstacleWidthNorm = 3;

    levelDefinition = {

    };

    function distributedRandom(norm) {
        var variance = Math.pow(0.8 * (2 * Math.random() - 1), 3);
        return norm + (variance * norm);
    }

    function randomizeObstacles() {
        var distance = distributedRandom(obstacleSpacingNorm);
        Proscenium.roles.terrain.members.forEach(function (terrain) {
            distance += distributedRandom(obstacleSpacingNorm);
            terrain.set('x', distance);
            terrain.set('width', distributedRandom(obstacleWidthNorm));

            if (Math.random() < 0.5) {
                terrain.set('y', 20);
                terrain.set('height', distributedRandom(obstacleHeightNorm));

            } else {
                terrain.set('y', 0);
                terrain.set('height', -1 * distributedRandom(obstacleHeightNorm));

            }
        });
    }

    return {
        curtains: ['input', 'controls'],
        stages: ['physics', 'snap', 'collision'],
        init: function () {
            var self = this;

            this.conditions.push({
                test: function () {
                    return Proscenium.actors.player.state.isDead;
                },
                run: function () {
                    self.end();
                    Proscenium.scenes.result.begin({
                        currentScene: self,
                        nextScene: Proscenium.scenes.level2
                    });
                }
            });
        },
        prep: function () {
            var ceiling, floor, player;

            player = Proscenium.actors.player
                .set('x', 3)
                .set('y', 10)
                .set('velocity', 5);

            Proscenium.actors.ceiling
                .set('x', 0)
                .set('y', 20)
                .set('height', -10)
                .set('width', 100);

            Proscenium.actors.floor
                .set('x', 0)
                .set('y', 0)
                .set('height', 10)
                .set('width', 100);

            randomizeObstacles();
            console.log(Proscenium.roles.terrain.members);

            this.actors = this.actors.concat(player, Proscenium.roles.obstacle.members);

            $(Proscenium.curtains.controls.element).show();
            $(Proscenium.curtains.input.element).show();
        },
        clear: function () {
            $(Proscenium.curtains.input.element).hide();
            Proscenium.actors.player.state.isDead = false;
            $(Proscenium.curtains.controls.element).hide();
            this.actors = [];
        }
    }
});
