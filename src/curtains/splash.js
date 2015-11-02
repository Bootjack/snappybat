define([
    'jquery',
    'proscenium'
], function(
    $,
    Proscenium
){
    return {
        element: 'splash-curtain',
        init: function () {
            var $element = $(this.element);
            $element.on('click', 'button', function (evt) {
                var level, levelSceneId, scene;

                level = $(evt.target).attr('data-level');
                levelSceneId = 'level' + level;
                scene = Proscenium.scenes[levelSceneId];
                if (scene) {
                    console.log('begin scene ' + scene.id);
                    scene.begin();
                }
            });
        },
        template: function(data) {
            var $html = $('<div>');

            $html.append('<h1>Snappy Bat</h1>');

            data.levels = data.levels || [];
            data.levels.forEach(function (level) {
                var $button = $('<button>').attr('data-level', level.number).text('Level ' + level.number);
                $html.append($button);
            });

            return $html.html();

            // $element.find('button.start').on('click', function(event){
            //   event.stopPropagation();
            //   Proscenium.scenes.start.end();
            //   Proscenium.scenes.level1.begin();
            // })
        }
    }
});
