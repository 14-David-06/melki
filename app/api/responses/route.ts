import { env } from 'cloudflare:workers';
import { people, keys } from '@/lib/calendar';
export const dynamic = 'force-dynamic';
const reply = (data:unknown,status=200) => Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
export async function GET(){
 try {
  const rows=await env.DB!.prepare('SELECT person,votes,revision,updated_at FROM responses').all<{person:string;votes:string;revision:number;updated_at:string}>();
  return reply(rows.results.map(r=>({person:r.person,votes:JSON.parse(r.votes),revision:r.revision,updatedAt:r.updated_at})));
 } catch {return reply({error:'No pudimos cargar las respuestas. Intenta actualizar.'},503)}
}
export async function PUT(request:Request){
 if(request.headers.get('origin') && request.headers.get('origin')!==new URL(request.url).origin)return reply({error:'Origen no permitido'},403);
 try {
  const raw=await request.text(); if(raw.length>6000)return reply({error:'Solicitud demasiado grande'},413);
  const {person,votes,revision}=JSON.parse(raw);
  if(!people.includes(person)||!Number.isInteger(revision)||revision<0||!votes||typeof votes!=='object'||Array.isArray(votes)||Object.entries(votes).some(([k,v])=>!keys.includes(k)||!['yes','no',''].includes(v as string)))return reply({error:'Revisa el nombre y las respuestas.'},400);
  const now=new Date().toISOString();
  const statement=revision===0
   ? env.DB!.prepare('INSERT INTO responses (person,votes,revision,updated_at) VALUES (?,?,1,?) ON CONFLICT(person) DO NOTHING').bind(person,JSON.stringify(votes),now)
   : env.DB!.prepare('UPDATE responses SET votes=?,revision=revision+1,updated_at=? WHERE person=? AND revision=?').bind(JSON.stringify(votes),now,person,revision);
  const result=await statement.run();
  if(!result.meta.changes)return reply({error:'Esta respuesta cambió en otro dispositivo. Actualiza antes de editar.'},409);
  return reply({person,votes,revision:revision+1,updatedAt:now});
 } catch {return reply({error:'No se guardó. Conservamos tus cambios en pantalla para que puedas reintentar.'},503)}
}
