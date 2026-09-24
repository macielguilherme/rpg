// ============================================================
// ARQUIVO: js/personagens.js
// Descrição: Lógica do Bestiário, abas de filtro e renderização 
// dos modais de detalhes de cada personagem.
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    // ------------------------------------------------------------
    // 1. BASE DE DADOS DE PERSONAGENS (Fallback)
    // ------------------------------------------------------------
    const PERSONAGENS_DB = window.PERSONAGENS_DATA || [
        // HASHIRAS
        {
            id: 'ayaka',
            type: 'hashira',
            name: 'Ayaka Kurenai',
            role: 'Hashira do Sangue',
            image: 'assets/characters/hashiras/ayaka-kurenai.png',
            stats: { for: 8, agi: 9, int: 6, vit: 7 },
            desc: 'Uma caçadora letal e silenciosa. A sua respiração utiliza o seu próprio sangue para fortalecer a lâmina.',
            history: 'Criada numa vila oculta por monges, Ayaka foi a única sobrevivente de um massacre. Ela jurou não descansar até que todos os onis sejam erradicados.',
            abilities: ['Corte Escarlate: Um ataque rápido que corta o ar.', 'Bruma de Sangue: Furtividade aprimorada.']
        },
        {
            id: 'daigo',
            type: 'hashira',
            name: 'Daigo Saburou',
            role: 'Hashira da Terra',
            image: 'assets/characters/hashiras/daigo-saburou.png',
            stats: { for: 10, agi: 4, int: 5, vit: 10 },
            desc: 'O pilar inabalável. Um homem de poucas palavras e força esmagadora.',
            history: 'Ex-ferreiro que quebrou a sua própria criação ao tentar forjar a espada perfeita. A sua força bruta compensa a falta de velocidade.',
            abilities: ['Tremor Terrestre: Um golpe no chão que desequilibra inimigos.', 'Pele de Pedra: Reduz drasticamente o dano sofrido.']
        },
        {
            id: 'enma',
            type: 'hashira',
            name: 'Enma Taketsu',
            role: 'Hashira das Cinzas',
            image: 'assets/characters/hashiras/enma-taketsu.png',
            stats: { for: 7, agi: 7, int: 8, vit: 7 },
            desc: 'Misterioso e implacável. Domina uma variação da respiração das chamas.',
            history: 'Sobreviveu a um incêndio provocado por Onis que destruiu a sua família. A sua lâmina está sempre quente.',
            abilities: ['Nuvem Cinzenta: Cega os oponentes temporariamente.', 'Fénix Negra: Um ataque de área devastador.']
        },
        {
            id: 'itsuo',
            type: 'hashira',
            name: 'Itsuo Hoshikage',
            role: 'Hashira das Estrelas',
            image: 'assets/characters/hashiras/itsuo-hoshikage.png',
            stats: { for: 6, agi: 10, int: 7, vit: 6 },
            desc: 'O mais rápido de todos. Os seus movimentos deixam um rasto de luz no escuro.',
            history: 'Nascido sob um eclipse, diz-se que ele pode prever os movimentos do inimigo antes que aconteçam.',
            abilities: ['Corte Estelar: Acerta múltiplos alvos em milissegundos.', 'Luz Ofuscante: Aumenta a própria evasão ao máximo.']
        },
        {
            id: 'minato',
            type: 'hashira',
            name: 'Minato Seiryu',
            role: 'Hashira da Torrente',
            image: 'assets/characters/hashiras/minato-seiryu.png',
            stats: { for: 7, agi: 8, int: 7, vit: 8 },
            desc: 'Calmo como um lago, furioso como um tsunami. Um estrategista brilhante.',
            history: 'Filho de pescadores, desenvolveu a sua técnica ao treinar debaixo das quedas de água da Ilha de Kagetsumi.',
            abilities: ['Redemoinho: Uma defesa impenetrável.', 'Tsunami de Lâminas: Um ataque que empurra os inimigos para trás.']
        },
        {
            id: 'rikuya',
            type: 'hashira',
            name: 'Rikuya Arashi',
            role: 'Hashira da Tempestade',
            image: 'assets/characters/hashiras/rikuya-arashi.png',
            stats: { for: 9, agi: 8, int: 5, vit: 7 },
            desc: 'Caótico e imprevisível. Luta com uma enorme lâmina serrilhada.',
            history: 'Era um bandido antes de ser recrutado. A sua ferocidade em combate é quase demoníaca.',
            abilities: ['Raio Fendido: Um golpe singular que ignora defesas.', 'Ira da Tempestade: Aumenta o próprio dano conforme o HP diminui.']
        },
        {
            id: 'yuki',
            type: 'hashira',
            name: 'Yuki Aramaki',
            role: 'Hashira do Frio',
            image: 'assets/characters/hashiras/yuki-aramaki.png',
            stats: { for: 6, agi: 8, int: 9, vit: 5 },
            desc: 'Elegante e mortal. Cada corte seu congela o sangue da vítima.',
            history: 'Mora nas Montanhas do Pico da Névoa. Raramente fala e prefere a companhia da neve ao invés de pessoas.',
            abilities: ['Prisão de Gelo: Paralisa o alvo.', 'Geada Cortante: Aplica dano contínuo (sangramento/frio).']
        },

        // ONIS
        {
            id: 'kasai',
            type: 'oni',
            name: 'Kasai Uba',
            role: 'Lua Inferior 4',
            image: 'assets/characters/onis/kasai-uba.png',
            stats: { for: 7, agi: 6, int: 10, vit: 8 },
            desc: 'Uma senhora aparentemente inofensiva que manipula o fogo e o desespero.',
            history: 'Vive nas ruínas do Templo do Sol Nascente. Ela consome a memória das suas vítimas antes de as devorar.',
            abilities: ['Chamas Fantasmas: Ilusões mortais.', 'Regeneração Demoníaca: Recupera HP rapidamente.']
        },
        {
            id: 'ketsurui',
            type: 'oni',
            name: 'Ketsurui',
            role: 'Lua Inferior 2',
            image: 'assets/characters/onis/ketsurui.png',
            stats: { for: 9, agi: 9, int: 5, vit: 9 },
            desc: 'O "Demónio das Lágrimas de Sangue". Um predador formidável.',
            history: 'Perdeu a sua humanidade após ser abandonado no Deserto de Mangaun. Luta com foices ligadas por correntes.',
            abilities: ['Correntes Sanguinárias: Puxa o inimigo para perto.', 'Grito Aterrador: Drena a Sanidade (SAN) do caçador.']
        },
        {
            id: 'reiki',
            type: 'oni',
            name: 'Reiki',
            role: 'Lua Inferior 6',
            image: 'assets/characters/onis/reiki.png',
            stats: { for: 5, agi: 10, int: 8, vit: 6 },
            desc: 'Uma aparição espectral. O seu toque absorve a vitalidade.',
            history: 'Assombra a Costa de Youngi Norte. Atraí marinheiros para o mar usando neblina tóxica.',
            abilities: ['Toque Congelante: Reduz a AGI do inimigo.', 'Névoa Tóxica: Dano constante durante o combate.']
        },
        {
            id: 'shien',
            type: 'oni',
            name: 'Shien',
            role: 'Lua Superior 3',
            image: 'assets/characters/onis/shien.png',
            stats: { for: 10, agi: 10, int: 8, vit: 10 },
            desc: 'Uma lenda entre os caçadores. Apenas a visão dele causa terror.',
            history: 'Um mestre de artes marciais corrompido há séculos. Reside nas profundezas do Vale da Noite.',
            abilities: ['Destruição Absoluta: Dano crítico inevitável.', 'Esquiva Perfeita: Ignora o primeiro ataque do turno.']
        }
    ];

    // ------------------------------------------------------------
    // 2. ELEMENTOS DO DOM
    // ------------------------------------------------------------
    const tabs = document.querySelectorAll('.tab');
    const charactersGrid = document.getElementById('charactersGrid');
    
    // Modal
    const characterModal = document.getElementById('characterModal');
    const modalClose = document.getElementById('modalClose');
    const modalImage = document.getElementById('modalImage');
    const modalBadge = document.getElementById('modalBadge');
    const modalName = document.getElementById('modalName');
    const modalRole = document.getElementById('modalRole');
    const modalDescription = document.getElementById('modalDescription');
    const modalHistory = document.getElementById('modalHistory');
    const modalAbilities = document.getElementById('modalAbilities');

    // Estatísticas no Modal
    const statFor = document.getElementById('statFor');
    const statForValue = document.getElementById('statForValue');
    const statAgi = document.getElementById('statAgi');
    const statAgiValue = document.getElementById('statAgiValue');
    const statInt = document.getElementById('statInt');
    const statIntValue = document.getElementById('statIntValue');
    const statVit = document.getElementById('statVit');
    const statVitValue = document.getElementById('statVitValue');

    let currentFilter = 'hashira'; // Tipo inicial

    // ------------------------------------------------------------
    // 3. LÓGICA DE RENDERIZAÇÃO
    // ------------------------------------------------------------
    function renderGrid(filterType) {
        if (!charactersGrid) return;
        charactersGrid.innerHTML = '';

        const filtered = PERSONAGENS_DB.filter(c => c.type === filterType);

        filtered.forEach(char => {
            const card = document.createElement('div');
            // Adiciona classe extra se for Oni (para estilos visuais de borda e HP)
            card.className = `character-card ${char.type === 'oni' ? 'character-card--oni' : ''}`;
            card.setAttribute('tabindex', '0');

            // Calcula a % total aproximada de "HP visual" para o card (baseado na vitalidade)
            const hpPercent = (char.stats.vit / 10) * 100;

            card.innerHTML = `
                <div class="character-card__media">
                    <span class="badge character-card__type-badge ${char.type === 'hashira' ? 'badge-gold' : 'badge-violet'}">
                        ${char.type === 'hashira' ? 'Hashira' : 'Oni'}
                    </span>
                    <img src="${char.image}" alt="${char.name}" class="character-card__image" onerror="this.src='assets/images/personagem.png'">
                </div>
                <div class="character-card__body">
                    <h3 class="character-card__name">${char.name}</h3>
                    <span class="character-card__role">${char.role}</span>
                    
                    <div class="character-card__hp">
                        <span class="character-card__stat">HP</span>
                        <div class="character-card__hp-bar">
                            <div class="character-card__hp-fill" style="width: ${hpPercent}%;"></div>
                        </div>
                    </div>

                    <div class="character-card__stats">
                        <div class="character-card__stat">
                            <strong>FOR</strong> ${char.stats.for}
                        </div>
                        <div class="character-card__stat">
                            <strong>AGI</strong> ${char.stats.agi}
                        </div>
                    </div>
                </div>
            `;

            // Eventos para abrir o Modal
            card.addEventListener('click', () => openModal(char));
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') openModal(char);
            });

            charactersGrid.appendChild(card);
        });
    }

    // ------------------------------------------------------------
    // 4. LÓGICA DAS ABAS
    // ------------------------------------------------------------
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            // Remove ativa de todas
            tabs.forEach(t => t.classList.remove('active'));
            // Adiciona ativa na atual
            e.target.classList.add('active');
            
            // Atualiza grid
            currentFilter = e.target.getAttribute('data-tipo');
            renderGrid(currentFilter);
        });
    });

    // ------------------------------------------------------------
    // 5. LÓGICA DO MODAL DETALHADO
    // ------------------------------------------------------------
    function openModal(char) {
        if (!characterModal) return;

        // Preenche info básica
        if (modalImage) {
            modalImage.src = char.image;
            modalImage.onerror = () => modalImage.src = 'assets/images/personagem.png';
        }
        
        if (modalBadge) {
            modalBadge.textContent = char.type === 'hashira' ? 'Hashira' : 'Oni';
            modalBadge.className = `badge ${char.type === 'hashira' ? 'badge-gold' : 'badge-violet'}`;
        }

        if (modalName) modalName.textContent = char.name;
        if (modalRole) {
            modalRole.textContent = char.role;
            // Altera a cor do subtítulo no modal de acordo com o tipo
            modalRole.style.color = char.type === 'hashira' ? 'var(--accent-spirit)' : 'var(--accent-violet)';
        }

        if (modalDescription) modalDescription.textContent = char.desc;
        if (modalHistory) modalHistory.textContent = char.history;

        // Preenche Estatísticas (barras)
        updateStatBar(statFor, statForValue, char.stats.for);
        updateStatBar(statAgi, statAgiValue, char.stats.agi);
        updateStatBar(statInt, statIntValue, char.stats.int);
        updateStatBar(statVit, statVitValue, char.stats.vit);

        // Preenche Habilidades (lista)
        if (modalAbilities) {
            modalAbilities.innerHTML = '';
            char.abilities.forEach(ability => {
                const li = document.createElement('li');
                li.textContent = ability;
                modalAbilities.appendChild(li);
            });
        }

        // Abre o modal
        characterModal.classList.add('active');
        characterModal.setAttribute('aria-hidden', 'false');
    }

    function updateStatBar(barEl, valEl, value) {
        if (!barEl || !valEl) return;
        valEl.textContent = value;
        // Assume máximo de 10 para o bestiário
        const pct = Math.min((value / 10) * 100, 100);
        barEl.style.width = `${pct}%`;
    }

    function closeModal() {
        if (!characterModal) return;
        characterModal.classList.remove('active');
        characterModal.setAttribute('aria-hidden', 'true');
    }

    // Eventos do Modal
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (characterModal) {
        characterModal.addEventListener('click', (e) => {
            if (e.target === characterModal) closeModal();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && characterModal && characterModal.classList.contains('active')) {
            closeModal();
        }
    });

    // ------------------------------------------------------------
    // INICIALIZAÇÃO
    // ------------------------------------------------------------
    renderGrid(currentFilter);
});