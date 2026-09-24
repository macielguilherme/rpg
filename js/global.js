// ============================================================
// ARQUIVO: js/global.js
// Descrição: Funções globais, gerenciamento de estado (localStorage)
// e utilitários de interface (toasts, modais).
// ============================================================

const CacadorRPG = {
    // Chave de salvamento no navegador
    STORAGE_KEY: 'cacador_save_data',

    // Carrega os dados do jogador
    loadData: function() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : null;
    },

    // Salva os dados do jogador
    saveData: function(data) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    },

    // Apaga o save (morte ou reset)
    clearData: function() {
        localStorage.removeItem(this.STORAGE_KEY);
    },

    // Exibe notificação na tela (Toast)
    showToast: function(message, duration = 3000) {
        const toast = document.getElementById('toast');
        if (!toast) return;

        const textEl = toast.querySelector('.toast-text');
        if (textEl) textEl.textContent = message;

        toast.hidden = false;
        
        // Pequeno delay para garantir que o display block foi aplicado antes da animação
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        // Esconde após o tempo determinado
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => { 
                toast.hidden = true; 
            }, 160); // tempo de animação em steps()
        }, duration);
    },

    // Inicializa comportamentos globais
    init: function() {
        this.setupModals();
    },

    // Configura o fechamento global de modais (botão ✕)
    setupModals: function() {
        const closeButtons = document.querySelectorAll('.modal-close');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal-overlay');
                if (modal) {
                    modal.setAttribute('aria-hidden', 'true');
                    modal.classList.remove('active');
                }
            });
        });
    }
};

// Inicializa scripts globais assim que o DOM carregar
document.addEventListener('DOMContentLoaded', () => {
    CacadorRPG.init();
});