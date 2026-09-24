// ============================================================
// ARQUIVO: data/personagens.js
// Descrição: Base de dados do Bestiário (Hashiras e Onis).
// ============================================================

window.PERSONAGENS_DATA = [
    // HASHIRAS
    {
        id: 'ayaka',
        type: 'hashira',
        name: 'Ayaka Kurenai',
        role: 'Hashira da Névoa Carmesim',
        image: 'assets/characters/hashiras/ayaka-kurenai.png',
        stats: { for: 8, agi: 9, int: 6, vit: 7 },
        desc: 'Silenciosa e reservada, usa o próprio sangue para endurecer a sua Nodachi.',
        history: 'Sobrevivente de um massacre na sua vila. Jurou não descansar até erradicar a ameaça noturna.',
        abilities: ['Gotas Escarlates: Projeta estilhaços de sangue afiados.', 'Sepultura Carmesim: Prisão líquida letal.']
    },
    {
        id: 'itsuo',
        type: 'hashira',
        name: 'Itsuo Hoshikage',
        role: 'Hashira do Som Noturno',
        image: 'assets/characters/hashiras/itsuo-hoshikage.png',
        stats: { for: 6, agi: 10, int: 7, vit: 6 },
        desc: 'Excêntrico e rápido. Os seus cortes espelham a abóbada celeste.',
        history: 'Luta com naginatas duplas, deixando um rasto ofuscante que imita o desenho das constelações.',
        abilities: ['Cintilação: Ataque ilusório desorientador.', 'Via Láctea: Cortes espirais num redemoinho estelar.']
    },
    {
        id: 'daigo',
        type: 'hashira',
        name: 'Daigo Saburou',
        role: 'Hashira da Areia',
        image: 'assets/characters/hashiras/daigo-saburou.png',
        stats: { for: 10, agi: 4, int: 5, vit: 10 },
        desc: 'Um antigo monge imperturbável que esmaga os oponentes com a sua kusarigama.',
        history: 'Utiliza os destroços do campo de batalha a seu favor, criando tempestades de areia impenetráveis.',
        abilities: ['Punho das Rochas: Compressão de areia num impacto sólido.', 'Areia do Esquecimento: Transforma o solo em areia movediça.']
    },
    {
        id: 'yuki',
        type: 'hashira',
        name: 'Yuki Aramaki',
        role: 'Hashira do Gelo',
        image: 'assets/characters/hashiras/yuki-aramaki.png',
        stats: { for: 6, agi: 8, int: 9, vit: 5 },
        desc: 'Fria, pragmática e letal. A sua lâmina congela instantaneamente a ferida.',
        history: 'Mantém o controlo absoluto sob pressão extrema, não demonstrando qualquer emoção no combate.',
        abilities: ['Lâmina Congelante: Retarda alvos com cristais de gelo.', 'Tempestade Ártica: Investida brutal e devastadora.']
    },
    {
        id: 'rikuya',
        type: 'hashira',
        name: 'Rikuya Arashi',
        role: 'Hashira do Raio Crescente',
        image: 'assets/characters/hashiras/rikuya-arashi.png',
        stats: { for: 9, agi: 8, int: 5, vit: 7 },
        desc: 'Competitivo e impetuoso. Luta com tonfas duplas tempestuosas.',
        history: 'Obcecado pela velocidade, fundiu o estilo do vento e do trovão num caos destrutivo inigualável.',
        abilities: ['Vento Trovejante: Corte rápido acompanhado de um estrondo.', 'Fúria Celestial: União da pressão do vento com o trovão.']
    },
    {
        id: 'minato',
        type: 'hashira',
        name: 'Minato Seiryu',
        role: 'Hashira da Água Abissal',
        image: 'assets/characters/hashiras/minato-seiryu.png',
        stats: { for: 7, agi: 8, int: 7, vit: 8 },
        desc: 'Equilibrado e compassivo. Como um irmão mais velho para a corporação.',
        history: 'Domina uma lança-espada longa (Nagamaki), executando movimentos fluidos mas com um peso esmagador.',
        abilities: ['Gota Serena: Um corte quase impercetível.', 'Abismo Azul: Vórtice que prende e dilacera nas profundezas.']
    },
    {
        id: 'enma',
        type: 'hashira',
        name: 'Enma Taketsu',
        role: 'Hashira da Cinza',
        image: 'assets/characters/hashiras/enma-taketsu.png',
        stats: { for: 7, agi: 7, int: 8, vit: 7 },
        desc: 'O prenúncio do fim. Luta com duas espadas ligadas por correntes.',
        history: 'Soturno e fúnebre, aparece após as tragédias. Acredita que a destruição serve de adubo à nova esperança.',
        abilities: ['Pulmões Queimados: Cinza fina que asfixia o alvo.', 'Renascimento de Enma: Erupção cataclísmica de brasas.']
    },

    // VILÃO CENTRAL
    {
        id: 'kuro',
        type: 'oni',
        name: 'Shourai no Kuro',
        role: 'O Futuro Negro',
        image: 'assets/characters/onis/shourai-kuro.png',
        stats: { for: 10, agi: 10, int: 10, vit: 10 },
        desc: 'Ex-Hashira com pele marcada por cristais abissais e pupilas que giram como engrenagens.',
        history: 'Consumido pelo Fragmento do Abismo, controla o próprio tecido do tempo. Tenta recrutar caçadores para aprisionar o mundo num presente eterno.',
        abilities: ['Redemoinho das Horas: Força o envelhecimento biológico rápido.', 'Colapso da Linha Temporal: Apaga a existência do alvo.']
    },

    // LUAS INFERIORES
    {
        id: 'ketsurui',
        type: 'oni',
        name: 'Ketsurui',
        role: 'Lua Inferior 1',
        image: 'assets/characters/onis/ketsurui.png',
        stats: { for: 9, agi: 9, int: 5, vit: 9 },
        desc: 'Demónio do Arrependimento. Manipula miasmas com odor a pêssego.',
        history: 'Nobre moribundo que aceitou o sangue negro. Luta com foices ligadas por correntes e um veneno que induz falsas memórias.',
        abilities: ['Utopia do Miasma: Corrói ossos através de uma névoa nostálgica.']
    },
    {
        id: 'kasai',
        type: 'oni',
        name: 'Kasai Uba',
        role: 'Lua Inferior 2',
        image: 'assets/characters/onis/kasai-uba.png',
        stats: { for: 7, agi: 6, int: 10, vit: 8 },
        desc: 'A Incineradora Vingativa que manipula fogo demoníaco.',
        history: 'Matriarca desfigurada que viu a sua aldeia queimar. As suas chamas não queimam apenas a carne, mas também sanidade e esperança.',
        abilities: ['Julgamento do Fogo do Inferno: Evoca fantasmas de chamas.']
    },
    {
        id: 'shien',
        type: 'oni',
        name: 'Shien',
        role: 'Lua Inferior 3',
        image: 'assets/characters/onis/shien.png',
        stats: { for: 8, agi: 8, int: 8, vit: 7 },
        desc: 'A Artista Envenenada de teatralidade grotesca.',
        history: 'Antiga estrela kabuki arruinada com ácido. Usa o seu sangue tóxico como tinta para criar ilusões enlouquecedoras.',
        abilities: ['Pesadelo Púrpura: Paisagens ilusórias que necrosam a carne ao toque.']
    },
    {
        id: 'reiki',
        type: 'oni',
        name: 'Reiki',
        role: 'Lua Inferior 4',
        image: 'assets/characters/onis/reiki.png',
        stats: { for: 5, agi: 10, int: 8, vit: 6 },
        desc: 'O Monge Assombrado por lâminas etéreas.',
        history: 'Um monge enlouquecido pelas vozes dos espíritos. Os seus ataques contornam a armadura e afetam diretamente a força de vontade.',
        abilities: ['Corte da Alma: Inflige exaustão e remove memórias sem causar dano físico.']
    }
];