'use client';
import {useState} from 'react';
import {Sun,Sunset,X} from 'lucide-react';
import {people,dates,periods,blocked,dateLabel,type Entry} from '@/lib/calendar';
export default function Overlap({entries}:{entries:Entry[]}){
 const [focus,setFocus]=useState<string[]>([]),[slot,setSlot]=useState('');
 const group=focus.length?focus:people;
 const vote=(p:string,k:string)=>entries.find(e=>e.person===p)?.votes[k]||'';
 const who=(k:string,v:string)=>group.filter(p=>vote(p,k)===v);
 const toggle=(p:string)=>setFocus(f=>f.includes(p)?f.filter(x=>x!==p):[...f,p]);
 const shade=(n:number)=>{const pct=Math.round(n/group.length*100);return {background:n?`color-mix(in oklab,#3f632b ${pct}%,#f4f6ef)`:'#fafbf7',color:pct>55?'#fff':'var(--ink)'}};
 const sel=slot&&{yes:who(slot,'yes'),no:who(slot,'no'),pending:who(slot,'')};
 return <div className="overlap">
  <div className="sectionHeading"><h3>Mapa de coincidencias</h3></div>
  <p className="small">Entre más oscura la casilla, más personas pueden. Toca una jornada para ver quiénes.</p>
  <div className="chips" role="group" aria-label="Personas clave"><span>Personas clave:</span>{people.map(p=><button key={p} aria-pressed={focus.includes(p)} className={focus.includes(p)?'on':''} onClick={()=>toggle(p)}>{p}</button>)}{focus.length>0&&<button className="clear" onClick={()=>setFocus([])}><X size={14}/> Todos</button>}</div>
  {focus.length>0&&<p className="small">Mostrando solo {focus.length===1?focus[0]:`${focus.length} personas`}. ★ = todas pueden.</p>}
  <div className="calendarHead"><span>Fecha</span><span><Sun size={19}/> Mañana</span><span><Sunset size={19}/> Tarde</span></div>
  {dates.map((d,i)=><div key={d}>{(i===0||d.slice(5,7)!==dates[i-1].slice(5,7))&&<div className="month">{new Date(d+'T12:00:00').toLocaleDateString('es-CO',{month:'long'})}</div>}
   <div className="dateRow"><div className="day"><b>{d.slice(8)}</b><span>{new Date(d+'T12:00:00').toLocaleDateString('es-CO',{weekday:'long'})}</span></div>
   {periods.map(p=>{const k=d+'-'+p;if(blocked[k])return <div key={k} className="slot blocked">{blocked[k]}</div>;const y=who(k,'yes').length,n=who(k,'no').length,all=y===group.length;
    return <button key={k} className={'heat'+(slot===k?' picked':'')+(all&&focus.length?' all':'')} style={shade(y)} title={`${y} pueden · ${n} no pueden · ${group.length-y-n} pendientes`} aria-label={`${dateLabel(d)}, ${p}: ${y} de ${group.length} pueden`} onClick={()=>setSlot(slot===k?'':k)}><strong>{all&&focus.length?'★ ':''}{y}/{group.length}</strong><small>{n?`${n} no`:''}</small></button>})}</div></div>)}
  <div className="legend" aria-hidden="true"><span>0</span><i/><span>{group.length} pueden</span></div>
  {sel&&<div className="detail" role="status"><div className="detailHead"><b>{dateLabel(slot.slice(0,10))} · {slot.slice(11)}</b><button aria-label="Cerrar" onClick={()=>setSlot('')}><X size={16}/></button></div>
   <p><span className="tag yes">✓ Pueden ({sel.yes.length})</span>{sel.yes.join(', ')||'Nadie'}</p>
   <p><span className="tag no">× No pueden ({sel.no.length})</span>{sel.no.join(', ')||'Nadie'}</p>
   <p><span className="tag">— Pendientes ({sel.pending.length})</span>{sel.pending.join(', ')||'Nadie'}</p></div>}
 </div>
}
