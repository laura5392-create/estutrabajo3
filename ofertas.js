// ============================================================================
//  ofertas.js — Datos de cada puesto de trabajo
//  Archivo de solo datos. No ejecuta nada: lo consumen el resto de scripts.
//
//  Índice = posición de la oferta en el orden ORIGINAL del HTML (0–15),
//  que es el mismo valor que empleos.js asigna a data-indice ANTES de ordenar.
//
//  ⚠ Al añadir una oferta: va SIEMPRE al final del HTML y aquí, con el índice
//    siguiente. Insertar en medio desplaza los índices y mezcla los datos.
// ============================================================================

// Franjas horarias disponibles para el estudiante
const FRANJAS = ['manana', 'tarde', 'noche'];

// Días abreviados: lun, mar, mie, jue, vie, sab, dom
const DIAS = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'];

const OFERTAS = {
  0: {
    puesto: 'Auxiliar de tienda',
    empresa: 'Almacenes El Sol',
    tareas: [
      'Atender a clientes en tienda y asesorar sobre productos y tallas.',
      'Reponer y ordenar la mercadería en estanterías y vitrinas.',
      'Registrar ventas en el sistema de caja de la tienda.',
      'Cuidar la presentación del punto de venta.',
    ],
    requisitos: [
      'Ser estudiante de secundaria, técnico o universidad en curso.',
      'Disponibilidad en las tardes de lunes a viernes, y sábados por la mañana.',
      'Buena disposición y trato amable con el público.',
      'Sin experiencia previa: la empresa capacita.',
    ],
    disponibilidad: { dias: ['lun', 'mar', 'mie', 'jue', 'vie'], franja: 'tarde' },
    disponibilidadExtra: { sab: 'manana' },
    habilidades: ['atención al cliente', 'ventas', 'caja', 'trato amable', 'organización'],
  },
  1: {
    puesto: 'Atención al cliente',
    empresa: 'Nexo Servicios',
    tareas: [
      'Atender llamadas entrantes y resolver consultas de clientes.',
      'Registrar cada contacto en el sistema de seguimiento.',
      'Escalar a soporte técnico los casos complejos.',
      'Mantener al día la base de datos de clientes.',
    ],
    requisitos: [
      'Estudiar o haber terminado bachillerato.',
      'Redacción clara y buena dicción al hablar.',
      'Manejo básico de computador y correo electrónico.',
      'Trabajo remoto: solo necesitas internet y un espacio tranquilo.',
    ],
    disponibilidad: { dias: ['lun', 'mar', 'mie', 'jue', 'vie'], franja: 'manana' },
    habilidades: ['atención al cliente', 'telefono', 'comunicación', 'redacción', 'crm'],
  },
  2: {
    puesto: 'Asistente administrativo',
    empresa: 'Oficina Ágil',
    tareas: [
      'Apoyar tareas de archivo y organización documental.',
      'Digitando información en tablas de cálculo.',
      'Atender llamadas y tomar mensajes.',
      'Apoyar en la elaboración de informes internos.',
    ],
    requisitos: [
      'Nivel básico de ofimática: Word, Excel y correo.',
      'Atención al detalle al momento de digitar.',
      'Disponibilidad de 4 horas al día, en la mañana o la tarde.',
      'Experiencia no requerida.',
    ],
    disponibilidad: { dias: ['lun', 'mar', 'mie', 'jue'], franja: 'tarde' },
    habilidades: ['administración', 'office', 'excel', 'organización', 'archivación'],
  },
  3: {
    puesto: 'Ayudante de cafetería',
    empresa: 'Café de la Esquina',
    tareas: [
      'Preparar y servir bebidas y alimentos de la carta.',
      'Atender a los clientes en barra y en mesa.',
      'Limpiar y ordenar la estación antes de abrir.',
      'Reponer insumos y avisar sobre faltantes a la administración.',
    ],
    requisitos: [
      'Disponibilidad los fines de semana: sábado y domingo.',
      'Buena actitud de servicio y trato cordial.',
      'Preferible haber trabajado en cafetería o restaurante.',
      'Edad mínima de 18 años.',
    ],
    disponibilidad: { dias: ['sab', 'dom'], franja: 'manana' },
    habilidades: ['servicios', 'restaurante', 'cafetería', 'atención al cliente', 'limpieza'],
  },
  4: {
    puesto: 'Monitor de biblioteca',
    empresa: 'Biblioteca Central',
    tareas: [
      'Ordenar y clasificar el material bibliográfico.',
      'Atender el préstamo y la devolución de libros.',
      'Apoyar a los usuarios en la búsqueda de textos.',
      'Mantener el registro de préstamos al día.',
    ],
    requisitos: [
      'Estar matriculado en cualquier programa de educación superior.',
      'Manejo responsable de los materiales de la biblioteca.',
      'Atención amable y orientación al público lector.',
      'Disponibilidad de 3 a 4 horas, en turno de mañana o tarde.',
    ],
    disponibilidad: { dias: ['lun', 'mar', 'mie', 'jue', 'vie'], franja: 'tarde' },
    habilidades: ['biblioteca', 'organización', 'atención al cliente', 'archivo', 'registro'],
  },
  5: {
    puesto: 'Cajero de supermercado',
    empresa: 'Supertienda Andina',
    tareas: [
      'Cobrar y registrar las ventas en el punto de pago.',
      'Atender consultas de clientes sobre productos y precios.',
      'Reponer los productos en los estantes y góndolas.',
      'Cerrar caja y hacer el corte de turno.',
    ],
    requisitos: [
      'Disponibilidad viernes, sábado, domingo y festivos.',
      'Conocimiento básico de aritmética y manejo de dinero.',
      'Agilidad y buena memoria para la caja.',
      'Mayor de edad, por el manejo de caja.',
    ],
    disponibilidad: { dias: ['vie', 'sab', 'dom'], franja: 'tarde' },
    habilidades: ['caja', 'ventas', 'atención al cliente', 'agilidad', 'inventario'],
  },
  6: {
    puesto: 'Tutor de matemáticas',
    empresa: 'Academia Descartes',
    tareas: [
      'Dictar clases particulares de matemáticas.',
      'Preparar ejercicios según el grado del estudiante.',
      'Hacer seguimiento al progreso de cada alumno.',
      'Coordinar los horarios directamente con las familias.',
    ],
    requisitos: [
      'Buen rendimiento en matemáticas: mínimo segundo semestre de universidad.',
      'Paciencia y capacidad para explicar con claridad.',
      'Disponibilidad de 2 a 3 horas, entre semana o fin de semana.',
      'Tú eliges tus horarios y a quién acompanar.',
    ],
    disponibilidad: { dias: ['lun', 'mar', 'mie', 'jue', 'vie'], franja: 'tarde' },
    habilidades: ['docencia', 'matemáticas', 'explicar', 'paciencia', 'refuerzo escolar'],
  },
  7: {
    puesto: 'Community manager',
    empresa: 'Agencia Pixel',
    tareas: [
      'Redactar y publicar el contenido de las redes sociales.',
      'Responder mensajes y comentarios de los seguidores.',
      'Crear piezas gráficas básicas con Canva.',
      'Medir el alcance y redactar reportes mensuales.',
    ],
    requisitos: [
      'Conocer el funcionamiento de Instagram, TikTok y Facebook.',
      'Manejo de herramientas ofimáticas y de edición de imágenes.',
      'Redacción clara y sentido de la comunicación.',
      'Modalidad híbrida: 2 días presencial, 3 en remoto.',
    ],
    disponibilidad: { dias: ['lun', 'mar', 'mie', 'jue', 'vie'], franja: 'manana' },
    habilidades: ['redes sociales', 'comunicación', 'marketing', 'diseño', 'canva', 'escritura'],
  },
  8: {
    puesto: 'Recepcionista',
    empresa: 'Hotel Manizales Plaza',
    tareas: [
      'Recibir a los huéspedes y registrar su ingreso.',
      'Atender las llamadas y los mensajes del hotel.',
      'Entregar información sobre servicios de la zona.',
      'Apoyar en la limpieza y el alistamiento de habitaciones.',
    ],
    requisitos: [
      'Estar estudiando o haber terminado bachillerato.',
      'Buena presencia y trato cordial con huéspedes.',
      'Disponibilidad en la mañana, de lunes a sábado.',
      'Experiencia previa no es necesaria.',
    ],
    disponibilidad: { dias: ['lun', 'mar', 'mie', 'jue', 'vie', 'sab'], franja: 'manana' },
    habilidades: ['recepción', 'atención al cliente', 'telefono', 'turismo', 'office'],
  },
  9: {
    puesto: 'Vendedor de mostrador',
    empresa: 'Modas Caribe',
    tareas: [
      'Atender a los clientes en el mostrador de la tienda.',
      'Vender prendas y administrar la caja del turno.',
      'Reponer el inventario y marcar prendas de temporada.',
      'Mantener el área de ventas ordenado y presentable.',
    ],
    requisitos: [
      'Estar matriculado en educación media o superior.',
      'Interés genuino por la moda y la atención al cliente.',
      'Disponibilidad de 4 horas al día, con fines de semana.',
      'Sin experiencia previa.',
    ],
    disponibilidad: { dias: ['lun', 'mar', 'mie', 'jue', 'vie', 'sab'], franja: 'tarde' },
    habilidades: ['ventas', 'moda', 'caja', 'atención al cliente', 'inventario'],
  },
  10: {
    puesto: 'Tutor de inglés',
    empresa: 'English Academy',
    tareas: [
      'Impartir clases de inglés conversacional.',
      'Enseñar vocabulario y expresiones de la vida diaria.',
      'Preparar material didáctico y actividades para cada clase.',
      'Informar a los padres el progreso de sus hijos.',
    ],
    requisitos: [
      'Nivel de inglés intermedio o avanzado, con certificación de ser posible.',
      'Experiencia dando clases, ya sea particular o institucional.',
      'Paciencia con niños y adolescentes.',
      'Dos horas por semana, en las tardes.',
    ],
    disponibilidad: { dias: ['mar', 'mie', 'jue'], franja: 'tarde' },
    habilidades: ['docencia', 'inglés', 'explicar', 'paciencia', 'material didáctico'],
  },
  11: {
    puesto: 'Mesero',
    empresa: 'Restaurante La Plaza',
    tareas: [
      'Tomar el pedido y servirlo en mesa.',
      'Recomendar platos del menú y sus bebidas.',
      'Atender el pago y cerrar la cuenta.',
      'Mantener la mesa limpia y ordenada.',
    ],
    requisitos: [
      'Mayor de edad y experiencia no requerida: capacitamos en el local.',
      'Disponibilidad sábado y domingo, con turno de 5 horas.',
      'Cuidado en la manipulación de alimentos.',
      'Las propinas se suman al sueldo mensual.',
    ],
    disponibilidad: { dias: ['sab', 'dom'], franja: 'tarde' },
    habilidades: ['servicios', 'restaurante', 'mesero', 'atención al cliente', 'propinas'],
  },
  12: {
    puesto: 'Diseñador UI Jr.',
    empresa: 'Studio Pixel',
    tareas: [
      'Diseñar interfaces de la app móvil con Figma.',
      'Crear sistemas de componentes reutilizables.',
      'Validar los diseños con el equipo de desarrollo.',
      'Documentar las decisiones de diseño.',
    ],
    requisitos: [
      'Portafolio con al menos 2 proyectos de interfaz.',
      'Manejo intermedio de Figma.',
      'Conocimiento de principios de usabilidad y accesibilidad.',
      'Jornada de lunes a viernes en horario de oficina.',
    ],
    disponibilidad: { dias: ['lun', 'mar', 'mie', 'jue', 'vie'], franja: 'manana' },
    habilidades: ['diseño', 'figma', 'ui', 'ux', 'accesibilidad', 'interfaz'],
  },
  13: {
    puesto: 'Soporte técnico',
    empresa: 'Tech Help',
    tareas: [
      'Responder tickets de soporte de primer nivel.',
      'Resolver fallas básicas de software y hardware.',
      'Escalar casos complejos al equipo de ingeniería.',
      'Documentar las soluciones en la base de conocimiento.',
    ],
    requisitos: [
      'Estar estudiando una carrera técnica en tecnología o la universidad.',
      'Buen manejo de computador: Windows, navegador y correo.',
      'Explicar con paciencia, en lenguaje sencillo.',
      'Disponibilidad de 4 horas al día, de lunes a sábado.',
    ],
    disponibilidad: { dias: ['lun', 'mar', 'mie', 'jue', 'vie', 'sab'], franja: 'manana' },
    habilidades: ['soporte técnico', 'software', 'hardware', 'computador', 'paciencia'],
  },
  14: {
    puesto: 'Data entry',
    empresa: 'Logística Total',
    tareas: [
      'Ingresar los registros de inventario en el sistema.',
      'Actualizar las hojas de cálculo de control.',
      'Verificar que las cifras coincidan con el conteo físico.',
      'Apoyar en la generación de reportes de movimientos.',
    ],
    requisitos: [
      'Manejo intermedio de Excel y hojas de cálculo.',
      'Atención al detalle: un error de digitado afecta los reportes.',
      'Trabajo remoto con computador propio o de la empresa.',
      'Disponibilidad de 3 horas al día, en el horario que mejor te sirva.',
    ],
    disponibilidad: { dias: ['lun', 'mar', 'mie', 'jue', 'vie'], franja: 'tarde' },
    habilidades: ['excel', 'administración', 'inventario', 'registro', 'excel avanzado'],
  },
  15: {
    puesto: 'Teleoperador',
    empresa: 'Contact Center Andino',
    tareas: [
      'Contactar a posibles clientes por teléfono.',
      'Ofrecer el producto y resolver objeciones.',
      'Registrar cada llamada en el sistema de CRM.',
      'Cumplir las metas mensuales de venta.',
    ],
    requisitos: [
      'Estudiar o haber terminado bachillerato.',
      'Voz clara y buena dicción, sin miedo al teléfono.',
      'La empresa capacita: no necesitas experiencia en ventas.',
      'Jornada completa de lunes a viernes, con comisión por metas.',
    ],
    disponibilidad: { dias: ['lun', 'mar', 'mie', 'jue', 'vie'], franja: 'manana' },
    habilidades: ['ventas', 'telefono', 'crm', 'comunicación', 'redacción'],
  },
  16: {
    puesto: 'Auxiliar de almacén',
    empresa: 'Almacén El Progreso',
    tareas: [
      'Atender a los vecinos del barrio en el mostrador.',
      'Registrar lo que queda anotado en el cuaderno de fiado.',
      'Reponer y ordenar la mercadería de los estantes.',
      'Atender el teléfono del almacén.',
    ],
    requisitos: [
      'Ser estudiante de bachillerato, de la Normal o de la universidad en curso.',
      'Vivir en Pensilvania o en veredas cercanas: es un puesto presencial.',
      'Vivir en Pensilvania o en veredas cercanas: es un puesto presencial.',
      'Buena atención al barrio y honestidad en la cuaderna.',
      'Sin experiencia previa: se aprende en el puesto.',
    ],
    disponibilidad: { dias: ['lun', 'mar', 'mie', 'jue', 'vie', 'sab'], franja: 'tarde' },
    habilidades: ['ventas', 'atención al cliente', 'caja', 'fiado', 'orden'],
  },
  17: {
    puesto: 'Supervisor de finca cafetera',
    empresa: 'Cooperativa Cafetera del Sur',
    tareas: [
      'Acompañar la recolección y separar el café maduro del verde.',
      'Llevar el registro de lotes de cada parcela.',
      'Revisar el estado de los árboles y reportar si hay plaga.',
      'Recibir el café en la finca y revisar su calidad.',
    ],
    requisitos: [
      'Saber distinguir café maduro, sobremaduro y verde.',
      'Estar en los lotes a la hora de entrada, que es temprano.',
      'Cuidar el agua y no contaminar los nacimientos.',
      'La cooperativa paga la bonificación por kilo recolectado.',
    ],
    disponibilidad: { dias: ['lun', 'mar', 'mie', 'jue', 'vie'], franja: 'manana' },
    habilidades: ['agricultura', 'café', 'trabajo de campo', 'calidad', 'registro'],
    imagen: {
      src: 'img/ofertas/agricultura.svg',
      alt: 'Ilustración de un cafetal en ladera, con montañas de fondo y una canasta de recolección',
    },
  },
  18: {
    puesto: 'Auxiliar de fruvería',
    empresa: 'Fruvería La Plaza',
    tareas: [
      'Cargar y acomodar la fruta que llega de las fincas vecinas.',
      'Retirar la fruta madura que ya no está para vender.',
      'Atender a los clientes del mercado.',
      'Limpiar las canastas y el piso de la bodega al cierre.',
    ],
    requisitos: [
      'Disponibilidad los sábados y domingos, en la mañana.',
      'Cargar peso sin que te afecte la espalda.',
      'Bacante por el municipio, es un puesto de la plaza.',
      'Edad mínima de 16 años.',
    ],
    disponibilidad: { dias: ['sab', 'dom'], franja: 'manana' },
    habilidades: ['ventas', 'servicios', 'mercadeo', 'limpieza', 'carga física'],
  },
  19: {
    puesto: 'Auxiliar administrativo',
    empresa: 'Junta Municipal',
    tareas: [
      'Recibir oficios en ventanilla y anotarlos en el sistema.',
      'Agendar citas y mandar las notificaciones.',
      'Ordenar y archivar los documentos del año en curso.',
      'Apoyar en la redacción de oficios y certificados.',
    ],
    requisitos: [
      'Estar matriculado en bachillerato tecnico, o estudiar administracion.',
      'Saber escribir correctamente, sin errores de ortografía.',
      'Cuidar el archivo, que es documento de todos los vecinos.',
      'Horario a convenir: se ajusta con el jefe de administración.',
    ],
    disponibilidad: { dias: ['lun', 'mar', 'mie', 'jue', 'vie'], franja: 'tarde' },
    habilidades: ['administración', 'archivación', 'office', 'atención al cliente', 'agenda'],
  },
  20: {
    puesto: 'Guía de ruta del café',
    empresa: 'Turismo del Magdalena',
    tareas: [
      'Recibir al grupo de visitantes en el punto de partida.',
      'Contarles cómo se siembra, se cosecha y se procesa el café.',
      'Caminar con el grupo por los senderos de la finca.',
      'Responder preguntas y cuidar que el visita termine bien.',
    ],
    requisitos: [
      'Hablar con claridad frente a un grupo, aunque tiembles un poco.',
      'Conocer cómo se produce el café en la región.',
      'Caminar por senderos de montana con los visitantes.',
      'Disponibilidad los fines de semana, porque es cuando llega el turismo.',
      'Estudios secundarios completos: no se necesita titulo de guia.',
    ],
    disponibilidad: { dias: ['sab', 'dom'], franja: 'manana' },
    habilidades: ['turismo', 'comunicación', 'café', 'caminatas', 'atención al cliente'],
    imagen: {
      src: 'img/ofertas/turismo.svg',
      alt: 'Ilustración de un sendero turístico junto al río, con un grupo de visitantes y el cartel Ruta del café',
    },
  },
};

// Imagen por tipo de trabajo: es la que usa una oferta salvo que traiga su
// propio campo `imagen`. Siempre con la misma forma: { src, alt }.
const TIPO_VISUAL = {
  'Ventas': {
    src: 'img/ofertas/ventas.svg',
    alt: 'Ilustración de un mostrador de tienda con productos y una bolsa de compras',
  },
  'Atención al cliente': {
    src: 'img/ofertas/atencion.svg',
    alt: 'Ilustración de un agente con auriculares frente a una pantalla de chat',
  },
  'Administración': {
    src: 'img/ofertas/administracion.svg',
    alt: 'Ilustración de un escritorio con documentos, carpetas y un portátil',
  },
  'Servicios': {
    src: 'img/ofertas/servicios.svg',
    alt: 'Ilustración de una barra de cafetería con café y un libro abierto',
  },
  'Educación': {
    src: 'img/ofertas/educacion.svg',
    alt: 'Ilustración de una pizarra con letras, un lápiz y un cuaderno',
  },
  'Tecnología': {
    src: 'img/ofertas/tecnologia.svg',
    alt: 'Ilustración de una pantalla con código y nodos conectados',
  },
};
