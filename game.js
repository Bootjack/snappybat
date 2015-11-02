require.config({
    paths: {
        jquery: 'bower_components/jquery/dist/jquery.min',
        proscenium: 'lib/proscenium/proscenium.min',
        snapsvg: 'bower_components/Snap.svg/dist/snap.svg-min'
    }
});

require([
    'jquery',
    'proscenium',
    'snapsvg'
], function (
    $,
    Proscenium,
    Snap
) {
    require([
        'src/scenes/start',
        'src/scenes/level1',
        'src/scenes/result',
        'src/curtains/splash',
        'src/curtains/levelControls'
    ], function (
        startScene,
        level1Scene,
        resultScene,
        splashCurtains,
        levelControls
    ) {
        Proscenium.actor('player');

        Proscenium.curtain('splash', splashCurtains);
        Proscenium.curtains.splash.levels = [{
          number: 1
        }, {
          number: 2
        }, {
          number: 3
        }];

        Proscenium.curtain('levelControls', levelControls);

        Proscenium.scene('start', startScene);
        Proscenium.scene('level1', level1Scene);
        Proscenium.scene('result', resultScene);

        Proscenium.scenes.start.begin();
    });
});
