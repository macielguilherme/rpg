// ============================================================
// ARQUIVO: data/cenas.js
// Descrição: Banco de dados de cenas, diálogos e escolhas do jogo.
// ============================================================

window.CENAS_DATA = {
    'inicio': {
        location: 'Floresta do Silêncio',
        text: 'A humidade da floresta pesa sobre os teus ombros. O silêncio é absoluto, quebrado apenas pelo som das tuas próprias botas na lama. Sentes que algo te observa por entre as árvores antigas.',
        choices: [
            { text: 'Avançar com a mão na espada', target: 'combate_1' },
            { text: 'Procurar um caminho mais seguro', target: 'caminho_oculto' }
        ]
    },
    'combate_1': {
        location: 'Clareira Sombria',
        text: 'Mal dás o primeiro passo, uma figura distorcida salta dos galhos acima. Os olhos amarelos do Oni brilham na escuridão enquanto ele avança na tua direção.',
        choices: [
            { text: 'Usar a tua Respiração e atacar', target: 'vitoria' },
            { text: 'Esquivar para trás', target: 'inicio' }
        ]
    },
    'caminho_oculto': {
        location: 'Trilha Esquecida',
        text: 'Desvias-te da rota principal e encontras uma velha estátua de pedra coberta de musgo. Aos pés da estátua, descansas um pouco, recuperando a tua Sanidade.',
        healSan: 10,
        choices: [
            { text: 'Retornar ao caminho principal', target: 'inicio' }
        ]
    },
    'vitoria': {
        location: 'Clareira Ensanguentada',
        text: 'A tua lâmina corta o ar com precisão. A cabeça do Oni rola pelo chão e o seu corpo desfaz-se em cinzas. A noite volta a ficar silenciosa.',
        addXp: 50,
        choices: [
            { text: 'Continuar a patrulha', target: 'inicio' }
        ]
    }
};