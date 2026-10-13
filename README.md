# Taller 2G 3G — Calendario familiar

Aplicación para recoger la disponibilidad de 11 participantes en ocho fechas de octubre, noviembre y diciembre de 2026, por mañana y tarde.

## Funciones

- Selección de participante y disponibilidad: pendiente, puedo, no puedo.
- Respuestas compartidas en Airtable (tabla `Respuestas`).
- Resultados por jornada, ordenados por cantidad de participantes disponibles.
- Exportación CSV y protección contra sobrescrituras desde otra sesión.
- Diseño adaptable con el logo y colores de Guaicaramo.

## Desarrollo

Requiere Node.js 22.13 o superior y un token de Airtable con permisos `data.records:read` y `data.records:write` sobre la base.

```sh
npm ci
npm run dev
```

Variables en `.env.local`:

```
AIRTABLE_API_KEY=pat...
AIRTABLE_BASE_ID=app...
AIRTABLE_TABLE=Respuestas   # opcional, es el valor por defecto
```

La tabla `Respuestas` tiene los campos `Persona` (texto), `Votos` (texto largo con JSON), `Revision` (número entero) y `Actualizado` (texto, fecha ISO).

## Verificación

```sh
npx tsc --noEmit
npm run build
```

## Estructura

- `app/page.tsx`: interfaz y resultados.
- `app/globals.css`: estilos.
- `app/api/responses/route.ts`: lectura, validación y guardado en Airtable.
- `lib/calendar.ts`: participantes, fechas y jornadas.
- `public/guaicaramo.png`: logo de la página oficial de Guaicaramo.

## Publicación

Se publica en Vercel como proyecto Next.js:

1. Importa el repositorio en Vercel (framework: Next.js, ya fijado en `vercel.json`).
2. En **Settings → Environment Variables**, define `AIRTABLE_API_KEY` y `AIRTABLE_BASE_ID` (y `AIRTABLE_TABLE` si la tabla tiene otro nombre).
3. Vuelve a desplegar.

Las respuestas guardadas antes en Cloudflare D1 no se migran automáticamente.

El selector de nombre no autentica a cada participante. Quienes tengan acceso al sitio pueden seleccionar un nombre y modificar su disponibilidad; la audiencia se controla en el alojamiento.

No se incluyen dependencias instaladas, datos locales, credenciales ni archivos de trabajo en el repositorio.
