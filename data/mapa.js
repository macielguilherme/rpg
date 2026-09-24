// ============================================================
// ARQUIVO: data/mapa.js
// Descrição: Banco de dados com as 10 regiões, bounding boxes e imagens.
// ============================================================

window.MAPA_DATA = [
    {
        id: 'serra_laminas',
        name: 'Serra das Lâminas Rubras',
        type: 'Cordilheira',
        danger: 9,
        explored: false,
        x: 540, y: 250, w: 120, h: 30,
        image: 'assets/maps/serra-das-laminas-rubras.png',
        desc: 'Um terreno brutal e traiçoeiro, onde o vento corta como uma lâmina e as rochas são afiadas. Lar de Onis que valorizam a força bruta.'
    },
    {
        id: 'vale_amanhecer',
        name: 'Vale do Amanhecer',
        type: 'Floresta Sagrada',
        danger: 4,
        explored: true,
        x: 800, y: 270, w: 120, h: 30,
        image: 'assets/maps/vale-do-amanhecer.png',
        desc: 'Uma região de beleza etérea. A luz do amanhecer aqui é ofuscante para os Onis, tornando-o um campo de treino ideal para caçadores.'
    },
    {
        id: 'templo_sol',
        name: 'Templo do Sol Nascente',
        type: 'Santuário',
        danger: 6,
        explored: false,
        x: 380, y: 380, w: 120, h: 50,
        image: 'assets/maps/templo-do-sol-nascente.png',
        desc: 'Um local de poder espiritual e treino antigo. Os Onis frequentemente tentam profanar o templo para roubar os segredos das Respirações.'
    },
    {
        id: 'deserto_mangaun',
        name: 'Deserto de Mangaun',
        type: 'Deserto',
        danger: 8,
        explored: false,
        x: 220, y: 480, w: 150, h: 30,
        image: 'assets/maps/deserto-de-mangaun.png',
        desc: 'Um ambiente hostil onde a água é escassa e o calor é implacável. Os Onis residentes são mestres da emboscada e da ilusão sob as dunas.'
    },
    {
        id: 'floresta_sombras',
        name: 'Floresta das Sombras',
        type: 'Território Oni',
        danger: 10,
        explored: false,
        x: 540, y: 535, w: 140, h: 30,
        image: 'assets/maps/floresta-das-sombras.png',
        desc: 'Um lugar onde a luz do sol nunca toca o chão. Apenas os caçadores mais experientes ousam entrar na escuridão eterna desta selva.'
    },
    {
        id: 'vale_noite',
        name: 'Vale da Noite',
        type: 'Vale Sombrio',
        danger: 9,
        explored: false,
        x: 380, y: 780, w: 80, h: 50,
        image: 'assets/maps/vale-da-noite.png',
        desc: 'Um antigo campo de batalha coberto pela sombra constante das montanhas. O local guarda a memória dos confrontos mais sangrentos.'
    },
    {
        id: 'costa_youngi_sul',
        name: 'Costa de Youngi Sul',
        type: 'Litoral',
        danger: 5,
        explored: false,
        x: 660, y: 690, w: 120, h: 30,
        image: 'assets/maps/costa-de-youngi-sul.png',
        desc: 'Região costeira de águas calmas e praias claras. Embora pacífica em aparência, serve como ponto de infiltração de inimigos pelo mar.'
    },
    {
        id: 'costa_youngi_norte',
        name: 'Costa de Youngi Norte',
        type: 'Litoral Rochoso',
        danger: 8,
        explored: false,
        x: 500, y: 890, w: 120, h: 30,
        image: 'assets/maps/costa-de-youngi-norte.png',
        desc: 'Falésias íngremes e cavernas marinhas traiçoeiras. A neblina constante e o relevo rochoso escondem perigos para os viajantes.'
    },
    {
        id: 'reino_perdido',
        name: 'Reino Perdido',
        type: 'Ruínas',
        danger: 10,
        explored: false,
        x: 820, y: 580, w: 120, h: 30,
        image: 'assets/maps/reino-perdido.png',
        desc: 'As ruínas de uma civilização esquecida. O epicentro da corrupção na ilha, onde o próprio espaço-tempo parece distorcido.'
    },
    {
        id: 'ilha_ferreiros',
        name: 'Ilha dos Ferreiros',
        type: 'Ilha Vulcânica',
        danger: 3,
        explored: false,
        x: 735, y: 900, w: 110, h: 30,
        image: 'assets/maps/ilha-dos-ferreiros.png',
        desc: 'Uma ilha isolada e vulcânica onde os mestres artesãos forjam as lâminas Nichirin essenciais para o combate dos caçadores.'
    }
];