requirejs.config({
    baseUrl: './',
    paths: {
        'vendor': 'vendor',
        'app': 'scripts/game',
        'utils': 'utils'
    }
});

requirejs(['vendor/pixi.min', 'utils/scaleToWindow', 'app/game'], function (pixi, scaleToWindow, game) {
    game();
});