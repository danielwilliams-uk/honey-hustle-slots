define(['utils/scaleToWindow'], function (scaleToWindow) {

    return function () {

        // Aliases
        var app = new PIXI.Application({
                width: 2267, height: 1275
            }),
            TextureCache = PIXI.utils.TextureCache,
            resources = PIXI.Loader.shared.resources,
            Sprite = PIXI.Sprite,
            loader = PIXI.Loader.shared;

        document.body.appendChild(app.view);

        scaleToWindow(app.renderer.view);

        // Global variables
        var WIDTH =  app.renderer.view.width,
            HEIGHT = app.renderer.view.height,
            spin,
            honeycomb,
            reelContainer,
            mask,
            button,
            REEL_WIDTH = 196,
            SYMBOL_WIDTH = 196,
            SYMBOL_HEIGHT = 170,
            TOTAL_SYMBOLS_REEL = 4,
            TOTAL_REELS = 5,
            INDENT = 30,
            reelsArray = [],
            slotTextures = [],
            state,
            reelOneSymbols = [],
            reelTwoSymbols = [],
            reelThreeSymbols = [],
            reelFourSymbols = [],
            reelFiveSymbols = [],
            allReelsSymbols = [],
            i;

        // Load resources
        loader
            .add("images/background.png")
            .add("images/honeycomb.png")
            .add("images/bear.png")
            .add("images/bee.png")
            .add("images/blue-bee.png")
            .add("images/green-bee.png")
            .add("images/red-bee.png")
            .add("images/bomb.png")
            .add("images/button.png")
            .add("images/green-frog.png")
            .add("images/red-frog.png")
            //.on('progress', loadProgressHandler)
            .load(setup);

        // Get percentage total of resources that have loaded and name
        function loadProgressHandler (loader, resource) {
            // Display the file url currently being loaded
            console.log(`loading...: ${resource.url}`);

            // Display percentage of files currently loaded
            console.log(`progress: ${loader.progress}%`)
        }

        function randomNumber (num) {
            return Math.floor(Math.random() * num);
        }

        function setup () {
            console.log('All files loaded');

            // Create textures
            slotTextures.push(
                PIXI.Texture.from('images/bear.png'),
                PIXI.Texture.from('images/bee.png'),
                PIXI.Texture.from('images/blue-bee.png'),
                PIXI.Texture.from('images/bomb.png'),
                PIXI.Texture.from('images/green-bee.png'),
                PIXI.Texture.from('images/green-frog.png'),
                PIXI.Texture.from('images/pot.png'),
                PIXI.Texture.from('images/red-bee.png'),
                PIXI.Texture.from('images/red-frog.png')
            );

            // Create all symbols for reel one
            for (var k = 0; k < 16; k++) {
                var rand = randomNumber(9);
                var symbol = new Sprite(slotTextures[rand]);
                reelOneSymbols.push(symbol);
            }

            // Clone deep and shuffle to create remaining 4 reels
            reelTwoSymbols = _.cloneDeep(reelOneSymbols);
            reelTwoSymbols = _.shuffle(reelTwoSymbols);

            reelThreeSymbols = _.cloneDeep(reelTwoSymbols);
            reelThreeSymbols = _.shuffle(reelThreeSymbols);

            reelFourSymbols = _.cloneDeep(reelThreeSymbols);
            reelFourSymbols = _.shuffle(reelTwoSymbols);

            reelFiveSymbols = _.cloneDeep(reelFourSymbols);
            reelFiveSymbols = _.shuffle(reelFiveSymbols);

            allReelsSymbols.push(reelOneSymbols, reelTwoSymbols, reelThreeSymbols, reelFourSymbols, reelFiveSymbols);
            //console.log('allReelsSymbols: ', allReelsSymbols);

            // Create honeycomb sprite
            var honeycombTexture = PIXI.Texture.from('images/honeycomb.png');
            honeycomb = new Sprite(honeycombTexture);

            honeycomb.y = (HEIGHT - honeycomb.height) / 2;
            honeycomb.x = (WIDTH - honeycomb.width) / 2;

            // Create background mask
            var maskTexture = PIXI.Texture.from('images/background.png');
            mask = new Sprite(maskTexture);
            mask.x =  (WIDTH - mask.width) / 2;
            mask.y =  (HEIGHT - mask.height) / 2;

            // Create button sprite
            var buttonTexture = PIXI.Texture.from('images/button.png');
            button = new Sprite(buttonTexture);

            // Make button interactive
            button.interactive = true;
            button.buttonMode = true;
            button.x = WIDTH / 2 - button.width / 2;
            button.y = HEIGHT - button.height * 2;

            button
                .on('mousedown', function () {
                    console.log('click!');
                    spin = true;
                });

            reelContainer = new PIXI.Container();

            // Build child reels
            for (i = 0; i < TOTAL_REELS; i++) {
                var reelChild = new PIXI.Container();

                reelChild.x = i * ((REEL_WIDTH - INDENT) - 20);

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
                    target: 0
                };

                // Symbols created and added to stage
                for (var j = 0; j < TOTAL_SYMBOLS_REEL; j++) {
                    var rand = randomNumber(16);
                    var symbol = allReelsSymbols[j][rand];

                    // Position symbols vertically
                    symbol.y = j * SYMBOL_HEIGHT;
                    reelObject.symbols.push(symbol); // Add symbol to reelObject
                    reelChild.addChild(symbol); // Add symbol to reelChild
                }
                reelsArray.push(reelObject);
            }

            // Add to stage
            app.stage.addChildAt(honeycomb, 0);
            app.stage.addChildAt(reelContainer, 1);
            app.stage.addChildAt(mask, 2);
            app.stage.addChildAt(button, 3);


            reelContainer.x = honeycomb.x;
            reelContainer.y = honeycomb.y /*- SYMBOL_HEIGHT*/; // Position reelContainer one symbol height above honeycomb to hide extra symbol
            // console.log('honeycomb.y: ', honeycomb.y);
            // console.log('honeycomb.x: ', honeycomb.x);

            // Update game state
            state = play;

            app.renderer.render(app.stage);

            // Start game loop
            app.ticker.add(function (delta) {
                gameLoop(delta);
            });
        }

        function gameLoop () {
            // Update game state
            state();
        }

        function play (delta) {
            if (spin) {
                spin = null;

                startSpin();

                // Update slots
                function updateSymbols () {
                    for (i = 0; i < reelsArray.length; i++  ) {
                        var reelObject = reelsArray[i];
                        var symbols = reelObject.symbols;
                        var index = Math.floor(reelObject.current);
                        var decimals = reelObject.current - index;

                        // Update symbol positions
                        for (var j = 0; j < symbols.length; j++) {
                            var symbol = symbols[j];
                            var OFFSET = j * SYMBOL_HEIGHT - SYMBOL_HEIGHT;
                            symbol.y = decimals * SYMBOL_HEIGHT + OFFSET;
                            var symbolType = reelOneSymbols[(index + 3 - j) % reelOneSymbols.length];

                            // Check current symbol texture with new texture in reel config
                            if (symbol.texture !== symbolType.texture) {
                                symbol.texture = symbolType.texture
                            }
                        }
                    }
                }

                function startSpin () {
                    for (i = 0; i < reelsArray.length; i++) {
                        var reelObject = reelsArray[i];
                        reelObject.target = reelObject.target + Math.floor(Math.random() * reelOneSymbols.length + reelOneSymbols.length * 1);
                        var time = (reelObject.target - reelObject.current) * 80;
                        createjs.Tween.get(reelObject, {onChange: updateSymbols}).to( {current: reelObject.target}, time);
                    }
                }
            }
        }
    }
});