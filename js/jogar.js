// ============================================================
// ARQUIVO: js/jogar.js (Versão Otimizada - 60 FPS Sem Lag)
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false }); // alpha: false acelera a renderização

    ctx.imageSmoothingEnabled = false;

    // 1. CONFIGURAÇÃO LEVE DAS CAMADAS (Sem ctx.filter pesado)
    const layersConfig = [
        { id: 'Sky', file: 'Sky.png', factor: 0.0, tile: true, opacity: 1.0 },
        { id: 'Mountain_Back', file: 'Mountain_Back.png', factor: 0.08, y: 120, h: 300, tile: true, opacity: 0.75 },
        { id: 'Mountain_Middle', file: 'Mountain_Middle.png', factor: 0.18, y: 160, h: 280, tile: true, opacity: 0.85 },
        { id: 'Mountain_Front', file: 'Mountain_Front.png', factor: 0.3, y: 200, h: 250, tile: true, opacity: 0.9 },
        { id: 'Clouds', file: 'Clouds.png', factor: 0.12, y: 20, h: 180, tile: true, autoSpeed: 0.3, opacity: 0.6 },
        { id: 'Fuji', file: 'Fuji.png', factor: 0.22, x: 380, y: 100, w: 320, h: 300, tile: false, opacity: 0.9 },
        { id: 'Shrine_Multiple', file: 'Shrine_Multiple.png', factor: 0.45, x: 80, y: 160, w: 210, h: 310, tile: false, opacity: 0.95 },
        { id: 'Shrine_Single', file: 'Shrine_Single.png', factor: 0.45, x: 740, y: 170, w: 160, h: 300, tile: false, opacity: 0.95 },
        { id: 'BackgroundTrees', file: 'BackgroundTrees.png', factor: 0.6, y: 300, h: 180, tile: true, opacity: 0.95 },
        { id: 'House', file: 'House.png', factor: 0.8, x: 440, y: 230, w: 250, h: 240, tile: false, opacity: 1.0 },
        { id: 'Ground', file: 'Ground.png', factor: 1.0, y: 460, h: 116, tile: true, opacity: 1.0 },
        { id: 'Gras', file: 'Gras.png', factor: 1.0, y: 435, h: 141, tile: true, opacity: 0.95 },
        { id: 'Trees', file: 'Trees.png', factor: 1.25, y: -20, h: 600, tile: true, opacity: 0.9 }
    ];

    // 2. FÍSICA DO JOGADOR
    const GROUND_Y = 412;

    const player = {
        x: 220,
        y: GROUND_Y,
        w: 64,
        h: 64,
        vy: 0,
        speed: 4.5,
        jumpForce: -12.5,
        gravity: 0.65,
        isGrounded: true,
        worldX: 0,
        direction: 'right',
        sprite: new Image()
    };
    player.sprite.src = 'assets/images/personagem.png';

    const keys = {};
    window.addEventListener('keydown', e => {
        keys[e.key.toLowerCase()] = true;
        if (e.key === ' ' || e.key === 'ArrowUp') e.preventDefault();
    });
    window.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

    // 3. CARREGAMENTO PRÉVIO DAS IMAGENS
    const images = {};
    let totalImages = layersConfig.length;
    let loadedCount = 0;
    let cloudOffset = 0;

    layersConfig.forEach(layer => {
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

    // 4. ATUALIZAÇÃO DA LÓGICA (FÍSICA)
    function update() {
        if (keys['a'] || keys['arrowleft']) {
            player.worldX -= player.speed;
            player.direction = 'left';
        }
        if (keys['d'] || keys['arrowright']) {
            player.worldX += player.speed;
            player.direction = 'right';
        }

        if ((keys['w'] || keys[' '] || keys['arrowup']) && player.isGrounded) {
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

        cloudOffset += 0.2;
    }

    // 5. RENDERIZAÇÃO ULTRA RÁPIDA
    function draw() {
        // Limpa a tela de forma veloz
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // A) DESENHA AS CAMADAS
        for (let i = 0; i < layersConfig.length; i++) {
            const layer = layersConfig[i];
            const img = images[layer.id];
            if (!img || !img.complete) continue;

            ctx.globalAlpha = layer.opacity;

            const y = layer.y !== undefined ? layer.y : 0;
            const h = layer.h !== undefined ? layer.h : canvas.height;

            let parallaxX = -player.worldX * layer.factor;
            if (layer.autoSpeed) parallaxX -= cloudOffset;

            if (layer.tile) {
                const imgWidth = canvas.width;
                let startX = (parallaxX % imgWidth);
                if (startX > 0) startX -= imgWidth;

                ctx.drawImage(img, startX, y, imgWidth, h);
                ctx.drawImage(img, startX + imgWidth, y, imgWidth, h);
            } else {
                const objX = layer.x + parallaxX;
                // Renderiza apenas se estiver dentro da tela visível
                if (objX + layer.w > 0 && objX < canvas.width) {
                    ctx.drawImage(img, objX, y, layer.w, h);
                }
            }
        }

        ctx.globalAlpha = 1.0;

        // B) SOMBRA DO JOGADOR
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.beginPath();
        const jumpOffset = GROUND_Y - player.y;
        const shadowRadius = Math.max(8, 18 - jumpOffset * 0.1);
        ctx.ellipse(player.x + player.w / 2, GROUND_Y + player.h - 4, shadowRadius, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // C) DESENHO DO JOGADOR
        if (player.sprite.complete && player.sprite.naturalWidth > 0) {
            ctx.save();
            if (player.direction === 'left') {
                ctx.translate(player.x + player.w, player.y);
                ctx.scale(-1, 1);
                ctx.drawImage(player.sprite, 0, 0, player.w, player.h);
            } else {
                ctx.drawImage(player.sprite, player.x, player.y, player.w, player.h);
            }
            ctx.restore();
        } else {
            ctx.fillStyle = '#E65B5B';
            ctx.fillRect(player.x, player.y, player.w, player.h);
        }

        // D) NÉVOA LEVE DE ATMOSFERA (SUBSTITUI O FILTRO PESADO)
        ctx.fillStyle = 'rgba(10, 12, 20, 0.15)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // LOOP DE JOGO EM 60 FPS
    function gameLoop() {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }
});