define([
    'proscenium'
], function(
    Proscenium
) {

    return {
        curtains: ['levelControls'],
        stages: [],
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
            $(Proscenium.curtains.levelControls.element).show();
        },
        clear: function () {
            Proscenium.actors.player.state.hasWon = false;
            $(Proscenium.curtains.levelControls.element).hide();
        }
    }
});
