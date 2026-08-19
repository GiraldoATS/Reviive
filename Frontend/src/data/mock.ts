import type {
  ConversacionResumen,
  Pedido,
  Producto,
  Proveedor,
  Recomendacion,
} from "@/types";

export const productos: Producto[] = [
  {
    id: "prod-relojes",
    nombre: "Restauración de relojes",
    categoria: "Relojes",
    descripcion:
      "Devolvemos el mecanismo y el brillo original a relojes de pulsera y bolsillo con historia.",
    precioBase: 89000,
    imagen: "reloj",
    activo: true,
  },
  {
    id: "prod-joyas",
    nombre: "Restauración de joyas",
    categoria: "Joyas",
    descripcion:
      "Limpieza, engaste y pulido artesanal para anillos, collares y piezas familiares.",
    precioBase: 69000,
    imagen: "joya",
    activo: true,
  },
  {
    id: "prod-camaras",
    nombre: "Restauración de cámaras",
    categoria: "Cámaras",
    descripcion:
      "Recuperamos cámaras análogas para que vuelvan a capturar momentos.",
    precioBase: 99000,
    imagen: "camara",
    activo: true,
  },
  {
    id: "prod-escritura",
    nombre: "Máquinas de escribir",
    categoria: "Escritura",
    descripcion:
      "Ajuste mecánico y estético de máquinas de escribir antiguas.",
    precioBase: 75000,
    imagen: "escritura",
    activo: true,
  },
  {
    id: "prod-fotografia",
    nombre: "Restauración fotográfica",
    categoria: "Fotografía",
    descripcion:
      "Recuperamos fotografías dañadas por el tiempo, la humedad o el uso.",
    precioBase: 45000,
    imagen: "fotografia",
    activo: true,
  },
  {
    id: "prod-antiguedades",
    nombre: "Objetos antiguos",
    categoria: "Objetos antiguos",
    descripcion:
      "Restauración de piezas de valor sentimental sin catálogo definido.",
    precioBase: 110000,
    imagen: "antiguedad",
    activo: true,
  },
  {
    id: "prod-textiles",
    nombre: "Restauración de textiles",
    categoria: "Textiles",
    descripcion: "Reparación cuidadosa de prendas y textiles con historia.",
    precioBase: 55000,
    imagen: "textil",
    activo: true,
  },
  {
    id: "prod-madera",
    nombre: "Restauración en madera",
    categoria: "Madera",
    descripcion: "Baúles, cajas y muebles pequeños devueltos a la vida.",
    precioBase: 130000,
    imagen: "madera",
    activo: true,
  },
];

export const proveedores: Proveedor[] = [
  {
    id: "prov-taller-tiempo",
    nombre: "Taller El Tiempo",
    ciudad: "Bogotá",
    estadoValidacion: "validado",
    calificacion: 4.9,
    especialidades: ["Relojes", "Objetos antiguos"],
  },
  {
    id: "prov-atelier-luz",
    nombre: "Atelier Luz",
    ciudad: "Medellín",
    estadoValidacion: "validado",
    calificacion: 4.8,
    especialidades: ["Fotografía", "Textiles"],
  },
  {
    id: "prov-manos-de-plata",
    nombre: "Manos de Plata",
    ciudad: "Cali",
    estadoValidacion: "pendiente",
    calificacion: 4.6,
    especialidades: ["Joyas"],
  },
];

export const pedidos: Pedido[] = [
  {
    id: "pedido-0512",
    codigo: "RV-2024-0512",
    clienteNombre: "Carolina M.",
    objeto: "Reloj de bolsillo Omega, 1940 aproximado",
    proveedor: "Taller El Tiempo",
    estado: "en_proceso",
    total: 95000,
    eventos: [
      { estado: "recibido", fecha: "12 May", descripcion: "Objeto recibido en taller y verificado." },
      { estado: "en_evaluacion", fecha: "13 May", descripcion: "Diagnóstico técnico completado." },
      { estado: "en_proceso", fecha: "16 May", descripcion: "Restauración del mecanismo en curso." },
      { estado: "control_de_calidad", fecha: "-", descripcion: "Pendiente." },
      { estado: "en_camino", fecha: "-", descripcion: "Pendiente." },
      { estado: "entregado", fecha: "-", descripcion: "Pendiente." },
    ],
  },
];

export const recomendaciones: Recomendacion[] = [
  {
    id: "rec-1",
    productoId: "prod-relojes",
    titulo: "Limpieza y restauración completa",
    justificacion: "Ideal para devolver la funcionalidad y estética original del reloj.",
    puntaje: 0.96,
    imagen: "reloj",
  },
  {
    id: "rec-2",
    productoId: "prod-relojes",
    titulo: "Cómo cuidar tu reloj de bolsillo",
    justificacion: "Consejos para mantenerlo en el tiempo.",
    puntaje: 0.81,
    imagen: "trazable",
  },
];

export const conversaciones: ConversacionResumen[] = [
  {
    id: "conv-1",
    cliente: "Carolina M.",
    pedidoRef: "RV-2024-0512",
    ultimoMensaje: "¿Podrían enviarme una actualización del reloj?",
    hora: "10:42",
    estado: "activa",
  },
  {
    id: "conv-2",
    cliente: "Andrés P.",
    pedidoRef: "RV-2024-0513",
    ultimoMensaje: "Gracias, quedo atento.",
    hora: "10:35",
    estado: "pendiente",
  },
  {
    id: "conv-3",
    cliente: "Laura G.",
    pedidoRef: "RV-2024-0514",
    ultimoMensaje: "Perfecto, muchas gracias.",
    hora: "10:05",
    estado: "cerrada",
  },
];

export const respuestasAlma: Record<string, string> = {
  default:
    "Gracias por escribir. Cuéntame un poco más sobre el objeto o el recuerdo que quieres restaurar y te acompaño en el proceso.",
  proyecto:
    "Con gusto te acompaño a iniciar un proyecto. Cuéntame: ¿qué objeto quieres restaurar y qué historia tiene para ti?",
  estado:
    "Para consultar el estado de tu pedido, indícame el código (ej. RV-2024-0512) y reviso el seguimiento por ti.",
  recomendaciones:
    "Según lo que cuentas, te recomiendo empezar por una evaluación de estado y luego una limpieza artesanal. ¿Quieres ver el detalle?",
  asesor:
    "Perfecto, en un momento un asesor humano de Reviive continuará esta conversación contigo.",
};
