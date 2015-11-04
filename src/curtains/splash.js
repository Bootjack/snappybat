define([
    'jquery',
    'proscenium'
], function(
    $,
    Proscenium
){
    function handleLevelButtonClick (currentScene, levelNumber) {
        var levelSceneId, scene;

        levelSceneId = 'level' + levelNumber;
        scene = Proscenium.scenes[levelSceneId];
        if (scene) {
            currentScene.end();
            console.log('begin scene ' + scene.id);
            scene.begin();
        }
    }

    return {
        element: 'splash-curtain',
        render: function () {
            var $levels = $(this.element).find('.levels').html(''),
                levels = this.levels || [],
                self = this;

            levels.forEach(function (level) {
                var $button = $('<button>').text('Level ' + level.number);
                $button.on('click', handleLevelButtonClick.bind(self, Proscenium.scenes.start, level.number));
                $levels.append($button);
            });
        }
    }
});
