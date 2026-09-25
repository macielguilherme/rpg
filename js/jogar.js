// ============================================================
// ARQUIVO: js/jogar.js (Árvores Pequenas e 100% Estáticas + Personagem 192px)
// Diretório dos Assets: img/Files/ e assets/images/
// Canvas: 1024x576px | Personagem: 192x192px
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });

    ctx.imageSmoothingEnabled = false;

    // 1. CONFIGURAÇÃO DE CAMADAS PARALLAX (img/Files/)
    const layersConfig = [
        { id: 'Sky', file: 'Sky.png', factor: 0.0, x: 0, y: 0, w: 1024, h: 576, tile: true, opacity: 1.0 },
        { id: 'Mountain_Back', file: 'Mountain_Back.png', factor: 0.08, x: 0, y: 160, w: 1024, h: 300, tile: true, opacity: 0.8 },
        { id: 'Mountain_Middle', file: 'Mountain_Middle.png', factor: 0.18, x: 0, y: 180, w: 1024, h: 300, tile: true, opacity: 0.88 },
        { id: 'Mountain_Front', file: 'Mountain_Front.png', factor: 0.3, x: 0, y: 220, w: 1024, h: 250, tile: true, opacity: 0.92 },
        { id: 'Clouds', file: 'Clouds.png', factor: 0.12, x: 0, y: 20, w: 1024, h: 200, tile: true, autoSpeed: 0.25, opacity: 0.65 },
        { id: 'Fuji', file: 'Fuji.png', factor: 0.22, x: 362, y: 160, w: 300, h: 300, tile: false, opacity: 0.9 },
        { id: 'Shrine_Multiple', file: 'Shrine_Multiple.png', factor: 0.45, x: 60, y: 60, w: 250, h: 400, tile: false, opacity: 0.95 },
        { id: 'Shrine_Single', file: 'Shrine_Single.png', factor: 0.45, x: 780, y: 60, w: 150, h: 400, tile: false, opacity: 0.95 },
        { id: 'BackgroundTrees', file: 'BackgroundTrees.png', factor: 0.6, x: 0, y: 260, w: 1024, h: 200, tile: true, opacity: 0.95 },
        { id: 'House', file: 'House.png', factor: 0.8, x: 410, y: 60, w: 300, h: 400, tile: false, opacity: 1.0 },
        { id: 'Ground', file: 'Ground.png', factor: 1.0, x: 0, y: 460, w: 1024, h: 116, tile: true, opacity: 1.0 },
        { id: 'Gras', file: 'Gras.png', factor: 1.0, x: 0, y: 440, w: 1024, h: 136, tile: true, opacity: 0.95 }
    ];

    // CAMADA DE ÁRVORES DA FRENTE (Pequenas, estáticas, sempre visíveis)
    const foregroundTreeLayer = {
        id: 'Trees',
        file: 'Trees.png',
        factor: 0.0,       // Sen parallax
        x: 30,             // Posición fixa no eixe X (bordo esquerdo)
        y: 220,            // Posición fixa no eixe Y (sobre o chan)
        w: 300,            // Largura pequena
        h: 200,            // Altura pequena
        tile: false,       // Sen repetição
        opacity: 1.0,      // Opacidade total para que non se perdan
        static: true       // Ignora calquera desprazamento
    };

    // 2. SISTEMA DO CAÇADOR (TAMANHO DE 192px)
    const GROUND_Y = 288;

    const playerSprites = {
        idle: new Image(),
        base: new Image(),
        walkFrames: [new Image(), new Image(), new Image()],
        jumpFrames: [new Image(), new Image(), new Image()]
    };

    // Mapeamento das imagens
    playerSprites.idle.src = 'assets/images/parado.png';
    playerSprites.base.src = 'assets/images/personagem.png';
    playerSprites.walkFrames[0].src = 'assets/images/andando_1.png';
    playerSprites.walkFrames[1].src = 'assets/images/andando_2.png';
    playerSprites.walkFrames[2].src = 'assets/images/andando_3.png';
    playerSprites.jumpFrames[0].src = 'assets/images/pulando_1.png';
    playerSprites.jumpFrames[1].src = 'assets/images/pulando_2.png';
    playerSprites.jumpFrames[2].src = 'assets/images/pulando_3.png';

    const walkSequence = [0, 1, 0, 2];

    const player = {
        x: 200,
        y: GROUND_Y,
        w: 192,
        h: 192,
        vy: 0,
        speed: 5.0,
        jumpForce: -14.0,
        gravity: 0.65,
        isGrounded: true,
        isCrouching: false,
        currentState: 'idle',
        walkSequenceIndex: 0,
        jumpFrameIndex: 0,
        animTimer: 0,
        animSpeed: 8,
        worldX: 0,
        direction: 'right'
    };

    const keys = {};
    window.addEventListener('keydown', e => {
        keys[e.key.toLowerCase()] = true;
        if ([' ', 'arrowup', 'arrowdown', 'w', 's'].includes(e.key.toLowerCase())) {
            e.preventDefault();
        }
    });
    window.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

    // 3. CARREGAMENTO DOS RECURSOS
    const images = {};
    const allLayers = [...layersConfig, foregroundTreeLayer];
    let totalImages = allLayers.length;
    let loadedCount = 0;
    let cloudOffset = 0;

    allLayers.forEach(layer => {
        const img = new Image();
        img.src = `img/Files/${layer.file}`;
        img.onload = () => checkLoad();
        img.onerror = () => checkLoad();
        images[layer.id] = img;
    });

    function checkLoad() {
        loadedCount++;
        if (loadedCount === totalImages) {
            requestAnimationFrame(gameLoop);
        }
    }

    // 4. LÓGICA DE MOVIMENTAÇÃO E ANIMAÇÃO
    function update() {
        let moving = false;
        player.isCrouching = false;

        if ((keys['s'] || keys['arrowdown']) && player.isGrounded) {
            player.isCrouching = true;
        }

        if (!player.isCrouching) {
            if (keys['a'] || keys['arrowleft']) {
                player.worldX -= player.speed;
                player.direction = 'left';
                moving = true;
            }
            if (keys['d'] || keys['arrowright']) {
                player.worldX += player.speed;
                player.direction = 'right';
                moving = true;
            }
        }

        if ((keys['w'] || keys[' '] || keys['arrowup']) && player.isGrounded && !player.isCrouching) {
            player.vy = player.jumpForce;
            player.isGrounded = false;
        }

        player.vy += player.gravity;
        player.y += player.vy;

        if (player.y >= GROUND_Y) {
            player.y = GROUND_Y;
            player.vy = 0;
            player.isGrounded = true;
        }

        // SELEÇÃO DO ESTADO DE ANIMAÇÃO
        if (!player.isGrounded) {
            player.currentState = 'jump';
            if (player.vy < -4) {
                player.jumpFrameIndex = 0;
            } else if (player.vy >= -4 && player.vy <= 4) {
                player.jumpFrameIndex = 1;
            } else {
                player.jumpFrameIndex = 2;
            }
        } else if (player.isCrouching) {
            player.currentState = 'crouch';
        } else if (moving) {
            player.currentState = 'walk';

            player.animTimer++;
            if (player.animTimer >= player.animSpeed) {
                player.animTimer = 0;
                player.walkSequenceIndex = (player.walkSequenceIndex + 1) % walkSequence.length;
            }
        } else {
            player.currentState = 'idle';
            player.walkSequenceIndex = 0;
            player.animTimer = 0;
        }

        cloudOffset += 0.25;
    }

    function drawLayer(layer) {
        const img = images[layer.id];
        if (!img || !img.complete || img.naturalWidth === 0) return;

        ctx.globalAlpha = layer.opacity;
        let parallaxX = -player.worldX * layer.factor;
        if (layer.autoSpeed) parallaxX -= cloudOffset;

        if (layer.tile) {
            const imgWidth = layer.w;
            let startX = (parallaxX % imgWidth);
            if (startX > 0) startX -= imgWidth;

            ctx.drawImage(img, startX, layer.y, imgWidth, layer.h);
            ctx.drawImage(img, startX + imgWidth, layer.y, imgWidth, layer.h);
        } else {
            // Capa estática: ignora calquera desprazamento e debúxase sempre
            const objX = layer.static ? layer.x : layer.x + parallaxX;
            ctx.drawImage(img, objX, layer.y, layer.w, layer.h);
        }
        ctx.globalAlpha = 1.0;
    }

    // 5. RENDERIZAÇÃO NO CANVAS
    function draw() {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // A) Camadas de Fundo
        for (let i = 0; i < layersConfig.length; i++) {
            drawLayer(layersConfig[i]);
        }

        // B) Sombra do Personagem
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        const jumpOffset = GROUND_Y - player.y;
        let shadowRadius = Math.max(18, 52 - jumpOffset * 0.15);
        if (player.isCrouching) shadowRadius = 58;

        ctx.ellipse(player.x + player.w / 2, GROUND_Y + player.h - 10, shadowRadius, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        // C) SELEÇÃO DO SPRITE DO PERSONAGEM
        let spriteToDraw = playerSprites.idle;

        if (!spriteToDraw.complete || spriteToDraw.naturalWidth === 0) {
            spriteToDraw = playerSprites.base;
        }

        if (player.currentState === 'walk') {
            const frameIndex = walkSequence[player.walkSequenceIndex];
            const currentWalkImg = playerSprites.walkFrames[frameIndex];
            if (currentWalkImg && currentWalkImg.complete && currentWalkImg.naturalWidth > 0) {
                spriteToDraw = currentWalkImg;
            }
        } else if (player.currentState === 'jump') {
            const currentJumpImg = playerSprites.jumpFrames[player.jumpFrameIndex];
            if (currentJumpImg && currentJumpImg.complete && currentJumpImg.naturalWidth > 0) {
                spriteToDraw = currentJumpImg;
            }
        }

        ctx.save();
        if (spriteToDraw && spriteToDraw.complete && spriteToDraw.naturalWidth > 0) {
            if (player.direction === 'left') {
                ctx.translate(player.x + player.w, player.y);
                ctx.scale(-1, 1);
                ctx.drawImage(spriteToDraw, 0, 0, player.w, player.h);
            } else {
                ctx.drawImage(spriteToDraw, player.x, player.y, player.w, player.h);
            }
        } else {
            ctx.fillStyle = '#E65B5B';
            ctx.fillRect(player.x, player.y, player.w, player.h);
        }
        ctx.restore();

        // D) Árvores da Frente (pequenas e 100% estáticas)
        drawLayer(foregroundTreeLayer);

        // E) Névoa Atmosférica
        ctx.fillStyle = 'rgba(12, 14, 24, 0.10)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function gameLoop() {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }
});