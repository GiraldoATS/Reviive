# Reviive

**El taller donde el tiempo se devuelve.**

Reviive conecta recuerdos, personas y tiempo a través de experiencias de
restauración artesanal de objetos con valor emocional (relojes, joyas,
cámaras, máquinas de escribir, fotografías, textiles, madera y objetos
antiguos). Un asistente de IA ("Alma") acompaña al cliente desde el registro
del recuerdo hasta la entrega del objeto restaurado, con proveedores/talleres
validados, seguimiento del pedido y memoriales digitales.

## Estructura del repositorio

```
Frontend/   Next.js + TypeScript — interfaz web (10 pantallas del roadmap de producto)
Backend/    Django + DRF — API de negocio, orquestación con n8n, contratos e infraestructura
```

Cada carpeta tiene su propio README con instrucciones de instalación y
ejecución.

## Identidad de marca

| Color | Hex |
|---|---|
| Borgoña | `#5B1F2E` |
| Rosa empolvado | `#E8C7C6` |
| Dorado cálido | `#D4AF37` |
| Marfil | `#F7F3EC` |
| Greige claro | `#D9CEC2` |
| Carbón | `#2B2B2B` |

Tipografía: **Playfair Display** (títulos) + **Lora** (cuerpo/interfaz).
Atributos de marca: cálida, elegante, confiable, artesanal.

## Pantallas del producto (Frontend)

1. Inicio / Landing
2. Catálogo
3. Chat con Alma
4. Registro de recuerdo
5. Recomendaciones
6. Pedido / Cotización
7. Seguimiento del pedido
8. Portal de proveedores
9. Centro de supervisión (agentes)
10. Dashboard administrativo

## Estado actual

- **Frontend**: las 10 pantallas están implementadas con datos de ejemplo,
  siguiendo fielmente la identidad de marca (colores, tipografía,
  iconografía de línea fina).
- **Backend**: arquitectura y modelo de datos completos (12 apps Django),
  validados con `manage.py check` y `makemigrations`. Pendiente de conexión
  a una base de datos real y de los workflows de n8n.
