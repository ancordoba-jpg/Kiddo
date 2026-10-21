/**
 * Base de datos inicial y estructura de datos para la aplicación Kiddo
 */

const KIDDO_DATA = {
  // Estado de usuario por defecto
  user: {
    name: 'Mateo',
    birthdate: '2020-05-15',
    parentPin: '1234',
    registered: false,
    sessionStartTime: Date.now(),
    todayScreenTimeMinutes: 14,
    deviceSyncCode: 'KID-7842-X',
    pairedParentDevice: 'iPhone 15 Pro de Papá',
    lastSync: 'Hace 2 minutos'
  },

  // Registro de actividades recientes para la pantalla de Inicio
  recentActivities: [
    {
      id: 'act-1',
      type: 'game',
      icon: '🧮',
      title: 'Aprender sumas',
      subtitle: 'Nivel 1 completado con éxito',
      time: 'Hace 15 min',
      color: '#BEE3F8'
    },
    {
      id: 'act-2',
      type: 'story',
      icon: '📖',
      title: 'Caperucita Roja',
      subtitle: 'Páginas 1 a 4 leídas',
      time: 'Hace 40 min',
      color: '#FFD1DC'
    },
    {
      id: 'act-3',
      type: 'mission',
      icon: '⭐',
      title: 'Misión cumplida: Comer una fruta',
      subtitle: '¡Gran trabajo saludable!',
      time: 'Hace 2 horas',
      color: '#C6F6D5'
    },
    {
      id: 'act-4',
      type: 'music',
      icon: '🎹',
      title: 'Piano con Puky',
      subtitle: 'Creó una melodía de 8 notas',
      time: 'Ayer',
      color: '#FEFCBF'
    }
  ],

  // 7 Juegos Educativos según especificación
  games: [
    {
      id: 'game-memory',
      name: 'Juegos de memoria',
      category: 'Atención y memoria',
      icon: '🧠',
      badge: 'Favorito',
      color: '#FFD1DC',
      gradient: 'linear-gradient(135deg, #FFD1DC, #FFE4E6)',
      description: 'Encuentra las parejas de animalitos y amigos de Puky.',
      tags: ['Concentración', 'Animales']
    },
    {
      id: 'game-sums',
      name: 'Aprender sumas',
      category: 'Matemáticas divertidas',
      icon: '➕',
      badge: 'Educativo',
      color: '#BEE3F8',
      gradient: 'linear-gradient(135deg, #BEE3F8, #E0F2FE)',
      description: 'Suma manzanas, estrellas y juguetes con ayuda de Puky.',
      tags: ['Números', 'Lógica']
    },
    {
      id: 'game-subs',
      name: 'Aprender restas',
      category: 'Matemáticas divertidas',
      icon: '➖',
      badge: 'Nuevo',
      color: '#C6F6D5',
      gradient: 'linear-gradient(135deg, #C6F6D5, #DCFCE7)',
      description: 'Descubre cuántos elementos quedan de forma visual y alegre.',
      tags: ['Cálculo', 'Básico']
    },
    {
      id: 'game-mult',
      name: 'Aprender multiplicación',
      category: 'Matemáticas divertidas',
      icon: '✖️',
      badge: 'Avanzado',
      color: '#FEFCBF',
      gradient: 'linear-gradient(135deg, #FEFCBF, #FEF9C3)',
      description: 'Aprende las tablas saltando de flor en flor en el bosque.',
      tags: ['Tablas', 'Desafío']
    },
    {
      id: 'game-clock',
      name: 'Aprender la hora',
      category: 'Habilidades del día',
      icon: '⏰',
      badge: 'Interactivo',
      color: '#E9D8FD',
      gradient: 'linear-gradient(135deg, #E9D8FD, #F3E8FF)',
      description: 'Mueve las agujas del reloj del cuarto de Puky para saber la hora.',
      tags: ['Tiempo', 'Rutinas']
    },
    {
      id: 'game-syllables',
      name: 'Completar palabras con sílabas',
      category: 'Lectoescritura',
      icon: '🔤',
      badge: 'Lectura',
      color: '#FEEBC8',
      gradient: 'linear-gradient(135deg, #FEEBC8, #FFEDD5)',
      description: 'Arrastra las sílabas mágicas (MA, PA, SO, LA) para formar palabras.',
      tags: ['Letras', 'Sonidos']
    },
    {
      id: 'game-words',
      name: 'Armar palabras',
      category: 'Lectoescritura',
      icon: '🧩',
      badge: 'Palabras',
      color: '#FED7D7',
      gradient: 'linear-gradient(135deg, #FED7D7, #FEE2E2)',
      description: 'Une letras de colores para descubrir nombres de animales y frutas.',
      tags: ['Vocabulario', 'Ortografía']
    }
  ],

  // Misiones diarias (Dentro y fuera de la app)
  missions: [
    {
      id: 'm-in-1',
      type: 'in_app',
      title: 'Aprender a sumar y restar',
      description: 'Practica operaciones divertidas en la sección Juegos.',
      icon: '🧮',
      completed: false,
      tag: 'En la app'
    },
    {
      id: 'm-in-2',
      type: 'in_app',
      title: 'Leer un cuento',
      description: 'Explora un cuento clásico y escucha la narración mágica.',
      icon: '📖',
      completed: true,
      tag: 'En la app'
    },
    {
      id: 'm-in-3',
      type: 'in_app',
      title: 'Hacer música con Puky',
      description: 'Toca 5 notas en el piano virtual para cantar juntos.',
      icon: '🎹',
      completed: false,
      tag: 'En la app'
    },
    {
      id: 'm-out-1',
      type: 'out_app',
      title: 'Comer una fruta',
      description: 'Disfruta de una rica manzana, plátano o tu fruta favorita.',
      icon: '🍎',
      completed: true,
      tag: 'Fuera de la app'
    },
    {
      id: 'm-out-2',
      type: 'out_app',
      title: 'Abrazar a alguien',
      description: 'Dale un abrazo cariñoso a mamá, papá, hermanos o abuelitos.',
      icon: '🤗',
      completed: false,
      tag: 'Fuera de la app'
    },
    {
      id: 'm-out-3',
      type: 'out_app',
      title: 'Ordenar la habitación',
      description: 'Deja tu cama y espacio ordenados y listos para jugar.',
      icon: '🛏️',
      completed: false,
      tag: 'Fuera de la app'
    },
    {
      id: 'm-out-4',
      type: 'out_app',
      title: 'Ordenar los juguetes',
      description: 'Guarda tus juguetes en su caja al terminar de jugar.',
      icon: '🧸',
      completed: true,
      tag: 'Fuera de la app'
    }
  ],

  // Categorías de música
  music: {
    relaxing: [
      {
        id: 'rel-piano',
        title: 'Piano de las Nubes',
        instrument: 'Piano',
        iconImage: 'assets/musica/relajante/icono-piano.png',
        color: '#EBF8FF',
        borderColor: '#BAE6FD',
        tagColor: '#0284C7',
        tagBg: '#E0F2FE',
        description: 'Notas suaves y serenas que transmiten paz y tranquilidad.',
        youtubeUrl: 'https://youtu.be/_kWkoRUrCWQ?si=3HTwbZ9a0ySCHB9M',
        videoId: '_kWkoRUrCWQ',
        audioMode: 'youtube'
      },
      {
        id: 'rel-violin',
        title: 'Violín de la Brisa',
        instrument: 'Violín',
        iconImage: 'assets/musica/relajante/icono-violin.png',
        color: '#FAF5FF',
        borderColor: '#E9D5FF',
        tagColor: '#9333EA',
        tagBg: '#F3E8FF',
        description: 'Melodías dulces y fluidas como el viento entre los árboles.',
        youtubeUrl: 'https://youtu.be/B0HtiGUYbQw?si=oAQINAJVgF3CoR_S',
        videoId: 'B0HtiGUYbQw',
        audioMode: 'youtube'
      },
      {
        id: 'rel-rain',
        title: 'Lluvia en el Bosque',
        instrument: 'Lluvia',
        iconImage: 'assets/musica/relajante/icono-lluvia.png',
        color: '#F0FDF4',
        borderColor: '#BBF7D0',
        tagColor: '#16A34A',
        tagBg: '#DCFCE7',
        description: 'Gotas relajantes cayendo sobre hojas tiernas de eucalipto.',
        youtubeUrl: 'https://www.youtube.com/live/8DbIaenwTvE?si=R0BgpZyOV_hS3WAL',
        videoId: '8DbIaenwTvE',
        audioMode: 'youtube'
      },
      {
        id: 'rel-harp',
        title: 'Arpa de las Estrellas',
        instrument: 'Arpa',
        iconImage: 'assets/musica/relajante/icono-estrellas.png',
        color: '#FEFCE8',
        borderColor: '#FEF08A',
        tagColor: '#CA8A04',
        tagBg: '#FEF9C3',
        description: 'Arpegios mágicos que invitan a soñar y descansar.',
        synthPreset: 'harp',
        audioMode: 'synth'
      }
    ],
    children: [
      {
        id: 'manuelita',
        title: 'Manuelita la tortuga',
        artist: 'María Elena Walsh',
        videoId: 'MWvldIeacPA',
        thumbnail: 'https://img.youtube.com/vi/MWvldIeacPA/hqdefault.jpg',
        description: 'Una canción clásica y tierna para cantar con alegría.',
        accent: '#F9A8D4'
      },
      {
        id: 'estrellita',
        title: 'Estrellita, ¿dónde estás?',
        artist: 'Super Simple Español',
        videoId: 'qDUfm2_beKE',
        thumbnail: 'https://img.youtube.com/vi/qDUfm2_beKE/hqdefault.jpg',
        description: 'Una melodía suave y conocida para acompañar momentos tranquilos.',
        accent: '#93C5FD'
      },
      {
        id: 'luna-cansada',
        title: 'Luna cansada',
        artist: 'Canticuéntico',
        videoId: 'tudwNZGbWXY',
        thumbnail: 'https://img.youtube.com/vi/tudwNZGbWXY/hqdefault.jpg',
        description: 'Una canción cálida y serena para escuchar en familia.',
        accent: '#C4B5FD'
      },
      {
        id: 'pollitos',
        title: 'Los pollitos dicen',
        artist: 'Super Simple Español',
        videoId: 'ZZ5cgLyJtNU',
        thumbnail: 'https://img.youtube.com/vi/ZZ5cgLyJtNU/hqdefault.jpg',
        description: 'Una canción infantil muy dulce para cantar y aprender.',
        accent: '#FDE68A'
      },
      {
        id: 'jardinero',
        title: 'El jardinero',
        artist: 'María Elena Walsh',
        videoId: 't0R5dvoTCDM',
        thumbnail: 'https://img.youtube.com/vi/t0R5dvoTCDM/hqdefault.jpg',
        description: 'Una propuesta musical clásica y divertida con ternura.',
        accent: '#6EE7B7'
      },
      {
        id: 'reina-batata',
        title: 'La reina Batata',
        artist: 'María Elena Walsh',
        videoId: 'v2flTr8zY5c',
        thumbnail: 'https://img.youtube.com/vi/v2flTr8zY5c/hqdefault.jpg',
        description: 'Una canción alegre y creativa del mundo de María Elena Walsh.',
        accent: '#FDBA74'
      },
      {
        id: 'quiero-para-mi',
        title: 'Quiero para mí',
        artist: 'Canticuéntico',
        videoId: '5bWM2gGB-Fs',
        thumbnail: 'https://img.youtube.com/vi/5bWM2gGB-Fs/hqdefault.jpg',
        description: 'Una canción sensible y bonita para disfrutar en calma.',
        accent: '#A7F3D0'
      },
      {
        id: 'arana-pequenita',
        title: 'La araña pequeñita',
        artist: 'Super Simple Español',
        videoId: 'XvKotqrAPFA',
        thumbnail: 'https://img.youtube.com/vi/XvKotqrAPFA/hqdefault.jpg',
        description: 'Una canción infantil muy conocida para cantar y jugar.',
        accent: '#DDD6FE'
      },
      {
        id: 'banar-la-luna',
        title: 'Bañar la luna',
        artist: 'María Elena Walsh',
        videoId: 'OMUh_vJXM44',
        thumbnail: 'https://img.youtube.com/vi/OMUh_vJXM44/hqdefault.jpg',
        description: 'Una melodía suave, poética y relajante.',
        accent: '#BAE6FD'
      },
      {
        id: 'giraluna-girasol',
        title: 'Giraluna, girasol',
        artist: 'Cantoalegre',
        videoId: 'HYQLRSI0KT4',
        thumbnail: 'https://img.youtube.com/vi/HYQLRSI0KT4/hqdefault.jpg',
        description: 'Una canción amorosa y tranquila con un ritmo delicado.',
        accent: '#FCA5A5'
      }
    ]
  },

  // 10 Cuentos Infantiles Clásicos con Páginas y Textos para lectura y narración sincronizada
  stories: [
    {
      id: 'caperucita',
      title: 'Caperucita Roja',
      author: 'Hermanos Grimm / Perrault',
      icon: '👧🧺',
      color: '#FFD1DC',
      gradient: 'linear-gradient(135deg, #FFD1DC, #FFE4E6)',
      coverText: 'Una niña bondadosa con capa roja y su visita a la abuelita en el bosque.',
      pages: [
        {
          pageNumber: 1,
          imageType: 'caperucita-p1',
          text: 'Había una vez una dulce niña que vivía cerca de un hermoso bosque verde. Siempre llevaba una linda caperucita de color rojo que le había regalado su abuelita, por eso todos la llamaban con cariño Caperucita Roja.',
          sceneTitle: 'El hogar en el bosque'
        },
        {
          pageNumber: 2,
          imageType: 'caperucita-p2',
          text: 'Un día soleado su mamá preparó una canastita con pastelitos y frutas frescas. Hija mía, lleva esta canasta a la casa de la abuelita porque está resfriada y camina siempre por el sendero seguro del bosque.',
          sceneTitle: 'El encargo de mamá'
        },
        {
          pageNumber: 3,
          imageType: 'caperucita-p3',
          text: 'Caperucita caminó feliz escuchando el cantar de los pajaritos y recolectando flores de mil colores. Puky el koala la saludó desde una rama sonriendo con alegría y deseándole un paseo lleno de paz y felicidad.',
          sceneTitle: 'Encuentro en el camino'
        },
        {
          pageNumber: 4,
          imageType: 'caperucita-p4',
          text: 'Al llegar a la casita, Caperucita y su abuelita disfrutaron juntas de los pastelitos y una rica merienda. Comprendieron que escuchar los sabios consejos de la familia hace que cada aventura termine con una gran sonrisa.',
          sceneTitle: 'Un final feliz'
        }
      ]
    },
    {
      id: 'tres-cerditos',
      title: 'Los tres cerditos',
      author: 'Cuento Popular',
      icon: '🐷🏠',
      color: '#FEFCBF',
      gradient: 'linear-gradient(135deg, #FEFCBF, #FEF9C3)',
      coverText: 'Tres hermanos que construyen sus casas de paja, madera y fuertes ladrillos.',
      pages: [
        {
          pageNumber: 1,
          imageType: 'cerditos-p1',
          text: 'En un valle lleno de flores vivían tres hermanos cerditos muy alegres. Decidieron construir cada uno su propia casa para vivir tranquilos y protegerse del frío y de la lluvia.',
          sceneTitle: 'Los tres hermanos'
        },
        {
          pageNumber: 2,
          imageType: 'cerditos-p2',
          text: 'El más pequeño hizo su casa de paja para terminar rápido y ponerse a jugar. El hermano del medio construyó su casita de madera, que quedó lista en una sola tarde.',
          sceneTitle: 'Construyendo con prisa'
        },
        {
          pageNumber: 3,
          imageType: 'cerditos-p3',
          text: 'El hermano mayor trabajó con dedicación, usando ladrillos fuertes y cemento firme. Sabía que el esfuerzo y la paciencia son la clave para construir cosas seguras y duraderas.',
          sceneTitle: 'El valor del esfuerzo'
        },
        {
          pageNumber: 4,
          imageType: 'cerditos-p4',
          text: 'Cuando sopló un viento muy fuerte por la montaña, la casa de ladrillo permaneció firme y acogedora. Los tres hermanos se reunieron felices a cantar y compartir un té calientito.',
          sceneTitle: 'Hermanos unidos'
        }
      ]
    },
    {
      id: 'patito-feo',
      title: 'El patito feo',
      author: 'Hans Christian Andersen',
      icon: '🦆🦢',
      color: '#BEE3F8',
      gradient: 'linear-gradient(135deg, #BEE3F8, #E0F2FE)',
      coverText: 'La emotiva historia de autodescubrimiento y belleza interior que se transforma en un cisne.',
      pages: [
        {
          pageNumber: 1,
          imageType: 'patito-p1',
          text: 'En una laguna cristalina nacieron hermosos patitos amarillos. Entre ellos había uno un poco diferente, de plumaje gris y cuello largo que caminaba con curiosidad.',
          sceneTitle: 'Un nuevo nacimiento'
        },
        {
          pageNumber: 2,
          imageType: 'patito-p2',
          text: 'El pequeño exploró el estanque buscando amigos amables. Puky el koala lo animó diciéndole: Eres único y especial, cada ser tiene su propio brillo en el corazón.',
          sceneTitle: 'Palabras de aliento'
        },
        {
          pageNumber: 3,
          imageType: 'patito-p3',
          text: 'Pasó el invierno y al llegar la primavera el patito miró su reflejo en el agua azul. Ya no era un patito pequeño, sino un majestuoso y elegante cisne blanco.',
          sceneTitle: 'La gran transformación'
        }
      ]
    },
    {
      id: 'cenicienta',
      title: 'Cenicienta',
      author: 'Charles Perrault',
      icon: '👠✨',
      color: '#E9D8FD',
      gradient: 'linear-gradient(135deg, #E9D8FD, #F3E8FF)',
      coverText: 'La bondad, la magia y un zapatito de cristal que cambian la vida de una joven gentil.',
      pages: [
        {
          pageNumber: 1,
          imageType: 'cenicienta-p1',
          text: 'Cenicienta era una joven bondadosa y paciente que llenaba de cariño y cantos a los pajaritos y ratoncitos del palacio donde vivía.',
          sceneTitle: 'El corazón bondadoso'
        },
        {
          pageNumber: 2,
          imageType: 'cenicienta-p2',
          text: 'Con ayuda de su Hada Madrina y un toque de varita mágica, una calabaza se convirtió en carruaje y Cenicienta lució un vestido resplandeciente.',
          sceneTitle: 'Magia de medianoche'
        },
        {
          pageNumber: 3,
          imageType: 'cenicienta-p3',
          text: 'Al probarse el zapatito de cristal que encajó a la perfección, todos celebraron que la dulzura y el respeto siempre triunfan con felicidad.',
          sceneTitle: 'Un sueño hecho realidad'
        }
      ]
    },
    {
      id: 'blancanieves',
      title: 'Blancanieves y los siete enanitos',
      author: 'Hermanos Grimm',
      icon: '🍎👑',
      color: '#C6F6D5',
      gradient: 'linear-gradient(135deg, #C6F6D5, #DCFCE7)',
      coverText: 'Una princesa de gran corazón que encuentra amigos entrañables en una cabaña del bosque.',
      pages: [
        {
          pageNumber: 1,
          imageType: 'blancanieves-p1',
          text: 'Blancanieves tenía una sonrisa radiante y amaba la naturaleza. En lo profundo del bosque encontró una casita pequeña y muy acogedora.',
          sceneTitle: 'La casita en el bosque'
        },
        {
          pageNumber: 2,
          imageType: 'blancanieves-p2',
          text: 'Allí vivían siete enanitos trabajadores y simpáticos que cantaban alegres al volver a casa. Blancanieves les enseñó a mantener todo ordenado y limpio.',
          sceneTitle: 'Nuevos grandes amigos'
        },
        {
          pageNumber: 3,
          imageType: 'blancanieves-p3',
          text: 'Juntos vivieron aventuras maravillosas protegidos por la bondad y la armonía de todos los animalitos del bosque.',
          sceneTitle: 'Amistad para siempre'
        }
      ]
    },
    {
      id: 'pinocho',
      title: 'Pinocho',
      author: 'Carlo Collodi',
      icon: '🤥🪵',
      color: '#FEEBC8',
      gradient: 'linear-gradient(135deg, #FEEBC8, #FFEDD5)',
      coverText: 'El muñeco de madera que aprende la importancia de decir la verdad y ser un buen hijo.',
      pages: [
        {
          pageNumber: 1,
          imageType: 'pinocho-p1',
          text: 'El carpintero Gepetto talló con amor un muñeco de madera al que llamó Pinocho. El Hada Azul le dio vida con la promesa de portarse bien.',
          sceneTitle: 'La creación de Gepetto'
        },
        {
          pageNumber: 2,
          imageType: 'pinocho-p2',
          text: 'Pinocho descubrió que cada vez que decía una mentirijilla, su nariz de madera crecía un poquito más. Aprendió que la sinceridad es el mejor camino.',
          sceneTitle: 'La lección de la verdad'
        },
        {
          pageNumber: 3,
          imageType: 'pinocho-p3',
          text: 'Al salvar con valentía a su papá Gepetto, el Hada lo convirtió en un niño de verdad lleno de alegría y nobleza.',
          sceneTitle: 'Un niño de verdad'
        }
      ]
    },
    {
      id: 'gato-botas',
      title: 'El gato con botas',
      author: 'Charles Perrault',
      icon: '🐱👢',
      color: '#FED7D7',
      gradient: 'linear-gradient(135deg, #FED7D7, #FEE2E2)',
      coverText: 'Un felino ingenioso y valiente que ayuda a su bondadoso dueño con astucia y humor.',
      pages: [
        {
          pageNumber: 1,
          imageType: 'gatobotas-p1',
          text: 'Un joven recibió como herencia a un gato muy especial. El gato le dijo con seguridad: Consígueme unas botas y una bolsa, y verás grandes maravillas.',
          sceneTitle: 'El regalo inesperado'
        },
        {
          pageNumber: 2,
          imageType: 'gatobotas-p2',
          text: 'Con elegancia y simpatía, el gato con botas visitó el castillo del rey presentándole exquisitos regalos en nombre de su querido amigo.',
          sceneTitle: 'Misiones del gato astuto'
        },
        {
          pageNumber: 3,
          imageType: 'gatobotas-p3',
          text: 'Gracias a su ingenio y lealtad, consiguieron un hermoso castillo donde vivieron felices comiendo deliciosos banquetes.',
          sceneTitle: 'La victoria del ingenio'
        }
      ]
    },
    {
      id: 'hansel-gretel',
      title: 'Hansel y Gretel',
      author: 'Hermanos Grimm',
      icon: '🍬🏠',
      color: '#FEFCBF',
      gradient: 'linear-gradient(135deg, #FEFCBF, #FEF9C3)',
      coverText: 'Dos hermanitos que descubren una casita de dulces y regresan a casa trabajando en equipo.',
      pages: [
        {
          pageNumber: 1,
          imageType: 'hansel-p1',
          text: 'Hansel y su hermana Gretel salieron a caminar por el bosque dejando un camino de piedritas brillantes que reflejaban la luz del sol.',
          sceneTitle: 'El sendero iluminado'
        },
        {
          pageNumber: 2,
          imageType: 'hansel-p2',
          text: 'Encontraron una casita mágica con tejado de chocolate, ventanas de caramelo y puertas de galleta crujiente.',
          sceneTitle: 'La casita de dulces'
        },
        {
          pageNumber: 3,
          imageType: 'hansel-p3',
          text: 'Cuidándose el uno al otro y colaborando en equipo, regresaron a los brazos de sus papás con su amor más fuerte que nunca.',
          sceneTitle: 'El regreso a casa'
        }
      ]
    },
    {
      id: 'bella-durmiente',
      title: 'La bella durmiente',
      author: 'Charles Perrault',
      icon: '🌹👑',
      color: '#FFD1DC',
      gradient: 'linear-gradient(135deg, #FFD1DC, #FFE4E6)',
      coverText: 'Un reino encantado protegido por rosas y un despertar lleno de luz y esperanza.',
      pages: [
        {
          pageNumber: 1,
          imageType: 'belladurmiente-p1',
          text: 'En un reino lleno de luz nació la princesa Aurora. Tres hadas bondadosas le regalaron la gracia, el don del canto y un corazón dulce.',
          sceneTitle: 'El gran festejo real'
        },
        {
          pageNumber: 2,
          imageType: 'belladurmiente-p2',
          text: 'El castillo quedó en un sueño pacífico rodeado de rosales y pájaros guardianes que esperaban el momento oportuno para despertar.',
          sceneTitle: 'El sueño pacífico'
        },
        {
          pageNumber: 3,
          imageType: 'belladurmiente-p3',
          text: 'Un rayo de sol cálido y un afectuoso despertar llenaron de música y flores todos los jardines del palacio real.',
          sceneTitle: 'El amanecer dorado'
        }
      ]
    },
    {
      id: 'ricitos-oro',
      title: 'Ricitos de Oro',
      author: 'Robert Southey',
      icon: '🥣🐻',
      color: '#FEFCBF',
      gradient: 'linear-gradient(135deg, #FEFCBF, #FEF9C3)',
      coverText: 'Una niña curiosa que visita la casa de los tres ositos y aprende a respetar las cosas de los demás.',
      pages: [
        {
          pageNumber: 1,
          imageType: 'ricitos-p1',
          text: 'Ricitos de Oro era una niña de cabello rizado y dorado. Paseando por el sendero descubrió la linda casa de Papá Oso, Mamá Osa y el Pequeño Osito.',
          sceneTitle: 'Paseo en el bosque'
        },
        {
          pageNumber: 2,
          imageType: 'ricitos-p2',
          text: 'Probó tres tazones de rica avena: uno muy caliente, uno muy frío y el del Pequeño Osito que estaba en su punto perfecto.',
          sceneTitle: 'Los tres tazones'
        },
        {
          pageNumber: 3,
          imageType: 'ricitos-p3',
          text: 'Al despertar y ver a la familia de ositos, pidió disculpas amablemente por entrar sin avisar y prometió ser siempre muy respetuosa.',
          sceneTitle: 'Una lección de respeto'
        }
      ]
    }
  ],

  // Videos organizados por categorías, edades y canales recomendados
  videos: {
    categories: [
      { id: 'aprender', name: 'Aprender', icon: '📚' },
      { id: 'bailar', name: 'Bailar', icon: '🎵' },
      { id: 'entretenimiento', name: 'Entretenimiento', icon: '🍿' }
    ],
    items: [
      // 2 a 4 años 🐣
      // Aprender
      {
        id: 'v-2-4-ap-1',
        title: 'Cinco Monitos',
        channel: 'El Reino Infantil',
        category: 'aprender',
        ageGroups: ['2-4'],
        videoUrl: 'https://www.youtube.com/watch?v=ap0G1n0NIzM',
        videoId: 'ap0G1n0NIzM',
        embedUrl: 'https://www.youtube-nocookie.com/embed/ap0G1n0NIzM',
        thumbnail: 'https://i.ytimg.com/vi/ap0G1n0NIzM/hqdefault.jpg',
        duration: '2:15',
        description: 'Canción divertida de los cinco monitos saltando en la cama.'
      },
      // Bailar
      {
        id: 'v-2-4-ba-1',
        title: 'Cabeza, hombros, rodillas y pies',
        channel: 'El Reino Infantil',
        category: 'bailar',
        ageGroups: ['2-4'],
        videoUrl: 'https://www.youtube.com/watch?v=3uM7YQW7j0M',
        videoId: '3uM7YQW7j0M',
        embedUrl: 'https://www.youtube-nocookie.com/embed/3uM7YQW7j0M',
        thumbnail: 'https://i.ytimg.com/vi/3uM7YQW7j0M/hqdefault.jpg',
        duration: '2:20',
        description: 'Baila y mueve todo el cuerpo reconociendo cada parte.'
      },
      {
        id: 'v-2-4-ba-2',
        title: 'La Patita Lulú',
        channel: 'El Reino Infantil',
        category: 'bailar',
        ageGroups: ['2-4'],
        videoUrl: 'https://www.youtube.com/watch?v=53e9vYjG5r8',
        videoId: '53e9vYjG5r8',
        embedUrl: 'https://www.youtube-nocookie.com/embed/53e9vYjG5r8',
        thumbnail: 'https://i.ytimg.com/vi/53e9vYjG5r8/hqdefault.jpg',
        duration: '2:40',
        description: 'Baila meneando la patita con Lulú en un ritmo súper alegre.'
      },
      // Entretenimiento
      {
        id: 'v-2-4-en-1',
        title: 'Los pollitos dicen',
        channel: 'Toy Cantando',
        category: 'entretenimiento',
        ageGroups: ['2-4'],
        videoUrl: 'https://www.youtube.com/watch?v=nlmNvyjwRhU',
        videoId: 'nlmNvyjwRhU',
        embedUrl: 'https://www.youtube-nocookie.com/embed/nlmNvyjwRhU',
        thumbnail: 'https://i.ytimg.com/vi/nlmNvyjwRhU/hqdefault.jpg',
        duration: '2:30',
        description: 'El clásico de los pollitos pío pío para cantar en familia.'
      },
      {
        id: 'v-2-4-en-2',
        title: 'Estrellita ¿Dónde Estás?',
        channel: 'El Reino Infantil',
        category: 'entretenimiento',
        ageGroups: ['2-4'],
        videoUrl: 'https://www.youtube.com/watch?v=_DdCTAZu930',
        videoId: '_DdCTAZu930',
        embedUrl: 'https://www.youtube-nocookie.com/embed/_DdCTAZu930',
        thumbnail: 'https://i.ytimg.com/vi/_DdCTAZu930/hqdefault.jpg',
        duration: '2:50',
        description: 'Una hermosa canción de cuna con estrellas brillantes.'
      },
      {
        id: 'v-2-4-en-3',
        title: 'Las Ruedas del Autobús',
        channel: 'El Reino Infantil',
        category: 'entretenimiento',
        ageGroups: ['2-4'],
        videoUrl: 'https://www.youtube.com/watch?v=G3VM3lE8gT0',
        videoId: 'G3VM3lE8gT0',
        embedUrl: 'https://www.youtube-nocookie.com/embed/G3VM3lE8gT0',
        thumbnail: 'https://i.ytimg.com/vi/G3VM3lE8gT0/hqdefault.jpg',
        duration: '2:25',
        description: 'Las ruedas del autobús que giran por toda la ciudad.'
      },

      // 5 a 7 años 🐰
      // Aprender
      {
        id: 'v-5-7-ap-1',
        title: 'Un elefante se balanceaba',
        channel: 'El Reino Infantil',
        category: 'aprender',
        ageGroups: ['5-7'],
        videoUrl: 'https://www.youtube.com/watch?v=ZkEuxLfwl4E',
        videoId: 'ZkEuxLfwl4E',
        embedUrl: 'https://www.youtube-nocookie.com/embed/ZkEuxLfwl4E',
        thumbnail: 'https://i.ytimg.com/vi/ZkEuxLfwl4E/hqdefault.jpg',
        duration: '3:10',
        description: 'Aprende los números cantando con los elefantes en la tela de araña.'
      },
      {
        id: 'v-5-7-ap-2',
        title: 'Canción de los Colores',
        channel: 'El Reino Infantil',
        category: 'aprender',
        ageGroups: ['5-7'],
        videoUrl: 'https://www.youtube.com/watch?v=6256pG0YJpE',
        videoId: '6256pG0YJpE',
        embedUrl: 'https://www.youtube-nocookie.com/embed/6256pG0YJpE',
        thumbnail: 'https://i.ytimg.com/vi/6256pG0YJpE/hqdefault.jpg',
        duration: '2:45',
        description: 'Identifica y canta los hermosos colores del mundo.'
      },
      // Bailar
      {
        id: 'v-5-7-ba-1',
        title: 'Soy una taza',
        channel: 'CantaJuego',
        category: 'bailar',
        ageGroups: ['5-7'],
        videoUrl: 'https://www.youtube.com/watch?v=fTzTFQbdYEQ',
        videoId: 'fTzTFQbdYEQ',
        embedUrl: 'https://www.youtube-nocookie.com/embed/fTzTFQbdYEQ',
        thumbnail: 'https://i.ytimg.com/vi/fTzTFQbdYEQ/hqdefault.jpg',
        duration: '2:15',
        description: 'Taza, tetera, cuchara y cucharón. Baile dinámico y divertido.'
      },
      {
        id: 'v-5-7-ba-2',
        title: 'El monstruo de la laguna',
        channel: 'Canticuénticos',
        category: 'bailar',
        ageGroups: ['5-7'],
        videoUrl: 'https://www.youtube.com/watch?v=eFdUXU9ZGls',
        videoId: 'eFdUXU9ZGls',
        embedUrl: 'https://www.youtube-nocookie.com/embed/eFdUXU9ZGls',
        thumbnail: 'https://i.ytimg.com/vi/eFdUXU9ZGls/hqdefault.jpg',
        duration: '3:05',
        description: 'Cumbia alegre para bailar moviendo todo el cuerpo.'
      },
      // Entretenimiento
      {
        id: 'v-5-7-en-1',
        title: 'Debajo de un botón',
        channel: 'El Reino Infantil',
        category: 'entretenimiento',
        ageGroups: ['5-7'],
        videoUrl: 'https://www.youtube.com/watch?v=7Y2WJ6pM8xE',
        videoId: '7Y2WJ6pM8xE',
        embedUrl: 'https://www.youtube-nocookie.com/embed/7Y2WJ6pM8xE',
        thumbnail: 'https://i.ytimg.com/vi/7Y2WJ6pM8xE/hqdefault.jpg',
        duration: '2:30',
        description: 'Debajo de un botón que encontró Martín, había un ratón.'
      },
      {
        id: 'v-5-7-en-2',
        title: 'La Vaca Lola y Yo',
        channel: 'El Reino Infantil',
        category: 'entretenimiento',
        ageGroups: ['5-7'],
        videoUrl: 'https://www.youtube.com/watch?v=ZWbumjPEOd0',
        videoId: 'ZWbumjPEOd0',
        embedUrl: 'https://www.youtube-nocookie.com/embed/ZWbumjPEOd0',
        thumbnail: 'https://i.ytimg.com/vi/ZWbumjPEOd0/hqdefault.jpg',
        duration: '3:20',
        description: 'Aventuras musicales con la querida Vaca Lola y amigos.'
      },

      // 8 a 10 años 🦊
      // Aprender
      {
        id: 'v-8-10-ap-1',
        title: 'El Sistema Solar',
        channel: 'Happy Learning',
        category: 'aprender',
        ageGroups: ['8-10'],
        videoUrl: 'https://www.youtube.com/watch?v=ZykXgSqet6A',
        videoId: 'ZykXgSqet6A',
        embedUrl: 'https://www.youtube-nocookie.com/embed/ZykXgSqet6A',
        thumbnail: 'https://i.ytimg.com/vi/ZykXgSqet6A/hqdefault.jpg',
        duration: '4:15',
        description: 'Exploración de los planetas, estrellas y maravillas espaciales.'
      },
      {
        id: 'v-8-10-ap-2',
        title: 'El Ciclo del Agua',
        channel: 'Happy Learning',
        category: 'aprender',
        ageGroups: ['8-10'],
        videoUrl: 'https://www.youtube.com/watch?v=QDCohXW6blg',
        videoId: 'QDCohXW6blg',
        embedUrl: 'https://www.youtube-nocookie.com/embed/QDCohXW6blg',
        thumbnail: 'https://i.ytimg.com/vi/QDCohXW6blg/hqdefault.jpg',
        duration: '3:50',
        description: 'Aprende cómo el agua se evapora, condensa y nutre la vida.'
      },
      {
        id: 'v-8-10-ap-3',
        title: 'Sistema Solar',
        channel: 'Pé de Sonho',
        category: 'aprender',
        ageGroups: ['8-10'],
        videoUrl: 'https://www.youtube.com/watch?v=J7M9J7kQ4xQ',
        videoId: 'J7M9J7kQ4xQ',
        embedUrl: 'https://www.youtube-nocookie.com/embed/J7M9J7kQ4xQ',
        thumbnail: 'https://i.ytimg.com/vi/J7M9J7kQ4xQ/hqdefault.jpg',
        duration: '3:30',
        description: 'Poética canción y animación artística sobre los planetas.'
      },
      {
        id: 'v-8-10-ap-4',
        title: 'Tiburones en Acción',
        channel: 'JunyTony',
        category: 'aprender',
        ageGroups: ['8-10'],
        videoUrl: 'https://www.youtube.com/watch?v=2Q0Gf7L6V7A',
        videoId: '2Q0Gf7L6V7A',
        embedUrl: 'https://www.youtube-nocookie.com/embed/2Q0Gf7L6V7A',
        thumbnail: 'https://i.ytimg.com/vi/2Q0Gf7L6V7A/hqdefault.jpg',
        duration: '3:40',
        description: 'Descubre las especies y habilidades de los tiburones en el mar.'
      },
      {
        id: 'v-8-10-ap-5',
        title: 'Cuatro Estaciones Hay',
        channel: 'El Reino Infantil',
        category: 'aprender',
        ageGroups: ['8-10'],
        videoUrl: 'https://www.youtube.com/watch?v=8j0Y9rJxL4E',
        videoId: '8j0Y9rJxL4E',
        embedUrl: 'https://www.youtube-nocookie.com/embed/8j0Y9rJxL4E',
        thumbnail: 'https://i.ytimg.com/vi/8j0Y9rJxL4E/hqdefault.jpg',
        duration: '2:40',
        description: 'Primavera, verano, otoño e invierno con ritmo y color.'
      },
      // Entretenimiento
      {
        id: 'v-8-10-en-1',
        title: 'Canción de la Amistad',
        channel: 'El Reino Infantil',
        category: 'entretenimiento',
        ageGroups: ['8-10'],
        videoUrl: 'https://www.youtube.com/watch?v=8Qw5nQW8Z5Y',
        videoId: '8Qw5nQW8Z5Y',
        embedUrl: 'https://www.youtube-nocookie.com/embed/8Qw5nQW8Z5Y',
        thumbnail: 'https://i.ytimg.com/vi/8Qw5nQW8Z5Y/hqdefault.jpg',
        duration: '3:10',
        description: 'Valores de amistad, respeto y cariño para compartir juntos.'
      }
    ],
    recommendedChannels: [
      {
        id: 'ch-1',
        name: 'El Reino Infantil',
        subscribers: '62M suscritos',
        icon: '👑',
        color: '#FFD1DC',
        url: 'https://www.youtube.com'
      },
      {
        id: 'ch-2',
        name: 'Canticuénticos Música',
        subscribers: '1.8M suscritos',
        icon: '🎶',
        color: '#BEE3F8',
        url: 'https://www.youtube.com'
      },
      {
        id: 'ch-3',
        name: 'Plim Plim Oficial',
        subscribers: '28M suscritos',
        icon: '🎈',
        color: '#FEFCBF',
        url: 'https://www.youtube.com'
      },
      {
        id: 'ch-4',
        name: 'Smile and Learn Español',
        subscribers: '3.4M suscritos',
        icon: '🧠',
        color: '#C6F6D5',
        url: 'https://www.youtube.com'
      }
    ]
  },

  // Opciones de personalización para Puky (ropa, accesorios, color)
  pukyCustomization: {
    outfits: [
      { id: 'outfit-default', name: 'Pañuelo Verde Oficial', icon: '🧣', color: '#52B748', active: true },
      { id: 'outfit-sweater', name: 'Suéter Pastel Suave', icon: '👕', color: '#BEE3F8', active: false },
      { id: 'outfit-explorer', name: 'Traje de Explorador', icon: '🦺', color: '#FEFCBF', active: false },
      { id: 'outfit-pajamas', name: 'Pijama de Estrellitas', icon: '✨', color: '#E9D8FD', active: false }
    ],
    accessories: [
      { id: 'acc-none', name: 'Sin accesorio (Oficial)', icon: '✨', active: true },
      { id: 'acc-glasses', name: 'Lentes Redondos', icon: '👓', active: false },
      { id: 'acc-hat', name: 'Gorra Alegre', icon: '🧢', active: false },
      { id: 'acc-bow', name: 'Moñito Pastel', icon: '🎀', active: false },
      { id: 'acc-flower', name: 'Flor en la Oreja', icon: '🌸', active: false }
    ],
    colors: [
      { id: 'col-koala-beige', name: 'Pelaje Beige Oficial', hex: '#CFC7BD', active: true },
      { id: 'col-koala-grey', name: 'Gris Koala Suave', hex: '#A0AEC0', active: false },
      { id: 'col-mint', name: 'Menta Pastel', hex: '#9AE6B4', active: false },
      { id: 'col-sky', name: 'Cielo Suave', hex: '#90CDF4', active: false },
      { id: 'col-peach', name: 'Durazno Cálido', hex: '#FBD38D', active: false }
    ]
  },

  // Respuestas del Chat con Puky
  chatWithPuky: {
    greetings: [
      '¡Hola amiguito! ¡Qué alegría verte hoy! 🐨✨',
      '¡Hola! ¿A qué te gustaría jugar hoy conmigo?',
      '¡Hola! Estoy muy feliz en mi habitación, ¿cómo estás?'
    ],
    responses: {
      'hola': '¡Hola! ¿Cómo estás hoy? ¡Me encanta saludarte!',
      'como estas': '¡Muy feliz y relajado comiendo ricas hojitas de eucalipto! 🍃 ¿Y tú?',
      'jugar': '¡Me encanta jugar! Podemos sumar, armar palabras o tocar el piano juntos. 🎹',
      'cuento': '¡Los cuentos son mágicos! Mi favorito es Caperucita Roja. ¿Quieres leerlo? 📖',
      'musica': '¡Tocar el piano es genial! Vayamos a la sección de Música a crear melodías. 🎵',
      'te quiero': '¡Yo también te quiero mucho! Eres mi mejor amigo. 💖🐨',
      'fruta': '¡Qué rico comer fruta saludable! Recuerda completar tu misión diaria. 🍎',
      'adios': '¡Hasta prontito! Te mando un gran abrazo de koala. 🤗'
    },
    defaultResponse: '¡Qué lindo lo que me dices! Me encanta ser tu compañero de aventuras. ¿Quieres que juguemos o leamos un cuento juntos? 🐨✨'
  },

  // Configuraciones parentales y estadísticas
  parentalSettings: {
    dailyLimitMinutes: 45,
    allowedTimeRange: { start: '08:00', end: '20:00' },
    soundVolumeLimit: 80,
    enableMusic: true,
    enableVideos: true,
    enableGames: true,
    enableStories: true,
    filterAge: '4-7 años',
    usageStats: {
      todayMinutes: 14,
      weeklyAverageMinutes: 28,
      topFeatures: [
        { name: 'Cuentos Infantiles', percentage: 40, icon: '📖', color: '#FFD1DC' },
        { name: 'Juegos Educativos', percentage: 30, icon: '🧮', color: '#BEE3F8' },
        { name: 'Crear Música', percentage: 20, icon: '🎹', color: '#FEFCBF' },
        { name: 'Videos Educativos', percentage: 10, icon: '📺', color: '#C6F6D5' }
      ],
      educationalProgress: [
        { subject: 'Lectoescritura', progress: 75, details: '3 cuentos completados' },
        { subject: 'Matemáticas Básicas', progress: 60, details: 'Sumas nivel 1 superadas' },
        { subject: 'Misiones Saludables', progress: 85, details: '6 de 7 misiones realizadas' },
        { subject: 'Habilidades Musicales', progress: 50, details: 'Exploración de escalas' }
      ]
    }
  }
};
