// ============================================================
// ARQUIVO: js/ficha.js
// Descrição: Lógica da Ficha de Personagem (carregamento de dados, 
// navegação por abas e exclusão de save).
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    // ------------------------------------------------------------
    // 1. VERIFICAÇÃO DE DADOS (SAVE)
    // ------------------------------------------------------------
    let character = null;

    if (typeof CacadorRPG !== 'undefined') {
        character = CacadorRPG.loadData();
    }

    const emptyState = document.getElementById('emptyState');
    const sheetContainer = document.getElementById('sheet');

    if (!character) {
        // Sem ficha criada, mostra o empty state
        if (emptyState) emptyState.hidden = false;
        if (sheetContainer) sheetContainer.hidden = true;
        return; // Interrompe a execução do resto do script
    }

    // Com ficha criada, mostra a interface
    if (emptyState) emptyState.hidden = true;
    if (sheetContainer) sheetContainer.hidden = false;

    // ------------------------------------------------------------
    // 2. PREENCHIMENTO DA IDENTIDADE E VITAIS
    // ------------------------------------------------------------
    
    // Textos base
    setText('sheetName', character.name);
    setText('sheetLevel', `LV. ${character.level}`);
    setText('sheetClass', `Caçador — Respiração: ${formatName(character.breathing)}`);
    setText('sheetAge', `${character.age} ANOS`);
    setText('sheetOrigin', formatName(character.origin));
    setText('sheetBreath', formatName(character.breathing));
    
    // XP
    const xpPercent = Math.min((character.xp / character.xpNext) * 100, 100);
    setText('sheetXpValue', `${character.xp} / ${character.xpNext}`);
    setWidth('sheetXpFill', `${xpPercent}%`);

    // HP & SAN & Moedas
    const hpPercent = Math.max((character.hp / character.maxHp) * 100, 0);
    setText('sheetHpValue', `${character.hp} / ${character.maxHp}`);
    setWidth('sheetHpFill', `${hpPercent}%`);

    const sanPercent = Math.max((character.san / character.maxSan) * 100, 0);
    setText('sheetSanValue', `${character.san} / ${character.maxSan}`);
    setWidth('sheetSanFill', `${sanPercent}%`);

    setText('sheetCoins', character.coins || 0);

    // ------------------------------------------------------------
    // 3. PREENCHIMENTO DA ABA STATUS
    // ------------------------------------------------------------
    setText('statAtk', character.atk);
    setText('statDef', character.def);
    setText('statCrit', `${character.crit}%`);
    setText('statDodge', `${character.dodge}%`);
    
    setText('statLevel', character.level);
    setText('statXpTotal', character.xp);
    setText('statKills', character.kills || 0);
    setText('statChapters', `${character.chapters || 0} / 4`);

    // ------------------------------------------------------------
    // 4. PREENCHIMENTO DA ABA ATRIBUTOS
    // ------------------------------------------------------------
    const attributesList = document.getElementById('attributesList');
    if (attributesList && character.attributes) {
        const attrMap = [
            { id: 'for', name: 'Força', abbr: 'FOR' },
            { id: 'agi', name: 'Agilidade', abbr: 'AGI' },
            { id: 'int', name: 'Inteligência', abbr: 'INT' },
            { id: 'vit', name: 'Vitalidade', abbr: 'VIT' },
            { id: 'res', name: 'Resistência', abbr: 'RES' },
            { id: 'sor', name: 'Sorte', abbr: 'SOR' }
        ];

        attributesList.innerHTML = '';
        attrMap.forEach(attr => {
            const val = character.attributes[attr.id] || 0;
            const pct = Math.min((val / 10) * 100, 100); // 10 é o máximo por atributo
            
            const row = document.createElement('div');
            row.className = 'attribute-row';
            row.innerHTML = `
                <div class="attribute-row__head">
                    <div>
                        <span class="attribute-row__abbr">${attr.abbr}</span>
                        <span class="attribute-row__name">${attr.name}</span>
                    </div>
                    <span class="attribute-row__value">${val}</span>
                </div>
                <div class="attribute-row__bar">
                    <div class="attribute-row__fill" style="width: ${pct}%"></div>
                </div>
            `;
            attributesList.appendChild(row);
        });
    }

    // ------------------------------------------------------------
    // 5. PREENCHIMENTO DA ABA EQUIPAMENTOS
    // ------------------------------------------------------------
    if (character.equipment) {
        setText('equipNameWeapon', character.equipment.weapon || 'Desarmado');
        setText('equipNameArmor', character.equipment.armor || 'Roupas Comuns');
        setText('equipNameAmulet', character.equipment.amulet || 'Nenhum');
        
        // Itens consumíveis (slots genéricos)
        const items = character.equipment.items || [];
        setText('equipNameItem1', items[0] || 'Vazio');
        setText('equipNameItem2', items[1] || 'Vazio');
        setText('equipNameItem3', items[2] || 'Vazio');
    }

    // ------------------------------------------------------------
    // 6. PREENCHIMENTO DA ABA HISTÓRICO
    // ------------------------------------------------------------
    const chaptersList = document.getElementById('chaptersList');
    if (chaptersList) {
        chaptersList.innerHTML = '';
        const historyLogs = character.history || [];
        
        if (historyLogs.length === 0) {
            chaptersList.innerHTML = '<p class="panel-desc">A sua jornada ainda não começou.</p>';
        } else {
            historyLogs.forEach((log, index) => {
                const item = document.createElement('div');
                item.className = 'chapter-list-item';
                item.innerHTML = `
                    <span class="chapter-list-item__num">0${index + 1}</span>
                    <div class="chapter-list-item__body">
                        <h4 class="chapter-list-item__title">${log}</h4>
                        <span class="chapter-list-item__date">Registro do Caçador</span>
                    </div>
                `;
                chaptersList.appendChild(item);
            });
        }
    }

    // ------------------------------------------------------------
    // 7. SISTEMA DE NAVEGAÇÃO DE ABAS
    // ------------------------------------------------------------
    const tabs = document.querySelectorAll('.sheet__tab');
    const panels = document.querySelectorAll('.sheet__panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active de todas as abas e painéis
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));

            // Adiciona active na aba clicada
            tab.classList.add('active');
            
            // Adiciona active no painel correspondente
            const panelId = tab.getAttribute('data-panel');
            const panel = document.getElementById(panelId);
            if (panel) panel.classList.add('active');
        });
    });

    // ------------------------------------------------------------
    // 8. APAGAR FICHA (MODAL)
    // ------------------------------------------------------------
    const deleteBtn = document.getElementById('deleteSheetBtn');
    const confirmModal = document.getElementById('confirmModal');
    const cancelDeleteBtn = document.getElementById('cancelDelete');
    const confirmDeleteBtn = document.getElementById('confirmDelete');

    if (deleteBtn && confirmModal) {
        deleteBtn.addEventListener('click', () => {
            confirmModal.classList.add('active');
            confirmModal.setAttribute('aria-hidden', 'false');
        });
    }

    if (cancelDeleteBtn && confirmModal) {
        cancelDeleteBtn.addEventListener('click', () => {
            confirmModal.classList.remove('active');
            confirmModal.setAttribute('aria-hidden', 'true');
        });
    }

    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', () => {
            if (typeof CacadorRPG !== 'undefined') {
                CacadorRPG.clearData();
                CacadorRPG.showToast('A ficha foi apagada nas chamas.', 2000);
            }
            
            // Esconde modal e recarrega a página para mostrar empty state
            if (confirmModal) confirmModal.classList.remove('active');
            
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        });
    }

    // ------------------------------------------------------------
    // FUNÇÕES AUXILIARES
    // ------------------------------------------------------------
    function setText(id, text) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    }

    function setWidth(id, width) {
        const el = document.getElementById(id);
        if (el) el.style.width = width;
    }

    function formatName(str) {
        if (!str) return '—';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
});