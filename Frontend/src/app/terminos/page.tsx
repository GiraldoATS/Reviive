import LegalDoc, { type SeccionLegal } from "@/components/LegalDoc";

const secciones: SeccionLegal[] = [
  {
    id: "informacion-general",
    titulo: "Información general",
    parrafos: [
      "Reviive es una plataforma digital que conecta a personas que desean conservar sus recuerdos con talleres y artesanos especializados en restauración, preservación y transformación de objetos con valor sentimental.",
    ],
  },
  {
    id: "objeto-plataforma",
    titulo: "Objeto de la plataforma",
    parrafos: [
      "Reviive permite solicitar evaluaciones, recibir cotizaciones y gestionar procesos de restauración y preservación de objetos, así como su posterior envío o entrega.",
    ],
  },
  {
    id: "registro-cuentas",
    titulo: "Registro y uso de cuentas",
    parrafos: [
      "Para utilizar la plataforma debes crear una cuenta proporcionando información veraz y actualizada. Eres responsable de la confidencialidad de tu cuenta y contraseña, así como de todas las actividades que se realicen desde ella.",
    ],
  },
  {
    id: "tipos-usuario",
    titulo: "Tipos de usuario",
    parrafos: [
      "Reviive contempla dos tipos de cuenta: clientes, que solicitan servicios de conservación de recuerdos, y talleres o artesanos, que ofrecen sus servicios de restauración a través de la plataforma.",
    ],
  },
  {
    id: "solicitud-evaluaciones",
    titulo: "Solicitud de evaluaciones",
    parrafos: [
      "Al solicitar una evaluación, debes proporcionar información y fotografías precisas del objeto. Reviive y los talleres asignados usarán esta información para elaborar una propuesta de restauración.",
    ],
  },
  {
    id: "servicios-ofrecidos",
    titulo: "Servicios ofrecidos",
    parrafos: [
      "Los servicios disponibles incluyen restauración, preservación, transformación y mantenimiento de objetos, según la evaluación y la propuesta acordada con el taller correspondiente.",
    ],
  },
  {
    id: "cotizaciones-precios-pagos",
    titulo: "Cotizaciones, precios y pagos",
    parrafos: [
      "Las cotizaciones son elaboradas por los talleres a partir de la evaluación inicial y pueden variar según el estado del objeto y la complejidad del trabajo. Los pagos se realizan a través de los medios habilitados en la plataforma.",
    ],
  },
  {
    id: "envios-entregas",
    titulo: "Envíos y entregas",
    parrafos: [
      "Reviive coordina la recolección, el envío y la entrega de los objetos entre el cliente y el taller asignado, con el cuidado y el seguimiento correspondientes.",
    ],
  },
  {
    id: "responsabilidades-cliente",
    titulo: "Responsabilidades del cliente",
    parrafos: [
      "El cliente debe proporcionar información veraz sobre el objeto, empacarlo adecuadamente cuando corresponda, y aprobar o rechazar las cotizaciones dentro de los plazos indicados.",
    ],
  },
  {
    id: "responsabilidades-talleres",
    titulo: "Responsabilidades de talleres",
    parrafos: [
      "Los talleres y artesanos deben ofrecer información veraz sobre sus servicios, cumplir con los tiempos y condiciones acordadas, y tratar cada objeto con el cuidado que merece.",
    ],
  },
  {
    id: "cancelaciones-modificaciones",
    titulo: "Cancelaciones y modificaciones",
    parrafos: [
      "Puedes cancelar o modificar una solicitud antes de que el taller inicie el proceso de intervención. Una vez iniciado, las condiciones de cancelación dependerán de lo acordado en la cotización.",
    ],
  },
  {
    id: "garantias-limitaciones",
    titulo: "Garantías y limitaciones",
    parrafos: [
      "Los talleres ofrecen garantía sobre el trabajo realizado según lo especificado en cada cotización. Reviive no garantiza resultados específicos sobre objetos con daños irreversibles.",
    ],
  },
  {
    id: "propiedad-intelectual",
    titulo: "Propiedad intelectual",
    parrafos: [
      "El contenido, diseño y marca de Reviive son propiedad de la plataforma. Las fotografías e historias que compartes siguen siendo de tu propiedad, salvo que autorices su uso para fines de difusión.",
    ],
  },
  {
    id: "uso-adecuado",
    titulo: "Uso adecuado de la plataforma",
    parrafos: [
      "Te comprometes a usar Reviive de forma honesta y respetuosa, sin publicar contenido ofensivo, fraudulento o que infrinja derechos de terceros.",
    ],
  },
  {
    id: "suspension-cancelacion",
    titulo: "Suspensión o cancelación",
    parrafos: [
      "Reviive puede suspender o cancelar cuentas que incumplan estos Términos y Condiciones o que representen un riesgo para otros usuarios de la plataforma.",
    ],
  },
  {
    id: "tratamiento-informacion",
    titulo: "Tratamiento de información",
    parrafos: [
      "El tratamiento de tus datos personales se rige por nuestra Política de Privacidad, que forma parte integral de estos Términos y Condiciones.",
    ],
  },
  {
    id: "modificaciones-terminos",
    titulo: "Modificaciones de los términos",
    parrafos: [
      "Podemos actualizar estos Términos y Condiciones periódicamente. Te notificaremos los cambios relevantes a través de la plataforma antes de que entren en vigor.",
    ],
  },
  {
    id: "legislacion-aplicable",
    titulo: "Legislación aplicable",
    parrafos: [
      "Estos Términos y Condiciones se rigen por las leyes de la República de Colombia. Cualquier controversia se resolverá ante las autoridades competentes.",
    ],
  },
  {
    id: "contacto",
    titulo: "Contacto",
    parrafos: [
      "Si tienes preguntas sobre estos Términos y Condiciones, escríbenos a hola@reviive.com.",
    ],
  },
];

export default function TerminosPage() {
  return (
    <LegalDoc
      titulo="Términos y condiciones"
      actualizado="15 de julio de 2026"
      intro="Bienvenido a Reviive. Al crear una cuenta, solicitar nuestros servicios o utilizar la plataforma, aceptas estos Términos y Condiciones. Te invitamos a leerlos cuidadosamente."
      secciones={secciones}
      notaIcono="/images/envios-entregas/icon-shield-check.png"
      notaTexto={[
        "En Reviive trabajamos por la confianza,",
        "el respeto y la transparencia en cada recuerdo.",
      ]}
      fotoSrc="/images/legal/terminos-foto.png"
    />
  );
}
