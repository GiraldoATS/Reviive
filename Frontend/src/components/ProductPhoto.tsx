import Image from "next/image";
import { ProductIcon, productPhotos } from "./icons";

export default function ProductPhoto({
  icono,
  src: srcProp,
  className = "",
}: {
  icono: string;
  /** Foto real del producto (Producto.imagen_url, controlada desde el admin). */
  src?: string;
  className?: string;
}) {
  const src = srcProp || productPhotos[icono];

  if (!src) {
    return (
      <div className={`flex items-center justify-center bg-rosa/20 ${className}`}>
        <ProductIcon icono={icono} className="h-9 w-9 text-borgona" />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image src={src} alt="" fill sizes="400px" className="object-cover" unoptimized />
    </div>
  );
}
