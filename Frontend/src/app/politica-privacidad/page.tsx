import LegalDoc, { type SeccionLegal } from "@/components/LegalDoc";

const secciones: SeccionLegal[] = [
  {
    id: "responsable",
    titulo: "Quién es responsable de tus datos",
    parrafos: [
      "Reviive es responsable del tratamiento de los datos personales que recopila a través de la plataforma.",
    ],
  },
  {
    id: "informacion-recopilamos",
    titulo: "Qué información recopilamos",
    parrafos: ["Recopilamos únicamente la información necesaria para ofrecerte nuestros servicios:"],
    items: [
      "Datos de contacto: nombre, correo electrónico, teléfono, ciudad.",
      "Información sobre tus solicitudes y objetos.",
      "Fotografías y descripciones de los objetos que deseas conservar.",
      "Información de pagos y transacciones.",
    ],
  },
  {
    id: "para-que-utilizamos",
    titulo: "Para qué utilizamos tu información",
    parrafos: [
      "Usamos tus datos para gestionar tu cuenta, procesar tus solicitudes de evaluación, coordinar cotizaciones con talleres y artesanos, y mantenerte informado sobre el estado de tus recuerdos.",
    ],
  },
  {
    id: "informacion-necesaria",
    titulo: "Información necesaria",
    parrafos: [
      "Solo te pedimos los datos indispensables para prestarte el servicio. Si algún campo no es obligatorio, te lo indicaremos en el formulario correspondiente.",
    ],
  },
  {
    id: "informacion-compartida",
    titulo: "Información compartida",
    parrafos: [
      "Compartimos la información estrictamente necesaria de tu objeto con el taller o artesano asignado a tu solicitud, para que pueda evaluarlo y elaborar una propuesta. No vendemos ni cedemos tus datos a terceros con fines comerciales.",
    ],
  },
  {
    id: "uso-fotografias",
    titulo: "Uso de fotografías",
    parrafos: [
      "Las fotografías que nos compartes se usan únicamente para documentar el estado de tu objeto y acompañar el proceso de restauración. Solo las publicamos como parte de historias o casos de éxito si nos das tu autorización explícita.",
    ],
  },
  {
    id: "conservacion-datos",
    titulo: "Conservación de datos",
    parrafos: [
      "Conservamos tu información mientras tu cuenta esté activa y durante el tiempo necesario para cumplir obligaciones legales o resolver disputas. Puedes solicitar la eliminación de tus datos cuando lo desees.",
    ],
  },
  {
    id: "seguridad",
    titulo: "Seguridad de la información",
    parrafos: [
      "Aplicamos medidas técnicas y organizativas razonables para proteger tus datos frente a accesos no autorizados, pérdida o uso indebido.",
    ],
  },
  {
    id: "cookies",
    titulo: "Cookies y tecnologías similares",
    parrafos: [
      "Usamos cookies esenciales para el funcionamiento de la plataforma y, con tu consentimiento, cookies analíticas que nos ayudan a mejorar tu experiencia.",
    ],
  },
  {
    id: "derechos-titular",
    titulo: "Derechos del titular",
    parrafos: [
      "Puedes conocer, actualizar, rectificar o solicitar la eliminación de tus datos personales, así como revocar tu consentimiento en cualquier momento.",
    ],
  },
  {
    id: "solicitar-actualizacion",
    titulo: "Cómo solicitar actualización",
    parrafos: [
      "Escríbenos a reviivemed@gmail.com indicando el cambio que necesitas. Responderemos tu solicitud dentro de los plazos establecidos por la ley.",
    ],
  },
  {
    id: "cambios-politica",
    titulo: "Cambios en la política",
    parrafos: [
      "Podemos actualizar esta política para reflejar mejoras en nuestros servicios o cambios normativos. Te notificaremos los cambios relevantes a través de la plataforma o por correo electrónico.",
    ],
  },
  {
    id: "canales-contacto",
    titulo: "Canales de contacto",
    parrafos: [
      "Si tienes dudas sobre esta política o el tratamiento de tus datos, escríbenos a reviivemed@gmail.com.",
    ],
  },
];

export default function PoliticaPrivacidadPage() {
  return (
    <LegalDoc
      titulo="Política de privacidad"
      actualizado="15 de julio de 2026"
      intro="En Reviive cuidamos tu información personal y nos comprometemos a proteger tu privacidad. Esta política explica cómo recopilamos, usamos y protegemos tus datos."
      secciones={secciones}
      notaIcono="/images/auth/registro-cliente/icon-lock.png"
      notaTexto={[
        "Tu privacidad es importante.",
        "Tus recuerdos y tu información están en buenas manos.",
      ]}
      fotoSrc="/images/legal/privacidad-foto.png"
    />
  );
}
