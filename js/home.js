// ============================================================
// ARQUIVO: js/home.js
// Descrição: Lógica da Tela de Título, navegação do menu e login.
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    // Referências dos elementos DOM
    const menuItems = document.querySelectorAll('.title-menu-item');
    const loginOverlay = document.getElementById('loginOverlay');
    const loginCloseBtn = document.getElementById('loginClose');
    const loginForm = document.getElementById('loginForm');
    const entrarBtn = document.querySelector('[data-action="entrar"]');

    let activeIndex = 0;

    // ------------------------------------------------------------
    // 1. NAVEGAÇÃO DO MENU (Mouse & Teclado)
    // ------------------------------------------------------------

    // Atualiza a seleção visual do cursor no menu
    function setActiveItem(index) {
        menuItems.forEach((item, i) => {
            if (i === index) {
                item.classList.add('active');
                item.focus();
            } else {
                item.classList.remove('active');
            }
        });
        activeIndex = index;
    }

    // Hover via mouse
    menuItems.forEach((item, index) => {
        item.addEventListener('mouseenter', () => {
            setActiveItem(index);
        });

        item.addEventListener('click', (e) => {
            const action = item.getAttribute('data-action');
            if (action === 'entrar') {
                e.preventDefault();
                openLoginModal();
            }
        });
    });

    // Navegação via Setas do Teclado (Up/Down) e Enter
    document.addEventListener('keydown', (e) => {
        // Se o modal de login estiver aberto, ignora atalhos da home
        if (loginOverlay && loginOverlay.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeLoginModal();
            }
            return;
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const next = (activeIndex + 1) % menuItems.length;
            setActiveItem(next);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prev = (activeIndex - 1 + menuItems.length) % menuItems.length;
            setActiveItem(prev);
        } else if (e.key === 'Enter') {
            const activeItem = menuItems[activeIndex];
            if (activeItem) {
                const action = activeItem.getAttribute('data-action');
                if (action === 'entrar') {
                    e.preventDefault();
                    openLoginModal();
                }
            }
        }
    });

    // ------------------------------------------------------------
    // 2. CONTROLE DO MODAL DE LOGIN
    // ------------------------------------------------------------

    function openLoginModal() {
        if (!loginOverlay) return;
        loginOverlay.classList.add('active');
        loginOverlay.setAttribute('aria-hidden', 'false');
        
        // Foco automático no primeiro input
        const emailInput = document.getElementById('email');
        if (emailInput) setTimeout(() => emailInput.focus(), 100);
    }

    function closeLoginModal() {
        if (!loginOverlay) return;
        loginOverlay.classList.remove('active');
        loginOverlay.setAttribute('aria-hidden', 'true');
    }

    if (entrarBtn) {
        entrarBtn.addEventListener('click', openLoginModal);
    }

    if (loginCloseBtn) {
        loginCloseBtn.addEventListener('click', closeLoginModal);
    }

    // Fechar ao clicar no backdrop (fora da caixa)
    if (loginOverlay) {
        loginOverlay.addEventListener('click', (e) => {
            if (e.target === loginOverlay) {
                closeLoginModal();
            }
        });
    }

    // Submissão do Formulário de Login
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value.trim();
            const senha = document.getElementById('senha').value.trim();

            if (!email || !senha) {
                if (typeof CacadorRPG !== 'undefined') {
                    CacadorRPG.showToast('Preencha todos os campos!');
                }
                return;
            }

            // Simulação de login efetuado com sucesso
            if (typeof CacadorRPG !== 'undefined') {
                CacadorRPG.showToast(`Bem-vindo de volta, ${email}!`);
            }

            closeLoginModal();

            // Redireciona para o jogo após o feedback
            setTimeout(() => {
                window.location.href = 'jogar.html';
            }, 1000);
        });
    }

    // Inicializa focando no primeiro item do menu
    if (menuItems.length > 0) {
        setActiveItem(0);
    }
});