define([
    'jquery',
    'proscenium'
], function (
    $,
    Proscenium
) {

    return {
        init: function () {
            $(document).on('keydown.inputCurtain', function (evt) {
                if (evt.which === 32) {
                    Proscenium.actors.player.flap();
                }
            });
        }
    };
});
