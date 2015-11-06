define([
    'proscenium'
], function(
    Proscenium
) {

    return {
        curtains: ['input', 'controls'],
        stages: ['physics', 'snap'],
        init: function () {
            var self = this;

            this.conditions.push({
                test: function () {
                    return Proscenium.actors.player.state.hasWon;
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
            var player = Proscenium.actors.player;

            player.state.x = 200;
            player.state.y = 100;
            player.state.velocity = 0;

            this.actors = this.actors.concat(player);

            $(Proscenium.curtains.controls.element).show();
        },
        clear: function () {
            Proscenium.actors.player.state.hasWon = false;
            $(Proscenium.curtains.controls.element).hide();
            this.actors = [];
        }
    }
});
