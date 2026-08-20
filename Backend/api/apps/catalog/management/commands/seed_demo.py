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
    dict(nombre="Restauración de relojes", categoria="Relojes", icono="reloj",
         descripcion="Devolvemos el mecanismo y el brillo original a relojes de pulsera y bolsillo con historia.",
         precio_base=89000),
    dict(nombre="Restauración de joyas", categoria="Joyas", icono="joya",
         descripcion="Limpieza, engaste y pulido artesanal para anillos, collares y piezas familiares.",
         precio_base=69000),
    dict(nombre="Restauración de cámaras", categoria="Cámaras", icono="camara",
         descripcion="Recuperamos cámaras análogas para que vuelvan a capturar momentos.",
         precio_base=99000),
    dict(nombre="Máquinas de escribir", categoria="Escritura", icono="escritura",
         descripcion="Ajuste mecánico y estético de máquinas de escribir antiguas.",
         precio_base=75000),
    dict(nombre="Restauración fotográfica", categoria="Fotografía", icono="fotografia",
         descripcion="Recuperamos fotografías dañadas por el tiempo, la humedad o el uso.",
         precio_base=45000),
    dict(nombre="Objetos antiguos", categoria="Objetos antiguos", icono="antiguedad",
         descripcion="Restauración de piezas de valor sentimental sin catálogo definido.",
         precio_base=110000),
    dict(nombre="Restauración de textiles", categoria="Textiles", icono="textil",
         descripcion="Reparación cuidadosa de prendas y textiles con historia.",
         precio_base=55000),
    dict(nombre="Restauración en madera", categoria="Madera", icono="madera",
         descripcion="Baúles, cajas y muebles pequeños devueltos a la vida.",
         precio_base=130000),
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
        self.stdout.write(f"Productos: {len(productos)}")

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
        CapacidadProveedor.objects.update_or_create(
            proveedor=proveedor,
            producto=productos[0],
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
