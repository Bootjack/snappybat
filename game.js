require.config({
    paths: {
        jquery: 'bower_components/jquery/dist/jquery.min',
        proscenium: 'lib/proscenium/proscenium',
        snapsvg: 'bower_components/Snap.svg/dist/snap.svg-min',
        text: 'bower_components/text/text'
    }
});

require([
    'proscenium',

    'src/stages/collision',
    'src/stages/physics',
    'src/stages/snap',

    'src/roles/bat',
    'src/roles/obstacle',

    'src/curtains/splash',
    'src/curtains/input',
    'src/curtains/controls',
    'src/curtains/result',

    'src/scenes/start',
    'src/scenes/flying',
    'src/scenes/result'
], function (
    Proscenium,

    collisionStage,
    physicsStage,
    snapStage,

    batRole,
    obstacleRole,

    splashCurtains,
    inputCurtain,
    controlsCurtain,
    resultCurtain,

    startScene,
    level1Scene,
    resultScene
) {
    Proscenium.stage('collision', collisionStage);
    Proscenium.stage('physics', physicsStage);
    Proscenium.stage('snap', snapStage);

    Proscenium.role('bat', batRole);
    Proscenium.actor('player').role('bat');

    Proscenium.role('obstacle', obstacleRole);
    Proscenium.actor('floor').role('obstacle');
    Proscenium.actor('ceiling').role('obstacle');

    Proscenium.role('terrain');
    (Array(10).join('ab') + 'a').split('b').forEach(function (x) {
        Proscenium.actor().role(['obstacle', 'terrain']);
    });
    console.log(Proscenium.roles.terrain.members);

    Proscenium.curtain('splash', splashCurtains);
    Proscenium.curtains.splash.levels = [{
      number: 1
    }];

    Proscenium.curtain('input', inputCurtain);
    Proscenium.curtain('controls', controlsCurtain);
    Proscenium.curtain('result', resultCurtain);

    Proscenium.scene('start', startScene);
    Proscenium.scene('level1', level1Scene);
    Proscenium.scene('result', resultScene);

    Proscenium.scenes.start.begin();
});
