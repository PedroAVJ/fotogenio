import "server-only";

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: [
        "/",
        "/registrarse/selecciona-tu-genero",
        "/registrarse/selecciona-estilos",
        "/registrarse/crear-cuenta",
      ],
      disallow: [
        "/api/",
        "/generando-fotos",
        "/galeria",
        "/nuevo-estilo",
        "/registrarse/pago",
        "/comprar-creditos",
      ],
    },
  };
}
