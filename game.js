require.config({
    paths: {
        proscenium: 'lib/proscenium/proscenium.min',
        snapsvg: 'bower_components/Snap.svg/dist/snap.svg-min'
    }
});

require([
    'proscenium',
    'snapsvg'
], function (
    Proscenium,
    Snap
) {
    console.log('Proscenium loaded', Proscenium);
    console.log('SnapSVG loaded', Snap);
});
