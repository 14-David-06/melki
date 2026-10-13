export const people = ['Catalina','Camila','Tomás','Pablo','Roberto Jr.','Roberto Sr.','Luis','Paula','Santiago','Martín','Juan'];
export const dates = ['2026-10-19','2026-11-23','2026-11-24','2026-11-25','2026-12-15','2026-12-16','2026-12-17','2026-12-18'];
export const periods = ['Mañana','Tarde'];
export const keys = dates.flatMap(d => periods.map(p => d+'-'+p));
export type Votes = Record<string, 'yes' | 'no' | ''>;
export type Entry = {person:string; votes:Votes; revision:number; updatedAt:string};
export const dateLabel = (d:string) => new Date(d+'T12:00:00').toLocaleDateString('es-CO',{weekday:'short',day:'numeric',month:'short'});
