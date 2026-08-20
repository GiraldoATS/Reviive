from datetime import date, timedelta

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.db import transaction

from apps.catalog.models import Producto
from apps.conversations.models import Conversacion, Mensaje
from apps.memories.models import Recuerdo
from apps.orders.models import EventoPedido, Pedido
from apps.providers.models import CapacidadProveedor, Proveedor
from apps.quotations.models import Cotizacion

PRODUCTOS = [
    dict(nombre="Peluche Memoria", categoria="Objetos personales", icono="peluche",
         descripcion="Restauramos y reinventamos peluches que han sido testigos de grandes historias de amor.",
         precio_base=60000),
    dict(nombre="Almohada Abrazo", categoria="Textiles", icono="almohada",
         descripcion="Confeccionamos almohadas con prendas o textiles significativos para sentir cerca a quienes amas.",
         precio_base=80000),
    dict(nombre="Cuadro de Historia", categoria="Arte y decoración", icono="cuadro",
         descripcion="Componemos y restauramos recuerdos visuales en cuadros que cuentan tu historia.",
         precio_base=120000),
    dict(nombre="Caja del Tiempo", categoria="Objetos personales", icono="caja",
         descripcion="Creamos cajas personalizadas para guardar recuerdos que marcaron momentos inolvidables.",
         precio_base=90000),
    dict(nombre="Libro de Memorias", categoria="Documentos y papel", icono="libro",
         descripcion="Diseñamos y restauramos libros para preservar recuerdos, cartas y fotografías en un solo lugar.",
         precio_base=100000),
    dict(nombre="Restauración Especial", categoria="Objetos personales", icono="restauracion",
         descripcion="Restauramos objetos únicos con técnicas artesanales para devolverles su valor y belleza original.",
         precio_base=150000),
    dict(nombre="Recuerdo Compartido", categoria="Objetos personales", icono="compartido",
         descripcion="Diseñamos piezas que se dividen para que dos personas lleven siempre un recuerdo compartido.",
         precio_base=70000),
    dict(nombre="Memorial Digital", categoria="Digitales", icono="memorial",
         descripcion="Creamos memoriales digitales para honrar y recordar a quienes ya no están con nosotros.",
         precio_base=80000),
]


class Command(BaseCommand):
    help = "Crea datos de demostración: catálogo, proveedor, cliente y un pedido de ejemplo."

    @transaction.atomic
    def handle(self, *args, **options):
        Usuario = get_user_model()

        productos = []
        for data in PRODUCTOS:
            prod, _ = Producto.objects.update_or_create(
                nombre=data["nombre"], defaults={**data, "activo": True}
            )
            productos.append(prod)
        nombres_vigentes = [data["nombre"] for data in PRODUCTOS]
        obsoletos, _ = Producto.objects.exclude(nombre__in=nombres_vigentes).delete()
        self.stdout.write(f"Productos: {len(productos)} (obsoletos eliminados: {obsoletos})")

        cliente, created = Usuario.objects.get_or_create(
            email="carolina@example.com",
            defaults=dict(username="carolina", rol=Usuario.Rol.CLIENTE),
        )
        if created:
            cliente.set_password("reviive123")
            cliente.save()

        proveedor_user, created = Usuario.objects.get_or_create(
            email="taller@example.com",
            defaults=dict(username="taller_el_tiempo", rol=Usuario.Rol.PROVEEDOR),
        )
        if created:
            proveedor_user.set_password("reviive123")
            proveedor_user.save()

        proveedor, _ = Proveedor.objects.update_or_create(
            usuario=proveedor_user,
            defaults=dict(
                nombre_taller="Taller El Tiempo",
                ciudad="Bogotá",
                estado_validacion=Proveedor.EstadoValidacion.VALIDADO,
                calificacion=4.9,
            ),
        )
        producto_restauracion = Producto.objects.get(nombre="Restauración Especial")
        CapacidadProveedor.objects.update_or_create(
            proveedor=proveedor,
            producto=producto_restauracion,
            material="",
            defaults=dict(ciudad="Bogotá", tiempo_estimado_dias=10),
        )

        admin, created = Usuario.objects.get_or_create(
            email="admin@reviive.test",
            defaults=dict(
                username="admin",
                rol=Usuario.Rol.SUPERADMINISTRADOR,
                is_staff=True,
                is_superuser=True,
            ),
        )
        if created:
            admin.set_password("reviive123")
            admin.save()

        recuerdo, _ = Recuerdo.objects.get_or_create(
            cliente=cliente,
            persona_recordada="Abuelo",
            defaults=dict(
                historia="Reloj de bolsillo de mi abuelo, no funciona hace años y quiero restaurarlo.",
                privacidad=Recuerdo.Privacidad.PRIVADO,
            ),
        )

        cotizacion, _ = Cotizacion.objects.get_or_create(
            recuerdo=recuerdo,
            proveedor=proveedor,
            defaults=dict(total=95000, vigencia=date.today() + timedelta(days=15)),
        )

        pedido, created = Pedido.objects.get_or_create(
            codigo="RV-2024-0512",
            defaults=dict(cliente=cliente, cotizacion=cotizacion, total=95000,
                          estado=Pedido.Estado.EN_PROCESO),
        )
        if created:
            for estado, descripcion in [
                (Pedido.Estado.RECIBIDO, "Objeto recibido en taller y verificado."),
                (Pedido.Estado.EN_EVALUACION, "Diagnóstico técnico completado."),
                (Pedido.Estado.EN_PROCESO, "Restauración del mecanismo en curso."),
            ]:
                EventoPedido.objects.create(pedido=pedido, estado=estado, descripcion=descripcion)

        conversacion, _ = Conversacion.objects.get_or_create(
            usuario=cliente,
            canal=Conversacion.Canal.WEB,
            defaults=dict(estado=Conversacion.Estado.ACTIVA, intencion="seguimiento_pedido"),
        )
        Mensaje.objects.get_or_create(
            conversacion=conversacion,
            rol=Mensaje.Rol.ALMA,
            contenido="¡Hola! Soy Alma, estoy aquí para acompañarte en cada paso de tu experiencia Reviive.",
        )

        self.stdout.write(self.style.SUCCESS("Datos de demostración creados correctamente."))
        self.stdout.write("Usuarios: carolina@example.com / taller@example.com / admin@reviive.test (clave: reviive123)")
