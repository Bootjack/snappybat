define([
    'jquery',
    'proscenium'
], function (
    $,
    Proscenium
) {

    return {
        element: 'result-curtain',
        init: function () {
            var $element = $(this.element),
                self = this;

            $element.on('click', 'button.replay', function () {
                self.resultScene.end();
                self.currentScene.begin();
            });
            $element.on('click', 'button.levels', function () {
                self.resultScene.end();
                Proscenium.scenes.start.begin();
            });
            $element.on('click', 'button.proceed', function () {
                self.resultScene.end();
                self.nextScene.begin();
            });
        }
    };
});
