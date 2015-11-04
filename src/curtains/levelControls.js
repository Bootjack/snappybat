define([
    'jquery',
    'proscenium'
], function (
    $,
    Proscenium
) {

    function winButtonClickHandler() {
        Proscenium.actors.player.state.hasWon = true;
    }

    return {
        element: 'level-controls-curtain',
        init: function () {
            var $element = $(this.element);

            $element.on('click', 'button.win', winButtonClickHandler.bind(this));
        }
    };
});
