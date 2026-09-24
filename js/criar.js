// ============================================================
// ARQUIVO: js/criar.js
// Descrição: Lógica do Wizard de Criação de Personagem (5 Etapas).
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    // ------------------------------------------------------------
    // 1. BASES DE DADOS LOCAIS (Fallback caso os scripts de data não carreguem)
    // ------------------------------------------------------------
    const ATRIBUTOS_BASE = window.ATRIBUTOS_DATA || [
        { id: 'for', name: 'Força', abbr: 'FOR', desc: 'Aumenta o dano do seu ataque.' },
        { id: 'agi', name: 'Agilidade', abbr: 'AGI', desc: 'Melhora sua esquiva e iniciativa.' },
        { id: 'int', name: 'Inteligência', abbr: 'INT', desc: 'Aumenta o controle e recuperação de SAN.' },
        { id: 'vit', name: 'Vitalidade', abbr: 'VIT', desc: 'Define os seus Pontos de Vida (HP).' },
        { id: 'res', name: 'Resistência', abbr: 'RES', desc: 'Reduz o dano sofrido em combate.' },
        { id: 'sor', name: 'Sorte', abbr: 'SOR', desc: 'Aumenta as hipóteses de ataque crítico.' }
    ];

    const RESPIRACOES_BASE = window.RESPIRACOES_DATA || [
        { id: 'vacuo', name: 'Respiração do Vácuo', desc: 'Técnica secreta. Manipula pressão e ausência de ar.', icon: '⚆', bonusAtk: 6, bonusDef: 0 },
        { id: 'agua', name: 'Respiração da Água', desc: 'Adaptável e fluida. Foco em defesa e equilíbrio.', icon: '❖', bonusAtk: 2, bonusDef: 4 },
        { id: 'chama', name: 'Respiração da Chama', desc: 'Agressiva e devastadora. Foco em dano maciço.', icon: '✦', bonusAtk: 5, bonusDef: 1 },
        { id: 'trovao', name: 'Respiração do Trovão', desc: 'Velocidade extrema. Foco em esquiva e crítico.', icon: 'ϟ', bonusAtk: 4, bonusDef: 2 }
    ];

    const EQUIPAMENTOS_BASE = window.EQUIPAMENTOS_DATA || [
        { id: 'equilibrado', name: 'Conjunto do Caçador', desc: 'Katana Nichirin padrão e uniforme de caçador.', icon: '⚔', arma: 'Katana Nichirin', armadura: 'Uniforme de Caçador' },
        { id: 'pesado', name: 'Conjunto do Guardião', desc: 'Lâmina pesada e armadura reforçada.', icon: '◈', arma: 'Nichirin Pesada', armadura: 'Armadura de Placas' },
        { id: 'leve', name: 'Conjunto do Agente', desc: 'Lâminas gémeas curtas e vestes leves.', icon: '◆', arma: 'Lâminas Duplas', armadura: 'Traje de Sombras' }
    ];

    // ------------------------------------------------------------
    // 2. ESTADO INICIAL DA FICHA
    // ------------------------------------------------------------
    const TOTAL_POINTS = 30;
    const MIN_ATTR = 3;
    const MAX_ATTR = 10;

    let currentStep = 1;

    let character = {
        name: '',
        age: 16,
        gender: 'm',
        origin: 'vila',
        attributes: {
            for: 3,
            agi: 3,
            int: 3,
            vit: 3,
            res: 3,
            sor: 3
        },
        breathing: 'vacuo',
        equipment: 'equilibrado'
    };

    // ------------------------------------------------------------
    // 3. ELEMENTOS DO DOM
    // ------------------------------------------------------------
    const stepperItems = document.querySelectorAll('.stepper-item');
    const stepPanels = document.querySelectorAll('.step-panel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const confirmBtn = document.getElementById('confirmBtn');

    const charNameInput = document.getElementById('charName');
    const charAgeInput = document.getElementById('charAge');
    const charGenderSelect = document.getElementById('charGender');
    const charBackgroundSelect = document.getElementById('charBackground');

    const attributesEditor = document.getElementById('attributesEditor');
    const pointsRemainingEl = document.getElementById('pointsRemaining');
    const pointsCounterEl = document.getElementById('pointsCounter');

    const previewHp = document.getElementById('previewHp');
    const previewSan = document.getElementById('previewSan');
    const previewAtk = document.getElementById('previewAtk');
    const previewDef = document.getElementById('previewDef');

    const breathingSelect = document.getElementById('breathingSelect');
    const equipmentSelect = document.getElementById('equipmentSelect');

    const summaryContainer = document.getElementById('summary');

    const previewName = document.getElementById('previewName');
    const previewRole = document.getElementById('previewRole');
    const sidebarHp = document.getElementById('sidebarHp');
    const sidebarSan = document.getElementById('sidebarSan');

    // ------------------------------------------------------------
    // 4. LÓGICA DO STEPPER (NAVEGAÇÃO)
    // ------------------------------------------------------------
    function updateStep(step) {
        currentStep = step;

        stepperItems.forEach(item => {
            const itemStep = parseInt(item.getAttribute('data-step'), 10);
            item.classList.remove('active', 'done');
            if (itemStep === currentStep) {
                item.classList.add('active');
            } else if (itemStep < currentStep) {
                item.classList.add('done');
            }
        });

        stepPanels.forEach(panel => {
            const panelStep = parseInt(panel.getAttribute('data-panel'), 10);
            if (panelStep === currentStep) {
                panel.classList.add('active');
            } else {
                panel.classList.remove('active');
            }
        });

        if (prevBtn) prevBtn.disabled = (currentStep === 1);

        if (currentStep === 5) {
            if (nextBtn) nextBtn.hidden = true;
            if (confirmBtn) confirmBtn.hidden = false;
            renderSummary();
        } else {
            if (nextBtn) nextBtn.hidden = false;
            if (confirmBtn) confirmBtn.hidden = true;
        }

        updateSidebarPreview();
    }

    function validateStep(step) {
        if (step === 1) {
            const name = charNameInput ? charNameInput.value.trim() : '';
            if (name.length < 3 || name.length > 24) {
                if (typeof CacadorRPG !== 'undefined') {
                    CacadorRPG.showToast('O nome deve ter entre 3 e 24 caracteres!');
                }
                if (charNameInput) charNameInput.focus();
                return false;
            }
            character.name = name;
            character.age = parseInt(charAgeInput.value, 10) || 16;
            character.gender = charGenderSelect.value;
            character.origin = charBackgroundSelect.value;
        } else if (step === 2) {
            const remaining = getRemainingPoints();
            if (remaining > 0) {
                if (typeof CacadorRPG !== 'undefined') {
                    CacadorRPG.showToast(`Ainda tem ${remaining} ponto(s) para distribuir!`);
                }
                return false;
            }
        }
        return true;
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                if (currentStep < 5) updateStep(currentStep + 1);
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentStep > 1) updateStep(currentStep - 1);
        });
    }

    // ------------------------------------------------------------
    // 5. ETAPA 2: EDITOR DE ATRIBUTOS
    // ------------------------------------------------------------
    function getUsedPoints() {
        return Object.values(character.attributes).reduce((a, b) => a + b, 0);
    }

    function getRemainingPoints() {
        return TOTAL_POINTS - getUsedPoints();
    }

    function calculateStats() {
        const { for: f, agi: a, int: i, vit: v, res: r } = character.attributes;

        const breathObj = RESPIRACOES_BASE.find(b => b.id === character.breathing) || {};
        const bAtk = breathObj.bonusAtk || 0;
        const bDef = breathObj.bonusDef || 0;

        const maxHp = v * 20 + 50;
        const maxSan = i * 10 + 40;
        const atk = f * 3 + a * 2 + bAtk;
        const def = r * 2 + Math.floor(v * 1.5) + bDef;

        return { maxHp, maxSan, atk, def };
    }

    function renderAttributesEditor() {
        if (!attributesEditor) return;
        attributesEditor.innerHTML = '';

        ATRIBUTOS_BASE.forEach(attr => {
            const val = character.attributes[attr.id];
            const row = document.createElement('div');
            row.className = 'attribute-editor-row';

            row.innerHTML = `
                <div class="attribute-editor-row__label">
                    <span class="attribute-editor-row__abbr">${attr.abbr}</span>
                    <span class="attribute-editor-row__name">${attr.name}</span>
                </div>
                <div class="attribute-editor-row__bar">
                    <div class="attribute-editor-row__fill" style="width: ${(val / MAX_ATTR) * 100}%"></div>
                </div>
                <div class="attribute-editor-row__controls">
                    <button type="button" class="attr-btn btn-minus" data-id="${attr.id}">-</button>
                    <span class="attribute-editor-row__value">${val}</span>
                    <button type="button" class="attr-btn btn-plus" data-id="${attr.id}">+</button>
                </div>
            `;

            attributesEditor.appendChild(row);
        });

        updateAttributesUI();
    }

    function updateAttributesUI() {
        const remaining = getRemainingPoints();

        if (pointsRemainingEl) pointsRemainingEl.textContent = remaining;

        if (pointsCounterEl) {
            pointsCounterEl.classList.remove('is-zero', 'is-over');
            if (remaining === 0) pointsCounterEl.classList.add('is-zero');
            else if (remaining < 0) pointsCounterEl.classList.add('is-over');
        }

        const rows = attributesEditor.querySelectorAll('.attribute-editor-row');
        rows.forEach(row => {
            const minusBtn = row.querySelector('.btn-minus');
            const plusBtn = row.querySelector('.btn-plus');
            const attrId = minusBtn.getAttribute('data-id');
            const currentVal = character.attributes[attrId];

            minusBtn.disabled = (currentVal <= MIN_ATTR);
            plusBtn.disabled = (currentVal >= MAX_ATTR || remaining <= 0);
        });

        const stats = calculateStats();
        if (previewHp) previewHp.textContent = `${stats.maxHp} HP`;
        if (previewSan) previewSan.textContent = `${stats.maxSan} SAN`;
        if (previewAtk) previewAtk.textContent = stats.atk;
        if (previewDef) previewDef.textContent = stats.def;

        updateSidebarPreview();
    }

    if (attributesEditor) {
        attributesEditor.addEventListener('click', (e) => {
            const btn = e.target.closest('.attr-btn');
            if (!btn) return;

            const attrId = btn.getAttribute('data-id');
            const isPlus = btn.classList.contains('btn-plus');

            if (isPlus) {
                if (getRemainingPoints() > 0 && character.attributes[attrId] < MAX_ATTR) {
                    character.attributes[attrId]++;
                }
            } else {
                if (character.attributes[attrId] > MIN_ATTR) {
                    character.attributes[attrId]--;
                }
            }

            renderAttributesEditor();
        });
    }

    // ------------------------------------------------------------
    // 6. ETAPA 3 & 4: CARDS DE SELEÇÃO
    // ------------------------------------------------------------
    function renderBreathingCards() {
        if (!breathingSelect) return;
        breathingSelect.innerHTML = '';

        RESPIRACOES_BASE.forEach(resp => {
            const card = document.createElement('div');
            card.className = `select-card ${character.breathing === resp.id ? 'selected' : ''}`;
            card.setAttribute('data-id', resp.id);

            card.innerHTML = `
                <span class="select-card__icon">${resp.icon}</span>
                <span class="select-card__name">${resp.name}</span>
                <p class="select-card__desc">${resp.desc}</p>
                <div class="select-card__bonus">
                    <span class="badge badge-blood">+${resp.bonusAtk} ATK</span>
                    <span class="badge badge-spirit">+${resp.bonusDef} DEF</span>
                </div>
            `;

            card.addEventListener('click', () => {
                character.breathing = resp.id;
                renderBreathingCards();
                updateAttributesUI();
            });

            breathingSelect.appendChild(card);
        });
    }

    function renderEquipmentCards() {
        if (!equipmentSelect) return;
        equipmentSelect.innerHTML = '';

        EQUIPAMENTOS_BASE.forEach(eq => {
            const card = document.createElement('div');
            card.className = `select-card ${character.equipment === eq.id ? 'selected' : ''}`;
            card.setAttribute('data-id', eq.id);

            card.innerHTML = `
                <span class="select-card__icon">${eq.icon}</span>
                <span class="select-card__name">${eq.name}</span>
                <p class="select-card__desc">${eq.desc}</p>
            `;

            card.addEventListener('click', () => {
                character.equipment = eq.id;
                renderEquipmentCards();
            });

            equipmentSelect.appendChild(card);
        });
    }

    // ------------------------------------------------------------
    // 7. ETAPA 5: RESUMO E CONFIRMAÇÃO
    // ------------------------------------------------------------
    function renderSummary() {
        if (!summaryContainer) return;

        const stats = calculateStats();
        const breathObj = RESPIRACOES_BASE.find(b => b.id === character.breathing) || {};
        const equipObj = EQUIPAMENTOS_BASE.find(e => e.id === character.equipment) || {};

        summaryContainer.innerHTML = `
            <div class="summary-block">
                <h3 class="summary-block__title">Identidade</h3>
                <div class="summary-row"><span class="summary-row__label">Nome:</span><span class="summary-row__value">${character.name}</span></div>
                <div class="summary-row"><span class="summary-row__label">Idade:</span><span class="summary-row__value">${character.age} anos</span></div>
                <div class="summary-row"><span class="summary-row__label">Origem:</span><span class="summary-row__value">${character.origin.toUpperCase()}</span></div>
            </div>

            <div class="summary-block">
                <h3 class="summary-block__title">Estilo & Equipamento</h3>
                <div class="summary-row"><span class="summary-row__label">Respiração:</span><span class="summary-row__value">${breathObj.name || character.breathing}</span></div>
                <div class="summary-row"><span class="summary-row__label">Arma Inicial:</span><span class="summary-row__value">${equipObj.arma || '—'}</span></div>
                <div class="summary-row"><span class="summary-row__label">Traje Inicial:</span><span class="summary-row__value">${equipObj.armadura || '—'}</span></div>
            </div>

            <div class="summary-block">
                <h3 class="summary-block__title">Estatísticas Finais</h3>
                <div class="summary-row"><span class="summary-row__label">HP Max:</span><span class="summary-row__value">${stats.maxHp}</span></div>
                <div class="summary-row"><span class="summary-row__label">SAN Max:</span><span class="summary-row__value">${stats.maxSan}</span></div>
                <div class="summary-row"><span class="summary-row__label">Ataque:</span><span class="summary-row__value">${stats.atk}</span></div>
                <div class="summary-row"><span class="summary-row__label">Defesa:</span><span class="summary-row__value">${stats.def}</span></div>
            </div>
        `;
    }

    // ------------------------------------------------------------
    // 8. SIDEBAR PREVIEW EM TEMPO REAL
    // ------------------------------------------------------------
    function updateSidebarPreview() {
        if (previewName) previewName.textContent = character.name || '— Sem nome —';

        const breathObj = RESPIRACOES_BASE.find(b => b.id === character.breathing);
        if (previewRole) previewRole.textContent = breathObj ? breathObj.name : '— sem respiração —';

        const stats = calculateStats();
        if (sidebarHp) sidebarHp.textContent = `${stats.maxHp} / ${stats.maxHp}`;
        if (sidebarSan) sidebarSan.textContent = `${stats.maxSan} / ${stats.maxSan}`;
    }

    if (charNameInput) {
        charNameInput.addEventListener('input', (e) => {
            character.name = e.target.value.trim();
            updateSidebarPreview();
        });
    }

    // ------------------------------------------------------------
    // 9. FINALIZAR E SALVAR FICHA
    // ------------------------------------------------------------
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            const stats = calculateStats();
            const equipObj = EQUIPAMENTOS_BASE.find(e => e.id === character.equipment) || {};

            const saveData = {
                name: character.name,
                age: character.age,
                gender: character.gender,
                origin: character.origin,
                breathing: character.breathing,
                level: 1,
                xp: 0,
                xpNext: 100,
                hp: stats.maxHp,
                maxHp: stats.maxHp,
                san: stats.maxSan,
                maxSan: stats.maxSan,
                coins: 50,
                atk: stats.atk,
                def: stats.def,
                crit: 5 + Math.floor(character.attributes.sor * 0.5),
                dodge: 5 + Math.floor(character.attributes.agi * 0.5),
                kills: 0,
                chapters: 0,
                attributes: { ...character.attributes },
                equipment: {
                    weapon: equipObj.arma || 'Katana Nichirin',
                    armor: equipObj.armadura || 'Uniforme de Caçador',
                    amulet: 'Nenhum',
                    items: ['Poção de Cura (1)']
                },
                history: ['Sobreviveu à destruição de sua vila e iniciou o treinamento.']
            };

            if (typeof CacadorRPG !== 'undefined') {
                CacadorRPG.saveData(saveData);
                CacadorRPG.showToast('Ficha criada com sucesso! Iniciando jornada...');
            }

            setTimeout(() => {
                window.location.href = 'ficha.html';
            }, 1200);
        });
    }

    // ------------------------------------------------------------
    // INICIALIZAÇÃO DO WIZARD
    // ------------------------------------------------------------
    renderAttributesEditor();
    renderBreathingCards();
    renderEquipmentCards();
    updateStep(1);
});