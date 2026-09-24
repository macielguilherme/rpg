// ============================================================
// ARQUIVO: js/mapa.js
// Descrição: Inicialização do Leaflet e gerenciamento do Popup Retrô.
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    const MAP_SIZE = 1024;
    const bounds = [[0, 0], [MAP_SIZE, MAP_SIZE]];
    const REGIOES_DB = window.MAPA_DATA || [];

    // Elementos do Modal
    const overlay = document.getElementById('regionModalOverlay');
    const titleEl = document.getElementById('modalTitle');
    const badgeEl = document.getElementById('modalBadge');
    const imageEl = document.getElementById('modalImage');
    const descEl = document.getElementById('modalDesc');
    const dangerBarEl = document.getElementById('modalDangerBar');
    const dangerValEl = document.getElementById('modalDangerVal');
    const closeXBtn = document.getElementById('modalCloseX');
    const closeSecondaryBtn = document.getElementById('modalCloseBtn');
    const exploreBtn = document.getElementById('modalExploreBtn');

    // Inicialização do Leaflet sem Zoom/Scroll/Arrasto
    const map = L.map('mapStage', {
        crs: L.CRS.Simple,
        minZoom: -1,
        maxZoom: 2,
        zoomControl: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: false,
        boxZoom: false,
        dragging: false,
        keyboard: false,
        attributionControl: false
    });

    L.imageOverlay('assets/maps/mapa.png', bounds).addTo(map);

    function fitMap() {
        map.invalidateSize();
        map.fitBounds(bounds, { padding: [0, 0] });
    }

    fitMap();
    setTimeout(fitMap, 100);
    window.addEventListener('resize', fitMap);

    // Renderiza as áreas de clique transparentes
    REGIOES_DB.forEach(region => {
        const leafletY = MAP_SIZE - region.y;
        const leafletX = region.x;

        const customIcon = L.divIcon({
            className: 'leaflet-pixel-marker',
            html: `<div class="map-hotspot"><div class="map-hotspot__marker" style="width:${region.w}px; height:${region.h}px;"></div></div>`,
            iconSize: [region.w, region.h],
            iconAnchor: [region.w / 2, region.h / 2]
        });

        const marker = L.marker([leafletY, leafletX], { icon: customIcon }).addTo(map);
        marker.on('click', () => openModal(region));
    });

    // Função para abrir o Popup com os dados da região
    function openModal(region) {
        if (!overlay) return;

        titleEl.textContent = region.name;
        badgeEl.textContent = region.type;
        descEl.textContent = region.desc;
        imageEl.src = region.image;
        imageEl.onerror = () => { imageEl.src = 'assets/maps/mapa.png'; };

        // Monta os 10 blocos da barra de perigo
        dangerBarEl.innerHTML = '';
        for (let i = 1; i <= 10; i++) {
            const seg = document.createElement('div');
            seg.className = `danger-seg ${i <= region.danger ? 'filled' : ''}`;
            dangerBarEl.appendChild(seg);
        }
        dangerValEl.textContent = `${region.danger} / 10`;

        // Ação de transição para o jogo
        exploreBtn.onclick = () => {
            if (typeof CacadorRPG !== 'undefined') {
                CacadorRPG.showToast(`Viajando para ${region.name}...`);
            }
            setTimeout(() => {
                window.location.href = 'jogar.html';
            }, 800);
        };

        overlay.hidden = false;
    }

    function closeModal() {
        if (overlay) overlay.hidden = true;
    }

    // Fechamento via botões
    if (closeXBtn) closeXBtn.addEventListener('click', closeModal);
    if (closeSecondaryBtn) closeSecondaryBtn.addEventListener('click', closeModal);

    // Fechamento ao clicar na área escura (overlay)
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });
    }
});