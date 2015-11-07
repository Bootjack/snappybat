define([
    'jquery',
    'proscenium'
], function (
    $,
    Proscenium
) {

    return {
        element: 'input-curtain',
        init: function () {
            var player = Proscenium.actors.player;
            $(document).on('keydown.inputCurtain', function (evt) {
                if (evt.which === 32) {
                    player.flap();
                }
            });
            $(this.element).on('click', function (evt) {
                player.flap();
            });
        }
    };
});
