define(['utils/scaleToWindow'], function (scaleToWindow) {

    return function () {

/*        window.addEventListener('resize', function () {
            scaleToWindow(renderer.view);
        });*/


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
            SPACE = 7,
            INDENT = 30,
            reelsArray = [],
            state;

         console.log('stage.width: ', WIDTH);
         console.log('stage.height: ', HEIGHT);

        // Load resources
        loader
            .add([
                "images/background.png",
                "images/honeycomb.png",
                "images/symbols.json"
        ])
            .load(setup);
        
        function setup () {

            // Create an alias
            var id = PIXI.loader.resources['images/symbols.json'].textures;

            // Create textures
            var slotTextures = [
                id['bear.png'],
                id['bee.png'],
                id['blue-bee.png'],
                id['bomb.png'],
                id['green-bee.png'],
                id['green-frog.png'],
                id['pot.png'],
                id['red-bee.png'],
                id['red-frog.png']
            ];

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

            // Create a container to store a group of display objects, ie. a reelContainer will store all reel objects (DisplayObjects)
            var reelContainer = new PIXI.Container();

            // Build the 5 child reels
            for (var i = 0; i < 5; i++) {

                var reelChild = new PIXI.Container();

                reelChild.x = i * ((REEL_WIDTH - INDENT) - 20);

                console.log('reelChild.x: ', reelChild.x);

                if (i % 2 === 0) {
                    reelChild.y = 0 - SYMBOL_HEIGHT * 2;
                } else {
                    reelChild.y = HONEY_COMB_CELL_HEIGHT / 2;
                }

                reelContainer.addChild(reelChild);

                // reelObject
                var reelObject = {
                    x: 0,
                    y: 0,
                    container: reelChild,
                    symbols:[],
                    position:0,
                    previousPosition:0
                };

                for (var j = 0; j < 10; j++) {
                    // Choose a random symbol
                    var symbol = new Sprite(slotTextures[ Math.floor(Math.random() * slotTextures.length)]);
                    //Position symbol by y value * j
                    symbol.y = j * SYMBOL_HEIGHT;
                    // Add symbol to symbols array in reelObject
                    reelObject.symbols.push(symbol);
                    // Add symbol to reel container
                    reelChild.addChild(symbol);
                }
                // Add reelObject to the reels array
                reelsArray.push(reelObject);
            }

            // Add to stage
            stage.addChildAt(honeycomb, 0);
            stage.addChildAt(reelContainer, 1);
            stage.addChildAt(mask, 2);
            stage.addChildAt(button, 3);


            reelContainer.x = honeycomb.x;
            reelContainer.y = honeycomb.y;
            // console.log('honeycomb.y: ', honeycomb.y);
            // console.log('honeycomb.x: ', honeycomb.x);

            renderer.render(stage);
        }
    }
});