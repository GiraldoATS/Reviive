from datetime import date, timedelta

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.db import transaction

from apps.catalog.models import Producto
from apps.conversations.models import Conversacion, Mensaje
from apps.evaluations.models import EjemploDataset
from apps.identity.models import Perfil
from apps.memories.models import Recuerdo
from apps.orders.models import EventoPedido, Pedido
from apps.providers.models import CapacidadProveedor, Proveedor
from apps.quotations.models import Cotizacion

PRODUCTOS = [
    dict(nombre="Peluche Memoria", categoria="Objetos personales", icono="peluche",
         descripcion="Restauramos y reinventamos peluches que han sido testigos de grandes historias de amor.",
         precio_base=60000, imagen_url="/images/servicios/sol-peluche.png"),
    dict(nombre="Almohada Abrazo", categoria="Textiles", icono="almohada",
         descripcion="Confeccionamos almohadas con prendas o textiles significativos para sentir cerca a quienes amas.",
         precio_base=80000, imagen_url="/images/servicios/sol-cojin.png"),
    dict(nombre="Cuadro de Historia", categoria="Arte y decoración", icono="cuadro",
         descripcion="Componemos y restauramos recuerdos visuales en cuadros que cuentan tu historia.",
         precio_base=120000, imagen_url="/images/servicios/cat-marco-historia.png"),
    dict(nombre="Caja del Tiempo", categoria="Objetos personales", icono="caja",
         descripcion="Creamos cajas personalizadas para guardar recuerdos que marcaron momentos inolvidables.",
         precio_base=90000, imagen_url="/images/servicios/cat-caja-recuerdos.png"),
    dict(nombre="Libro de Memorias", categoria="Documentos y papel", icono="libro",
         descripcion="Diseñamos y restauramos libros para preservar recuerdos, cartas y fotografías en un solo lugar.",
         precio_base=100000, imagen_url="/images/servicios/before-after/fotos-after.png"),
    dict(nombre="Restauración Especial", categoria="Objetos personales", icono="restauracion",
         descripcion="Restauramos objetos únicos con técnicas artesanales para devolverles su valor y belleza original.",
         precio_base=150000, imagen_url="/images/servicios/sol-muebles.png"),
    dict(nombre="Recuerdo Compartido", categoria="Objetos personales", icono="compartido",
         descripcion="Diseñamos piezas que se dividen para que dos personas lleven siempre un recuerdo compartido.",
         precio_base=70000, imagen_url="/images/servicios/cat-joyas-compartido.png"),
    dict(nombre="Memorial Digital", categoria="Digitales", icono="memorial",
         descripcion="Creamos memoriales digitales para honrar y recordar a quienes ya no están con nosotros.",
         precio_base=80000, imagen_url="/images/servicios/cat-objetos.png"),
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
        Perfil.objects.update_or_create(
            usuario=cliente,
            defaults=dict(nombre="Carolina M.", ciudad="Bogotá", consentimiento_datos=True),
        )

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

        supervisor, created = Usuario.objects.get_or_create(
            email="supervisor@reviive.test",
            defaults=dict(username="supervisor_ia", rol=Usuario.Rol.SUPERVISOR_IA),
        )
        if created:
            supervisor.set_password("reviive123")
            supervisor.save()

        recuerdo, _ = Recuerdo.objects.get_or_create(
            cliente=cliente,
            persona_recordada="Abuelo",
            defaults=dict(
                historia="Reloj de bolsillo de mi abuelo, no funciona hace años y quiero restaurarlo.",
                privacidad=Recuerdo.Privacidad.PRIVADO,
            ),
        )
        recuerdo.objetos.get_or_create(tipo="Reloj de bolsillo", defaults=dict(categoria="Joyería y relojes"))

        cotizacion, _ = Cotizacion.objects.get_or_create(
            recuerdo=recuerdo,
            proveedor=proveedor,
            defaults=dict(
                total=95000,
                vigencia=date.today() + timedelta(days=15),
                estado=Cotizacion.Estado.ACEPTADA,
            ),
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
            intencion="seguimiento_pedido",
            defaults=dict(estado=Conversacion.Estado.ACTIVA),
        )
        Mensaje.objects.get_or_create(
            conversacion=conversacion,
            rol=Mensaje.Rol.ALMA,
            contenido="¡Hola! Soy Alma, estoy aquí para acompañarte en cada paso de tu experiencia Reviive.",
        )

        # --- Ejemplos 2 y 3: variedad de estados para las páginas de admin ---
        # (máximo 3 registros por modelo, sólo para que las páginas conectadas
        # a APIs reales muestren información en vez de aparecer vacías).
        otros_clientes = [
            dict(email="andres@example.com", username="andres_p", nombre="Andrés P.", ciudad="Medellín"),
            dict(email="laura@example.com", username="laura_g", nombre="Laura G.", ciudad="Cali"),
        ]
        otros_proveedores = [
            dict(
                email="atelierluz@example.com", username="atelier_luz",
                nombre_taller="Atelier Luz", ciudad="Medellín", calificacion=4.8,
                producto="Cuadro de Historia",
            ),
            dict(
                email="manosdeplata@example.com", username="manos_de_plata",
                nombre_taller="Manos de Plata", ciudad="Cali", calificacion=4.6,
                producto="Recuerdo Compartido",
            ),
        ]
        historias = [
            ("Cámara Rolleiflex de mi papá, quiero que vuelva a funcionar.", "Cámara Rolleiflex"),
            ("Máquina de escribir Remington de mi abuela, es un recuerdo familiar.", "Máquina de escribir Remington"),
        ]
        pedido_estados = [
            (Pedido.Estado.EN_PROCESO, "0513"),
            (Pedido.Estado.ENTREGADO, "0514"),
        ]

        for i, (cli_data, prov_data, (historia_txt, objeto_txt), (pedido_estado, sufijo_codigo)) in enumerate(
            zip(otros_clientes, otros_proveedores, historias, pedido_estados)
        ):
            cli_user, created = Usuario.objects.get_or_create(
                email=cli_data["email"],
                defaults=dict(username=cli_data["username"], rol=Usuario.Rol.CLIENTE),
            )
            if created:
                cli_user.set_password("reviive123")
                cli_user.save()
            Perfil.objects.update_or_create(
                usuario=cli_user,
                defaults=dict(nombre=cli_data["nombre"], ciudad=cli_data["ciudad"], consentimiento_datos=True),
            )

            prov_user, created = Usuario.objects.get_or_create(
                email=prov_data["email"],
                defaults=dict(username=prov_data["username"], rol=Usuario.Rol.PROVEEDOR),
            )
            if created:
                prov_user.set_password("reviive123")
                prov_user.save()
            otro_proveedor, _ = Proveedor.objects.update_or_create(
                usuario=prov_user,
                defaults=dict(
                    nombre_taller=prov_data["nombre_taller"],
                    ciudad=prov_data["ciudad"],
                    estado_validacion=Proveedor.EstadoValidacion.VALIDADO,
                    calificacion=prov_data["calificacion"],
                ),
            )
            CapacidadProveedor.objects.update_or_create(
                proveedor=otro_proveedor,
                producto=Producto.objects.get(nombre=prov_data["producto"]),
                material="",
                defaults=dict(ciudad=prov_data["ciudad"], tiempo_estimado_dias=12),
            )

            otro_recuerdo, _ = Recuerdo.objects.get_or_create(
                cliente=cli_user,
                historia=historia_txt,
                defaults=dict(privacidad=Recuerdo.Privacidad.PRIVADO),
            )
            otro_recuerdo.objetos.get_or_create(tipo=objeto_txt, defaults=dict(categoria="Fotografías y cartas"))

            otra_cotizacion, _ = Cotizacion.objects.get_or_create(
                recuerdo=otro_recuerdo,
                proveedor=otro_proveedor,
                defaults=dict(
                    total=68000 + i * 13000,
                    vigencia=date.today() + timedelta(days=15),
                    estado=Cotizacion.Estado.ACEPTADA,
                ),
            )

            otro_pedido, created = Pedido.objects.get_or_create(
                codigo=f"RV-2024-{sufijo_codigo}",
                defaults=dict(
                    cliente=cli_user, cotizacion=otra_cotizacion,
                    total=otra_cotizacion.total, estado=pedido_estado,
                ),
            )
            if created:
                EventoPedido.objects.create(
                    pedido=otro_pedido, estado=Pedido.Estado.RECIBIDO,
                    descripcion="Objeto recibido en taller y verificado.",
                )
                if pedido_estado == Pedido.Estado.ENTREGADO:
                    EventoPedido.objects.create(
                        pedido=otro_pedido, estado=Pedido.Estado.ENTREGADO,
                        descripcion="Entregado al cliente en perfecto estado.",
                    )

            otra_conversacion, _ = Conversacion.objects.get_or_create(
                usuario=cli_user,
                canal=Conversacion.Canal.WEB,
                intencion="cotizacion",
                defaults=dict(estado=Conversacion.Estado.CERRADA),
            )
            Mensaje.objects.get_or_create(
                conversacion=otra_conversacion,
                rol=Mensaje.Rol.USUARIO,
                contenido=historia_txt,
            )

        # Una cotización adicional que se queda "enviada" (sin pedido) para
        # que /admin/cotizaciones muestre variedad de estados real.
        Cotizacion.objects.get_or_create(
            recuerdo=recuerdo,
            proveedor=Proveedor.objects.get(nombre_taller="Manos de Plata"),
            defaults=dict(
                total=88000, vigencia=date.today() + timedelta(days=10),
                estado=Cotizacion.Estado.ENVIADA,
            ),
        )

        # --- Dataset de entrenamiento (RN-09 / RN-11): hasta 3 ejemplos ---
        # update_or_create (no get_or_create): estas 3 filas son parte del
        # estado de demo determinista que este comando reproduce en cada
        # ejecución, así que siempre vuelven a quedar pendiente/aprobado/
        # rechazado igual, sin importar aprobaciones previas de prueba.
        ejemplos_dataset = [
            ("carolina@example.com", "seguimiento_pedido", EjemploDataset.EstadoRevision.APROBADO, True),
            ("andres@example.com", "cotizacion", EjemploDataset.EstadoRevision.PENDIENTE, True),
            ("laura@example.com", "cotizacion", EjemploDataset.EstadoRevision.RECHAZADO, False),
        ]
        for email, intencion, estado_revision, anonimizado in ejemplos_dataset:
            conv = Conversacion.objects.filter(usuario__email=email, intencion=intencion).first()
            if not conv:
                continue
            EjemploDataset.objects.update_or_create(
                conversacion=conv,
                defaults=dict(
                    etiqueta=intencion,
                    anonimizado=anonimizado,
                    estado_revision=estado_revision,
                    aprobado_por=None,
                ),
            )

        self.stdout.write(self.style.SUCCESS("Datos de demostración creados correctamente."))
        self.stdout.write(
            "Usuarios (clave: reviive123): carolina@example.com, andres@example.com, laura@example.com "
            "(clientes) · taller@example.com, atelierluz@example.com, manosdeplata@example.com (proveedores) · "
            "admin@reviive.test (admin) · supervisor@reviive.test (supervisor_ia)"
        )
