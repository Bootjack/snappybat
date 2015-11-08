define([
    'jquery',
    'proscenium'
], function(
    $,
    Proscenium
) {

    var levelDefinition;

    levelDefinition = {

    };

    return {
        curtains: ['input', 'controls'],
        stages: ['physics', 'snap'],
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
