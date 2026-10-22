/**
 * Base de datos inicial y estructura de datos para la aplicación Kiddo
 */

const KIDDO_DATA = {
  // Estado de usuario por defecto
  user: {
    name: 'Mateo',
    avatar: 'nino', // 'nino' o 'nina'
    birthdate: '2020-05-15',
    parentPin: '1234',
    registered: false,
    sessionStartTime: Date.now(),
    todayScreenTimeMinutes: 14,
    deviceSyncCode: 'KID-7842-X',
    pairedParentDevice: 'iPhone 15 Pro de Papá',
    lastSync: 'Hace 2 minutos'
  },

  // Configuración parental (por defecto: sin restricciones activas)
  // El adulto puede modificarlas desde el Panel Parental en Ajustes.
  parentalSettings: {
    dailyLimitMinutes: 0,          // 0 = sin límite diario
    allowedTimeRange: {
      start: '08:00',
      end: '20:00',
      enabled: false               // desactivado por defecto; el adulto debe activarlo
    },
    enableMusic: true,
    enableVideos: true,
    enableGames: true,
    enableStories: true
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
  // 10 Cuentos Infantiles Clasicos con 6 paginas completas cada uno
  stories: [
    {
      id: 'caperucita',
      title: 'Caperucita Roja',
      author: 'Hermanos Grimm / Perrault',
      icon: '👧🧺',
      coverImage: 'assets/cuentos/portadas/caperucita.png',
      color: '#FFD1DC',
      gradient: 'linear-gradient(135deg, #FFD1DC, #FFE4E6)',
      coverText: "Una niña bondadosa con capa roja y su visita a la abuelita en el bosque.",
      pages: [
        {
          pageNumber: 1,
          imageType: 'caperucita-p1',
          imageSrc: 'assets/cuentos/ilustraciones/Caperucita/caperucita-p1.png',
          text: "Había una vez una niña a la que todos llamaban Caperucita Roja porque siempre llevaba una capa de ese color. Un día, su mamá preparó una canasta con pan y frutas para su abuela, que estaba enferma. «Llevásela con cariño y seguí el sendero del bosque», le pidió. Caperucita prometió tener cuidado y salió contenta hacia la casa de su abuela.",
          sceneTitle: "Una visita para la abuela"
        },
        {
          pageNumber: 2,
          imageType: 'caperucita-p2',
          imageSrc: 'assets/cuentos/ilustraciones/Caperucita/caperucita-p2.png',
          text: "Mientras caminaba, Caperucita vio flores junto al sendero. Entonces apareció un lobo y le preguntó adónde iba. Sin darse cuenta de que el animal quería engañarla, la niña le contó que visitaría a su abuela. El lobo le sugirió recoger un ramo de flores. Mientras Caperucita se detenía, él corrió por otro camino, mucho más corto.",
          sceneTitle: "El encuentro en el bosque"
        },
        {
          pageNumber: 3,
          imageType: 'caperucita-p3',
          imageSrc: 'assets/cuentos/ilustraciones/Caperucita/caperucita-p3.png',
          text: "El lobo llegó primero a la casita y llamó a la puerta imitando la voz de Caperucita. Cuando la abuela abrió, se asustó mucho. El lobo la encerró en un armario y se puso su gorro y sus lentes. Después se acostó en la cama, se tapó hasta la nariz y esperó a que llegara la niña.",
          sceneTitle: "Una visita inesperada"
        },
        {
          pageNumber: 4,
          imageType: 'caperucita-p4',
          imageSrc: 'assets/cuentos/ilustraciones/Caperucita/caperucita-p4.png',
          text: "Poco después, Caperucita entró con su canasta. La habitación estaba oscura y la abuela parecía distinta. «Abuelita, ¡qué orejas tan grandes tenés!», dijo. «Son para oírte mejor», contestó el lobo. «¡Y qué ojos tan grandes!» «Son para verte mejor». Cuando Caperucita preguntó por sus dientes, el lobo saltó de la cama y la niña pidió ayuda.",
          sceneTitle: "¡Qué ojos tan grandes!"
        },
        {
          pageNumber: 5,
          imageType: 'caperucita-p5',
          imageSrc: 'assets/cuentos/ilustraciones/Caperucita/caperucita-p5.png',
          text: "Un guardabosques que pasaba cerca escuchó el grito y entró rápidamente. El lobo, sorprendido, escapó por la ventana y corrió hacia lo profundo del bosque. El guardabosques abrió el armario y liberó a la abuela. Caperucita la abrazó con fuerza, feliz de verla sana y salva. Entre los tres cerraron bien puertas y ventanas.",
          sceneTitle: "Llega la ayuda"
        },
        {
          pageNumber: 6,
          imageType: 'caperucita-p6',
          imageSrc: 'assets/cuentos/ilustraciones/Caperucita/caperucita-p6.png',
          text: "Caperucita le contó a su abuela todo lo ocurrido. Comprendió que no debía compartir información con desconocidos ni apartarse del camino acordado sin avisar. Después prepararon té, repartieron el pan y las frutas de la canasta y disfrutaron de una hermosa merienda. Al regresar, Caperucita siguió el sendero y llegó a casa con una historia que nunca olvidaría.",
          sceneTitle: "Una merienda especial"
        }
      ]
    },
    {
      id: 'tres-cerditos',
      title: 'Los tres cerditos',
      author: 'Cuento Popular',
      icon: '🐷🏠',
      coverImage: 'assets/cuentos/portadas/tres-cerditos.png',
      color: '#FEFCBF',
      gradient: 'linear-gradient(135deg, #FEFCE8, #FFFFFF)',
      coverText: "Tres hermanos que construyen sus casas de paja, madera y fuertes ladrillos.",
      pages: [
        {
          pageNumber: 1,
          imageType: 'cerditos-p1',
          imageSrc: 'assets/cuentos/ilustraciones/Los tres Cerditos/tres-cerditos-p1.png',
          text: "Tres cerditos hermanos decidieron construir sus propias casas. El primero quería terminar rápido para ir a jugar y levantó una casita de paja. El segundo eligió madera: tardó algo más, pero pronto estuvo listo. El tercero reunió ladrillos y preparó una mezcla resistente. Sus hermanos se rieron porque trabajaba despacio. «Prefiero hacerla fuerte y segura», respondió.",
          sceneTitle: "Tres hermanos construyen"
        },
        {
          pageNumber: 2,
          imageType: 'cerditos-p2',
          imageSrc: 'assets/cuentos/ilustraciones/Los tres Cerditos/tres-cerditos-p2.png',
          text: "Una tarde apareció un lobo hambriento. Llegó a la casa de paja y llamó a la puerta. «Cerdito, dejame entrar», pidió. «¡No!», respondió el primero. Entonces el lobo sopló con tanta fuerza que la casa se desarmó y la paja voló por el aire. El cerdito corrió tan rápido como pudo hasta la casa de madera de su hermano.",
          sceneTitle: "El lobo y la paja"
        },
        {
          pageNumber: 3,
          imageType: 'cerditos-p3',
          imageSrc: 'assets/cuentos/ilustraciones/Los tres Cerditos/tres-cerditos-p3.png',
          text: "Los dos hermanos cerraron la puerta, pero el lobo llegó enseguida. Volvió a soplar una y otra vez. La madera crujió hasta que la casita se vino abajo. Los cerditos salieron corriendo entre las tablas y fueron a refugiarse en la casa de ladrillos. El tercer hermano los recibió, cerró con llave y les dijo que se quedaran tranquilos.",
          sceneTitle: "La casa de madera"
        },
        {
          pageNumber: 4,
          imageType: 'cerditos-p4',
          imageSrc: 'assets/cuentos/ilustraciones/Los tres Cerditos/tres-cerditos-p4.png',
          text: "El lobo llegó furioso y empezó a soplar. Sopló una vez, dos veces y muchas más, pero la casa de ladrillos no se movió. Empujó las paredes y golpeó la puerta: nada funcionó. Miró hacia arriba y descubrió la chimenea. Pensó que podría entrar por allí sin que los cerditos lo vieran.",
          sceneTitle: "Una casa resistente"
        },
        {
          pageNumber: 5,
          imageType: 'cerditos-p5',
          imageSrc: 'assets/cuentos/ilustraciones/Los tres Cerditos/tres-cerditos-p5.png',
          text: "Los cerditos escucharon ruidos sobre el techo. El tercer hermano había dejado una gran olla con agua caliente en la chimenea y, al oír al lobo acercarse, les pidió que se apartaran. Al sentir el vapor, el lobo se asustó, retrocedió y salió por donde había venido. Después se alejó del lugar sin volver a molestarlos.",
          sceneTitle: "Un plan que fracasa"
        },
        {
          pageNumber: 6,
          imageType: 'cerditos-p6',
          imageSrc: 'assets/cuentos/ilustraciones/Los tres Cerditos/tres-cerditos-p6.png',
          text: "Los tres hermanos celebraron que estaban a salvo. El primero y el segundo aprendieron que hacer algo con cuidado puede llevar tiempo, pero vale la pena. Juntos repararon el jardín, ordenaron la casa y prepararon una deliciosa cena. Desde entonces, cuando uno tenía una tarea difícil, los otros dos lo ayudaban. ¡Y siempre reservaban tiempo para jugar!",
          sceneTitle: "Trabajar juntos"
        }
      ]
    },
    {
      id: 'patito-feo',
      title: 'El patito feo',
      author: 'Hans Christian Andersen',
      icon: '🦆🦢',
      coverImage: 'assets/cuentos/portadas/patito-feo.png',
      color: '#BEE3F8',
      gradient: 'linear-gradient(135deg, #F0F9FF, #FFFFFF)',
      coverText: "La emotiva historia de autodescubrimiento y belleza interior que se transforma en un cisne.",
      pages: [
        {
          pageNumber: 1,
          imageType: 'patito-p1',
          imageSrc: 'assets/cuentos/ilustraciones/Patito Feo/patito-feo-p1.png',
          text: "En una granja, una pata esperaba con paciencia a que nacieran sus patitos. Uno tras otro, los huevos se abrieron y aparecieron pequeños patos amarillos. Pero quedaba un huevo grande. Cuando por fin se rompió, salió un polluelo gris, alto y algo torpe. Era distinto de sus hermanos, pero su madre lo recibió con el mismo cariño.",
          sceneTitle: "Un huevo diferente"
        },
        {
          pageNumber: 2,
          imageType: 'patito-p2',
          imageSrc: 'assets/cuentos/ilustraciones/Patito Feo/patito-feo-p2.png',
          text: "Algunos animales de la granja se burlaban de su aspecto. El patito intentaba jugar con los demás, pero a menudo lo dejaban solo. Triste, comenzó a pensar que no encajaba allí. Un día decidió explorar otros lugares. Caminó entre los juncos, cruzó un prado y encontró un estanque donde pudo descansar y escuchar el sonido tranquilo del agua.",
          sceneTitle: "Días difíciles"
        },
        {
          pageNumber: 3,
          imageType: 'patito-p3',
          imageSrc: 'assets/cuentos/ilustraciones/Patito Feo/patito-feo-p3.png',
          text: "El patito vio volar a unas aves blancas de cuello largo. Nunca había visto criaturas tan elegantes y se quedó admirándolas. Pronto llegó el invierno. Hacía mucho frío y el estanque comenzó a congelarse. El patito buscó refugio entre las plantas secas hasta que una familia amable lo encontró y le ofreció un lugar cálido para recuperarse.",
          sceneTitle: "El largo invierno"
        },
        {
          pageNumber: 4,
          imageType: 'patito-p4',
          imageSrc: 'assets/cuentos/ilustraciones/Patito Feo/patito-feo-p4.png',
          text: "Pasaron los meses. Con la primavera regresaron las flores y los días luminosos. El patito, ahora más grande, volvió al estanque. Sentía que algo había cambiado: su cuello era más largo, sus alas más fuertes y sus plumas se habían vuelto claras. Entonces vio, nadando frente a él, a aquellas hermosas aves blancas que tanto había admirado.",
          sceneTitle: "La llegada de la primavera"
        },
        {
          pageNumber: 5,
          imageType: 'patito-p5',
          imageSrc: 'assets/cuentos/ilustraciones/Patito Feo/patito-feo-p5.png',
          text: "El patito bajó la cabeza para beber agua y descubrió su reflejo. Ya no era el ave gris de la granja: ¡se había convertido en un cisne blanco! Los otros cisnes se acercaron con curiosidad y lo invitaron a nadar con ellos. Por primera vez sintió que encontraba compañeros que se parecían a él y lo recibían con alegría.",
          sceneTitle: "Un reflejo sorprendente"
        },
        {
          pageNumber: 6,
          imageType: 'patito-p6',
          imageSrc: 'assets/cuentos/ilustraciones/Patito Feo/patito-feo-p6.png',
          text: "El joven cisne extendió las alas y se deslizó sobre el agua brillante. Recordó aquellos días en que se había sentido solo y deseó que nadie tuviera que pasar por eso. Comprendió que ser diferente no era algo malo y que todos merecemos respeto. Rodeado de nuevos amigos, comenzó una etapa feliz, sin olvidar el valor de la bondad.",
          sceneTitle: "Un lugar al que pertenecer"
        }
      ]
    },
    {
      id: 'cenicienta',
      title: 'Cenicienta',
      author: 'Hermanos Grimm',
      icon: '👠✨',
      coverImage: 'assets/cuentos/portadas/cenicienta.png',
      color: '#E9D8FD',
      gradient: 'linear-gradient(135deg, #FAF5FF, #FFFFFF)',
      coverText: "Una joven amable que, con la ayuda de la magia, vive una noche especial.",
      pages: [
        {
          pageNumber: 1,
          imageType: 'cenicienta-p1',
          imageSrc: 'assets/cuentos/ilustraciones/Cenicienta/cenicienta-p1.png',
          text: "Cenicienta vivía con su madrastra y sus dos hermanastras. Desde que su padre había muerto, le encargaban casi todas las tareas de la casa y rara vez la trataban con cariño. Aun así, ella encontraba alegría en las pequeñas cosas: cuidar las plantas, cantar y conversar con sus amigos los pájaros. Soñaba con una vida en la que pudiera ser escuchada y respetada.",
          sceneTitle: "Una joven muy bondadosa"
        },
        {
          pageNumber: 2,
          imageType: 'cenicienta-p2',
          imageSrc: 'assets/cuentos/ilustraciones/Cenicienta/cenicienta-p2.png',
          text: "Un día llegó una invitación: el palacio celebraría un gran baile al que podían asistir las jóvenes del reino. Cenicienta deseaba ir, pero su madrastra no quiso ayudarla a prepararse. Cuando las otras salieron, ella se quedó sola y lloró. De pronto apareció una mujer amable y luminosa: su hada madrina, dispuesta a cumplir su deseo por una noche.",
          sceneTitle: "Una invitación al palacio"
        },
        {
          pageNumber: 3,
          imageType: 'cenicienta-p3',
          imageSrc: 'assets/cuentos/ilustraciones/Cenicienta/cenicienta-p3.png',
          text: "Con su varita, el hada transformó una calabaza en un carruaje, unos ratoncitos en caballos y la ropa gastada de Cenicienta en un vestido precioso. En sus pies brillaban unas delicadas zapatillas de cristal. «Disfrutá del baile», le dijo, «pero regresá antes de las doce: a medianoche terminará la magia». Cenicienta agradeció el regalo y partió emocionada.",
          sceneTitle: "Un vestido maravilloso"
        },
        {
          pageNumber: 4,
          imageType: 'cenicienta-p4',
          imageSrc: 'assets/cuentos/ilustraciones/Cenicienta/cenicienta-p4.png',
          text: "En el palacio, Cenicienta conoció al príncipe. Conversaron, se rieron y bailaron durante horas. Él admiró su alegría y su manera de pensar, sin saber quién era. De pronto, el reloj comenzó a dar las doce campanadas. Cenicienta recordó la advertencia y corrió hacia la salida. En la escalera perdió una zapatilla de cristal, pero no tuvo tiempo de recogerla.",
          sceneTitle: "El baile y la medianoche"
        },
        {
          pageNumber: 5,
          imageType: 'cenicienta-p5',
          imageSrc: 'assets/cuentos/ilustraciones/Cenicienta/cenicienta-p5.png',
          text: "El príncipe quiso volver a encontrar a la joven del baile. Por eso recorrió el reino con la zapatilla, buscando a quien le perteneciera. Muchas personas se la probaron, sin éxito. Cuando llegó a la casa de Cenicienta, las hermanastras intentaron calzarla primero. Cenicienta pidió su turno y la zapatilla le quedó perfecta. Entonces mostró la otra, que había guardado.",
          sceneTitle: "La zapatilla perdida"
        },
        {
          pageNumber: 6,
          imageType: 'cenicienta-p6',
          imageSrc: 'assets/cuentos/ilustraciones/Cenicienta/cenicienta-p6.png',
          text: "El príncipe reconoció a Cenicienta y ambos volvieron a encontrarse, felices. Con el tiempo decidieron compartir sus vidas, basadas en el respeto y el cariño. Cenicienta dejó atrás los días en que no escuchaban sus deseos y comenzó una etapa nueva. Nunca olvidó a quienes habían sido amables con ella y procuró ofrecer la misma bondad a los demás.",
          sceneTitle: "Un nuevo comienzo"
        }
      ]
    },
    {
      id: 'blancanieves',
      title: 'Blanca Nieves y los siete enanitos',
      author: 'Hermanos Grimm',
      icon: '🍎👑',
      coverImage: 'assets/cuentos/portadas/blancanieves.png',
      color: '#C6F6D5',
      gradient: 'linear-gradient(135deg, #F0FDF4, #FFFFFF)',
      coverText: "Una princesa bondadosa que encuentra nuevos amigos en el bosque.",
      pages: [
        {
          pageNumber: 1,
          imageType: 'blancanieves-p1',
          imageSrc: 'assets/cuentos/ilustraciones/Blanca Nieves/blanca-nieves-p1.png',
          text: "Blancanieves era una joven amable que vivía en un castillo. Su madrastra, la reina, tenía un espejo mágico al que preguntaba quién era la más hermosa. Durante mucho tiempo, el espejo respondía que era ella. Pero un día nombró a Blancanieves. La reina sintió tantos celos que ordenó a un cazador llevar a la muchacha lejos del castillo. Él, incapaz de hacerle daño, la dejó escapar.",
          sceneTitle: "El espejo de la reina"
        },
        {
          pageNumber: 2,
          imageType: 'blancanieves-p2',
          imageSrc: 'assets/cuentos/ilustraciones/Blanca Nieves/blanca-nieves-p2.png',
          text: "Blancanieves caminó por el bosque hasta encontrar una pequeña casa. Dentro había siete sillitas, siete platos y siete camitas. Como estaba agotada, se quedó dormida. Al anochecer regresaron siete mineros que trabajaban en las montañas. Se sorprendieron al verla, escucharon su historia y le ofrecieron quedarse con ellos mientras buscaba un lugar seguro.",
          sceneTitle: "Una casita en el bosque"
        },
        {
          pageNumber: 3,
          imageType: 'blancanieves-p3',
          imageSrc: 'assets/cuentos/ilustraciones/Blanca Nieves/blanca-nieves-p3.png',
          text: "La reina descubrió, gracias a su espejo, que Blancanieves seguía viva. Se disfrazó de anciana y llegó a la casita con una cesta de manzanas. Blancanieves recordó que debía tener cuidado con los desconocidos, pero la mujer fingió ser amable y le ofreció una fruta. Después de morderla, Blancanieves cayó en un sueño profundo. La reina se alejó creyendo que nadie podría despertarla.",
          sceneTitle: "La visita de la desconocida"
        },
        {
          pageNumber: 4,
          imageType: 'blancanieves-p4',
          imageSrc: 'assets/cuentos/ilustraciones/Blanca Nieves/blanca-nieves-p4.png',
          text: "Cuando regresaron, los siete amigos se preocuparon muchísimo. Intentaron despertar a Blancanieves, pero ella no respondía. Se quedaron a su lado y la cuidaron con ternura. Pasaron los días. Como parecía dormir serenamente, prepararon un lugar hermoso lleno de flores donde pudieran acompañarla y esperar alguna señal de que despertaría.",
          sceneTitle: "Los amigos la encuentran"
        },
        {
          pageNumber: 5,
          imageType: 'blancanieves-p5',
          imageSrc: 'assets/cuentos/ilustraciones/Blanca Nieves/blanca-nieves-p5.png',
          text: "Un día llegó un joven príncipe que conocía historias sobre la bondad de Blancanieves. Mientras los amigos la trasladaban con cuidado, un movimiento inesperado hizo que se desprendiera el trocito de manzana que tenía atascado en la garganta. Blancanieves abrió los ojos y respiró profundamente. Todos la rodearon, sorprendidos y felices de verla despierta.",
          sceneTitle: "El despertar"
        },
        {
          pageNumber: 6,
          imageType: 'blancanieves-p6',
          imageSrc: 'assets/cuentos/ilustraciones/Blanca Nieves/blanca-nieves-p6.png',
          text: "Blancanieves abrazó a sus siete amigos y les agradeció que nunca la abandonaran. Decidió empezar una vida lejos de la reina, rodeada de personas que la apreciaran por su bondad y valentía. Conoció mejor al príncipe y, con el tiempo, nació entre ellos un gran cariño. Los siete amigos siguieron visitándola. Blancanieves aprendió que la verdadera amistad cuida, acompaña y respeta.",
          sceneTitle: "Una vida elegida"
        }
      ]
    },
    {
      id: 'gato-botas',
      title: 'El gato con botas',
      author: 'Charles Perrault',
      icon: '🐱👢',
      coverImage: 'assets/cuentos/portadas/gato-botas.png',
      color: '#C7D2FE',
      gradient: 'linear-gradient(135deg, #EEF2FF, #FFFFFF)',
      coverText: "Un gato muy ingenioso ayuda a su dueño a encontrar nuevas oportunidades.",
      pages: [
        {
          pageNumber: 1,
          imageType: 'gatobotas-p1',
          imageSrc: 'assets/cuentos/ilustraciones/Gato con botas/gato-botas-p1.png',
          text: "Cuando un molinero murió, repartió sus bienes entre sus tres hijos. Al menor solo le dejó un gato. El joven estaba desanimado, pero el animal lo sorprendió hablando: «Si me conseguís unas botas y una bolsa, voy a ayudarte». Aunque no entendía cómo, el muchacho confió en él. El gato se calzó las botas, levantó la cabeza y salió decidido a buscar una oportunidad.",
          sceneTitle: "Una herencia inesperada"
        },
        {
          pageNumber: 2,
          imageType: 'gatobotas-p2',
          imageSrc: 'assets/cuentos/ilustraciones/Gato con botas/gato-botas-p2.png',
          text: "El gato llevó al rey algunos regalos del campo y dijo que venían de parte de su amo, al que presentó como el Marqués de Carabás. El rey quedó intrigado por aquel personaje desconocido. Cada vez que regresaba, el gato inventaba nuevos detalles. Mientras tanto, su amo se preguntaba qué plan tendría aquel compañero tan astuto.",
          sceneTitle: "Un gato muy ingenioso"
        },
        {
          pageNumber: 3,
          imageType: 'gatobotas-p3',
          imageSrc: 'assets/cuentos/ilustraciones/Gato con botas/gato-botas-p3.png',
          text: "Un día, el gato supo que el rey pasearía con su hija cerca del río. Convenció a su amo de bañarse allí y escondió sus ropas. Cuando pasó el carruaje, pidió ayuda a gritos: «¡Han perdido la ropa del marqués!». El rey, recordando los regalos, mandó traer un hermoso traje. Así, el joven pudo presentarse y conversar con la princesa.",
          sceneTitle: "Un encuentro junto al río"
        },
        {
          pageNumber: 4,
          imageType: 'gatobotas-p4',
          imageSrc: 'assets/cuentos/ilustraciones/Gato con botas/gato-botas-p4.png',
          text: "El gato corrió por delante del carruaje y habló con los campesinos que trabajaban en los campos. Les pidió que dijeran que esas tierras pertenecían al Marqués de Carabás. Cuando el rey preguntaba de quién eran los cultivos, todos repetían aquel nombre. El joven, que viajaba junto a la princesa, no entendía cómo había conseguido su gato organizar semejante sorpresa.",
          sceneTitle: "Los campos del camino"
        },
        {
          pageNumber: 5,
          imageType: 'gatobotas-p5',
          imageSrc: 'assets/cuentos/ilustraciones/Gato con botas/gato-botas-p5.png',
          text: "El gato llegó a un castillo gobernado por un ogro que podía transformarse en distintos animales. El gato lo felicitó por su poder y le pidió una demostración. Primero, el ogro se volvió león. Después, para presumir aún más, se convirtió en un ratón. De un salto, el gato lo atrapó y el ogro huyó para no volver. El castillo quedó libre.",
          sceneTitle: "El castillo del ogro"
        },
        {
          pageNumber: 6,
          imageType: 'gatobotas-p6',
          imageSrc: 'assets/cuentos/ilustraciones/Gato con botas/gato-botas-p6.png',
          text: "Cuando llegó el carruaje, el gato abrió las puertas del castillo y recibió a todos. El rey quedó impresionado. Con el tiempo, el joven y la princesa se hicieron amigos y se enamoraron. El gato fue celebrado por su ingenio, aunque su amo comprendió que, de allí en adelante, debían construir una vida con honestidad y esfuerzo, no solamente con los trucos de su compañero.",
          sceneTitle: "El verdadero comienzo"
        }
      ]
    },
    {
      id: 'ricitos-oro',
      title: 'Ricitos de Oro',
      author: 'Robert Southey',
      icon: '🥣🐻',
      coverImage: 'assets/cuentos/portadas/ricitos-oro.png',
      color: '#FEFCBF',
      gradient: 'linear-gradient(135deg, #FEFCE8, #FFFFFF)',
      coverText: "Una niña curiosa aprende a respetar la casa y las pertenencias de tres osos.",
      pages: [
        {
          pageNumber: 1,
          imageType: 'ricitos-p1',
          text: "En una casita del bosque vivían tres osos: uno grande, uno mediano y uno pequeño. Una mañana prepararon avena para desayunar, pero estaba demasiado caliente. Decidieron salir a caminar mientras se enfriaba. Poco después, una niña llamada Ricitos de Oro llegó a la puerta. Llamó varias veces y, como nadie respondió, entró sin permiso.",
          sceneTitle: "Una casa en el bosque"
        },
        {
          pageNumber: 2,
          imageType: 'ricitos-p2',
          text: "Sobre la mesa había tres platos. Ricitos probó el grande: «¡Está demasiado caliente!». Probó el mediano: «¡Está demasiado frío!». Después probó el pequeño: «¡Este está justo como me gusta!». Y se comió toda la avena del osito. Al terminar, sintió ganas de sentarse y descansar un momento.",
          sceneTitle: "Tres platos de avena"
        },
        {
          pageNumber: 3,
          imageType: 'ricitos-p3',
          text: "La primera silla era enorme y demasiado dura. La segunda era más pequeña, pero muy blanda. La tercera parecía perfecta para ella. Ricitos se sentó, se acomodó y comenzó a balancearse. ¡Crac! La silla del osito se rompió. La niña se levantó sorprendida. En vez de salir a buscar al dueño, subió las escaleras para explorar la casa.",
          sceneTitle: "Tres sillas diferentes"
        },
        {
          pageNumber: 4,
          imageType: 'ricitos-p4',
          text: "Arriba encontró tres camas. La grande era muy firme y la mediana, demasiado mullida. La pequeña era cómoda y calentita. Ricitos se acurrucó y se quedó dormida. Mientras tanto, los tres osos regresaron de su paseo. Apenas entraron, descubrieron que alguien había probado la comida y desordenado la sala.",
          sceneTitle: "Tres camas"
        },
        {
          pageNumber: 5,
          imageType: 'ricitos-p5',
          text: "«¡Alguien comió mi avena!», exclamó el osito. Luego vio su silla rota y se entristeció. Los tres subieron al dormitorio y encontraron a Ricitos dormida. Cuando la niña despertó, se asustó al verlos. Pero los osos no querían hacerle daño: solo deseaban entender por qué había entrado en su casa sin permiso.",
          sceneTitle: "Los osos regresan"
        },
        {
          pageNumber: 6,
          imageType: 'ricitos-p6',
          text: "Ricitos de Oro reconoció lo que había hecho. «Perdón por entrar, comer su desayuno y romper la silla», dijo avergonzada. Prometió pedir permiso antes de tocar las cosas de otras personas. Los osos aceptaron sus disculpas y la acompañaron hasta el sendero. Al llegar a casa, Ricitos contó lo ocurrido y nunca olvidó aquella importante lección sobre el respeto.",
          sceneTitle: "Aprender a respetar"
        }
      ]
    },
    {
      id: 'hansel-gretel',
      title: 'Hansel y Gretel',
      author: 'Hermanos Grimm',
      icon: '🍬🏠',
      coverImage: 'assets/cuentos/portadas/hansel-gretel.png',
      color: '#FBCFE8',
      gradient: 'linear-gradient(135deg, #FDF2F8, #FFFFFF)',
      coverText: "Dos hermanos encuentran una casita de dulces y consiguen regresar juntos a su hogar.",
      pages: [
        {
          pageNumber: 1,
          imageType: 'hansel-p1',
          text: "Hansel y Gretel vivían con su padre y su madrastra en una pequeña casa cerca del bosque. La familia atravesaba tiempos difíciles y a veces había muy poco para comer. Una mañana, los adultos llevaron a los hermanos a buscar leña, pero los dejaron solos entre los árboles. Asustados, los niños se tomaron de la mano y trataron de encontrar el camino de regreso.",
          sceneTitle: "Una familia con dificultades"
        },
        {
          pageNumber: 2,
          imageType: 'hansel-p2',
          text: "Hansel había llevado un pedacito de pan y dejó pequeñas migas para recordar por dónde pasaban. Sin embargo, los pájaros se las comieron. Cuando los hermanos quisieron volver, ya no pudieron seguir el rastro. Caminaron durante horas, se animaron mutuamente y buscaron refugio antes de que llegara la noche.",
          sceneTitle: "Un rastro de migas"
        },
        {
          pageNumber: 3,
          imageType: 'hansel-p3',
          text: "Al día siguiente encontraron algo increíble: una casa hecha de dulces, galletas y azúcar. Como tenían hambre, probaron un trocito. Entonces salió una anciana y los invitó a entrar. Les ofreció comida y camas cómodas, pero su aparente amabilidad escondía malas intenciones: quería mantener a los niños encerrados para quedarse con ellos.",
          sceneTitle: "La casa de golosinas"
        },
        {
          pageNumber: 4,
          imageType: 'hansel-p4',
          text: "La mujer encerró a Hansel en una habitación y obligó a Gretel a ayudarla en la cocina. Cada día preguntaba si Hansel había engordado y él le mostraba un huesito, que ella confundía con su dedo porque veía muy mal. Gretel, mientras tanto, observaba las llaves y buscaba un momento para liberar a su hermano.",
          sceneTitle: "Un plan para escapar"
        },
        {
          pageNumber: 5,
          imageType: 'hansel-p5',
          text: "Un día, cuando la anciana se distrajo junto al horno, Gretel logró apartarse, tomó las llaves y abrió la puerta de Hansel. Los dos escaparon rápidamente de la casa de dulces. Corrieron entre los árboles hasta llegar a un río. Con ayuda de un pato que los llevó de una orilla a otra, pudieron continuar el camino sin regresar junto a la anciana.",
          sceneTitle: "Los hermanos se ayudan"
        },
        {
          pageNumber: 6,
          imageType: 'hansel-p6',
          text: "Después de caminar mucho, reconocieron un sendero conocido y encontraron su hogar. Su padre, arrepentido por haberlos dejado solos, los abrazó emocionado y prometió cuidarlos mejor. La madrastra ya no vivía allí. Con esfuerzo y ayuda de sus vecinos, la familia encontró una forma de salir adelante. Hansel y Gretel recordaron siempre que juntos habían sido más valientes.",
          sceneTitle: "El regreso a casa"
        }
      ]
    },
    {
      id: 'pinocho',
      title: 'Pinocho',
      author: 'Carlo Collodi',
      icon: '🤥🪵',
      coverImage: 'assets/cuentos/portadas/pinocho.png',
      color: '#FED7AA',
      gradient: 'linear-gradient(135deg, #FFF7ED, #FFFFFF)',
      coverText: "Un muñeco de madera que sueña con ser un niño de verdad y aprende sobre la honestidad.",
      pages: [
        {
          pageNumber: 1,
          imageType: 'pinocho-p1',
          text: "Un carpintero llamado Geppetto construyó un muñeco de madera y lo llamó Pinocho. Deseaba tanto tener un hijo que se sorprendió cuando, gracias a un poco de magia, el muñeco comenzó a moverse y hablar. Geppetto lo abrazó con alegría. Pinocho quería descubrir el mundo, pero todavía tenía mucho que aprender sobre las decisiones, la verdad y el cuidado de quienes lo querían.",
          sceneTitle: "Un muñeco especial"
        },
        {
          pageNumber: 2,
          imageType: 'pinocho-p2',
          text: "Geppetto consiguió un libro para que Pinocho pudiera ir a la escuela. Sin embargo, camino a clase, el muñeco escuchó música y se acercó a un teatro de marionetas. Fascinado por las luces, olvidó la escuela. Allí conoció a personas que intentaron aprovecharse de su ingenuidad. Pinocho logró salir, pero comprendió que las decisiones impulsivas podían meterlo en problemas.",
          sceneTitle: "El primer camino equivocado"
        },
        {
          pageNumber: 3,
          imageType: 'pinocho-p3',
          text: "Cuando un hada bondadosa le preguntó qué había pasado, Pinocho sintió vergüenza y mintió. Entonces su nariz comenzó a crecer. Cada mentira la hacía un poquito más larga. Asustado, confesó la verdad y pidió perdón. El hada lo ayudó y le explicó que decir la verdad es importante, especialmente cuando uno se equivoca. Pinocho prometió esforzarse por actuar mejor.",
          sceneTitle: "Una mentira que crece"
        },
        {
          pageNumber: 4,
          imageType: 'pinocho-p4',
          text: "Aun así, Pinocho volvió a distraerse. Un muchacho lo invitó a un lugar donde nadie estudiaba y todos jugaban sin descanso. Al principio parecía divertido, pero pronto descubrió que allí los niños eran transformados en burritos. Pinocho también comenzó a cambiar y se asustó. Con valentía logró escapar y buscó el camino de vuelta, dispuesto a encontrar a Geppetto.",
          sceneTitle: "El país de los juegos"
        },
        {
          pageNumber: 5,
          imageType: 'pinocho-p5',
          text: "Pinocho se enteró de que Geppetto había salido a buscarlo por el mar y no había regresado. Sin dudarlo, fue tras él. En medio de una tormenta, un enorme animal marino los engulló por separado. Dentro de su vientre oscuro, Pinocho encontró a Geppetto. Juntos idearon una forma de salir y, aprovechando un gran estornudo del animal, alcanzaron el mar abierto.",
          sceneTitle: "En busca de Geppetto"
        },
        {
          pageNumber: 6,
          imageType: 'pinocho-p6',
          text: "Pinocho ayudó a Geppetto a llegar sano y salvo a la playa. De regreso en casa lo cuidó, retomó sus estudios y comenzó a tomar decisiones más responsables. El hada vio cuánto había crecido por dentro y le concedió su mayor deseo: convertirse en un niño de verdad. Pinocho abrazó a Geppetto y comprendió que la valentía también significa reconocer errores y cuidar a los demás.",
          sceneTitle: "Un corazón valiente"
        }
      ]
    },
    {
      id: 'bella-durmiente',
      title: 'La bella durmiente',
      author: 'Charles Perrault',
      icon: '🌹👑',
      coverImage: 'assets/cuentos/portadas/bella-durmiente.png',
      color: '#E9D8FD',
      gradient: 'linear-gradient(135deg, #FAF5FF, #FFFFFF)',
      coverText: "Una princesa y todo su castillo despiertan de un largo sueño encantado.",
      pages: [
        {
          pageNumber: 1,
          imageType: 'belladurmiente-p1',
          imageSrc: 'assets/cuentos/ilustraciones/Bella Durmiente/bella-durmiente-p1.png',
          text: "Hace mucho tiempo, un rey y una reina tuvieron una hija a la que llamaron Aurora. Para celebrar su nacimiento organizaron una gran fiesta e invitaron a las hadas del reino. Cada una le ofreció un regalo: alegría, bondad, imaginación y sabiduría. Pero apareció un hada que no había sido invitada y, muy ofendida, lanzó un hechizo sobre la pequeña.",
          sceneTitle: "Una princesa y una celebración"
        },
        {
          pageNumber: 2,
          imageType: 'belladurmiente-p2',
          imageSrc: 'assets/cuentos/ilustraciones/Bella Durmiente/bella-durmiente-p2.png',
          text: "El hada dijo que, al cumplir cierta edad, Aurora se pincharía un dedo con el huso de una rueca y caería dormida. Una de las hadas buenas todavía no había entregado su regalo y suavizó el hechizo: la princesa no moriría, sino que dormiría profundamente hasta que llegara el momento de despertar. El rey ordenó retirar las ruecas del palacio para proteger a su hija.",
          sceneTitle: "El hechizo"
        },
        {
          pageNumber: 3,
          imageType: 'belladurmiente-p3',
          imageSrc: 'assets/cuentos/ilustraciones/Bella Durmiente/bella-durmiente-p3.png',
          text: "Aurora creció rodeada de libros, jardines y personas que la querían. Años después, en un rincón del castillo, descubrió a una anciana hilando junto a una rueca. Curiosa, se acercó para ver cómo funcionaba. Antes de que nadie pudiera detenerla, se pinchó un dedo y cayó dormida. El hechizo se cumplió y el hada buena extendió el sueño a todo el castillo.",
          sceneTitle: "El día inesperado"
        },
        {
          pageNumber: 4,
          imageType: 'belladurmiente-p4',
          imageSrc: 'assets/cuentos/ilustraciones/Bella Durmiente/bella-durmiente-p4.png',
          text: "Los cocineros dejaron de cocinar, los músicos soltaron sus instrumentos y hasta los animales descansaron. Alrededor del castillo comenzó a crecer un espeso jardín de rosales, como si la naturaleza quisiera cuidarlo mientras esperaba. Pasaron muchos años. En los pueblos cercanos, las familias contaban la historia de la princesa dormida y del palacio escondido entre las flores.",
          sceneTitle: "El castillo silencioso"
        },
        {
          pageNumber: 5,
          imageType: 'belladurmiente-p5',
          imageSrc: 'assets/cuentos/ilustraciones/Bella Durmiente/bella-durmiente-p5.png',
          text: "Un príncipe escuchó aquella leyenda y decidió conocer el misterioso castillo. Cuando llegó, los rosales se abrieron formando un sendero: el tiempo del hechizo estaba llegando a su fin. Caminó por los salones silenciosos hasta encontrar a Aurora dormida. Entonces las campanas comenzaron a sonar y, con el amanecer, la magia finalmente se deshizo.",
          sceneTitle: "Un visitante curioso"
        },
        {
          pageNumber: 6,
          imageType: 'belladurmiente-p6',
          imageSrc: 'assets/cuentos/ilustraciones/Bella Durmiente/bella-durmiente-p6.png',
          text: "Aurora abrió los ojos y vio la luz entrando por las ventanas. Poco a poco despertaron el rey, la reina y todos los habitantes del castillo. Hubo abrazos, canciones y una gran fiesta para celebrar el regreso de la vida. Aurora conoció al príncipe, conversaron y se hicieron amigos. El reino recuperó su alegría y, desde entonces, celebró cada día como un regalo.",
          sceneTitle: "Un nuevo amanecer"
        }
      ]
    }
  ],
  videos: {
    categories: [
      { id: 'aprender', name: 'Aprender', icon: '📚' },
      { id: 'entretenimiento', name: 'Entretenimiento', icon: '🍿' },
      { id: 'bailar', name: 'Bailar', icon: '🎵' },
      { id: 'crear', name: 'Crear', icon: '🎨' }
    ],
    items: [
      // 1. APRENDER (4 videos)
      {
        id: 'vid-ap-1',
        title: 'El abecedario de la A a la Z',
        channel: 'Smile and Learn - Español',
        category: 'aprender',
        videoId: 'AV8fPO0VN14',
        videoUrl: 'https://www.youtube.com/watch?v=AV8fPO0VN14',
        thumbnail: 'https://i.ytimg.com/vi/AV8fPO0VN14/hqdefault.jpg'
      },
      {
        id: 'vid-ap-2',
        title: 'Sílabas para niños con música',
        channel: 'FIESTIKIDS',
        category: 'aprender',
        videoId: 'j1RIUuftxKo',
        videoUrl: 'https://www.youtube.com/watch?v=j1RIUuftxKo',
        thumbnail: 'https://i.ytimg.com/vi/j1RIUuftxKo/hqdefault.jpg'
      },
      {
        id: 'vid-ap-3',
        title: 'El sistema solar y los planetas',
        channel: 'Happy Learning Español',
        category: 'aprender',
        videoId: 'ZykXgSqet6A',
        videoUrl: 'https://www.youtube.com/watch?v=ZykXgSqet6A',
        thumbnail: 'https://i.ytimg.com/vi/ZykXgSqet6A/hqdefault.jpg'
      },
      {
        id: 'vid-ap-4',
        title: 'El ciclo del agua',
        channel: 'Happy Learning Español',
        category: 'aprender',
        videoId: 'QDCohXW6blg',
        videoUrl: 'https://www.youtube.com/watch?v=QDCohXW6blg',
        thumbnail: 'https://i.ytimg.com/vi/QDCohXW6blg/hqdefault.jpg'
      },

      // 2. ENTRETENIMIENTO (5 videos)
      {
        id: 'vid-en-1',
        title: 'Luna cansada',
        channel: 'Canticuénticos',
        category: 'entretenimiento',
        videoId: 'tudwNZGbWXY',
        videoUrl: 'https://www.youtube.com/watch?v=tudwNZGbWXY',
        thumbnail: 'https://i.ytimg.com/vi/tudwNZGbWXY/hqdefault.jpg'
      },
      {
        id: 'vid-en-2',
        title: 'A cocochito',
        channel: 'Canticuénticos',
        category: 'entretenimiento',
        videoId: '4Lrc4MnBH78',
        videoUrl: 'https://www.youtube.com/watch?v=4Lrc4MnBH78',
        thumbnail: 'https://i.ytimg.com/vi/4Lrc4MnBH78/hqdefault.jpg'
      },
      {
        id: 'vid-en-3',
        title: 'Vamos a plantar',
        channel: 'Canticuénticos',
        category: 'entretenimiento',
        videoId: 'Ko8wa5dHIjw',
        videoUrl: 'https://www.youtube.com/watch?v=Ko8wa5dHIjw',
        thumbnail: 'https://i.ytimg.com/vi/Ko8wa5dHIjw/hqdefault.jpg'
      },
      {
        id: 'vid-en-4',
        title: 'Zamba para aprender a caminar',
        channel: 'Canticuénticos',
        category: 'entretenimiento',
        videoId: 'IwrtTJTKWpY',
        videoUrl: 'https://www.youtube.com/watch?v=IwrtTJTKWpY',
        thumbnail: 'https://i.ytimg.com/vi/IwrtTJTKWpY/hqdefault.jpg'
      },
      {
        id: 'vid-en-5',
        title: 'Hay secretos',
        channel: 'Canticuénticos',
        category: 'entretenimiento',
        videoId: 'KD2zGDD1wNg',
        videoUrl: 'https://www.youtube.com/watch?v=KD2zGDD1wNg',
        thumbnail: 'https://i.ytimg.com/vi/KD2zGDD1wNg/hqdefault.jpg'
      },

      // 3. BAILAR (4 videos)
      {
        id: 'vid-ba-1',
        title: 'El monstruo de la laguna',
        channel: 'Canticuénticos',
        category: 'bailar',
        videoId: 'UQW1C8j0FZo',
        videoUrl: 'https://www.youtube.com/watch?v=UQW1C8j0FZo',
        thumbnail: 'https://i.ytimg.com/vi/UQW1C8j0FZo/hqdefault.jpg'
      },
      {
        id: 'vid-ba-2',
        title: 'Bate con la cucharita',
        channel: 'Canticuénticos',
        category: 'bailar',
        videoId: 'EoGdJbkWoDU',
        videoUrl: 'https://www.youtube.com/watch?v=EoGdJbkWoDU',
        thumbnail: 'https://i.ytimg.com/vi/EoGdJbkWoDU/hqdefault.jpg'
      },
      {
        id: 'vid-ba-3',
        title: 'El mamboretá',
        channel: 'Canticuénticos',
        category: 'bailar',
        videoId: '-ilPkG2TKzI',
        videoUrl: 'https://www.youtube.com/watch?v=-ilPkG2TKzI',
        thumbnail: 'https://i.ytimg.com/vi/-ilPkG2TKzI/hqdefault.jpg'
      },
      {
        id: 'vid-ba-4',
        title: 'La rana Rosita',
        channel: 'Canticuénticos',
        category: 'bailar',
        videoId: '5bWM2gGB-Fs',
        videoUrl: 'https://www.youtube.com/watch?v=5bWM2gGB-Fs',
        thumbnail: 'https://i.ytimg.com/vi/5bWM2gGB-Fs/hqdefault.jpg'
      },

      // 4. CREAR (6 videos)
      {
        id: 'vid-cr-1',
        title: 'Avión de papel',
        channel: 'TheBroCrafts',
        category: 'crear',
        videoId: '44iMaTOd89A',
        videoUrl: 'https://www.youtube.com/watch?v=44iMaTOd89A',
        thumbnail: 'https://i.ytimg.com/vi/44iMaTOd89A/hqdefault.jpg'
      },
      {
        id: 'vid-cr-2',
        title: 'Serpientes de papel',
        channel: 'Luna art and craft',
        category: 'crear',
        videoId: 'yF2UU4iENoI',
        videoUrl: 'https://www.youtube.com/watch?v=yF2UU4iENoI',
        thumbnail: 'https://i.ytimg.com/vi/yF2UU4iENoI/hqdefault.jpg'
      },
      {
        id: 'vid-cr-3',
        title: 'Sapito de papel',
        channel: 'Origami Kültür',
        category: 'crear',
        videoId: 'FiXzqN1qWkU',
        videoUrl: 'https://www.youtube.com/watch?v=FiXzqN1qWkU',
        thumbnail: 'https://i.ytimg.com/vi/FiXzqN1qWkU/hqdefault.jpg'
      },
      {
        id: 'vid-cr-4',
        title: 'Barco de papel',
        channel: 'Guiainfantil Brasil',
        category: 'crear',
        videoId: 'CPrdggN48-c',
        videoUrl: 'https://www.youtube.com/watch?v=CPrdggN48-c',
        thumbnail: 'https://i.ytimg.com/vi/CPrdggN48-c/hqdefault.jpg'
      },
      {
        id: 'vid-cr-5',
        title: 'Slime',
        channel: 'Manualidades Play',
        category: 'crear',
        videoId: '_VZSxztmt54',
        videoUrl: 'https://www.youtube.com/watch?v=_VZSxztmt54',
        thumbnail: 'https://i.ytimg.com/vi/_VZSxztmt54/hqdefault.jpg'
      },
      {
        id: 'vid-cr-6',
        title: 'Flores',
        channel: 'SNL CRAFTS',
        category: 'crear',
        videoId: '-wlE5IJmlZE',
        videoUrl: 'https://www.youtube.com/watch?v=-wlE5IJmlZE',
        thumbnail: 'https://i.ytimg.com/vi/-wlE5IJmlZE/hqdefault.jpg'
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
    allowedTimeRange: { start: '08:00', end: '20:00', enabled: true },
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
