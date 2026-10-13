import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'Taller 2G 3G · Calendario familiar',description:'Encontramos un momento para reunirnos. Disponibilidad familiar para el Taller 2G 3G.',icons:{icon:'/guaicaramo.png'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="es"><body>{children}</body></html>}
