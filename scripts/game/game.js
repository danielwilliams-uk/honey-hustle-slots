define(['utils/scaleToWindow', 'app/SplashScreen'], function (scaleToWindow, SplashScreen) {

    return function () {

        var wrapper = document.querySelector("#wrapper");
        //Add a requestFullscreen polyfill to the wrapper
        var vendors = ["ms", "webkit", "o", "moz"];
        vendors.forEach(function (vendor) {
            if (!wrapper.requestFullscreen) {
                wrapper.requestFullscreen = wrapper[vendor + "RequestFullscreen"];
            }
        });

        // Aliases
        var app = new PIXI.Application({
                width: 2267, height: 1275
            }),
            Container = PIXI.Container,
            Sprite = PIXI.Sprite,
            loader = PIXI.Loader.shared;

        wrapper.appendChild(app.view);

        // Global variables
        var WIDTH =  app.renderer.view.width,
            HEIGHT = app.renderer.view.height,
            spin = false,
            honeycomb,
            reelContainer,
            mask,
            button,
            playButton,
            REEL_WIDTH = 274,
            SYMBOL_WIDTH = 274,
            SYMBOL_HEIGHT = 238,
            TOTAL_SYMBOLS_REEL = 4,
            TOTAL_REELS = 5,
            INDENT = 30,
            reelsArray = [],
            symbolTextures = [],
            reelConfig1 = [],
            reelConfig2 = [],
            reelConfig3 = [],
            reelConfig4 = [],
            reelConfig5 = [],
            allReelConfigs = [],
            state,
            i;

        // Add all reelConfigs to array
        allReelConfigs.push(reelConfig1, reelConfig2, reelConfig3, reelConfig4, reelConfig5);

        // Load resources
        loader
            .add("images/splash-screen.png")
            .add("images/background.png")
            .add("images/honeycomb.png")
            .add("images/symbols.json")
            //.on('progress', loadProgressHandler)
            .load(setup);

        // Get percentage total of resources that have loaded and name
        function loadProgressHandler (loader, resource) {
            // Display the file url currently being loaded
            console.log('loading...: ' + ' ', + resource.url);

            // Display percentage of files currently loaded
            console.log('progress: ' + ' ', + loader.progress + '%')
        }

        function randomNumber (num) {
            return Math.floor(Math.random() * num);
        }

        function setup () {
            console.log('All files loaded');

            // Get reference to sprite sheet
            var spriteSheet = PIXI.Loader.shared.resources["images/symbols.json"];
            console.log('spriteSheet: ', spriteSheet);

            // Create textures
            var bear = spriteSheet.textures["bear.png"],
                bee = spriteSheet.textures["bee.png"],
                blueBee = spriteSheet.textures["blue-bee.png"],
                bomb = spriteSheet.textures["bomb.png"],
                greenBee = spriteSheet.textures["green-bee.png"],
                greenFrog = spriteSheet.textures["green-frog.png"],
                pot = spriteSheet.textures["pot.png"],
                redBee = spriteSheet.textures["red-bee.png"],
                redFrog = spriteSheet.textures["red-frog.png"];

            symbolTextures.push(bear,bee,blueBee,bomb,greenBee,greenFrog,pot,redBee,redFrog);

            var gameScene = new Container();
            var maskContainer = new Container();

            app.stage.addChildAt(gameScene, 0);
            app.stage.addChildAt(maskContainer,1);

            gameScene.alpha = 0;
            maskContainer.alpha = 0;

            // Create splash screen object
            var splashScreenChild = new SplashScreen();
            // Get the splash screen and play button elements
            var splashScreenEle = document.getElementById('imgbox');
            playButton = document.getElementById('playButton');

            // Play button handler
            playButton.addEventListener('mousedown', function () {
                wrapper.requestFullscreen();
                wrapper.style.display = 'block';
                createjs.Tween.get(gameScene).to({alpha: 1}, 2000);
                splashScreenChild.hideSplashScreen(splashScreenEle, playButton)
                    .then(function (value) {
                        if (value) {
                            maskContainer.alpha = 1;
                        }
                    })
            });

            // Create honeycomb sprite
            var honeycombTexture = PIXI.Texture.from('images/honeycomb.png');
            honeycomb = new Sprite(honeycombTexture);

            honeycomb.y = (HEIGHT - honeycomb.height) / 2;
            honeycomb.x = (WIDTH - honeycomb.width) / 2;

            // Create background mask
            var maskTexture = PIXI.Texture.from('images/background.png');
            mask = new Sprite(maskTexture);
            mask.x =  ((WIDTH - mask.width) / 2) + 1;
            mask.y =  ((HEIGHT - mask.height) / 2) - 2;

            // Create button sprite
            var buttonTexture = spriteSheet.textures["button.png"];
            button = new Sprite(buttonTexture);

            // Make button interactive
            button.interactive = true;
            button.buttonMode = true;
            button.x = WIDTH / 2 - button.width / 2;
            button.y = HEIGHT - button.height * 2;

            reelContainer = new PIXI.Container();

            // Populate all reel configs
            for (i = 0; i < allReelConfigs.length; i++ ) {
                var arr = allReelConfigs[i];

                for (var j = 0; j < 16; j++) {
                    var rand = randomNumber(9);
                    arr.push(rand); // Push random number into array
                }
            }
            console.log('all reel configs', allReelConfigs);

            // Build child reels
            for (i = 0; i < TOTAL_REELS; i++) {
                var reelChild = new PIXI.Container();

                reelChild.x = i * ((REEL_WIDTH - INDENT) - 40);

                if (i % 2 === 0) {
                    reelChild.y = 0;
                } else {
                    reelChild.y = SYMBOL_HEIGHT / 2;
                }

                reelContainer.addChild(reelChild);

                // reelObject
                var reelObject = {
                    container: reelChild,
                    symbols: [],
                    current: 0,
                    target: 0,
                    blur: new PIXI.filters.BlurFilter()
                };
                reelObject.blur.blurX = 0;
                reelObject.blur.blurY = 0;
                reelChild.filters = [reelObject.blur];

                // Create symbols
                for (var j = 0; j < TOTAL_SYMBOLS_REEL; j++) {
                    var arr = allReelConfigs[i]; // Get each reel config list
                    var symbol = new Sprite(symbolTextures[arr[j]]); // Create 4 sprites using first four values in reel config list

                    // Position symbols vertically
                    symbol.y = j * SYMBOL_HEIGHT;
                    reelObject.symbols.push(symbol);
                    reelChild.addChild(symbol);
                }
                reelsArray.push(reelObject);
            }

            // Add to stage
            gameScene.addChildAt(honeycomb, 0);
            gameScene.addChildAt(reelContainer, 1);

            maskContainer.addChildAt(mask, 0);
            maskContainer.addChildAt(button, 1);

            reelContainer.x = honeycomb.x;
            reelContainer.y = honeycomb.y /*- SYMBOL_HEIGHT*/; // Position reelContainer one symbol height above honeycomb to hide extra symbol

            app.renderer.render(app.stage);

            button
                .on('pointerdown', function () {
                    console.log('click!');
                    startSpin();
                });
        }

        function startSpin () {
            if (spin) return;
            spin = true;

            for (i = 0; i < reelsArray.length; i++) {
                var reelObject = reelsArray[i];
                reelObject.target = reelObject.target + Math.floor(Math.random() * 16 + 16 * (3 + i));
                var time = (reelObject.target - reelObject.current) * 80;
                createjs.Tween.get(reelObject, {onChange: updateSymbols}).to({current: reelObject.target}, time);
            }
        }

        // Update slots
        function updateSymbols () {
            spin = false;

            for (i = 0; i < reelsArray.length; i++  ) {
                var reelObject = reelsArray[i];
                var symbols = reelObject.symbols;
                var index = Math.floor(reelObject.current);
                var decimals = reelObject.current - index;
                reelObject.blur.blurY = (reelObject.target - reelObject.current) * 3;

                // Update symbol positions
                for (var j = 0; j < symbols.length; j++) {
                    var symbol = symbols[j];
                    var OFFSET = j * SYMBOL_HEIGHT - SYMBOL_HEIGHT;
                    symbol.y = decimals * SYMBOL_HEIGHT + OFFSET;

                    var reelConfig = allReelConfigs[i]; // Each reel config list
                    var symbolType = reelConfig[(index + 3 - j) % reelConfig.length];
                    console.log('symbolType: ', symbolType);

                    // Check current symbol texture with new texture in reel config
                    if (symbol.texture !== symbolTextures[symbolType]) {
                        symbol.texture = symbolTextures[symbolType];
                    }
                }
            }
        }
    }
});
