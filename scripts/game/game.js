define(['utils/scaleToWindow'], function (scaleToWindow) {

    return function () {

        // Aliases
        var Container = PIXI.Container,
            autoDetectRenderer = PIXI.autoDetectRenderer,
            TextureCache = PIXI.utils.TextureCache,
            Graphics = PIXI.Graphics,
            Sprite = PIXI.Sprite,
            loader = PIXI.loader,
            Text = PIXI.Text;

        var renderer = autoDetectRenderer(1500, 1275);
        var stage = new PIXI.Container();
        document.body.appendChild(renderer.view);

        scaleToWindow(renderer.view);

        // Global variables
        var WIDTH =  renderer.view.width,
            HEIGHT = renderer.view.height,
            spin,
            spinning,
            honeycomb,
            mask,
            button,
            REEL_WIDTH = 196,
            SYMBOL_WIDTH = 196,
            SYMBOL_HEIGHT = 170,
            HONEY_COMB_CELL_WIDTH = 196,
            HONEY_COMB_CELL_HEIGHT = 170,
			TOTAL_SYMBOLS_REEL = 4,
			ALL_SYMBOLS = 9,
			TOTAL_REELS = 5,
            SPACE = 7,
            INDENT = 30,
            reelsArray = [],
            slotTextures = [],
            state,
			allSymbols = [],
            i;

        // Load resources
        loader
            .add([
                "images/background.png",
                "images/honeycomb.png",
                "images/symbols.json"
        ])
            .load(setup);

        function randomNumber (num) {
            return Math.floor(Math.random() * num);
        };
        
        function setup () {

            // Create alias
            var id = PIXI.loader.resources['images/symbols.json'].textures;

            // Create textures
            slotTextures.push(
                id['bear.png'],
                id['bee.png'],
                id['blue-bee.png'],
                id['bomb.png'],
                id['green-bee.png'],
                id['green-frog.png'],
                id['pot.png'],
                id['red-bee.png'],
                id['red-frog.png']
            );
			
			// Create all symbols
			for (i = 0; i < ALL_SYMBOLS; i++) {
				var symbol = new Sprite(slotTextures[i]);
				allSymbols.push(symbol);
			}

            // Create honeycomb sprite
            var honeycombTexture =  PIXI.utils.TextureCache['images/honeycomb.png'];
            honeycomb = new Sprite(honeycombTexture);

            honeycomb.y = (HEIGHT - honeycomb.height) / 2;
            honeycomb.x = (WIDTH - honeycomb.width) / 2;

            // Create background mask
            var maskTexture = PIXI.utils.TextureCache['images/background.png'];
            mask = new Sprite(maskTexture);
            mask.x =  stage.x - (honeycomb.width / 2) + SPACE;

            // Create button sprite
            var buttonTexture = TextureCache['button.png'];
            button =  new Sprite(buttonTexture);

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

            var reelContainer = new PIXI.Container();

            // Build child reels
            for (i = 0; i < TOTAL_REELS; i++) {
                var randomImageNumbers = [],
                    num;

                var reelChild = new PIXI.Container();

                reelChild.x = i * ((REEL_WIDTH - INDENT) - 20);

                if (i % 2 === 0) {
                    reelChild.y = 0;
                } else {
                    reelChild.y = 0 + SYMBOL_HEIGHT / 2;
                }

                reelContainer.addChild(reelChild);

                // reelObject
                var reelObject = {
                    container: reelChild,
					symbolIndexes: [],
                    symbols:[],
                    vy: 0,
                    y: 0
                };

                // Initialise reels at start
                for (var ii = 0; ii < TOTAL_SYMBOLS_REEL; ii++) {
                    num = randomNumber(9); 
                    randomImageNumbers.push(num);
					reelObject.symbolIndexes.push(num);
                }
                // console.log('randomImageNumbers: ', randomImageNumbers);

                for (var j = 0; j < TOTAL_SYMBOLS_REEL; j++) {
                    var symbol = new Sprite(slotTextures[randomImageNumbers[j]]);
                    // Position symbol vertically
                    symbol.y = j * SYMBOL_HEIGHT;
                    reelObject.symbols.push(symbol);
                    reelChild.addChild(symbol);
                }
                reelsArray.push(reelObject);
            }

            // Add to stage
            stage.addChildAt(honeycomb, 0);
            stage.addChildAt(reelContainer, 1);
            stage.addChildAt(mask, 2);
            stage.addChildAt(button, 3);


            reelContainer.x = honeycomb.x;
            reelContainer.y = honeycomb.y - SYMBOL_HEIGHT;
            // console.log('honeycomb.y: ', honeycomb.y);
            // console.log('honeycomb.x: ', honeycomb.x);

            // Update game state
            state = play;

            // Start game loop
            gameLoop();
        }

        function gameLoop () {
            window.requestAnimationFrame(gameLoop);
            state();
            renderer.render(stage);
        }

        function play () {
            if (spin) {
                spin = null;

                for (i = 0; i < reelsArray.length; i++
                ) {
                    // Iterate through every reelChild
                    var reelObject = reelsArray[i];
                    var symbols = reelObject.symbols;

                    // Update symbol positions
                    for (var j = 0; j < symbols.length; j++) {
						var symbol = symbols[j];
						var posY = j * SYMBOL_HEIGHT;
						TweenLite.to(symbol, 2, {y: posY + SYMBOL_HEIGHT});
                    }
                }

            }
        }

        function gameOver () {

        }
    }
});