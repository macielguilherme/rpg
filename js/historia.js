// ============================================================
// ARQUIVO: js/historia.js
// Descrição: Lógica da Crônica, linha do tempo, progressão e 
// visualização de capítulos no modal.
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    // ------------------------------------------------------------
    // 1. BASE DE DADOS DE HISTÓRIA (Fallback)
    // ------------------------------------------------------------
    const HISTORIA_DB = window.HISTORIA_DATA || [
        {
            id: 1,
            number: 'CAPÍTULO I',
            date: 'Anoitecer, 2020',
            title: 'O Despertar da Névoa',
            location: 'Vila Oculta',
            excerpt: 'Uma noite comum foi consumida pelo fogo e pelo sangue. O primeiro encontro com as criaturas da noite.',
            image: 'assets/images/personagem.png',
            text: [
                'O cheiro a fumo acordou-te antes mesmo dos gritos, [JOGADOR]. Quando saíste de casa, a vila que conhecias tinha desaparecido. Em seu lugar, apenas chamas e sombras que se moviam rápido demais.',
                'Não havia tempo para chorar. Pegaste a velha espada enferrujada do teu avô e correste para a floresta, perseguido por olhos amarelos brilhantes.',
                'Foi nessa noite que tudo mudou. Foi nessa noite que te tornaste um caçador.'
            ],
            characters: ['Tu', 'Oni Desconhecido']
        },
        {
            id: 2,
            number: 'CAPÍTULO II',
            date: 'Aurora, 2021',
            title: 'O Treino Gélido',
            location: 'Montanha Sagrada',
            excerpt: 'Meses de dor e exaustão sob a tutela de um antigo mestre. O corpo quebra antes da mente.',
            image: 'assets/images/personagem.png',
            text: [
                'O ar era tão rarefeito que cada respiração parecia rasgar os teus pulmões com vidro moído. "Respiração Total, [JOGADOR]", dizia o velho mestre, enquanto te atirava do penhasco pela décima vez.',
                'Aos poucos, o frio deixou de incomodar. A tua lâmina tornou-se mais rápida, mais precisa. A tua vontade foi forjada no gelo.',
                'A Prova Final estava a aproximar-se.'
            ],
            characters: ['Tu', 'Mestre Ancião']
        },
        {
            id: 3,
            number: 'CAPÍTULO III',
            date: 'Lua Cheia, 2023',
            title: 'Seleção Final',
            location: 'Floresta de Glicínias',
            excerpt: 'Sete dias. Sem ajuda. Sem rota de fuga. Apenas tu e os demónios.',
            image: 'assets/images/personagem.png',
            text: [
                'As flores de glicínia brilhavam sob a luz da lua, criando uma ilusão de paz. Mas assim que passaste os portões, o cheiro a morte ficou insuportável.',
                'Não eras o único aspirante ali. Muitos não passaram da primeira noite. Tiveste de usar tudo o que aprendeste apenas para sobreviver até o amanhecer.',
                'Quando o sétimo dia chegou, a tua lâmina estava banhada em sangue e as tuas mãos tremiam, mas estavas vivo.'
            ],
            characters: ['Tu', 'Aspirantes']
        },
        {
            id: 4,
            number: 'CAPÍTULO IV',
            date: 'Presente, 2026',
            title: 'A Lâmina Solitária',
            location: 'Kagetsumi',
            excerpt: 'Agora és um caçador formado. O verdadeiro pesadelo apenas começou.',
            image: 'assets/images/personagem.png',
            text: [
                'O teu corvo sobrevoa o céu cinzento, deixando cair uma mensagem manchada de sangue. Há rumores de um demónio de classe Lua na região de Kagetsumi.',
                'Não há Hashiras disponíveis, [JOGADOR]. Estás por tua conta. Preparas o teu equipamento, respiras fundo e caminhas em direção à escuridão.'
            ],
            characters: ['Tu', 'Corvo Mensageiro']
        }
    ];

    // ------------------------------------------------------------
    // 2. VERIFICAR PROGRESSO DO JOGADOR
    // ------------------------------------------------------------
    let character = null;
    let chaptersUnlocked = 1;

    if (typeof CacadorRPG !== 'undefined') {
        character = CacadorRPG.loadData();
        if (character && character.chapters) {
            chaptersUnlocked = Math.max(1, character.chapters);
        }
    }

    const progressSection = document.getElementById('progressSection');
    const progressPercent = document.getElementById('progressPercent');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');

    if (character && progressSection) {
        progressSection.hidden = false;
        
        const maxChapters = HISTORIA_DB.length;
        const calcPercent = Math.min(Math.round((chaptersUnlocked / maxChapters) * 100), 100);
        
        if (progressPercent) progressPercent.textContent = `${calcPercent}%`;
        if (progressFill) progressFill.style.width = `${calcPercent}%`;
        if (progressText) {
            progressText.innerHTML = `O caçador <strong>${character.name}</strong> completou ${chaptersUnlocked} de ${maxChapters} capítulos da jornada principal.`;
        }
    }

    // ------------------------------------------------------------
    // 3. RENDERIZAR A TIMELINE
    // ------------------------------------------------------------
    const timelineContainer = document.getElementById('timeline');
    let currentChapterIndex = 0;

    function renderTimeline() {
        if (!timelineContainer) return;
        timelineContainer.innerHTML = '';

        HISTORIA_DB.forEach((chap, index) => {
            const isUnlocked = index < chaptersUnlocked;
            const isCurrent = index === (chaptersUnlocked - 1);

            const item = document.createElement('div');
            item.className = `timeline-item ${isCurrent ? 'current' : ''} ${!isUnlocked ? 'locked' : ''}`;
            item.setAttribute('tabindex', isUnlocked ? '0' : '-1');

            item.innerHTML = `
                <div class="timeline-item__card">
                    <div class="timeline-item__meta">
                        <span class="timeline-item__number">${chap.number}</span>
                        <span class="timeline-item__date">${chap.date}</span>
                    </div>
                    <h3 class="timeline-item__title">${isUnlocked ? chap.title : 'Capítulo Bloqueado'}</h3>
                    <p class="timeline-item__excerpt">${isUnlocked ? chap.excerpt : 'Continuem a jornada para descobrir o que acontece a seguir.'}</p>
                    ${isUnlocked ? `<span class="timeline-item__location">◈ ${chap.location}</span>` : ''}
                </div>
            `;

            if (isUnlocked) {
                item.addEventListener('click', () => openChapterModal(index));
                item.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') openChapterModal(index);
                });
            }

            timelineContainer.appendChild(item);
        });
    }

    // ------------------------------------------------------------
    // 4. MODAL DE CAPÍTULO
    // ------------------------------------------------------------
    const chapterModal = document.getElementById('chapterModal');
    const chapterClose = document.getElementById('chapterClose');
    
    const elNumber = document.getElementById('chapterNumber');
    const elDate = document.getElementById('chapterDate');
    const elTitle = document.getElementById('chapterTitle');
    const elLocation = document.getElementById('chapterLocation');
    const elImage = document.getElementById('chapterImage');
    const elContent = document.getElementById('chapterContent');
    const elCharacters = document.getElementById('chapterCharacters');
    
    const btnPrev = document.getElementById('chapterPrev');
    const btnNext = document.getElementById('chapterNext');

    function openChapterModal(index) {
        if (!chapterModal || !HISTORIA_DB[index]) return;
        
        currentChapterIndex = index;
        const chap = HISTORIA_DB[index];

        if (elNumber) elNumber.textContent = chap.number;
        if (elDate) elDate.textContent = chap.date;
        if (elTitle) elTitle.textContent = chap.title;
        if (elLocation) elLocation.textContent = chap.location;
        if (elImage) elImage.src = chap.image;

        const playerName = character ? character.name : 'Tu';

        if (elContent) {
            elContent.innerHTML = '';
            chap.text.forEach(paragraph => {
                const formattedParagraph = paragraph.replace(/\[JOGADOR\]/g, playerName);
                const p = document.createElement('p');
                p.textContent = formattedParagraph;
                elContent.appendChild(p);
            });
        }

        if (elCharacters) {
            elCharacters.innerHTML = '';
            chap.characters.forEach(charName => {
                const chip = document.createElement('span');
                chip.className = 'chapter-chip';
                chip.textContent = charName === 'Tu' ? playerName : charName;
                elCharacters.appendChild(chip);
            });
        }

        if (btnPrev) btnPrev.disabled = (currentChapterIndex === 0);
        
        if (btnNext) {
            const isNextLocked = (currentChapterIndex + 1) >= chaptersUnlocked;
            const isLast = (currentChapterIndex + 1) >= HISTORIA_DB.length;
            btnNext.disabled = (isLast || isNextLocked);
        }

        chapterModal.classList.add('active');
        chapterModal.setAttribute('aria-hidden', 'false');
    }

    function closeChapterModal() {
        if (!chapterModal) return;
        chapterModal.classList.remove('active');
        chapterModal.setAttribute('aria-hidden', 'true');
    }

    if (chapterClose) chapterClose.addEventListener('click', closeChapterModal);
    
    if (chapterModal) {
        chapterModal.addEventListener('click', (e) => {
            if (e.target === chapterModal) closeChapterModal();
        });
    }

    if (btnPrev) {
        btnPrev.addEventListener('click', () => {
            if (currentChapterIndex > 0) openChapterModal(currentChapterIndex - 1);
        });
    }

    if (btnNext) {
        btnNext.addEventListener('click', () => {
            const isNextLocked = (currentChapterIndex + 1) >= chaptersUnlocked;
            if (!isNextLocked && currentChapterIndex < HISTORIA_DB.length - 1) {
                openChapterModal(currentChapterIndex + 1);
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && chapterModal && chapterModal.classList.contains('active')) {
            closeChapterModal();
        }
    });

    // ------------------------------------------------------------
    // INICIALIZAÇÃO
    // ------------------------------------------------------------
    renderTimeline();
});