export type RolUsuario =
  | "visitante"
  | "cliente"
  | "proveedor"
  | "curador"
  | "operador_logistico"
  | "administrador"
  | "supervisor_ia"
  | "superadministrador";

export interface Producto {
  id: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  precioBase: number;
  imagen: string;
  imagenUrl: string;
  activo: boolean;
}

export interface Proveedor {
  id: string;
  nombre: string;
  ciudad: string;
  estadoValidacion: "pendiente" | "validado" | "suspendido";
  calificacion: number;
  especialidades: string[];
}

export type EstadoPedido =
  | "recibido"
  | "en_evaluacion"
  | "en_proceso"
  | "control_de_calidad"
  | "en_camino"
  | "entregado";

export interface EventoPedido {
  estado: EstadoPedido;
  fecha: string;
  descripcion: string;
}

export interface Pedido {
  id: string;
  codigo: string;
  clienteNombre: string;
  objeto: string;
  proveedor: string;
  estado: EstadoPedido;
  total: number;
  eventos: EventoPedido[];
}

export interface Recomendacion {
  id: string;
  productoId: string;
  titulo: string;
  justificacion: string;
  puntaje: number;
  imagen: string;
}

export interface Mensaje {
  id: string;
  rol: "usuario" | "alma";
  contenido: string;
  hora: string;
  imagenPreview?: string;
}

export interface ConversacionResumen {
  id: string;
  cliente: string;
  pedidoRef?: string;
  ultimoMensaje: string;
  hora: string;
  estado: "activa" | "pendiente" | "cerrada";
}
