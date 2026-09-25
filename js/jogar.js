// ============================================================
// ARQUIVO: js/jogar.js
// Caçador Solitário — Capítulo 1: Vale do Amanhecer
// Canvas: 1024x576px
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });

    ctx.imageSmoothingEnabled = false;

    // ========================================================
    // 1. CONFIGURAÇÃO DAS CAMADAS DO CENÁRIO
    // ========================================================

    const layersConfig = [
        {
            id: 'Sky',
            file: 'Sky.png',
            factor: 0.0,
            x: 0,
            y: 0,
            w: 1024,
            h: 576,
            tile: true,
            opacity: 1.0
        },

        {
            id: 'Mountain_Back',
            file: 'Mountain_Back.png',
            factor: 0.08,
            x: 0,
            y: 160,
            w: 1024,
            h: 300,
            tile: true,
            opacity: 0.8
        },

        {
            id: 'Mountain_Middle',
            file: 'Mountain_Middle.png',
            factor: 0.18,
            x: 0,
            y: 180,
            w: 1024,
            h: 300,
            tile: true,
            opacity: 0.88
        },

        {
            id: 'Mountain_Front',
            file: 'Mountain_Front.png',
            factor: 0.3,
            x: 0,
            y: 220,
            w: 1024,
            h: 250,
            tile: true,
            opacity: 0.92
        },

        {
            id: 'Clouds',
            file: 'Clouds.png',
            factor: 0.12,
            x: 0,
            y: 20,
            w: 1024,
            h: 200,
            tile: true,
            autoSpeed: 0.25,
            opacity: 0.65
        },

        {
            id: 'Fuji',
            file: 'Fuji.png',
            factor: 0.22,
            x: 362,
            y: 160,
            w: 300,
            h: 300,
            tile: false,
            opacity: 0.9
        },

        {
            id: 'Shrine_Multiple',
            file: 'Shrine_Multiple.png',
            factor: 0.45,
            x: 60,
            y: 60,
            w: 250,
            h: 400,
            tile: false,
            opacity: 0.95
        },

        {
            id: 'Shrine_Single',
            file: 'Shrine_Single.png',
            factor: 0.45,
            x: 780,
            y: 60,
            w: 150,
            h: 400,
            tile: false,
            opacity: 0.95
        },

        {
            id: 'BackgroundTrees',
            file: 'BackgroundTrees.png',
            factor: 0.6,
            x: 0,
            y: 260,
            w: 1024,
            h: 200,
            tile: true,
            opacity: 0.95
        },

        {
            id: 'House',
            file: 'House.png',
            factor: 0.8,
            x: 410,
            y: 60,
            w: 300,
            h: 400,
            tile: false,
            opacity: 1.0
        },

        // GROUND
        {
            id: 'Ground',
            file: 'Ground.png',
            factor: 1.0,
            x: 0,
            y: 460,
            w: 1024,
            h: 116,
            tile: true,
            opacity: 1.0
        },

        // GRAMA
        {
            id: 'Gras',
            file: 'Gras.png',
            factor: 1.0,
            x: 0,
            y: 440,
            w: 1024,
            h: 136,
            tile: true,
            opacity: 0.95
        }
    ];

    // ========================================================
    // 2. ÁRVORE
    // ========================================================

    const foregroundTreeLayer = {
        id: 'Trees',
        file: 'Trees.png',

        factor: 1.0,

        x: 0,
        y: 150,

        w: 630,
        h: 470,

        tile: false,

        opacity: 1.0,

        static: false
    };

    // ========================================================
    // 3. SISTEMA DO CAÇADOR
    // ========================================================

    const GROUND_Y = 288;

    const playerSprites = {
        idle: new Image(),
        base: new Image(),

        walkFrames: [
            new Image(),
            new Image(),
            new Image()
        ],

        jumpFrames: [
            new Image(),
            new Image(),
            new Image()
        ]
    };

    // ========================================================
    // 4. SPRITES DO PERSONAGEM
    // ========================================================

    playerSprites.idle.src =
        'assets/images/parado.png';

    playerSprites.base.src =
        'assets/images/personagem.png';

    playerSprites.walkFrames[0].src =
        'assets/images/andando_1.png';

    playerSprites.walkFrames[1].src =
        'assets/images/andando_2.png';

    playerSprites.walkFrames[2].src =
        'assets/images/andando_3.png';

    playerSprites.jumpFrames[0].src =
        'assets/images/pulando_1.png';

    playerSprites.jumpFrames[1].src =
        'assets/images/pulando_2.png';

    playerSprites.jumpFrames[2].src =
        'assets/images/pulando_3.png';

    const walkSequence = [0, 1, 0, 2];

    // ========================================================
    // 5. CONFIGURAÇÃO DO PLAYER
    // ========================================================

    const player = {
        x: 200,
        y: GROUND_Y,

        w: 192,
        h: 192,

        vy: 0,

        speed: 5.0,
        runSpeed: 10.0,
        currentSpeed: 5.0,

        jumpForce: -14.0,

        gravity: 0.65,

        isGrounded: true,

        isCrouching: false,

        isRunning: false,

        currentState: 'idle',

        walkSequenceIndex: 0,

        jumpFrameIndex: 0,

        animTimer: 0,

        animSpeed: 8,
        animSpeedRun: 4,

        worldX: 0,

        direction: 'right'
    };

    // ========================================================
    // 6. HUD DE DEBUG (COORDENADAS)
    // ========================================================

    const showDebug = true; // ← mude para false para esconder

    // Elemento HTML que vai exibir as coordenadas
    // (criado dinamicamente para não precisar alterar o HTML)
    const debugHUD = document.createElement('div');
    debugHUD.id = 'debugHUD';
    debugHUD.style.cssText = `
        position: absolute;
        top: 16px;
        right: 16px;
        background: rgba(8, 8, 12, 0.85);
        border: 1px solid rgba(230, 91, 91, 0.5);
        padding: 10px 14px;
        font-family: 'Pixelify Sans', monospace;
        font-size: 11px;
        line-height: 1.6;
        color: #ffffff;
        pointer-events: none;
        z-index: 100;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(2px);
        min-width: 180px;
    `;

    // Insere o HUD dentro do viewport do jogo
    const gameViewport = canvas.parentElement;
    if (gameViewport) {
        gameViewport.appendChild(debugHUD);
    }

    function updateDebugHUD() {
        if (!showDebug) {
            debugHUD.style.display = 'none';
            return;
        }

        debugHUD.style.display = 'block';

        debugHUD.innerHTML = `
            <div style="color:#E65B5B; letter-spacing:1.5px; margin-bottom:6px;">◆ DEBUG</div>
            <div><span style="color:#41a6b5;">POS X:</span> ${Math.round(player.x)}</div>
            <div><span style="color:#41a6b5;">POS Y:</span> ${Math.round(player.y)}</div>
            <div><span style="color:#41a6b5;">WORLD X:</span> ${Math.round(player.worldX)}</div>
            <div><span style="color:#41a6b5;">VEL:</span> ${player.currentSpeed}</div>
            <div><span style="color:#41a6b5;">ESTADO:</span> ${player.currentState.toUpperCase()}</div>
        `;
    }

    // ========================================================
    // 7. CONTROLES
    // ========================================================

    const keys = {};

    window.addEventListener('keydown', e => {

        keys[e.key.toLowerCase()] = true;

        if (e.key === 'Shift') {
            keys['shift'] = true;
        }

        if (
            [
                ' ',
                'arrowup',
                'arrowdown',
                'w',
                's'
            ].includes(e.key.toLowerCase())
        ) {
            e.preventDefault();
        }
    });

    window.addEventListener('keyup', e => {

        keys[e.key.toLowerCase()] = false;

        if (e.key === 'Shift') {
            keys['shift'] = false;
        }
    });

    // ========================================================
    // 8. CARREGAMENTO DOS RECURSOS
    // ========================================================

    const images = {};

    const allLayers = [
        ...layersConfig,
        foregroundTreeLayer
    ];

    let totalImages = allLayers.length;
    let loadedCount = 0;

    let cloudOffset = 0;

    allLayers.forEach(layer => {

        const img = new Image();

        img.src = `img/Files/${layer.file}`;

        img.onload = () => {
            checkLoad();
        };

        img.onerror = () => {
            console.warn(
                `Não foi possível carregar: ${layer.file}`
            );

            checkLoad();
        };

        images[layer.id] = img;
    });

    function checkLoad() {

        loadedCount++;

        if (loadedCount === totalImages) {
            requestAnimationFrame(gameLoop);
        }
    }

    // ========================================================
    // 9. LÓGICA DE MOVIMENTAÇÃO
    // ========================================================

    function update() {

        let moving = false;

        player.isCrouching = false;

        // ----------------------------------------------------
        // AGACHAR
        // ----------------------------------------------------

        if (
            (keys['s'] || keys['arrowdown']) &&
            player.isGrounded
        ) {
            player.isCrouching = true;
        }

        // ----------------------------------------------------
        // CORRER (SHIFT)
        // ----------------------------------------------------

        player.isRunning =
            !!keys['shift'] &&
            player.isGrounded &&
            !player.isCrouching;

        player.currentSpeed =
            player.isRunning
                ? player.runSpeed
                : player.speed;

        // ----------------------------------------------------
        // MOVIMENTO HORIZONTAL
        // ----------------------------------------------------

        if (!player.isCrouching) {

            if (
                keys['a'] ||
                keys['arrowleft']
            ) {

                player.worldX -= player.currentSpeed;

                player.direction = 'left';

                moving = true;
            }

            if (
                keys['d'] ||
                keys['arrowright']
            ) {

                player.worldX += player.currentSpeed;

                player.direction = 'right';

                moving = true;
            }
        }

        // ----------------------------------------------------
        // PULO
        // ----------------------------------------------------

        if (
            (
                keys['w'] ||
                keys[' '] ||
                keys['arrowup']
            ) &&
            player.isGrounded &&
            !player.isCrouching
        ) {

            player.vy = player.jumpForce;

            player.isGrounded = false;
        }

        // ----------------------------------------------------
        // GRAVIDADE
        // ----------------------------------------------------

        player.vy += player.gravity;

        player.y += player.vy;

        // ----------------------------------------------------
        // COLISÃO COM O CHÃO
        // ----------------------------------------------------

        if (player.y >= GROUND_Y) {

            player.y = GROUND_Y;

            player.vy = 0;

            player.isGrounded = true;
        }

        // ====================================================
        // ESTADO DA ANIMAÇÃO
        // ====================================================

        if (!player.isGrounded) {

            player.currentState = 'jump';

            if (player.vy < -4) {

                player.jumpFrameIndex = 0;

            } else if (
                player.vy >= -4 &&
                player.vy <= 4
            ) {

                player.jumpFrameIndex = 1;

            } else {

                player.jumpFrameIndex = 2;
            }

        } else if (player.isCrouching) {

            player.currentState = 'crouch';

        } else if (moving) {

            player.currentState =
                player.isRunning
                    ? 'run'
                    : 'walk';

            const currentAnimSpeed =
                player.isRunning
                    ? player.animSpeedRun
                    : player.animSpeed;

            player.animTimer++;

            if (
                player.animTimer >=
                currentAnimSpeed
            ) {

                player.animTimer = 0;

                player.walkSequenceIndex =
                    (
                        player.walkSequenceIndex + 1
                    ) % walkSequence.length;
            }

        } else {

            player.currentState = 'idle';

            player.walkSequenceIndex = 0;

            player.animTimer = 0;
        }

        // Movimento automático das nuvens
        cloudOffset += 0.25;

        // Atualiza o HUD de debug
        updateDebugHUD();
    }

    // ========================================================
    // 10. DESENHAR CAMADA
    // ========================================================

    function drawLayer(layer) {

        const img = images[layer.id];

        if (
            !img ||
            !img.complete ||
            img.naturalWidth === 0
        ) {
            return;
        }

        ctx.globalAlpha = layer.opacity;

        // ----------------------------------------------------
        // PARALLAX
        // ----------------------------------------------------

        let parallaxX =
            -player.worldX * layer.factor;

        if (layer.autoSpeed) {
            parallaxX -= cloudOffset;
        }

        // ----------------------------------------------------
        // CAMADAS REPETIDAS
        // ----------------------------------------------------

        if (layer.tile) {

            const imgWidth = layer.w;

            let startX =
                parallaxX % imgWidth;

            if (startX > 0) {
                startX -= imgWidth;
            }

            ctx.drawImage(
                img,
                startX,
                layer.y,
                imgWidth,
                layer.h
            );

            ctx.drawImage(
                img,
                startX + imgWidth,
                layer.y,
                imgWidth,
                layer.h
            );

        }

        // ----------------------------------------------------
        // CAMADAS ÚNICAS
        // ----------------------------------------------------

        else {

            const objX =
                layer.static
                    ? layer.x
                    : layer.x + parallaxX;

            ctx.drawImage(
                img,
                objX,
                layer.y,
                layer.w,
                layer.h
            );
        }

        ctx.globalAlpha = 1.0;
    }

    // ========================================================
    // 11. DESENHAR PERSONAGEM
    // ========================================================

    function drawPlayer() {

        let spriteToDraw =
            playerSprites.idle;

        if (
            !spriteToDraw.complete ||
            spriteToDraw.naturalWidth === 0
        ) {

            spriteToDraw =
                playerSprites.base;
        }

        // ANDANDO OU CORRENDO
        if (
            player.currentState === 'walk' ||
            player.currentState === 'run'
        ) {

            const frameIndex =
                walkSequence[
                    player.walkSequenceIndex
                ];

            const currentWalkImg =
                playerSprites.walkFrames[
                    frameIndex
                ];

            if (
                currentWalkImg &&
                currentWalkImg.complete &&
                currentWalkImg.naturalWidth > 0
            ) {

                spriteToDraw =
                    currentWalkImg;
            }
        }

        // PULANDO
        else if (
            player.currentState === 'jump'
        ) {

            const currentJumpImg =
                playerSprites.jumpFrames[
                    player.jumpFrameIndex
                ];

            if (
                currentJumpImg &&
                currentJumpImg.complete &&
                currentJumpImg.naturalWidth > 0
            ) {

                spriteToDraw =
                    currentJumpImg;
            }
        }

        // DESENHAR
        ctx.save();

        if (
            spriteToDraw &&
            spriteToDraw.complete &&
            spriteToDraw.naturalWidth > 0
        ) {

            // Olhando para esquerda
            if (
                player.direction === 'left'
            ) {

                ctx.translate(
                    player.x + player.w,
                    player.y
                );

                ctx.scale(-1, 1);

                ctx.drawImage(
                    spriteToDraw,
                    0,
                    0,
                    player.w,
                    player.h
                );

            }

            // Olhando para direita
            else {

                ctx.drawImage(
                    spriteToDraw,
                    player.x,
                    player.y,
                    player.w,
                    player.h
                );
            }

        } else {

            // Fallback
            ctx.fillStyle =
                '#E65B5B';

            ctx.fillRect(
                player.x,
                player.y,
                player.w,
                player.h
            );
        }

        ctx.restore();

        // ====================================================
        // HITBOX DO PLAYER (opcional, para debug visual)
        // ====================================================
        // Descomente para ver a hitbox do personagem

        /*
        ctx.strokeStyle = 'rgba(230, 91, 91, 0.8)';
        ctx.lineWidth = 2;
        ctx.strokeRect(
            player.x,
            player.y,
            player.w,
            player.h
        );
        */
    }

    // ========================================================
    // 12. RENDERIZAÇÃO
    // ========================================================

    function draw() {

        // ----------------------------------------------------
        // LIMPAR CANVAS
        // ----------------------------------------------------

        ctx.fillStyle = '#000000';

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        // ====================================================
        // A) FUNDO
        // ====================================================

        for (
            let i = 0;
            i < 10;
            i++
        ) {

            drawLayer(
                layersConfig[i]
            );
        }

        // ====================================================
        // B) GROUND
        // ====================================================

        drawLayer(
            layersConfig[10]
        );

        // ====================================================
        // C) GRAMA
        // ====================================================

        drawLayer(
            layersConfig[11]
        );

        // ====================================================
        // D) SOMBRA DO PERSONAGEM
        // ====================================================

        ctx.fillStyle =
            'rgba(0, 0, 0, 0.4)';

        ctx.beginPath();

        const jumpOffset =
            GROUND_Y - player.y;

        let shadowRadius =
            Math.max(
                18,
                52 - jumpOffset * 0.15
            );

        if (player.isCrouching) {
            shadowRadius = 58;
        }

        ctx.ellipse(
            player.x + player.w / 2,
            GROUND_Y + player.h - 10,
            shadowRadius,
            10,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();

        // ====================================================
        // E) PERSONAGEM
        // ====================================================

        drawPlayer();

        // ====================================================
        // F) ÁRVORE — NA FRENTE DO PERSONAGEM
        // ====================================================

        drawLayer(
            foregroundTreeLayer
        );

        // ====================================================
        // G) NÉVOA ATMOSFÉRICA
        // ====================================================

        ctx.fillStyle =
            'rgba(12, 14, 24, 0.10)';

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );
    }

    // ========================================================
    // 13. GAME LOOP
    // ========================================================

    function gameLoop() {

        update();

        draw();

        requestAnimationFrame(
            gameLoop
        );
    }
});