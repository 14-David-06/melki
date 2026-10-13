# Taller 2G 3G — Calendario familiar

Aplicación para recoger la disponibilidad de 11 participantes en ocho fechas de octubre, noviembre y diciembre de 2026, por mañana y tarde.

## Funciones

- Selección de participante y disponibilidad: pendiente, puedo, no puedo.
- Respuestas compartidas en Cloudflare D1.
- Resultados por jornada, ordenados por cantidad de participantes disponibles.
- Exportación CSV y protección contra sobrescrituras desde otra sesión.
- Diseño adaptable con el logo y colores de Guaicaramo.

## Desarrollo

Requiere Node.js 22.13 o superior.

```sh
npm ci
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_yielding_tyger_tiger.sql
npm run dev -- --hostname 127.0.0.1
```

La migración se aplica una vez a una base local nueva. `npm run dev` muestra la dirección local. La base local es independiente de la de producción.

## Verificación

```sh
npx tsc --noEmit
npm run build
```

## Estructura

- `app/page.tsx`: interfaz y resultados.
- `app/globals.css`: estilos.
- `app/api/responses/route.ts`: lectura, validación y guardado.
- `lib/calendar.ts`: participantes, fechas y jornadas.
- `db/schema.ts` y `drizzle/`: esquema y migraciones.
- `public/guaicaramo.png`: logo de la página oficial de Guaicaramo.

## Publicación

Este proyecto usa Vinext y Cloudflare Workers con el binding D1 `DB`. `.openai/hosting.json` conserva la configuración de Sites; subir el código a GitHub no publica el sitio ni migra las respuestas. No es un sitio estático compatible directamente con GitHub Pages.

El selector de nombre no autentica a cada participante. Quienes tengan acceso al sitio pueden seleccionar un nombre y modificar su disponibilidad; la audiencia se controla en el alojamiento.

No se incluyen dependencias instaladas, datos locales, credenciales ni archivos de trabajo en el repositorio.
