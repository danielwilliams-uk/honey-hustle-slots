requirejs.config({
    baseUrl: './',
    paths: {
        'vendor': 'vendor',
        'app': 'scripts/game',
        'utils': 'utils'
    }
});

requirejs(['vendor/pixi.min', 'vendor/gsap.min', 'utils/scaleToWindow', 'app/game'], function (pixi, gsap, scaleToWindow, game) {
    game();
});