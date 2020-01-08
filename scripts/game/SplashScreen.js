define(function () {

    return function () {

        var self = this,
            showSplashScreen = false;

        self.hideSplashScreen = function (obj) {
            return new Promise(function (resolve) {
                if (showSplashScreen) return;
                showSplashScreen = true;
                createjs.Tween.get(obj).to({alpha: 0}, 0)
                    .call(resolve, [showSplashScreen]);
            });
        };
    }
});