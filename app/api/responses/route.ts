import { people, keys } from '@/lib/calendar';
export const dynamic = 'force-dynamic';
const reply = (data:unknown,status=200) => Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
type Row = {id:string; fields:{Persona?:string; Votos?:string; Revision?:number; Actualizado?:string}};
async function airtable(path='',init:RequestInit={}){
 const {AIRTABLE_API_KEY:key,AIRTABLE_BASE_ID:base}=process.env,table=process.env.AIRTABLE_TABLE||'Respuestas';
 if(!key||!base)throw new Error('Faltan AIRTABLE_API_KEY o AIRTABLE_BASE_ID.');
 const r=await fetch(`https://api.airtable.com/v0/${base}/${encodeURIComponent(table)}${path}`,{...init,cache:'no-store',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'}});
 if(!r.ok)throw new Error(`Airtable ${r.status}: ${await r.text()}`);
 return r.json();
}
async function all(){
 const rows:Row[]=[];let offset='';
 do{const page=await airtable('?pageSize=100'+(offset?'&offset='+offset:''));rows.push(...page.records);offset=page.offset||''}while(offset);
 return rows.filter(r=>r.fields.Persona);
}
export async function GET(){
 try {
  const rows=await all();
  return reply(rows.map(r=>({person:r.fields.Persona,votes:JSON.parse(r.fields.Votos||'{}'),revision:r.fields.Revision||1,updatedAt:r.fields.Actualizado||''})));
 } catch(e) {console.error(e);return reply({error:'No pudimos cargar las respuestas. Intenta actualizar.'},503)}
}
export async function PUT(request:Request){
 if(request.headers.get('origin') && request.headers.get('origin')!==new URL(request.url).origin)return reply({error:'Origen no permitido'},403);
 try {
  const raw=await request.text(); if(raw.length>6000)return reply({error:'Solicitud demasiado grande'},413);
  const {person,votes,revision}=JSON.parse(raw);
  if(!people.includes(person)||!Number.isInteger(revision)||revision<0||!votes||typeof votes!=='object'||Array.isArray(votes)||Object.entries(votes).some(([k,v])=>!keys.includes(k)||!['yes','no',''].includes(v as string)))return reply({error:'Revisa el nombre y las respuestas.'},400);
  // Airtable has no conditional writes: compare the revision just before saving.
  const current=(await all()).find(r=>r.fields.Persona===person);
  if((current?.fields.Revision||0)!==revision)return reply({error:'Esta respuesta cambió en otro dispositivo. Actualiza antes de editar.'},409);
  const now=new Date().toISOString(),fields={Persona:person,Votos:JSON.stringify(votes),Revision:revision+1,Actualizado:now};
  if(current)await airtable('/'+current.id,{method:'PATCH',body:JSON.stringify({fields,typecast:true})});
  else await airtable('',{method:'POST',body:JSON.stringify({fields,typecast:true})});
  return reply({person,votes,revision:revision+1,updatedAt:now});
 } catch(e) {console.error(e);return reply({error:'No se guardó. Conservamos tus cambios en pantalla para que puedas reintentar.'},503)}
}
