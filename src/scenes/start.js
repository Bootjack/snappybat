define([
    'jquery',
    'proscenium'
],function(
    $,
    Proscenium
){
    return {
        curtains: ['splash'],
        prep: function () {
            var splash = Proscenium.curtains.splash;
            splash.update();
            $(splash.element).show();
        },
        clear: function () {
            $(Proscenium.curtains.splash.element).hide();
        }
    };
});
