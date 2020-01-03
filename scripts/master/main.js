requirejs.config({
    baseUrl: './',
    paths: {
        'vendor': 'vendor',
        'app': 'scripts/game',
        'utils': 'utils'
    }
});

requirejs(['vendor/pixi.min', 'vendor/tweenjs', 'utils/scaleToWindow', 'app/game'], function (pixi, createjs, scaleToWindow, game) {
    game();
});