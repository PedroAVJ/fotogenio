import {
  Building,
  FolderOpen,
  Home,
  HousePlus,
  IdCard,
  LineChart,
  Users,
  Wrench,
} from 'lucide-react';

import { MainLayout } from '@/app/main-layout';
import { NavLink } from '@/app/nav-link';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Muted } from '@/components/ui/typography';

function Sidebar() {
  return (
    <ScrollArea className="h-screen w-80">
      <aside className="flex flex-col gap-12 p-6">
        <NavLink href="/">
          <Home size={24} />
          Inicio
        </NavLink>
        <div className="flex flex-col gap-3">
          <Muted>Catálogos</Muted>
          <nav className="flex flex-col gap-1">
            <NavLink href="/clientes">
              <Users size={16} />
              Clientes
            </NavLink>
            <NavLink href="/agregar/chofer">
              <IdCard size={20} />
              Choferes
            </NavLink>
          </nav>
        </div>
        <div className="flex flex-col gap-3">
          <Muted>Divisiones</Muted>
          <nav className="flex flex-col gap-1">
            <NavLink href="/agregar/division">
              <HousePlus size={20} />
              Agregar
            </NavLink>
            <NavLink href={`/division/${123}`}>Asfaltos</NavLink>
            <NavLink href={`/division/${456}`}>Concretos</NavLink>
          </nav>
        </div>
        <div className="flex flex-col gap-3">
          <Muted>Reportes</Muted>
          <nav className="flex flex-col gap-1">
            <NavLink href="/">
              <FolderOpen size={20} />
              Pending
            </NavLink>
          </nav>
        </div>
        <div className="flex flex-col gap-3">
          <Muted>Analisís</Muted>
          <nav className="flex flex-col gap-1">
            <NavLink href="/">
              <LineChart size={20} />
              Pending
            </NavLink>
          </nav>
        </div>
        <div className="flex flex-col gap-3">
          <Muted>Herramientas</Muted>
          <nav className="flex flex-col gap-1">
            <NavLink href="/">
              <Wrench size={20} />
              Pending
            </NavLink>
          </nav>
        </div>
        <div className="flex flex-col gap-3">
          <Muted>Manejo de organización</Muted>
          <nav className="flex flex-col gap-1">
            <NavLink href="/">
              <Building size={20} />
              Pending
            </NavLink>
          </nav>
        </div>
      </aside>
    </ScrollArea>
  );
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <MainLayout sidebar={<Sidebar />}>{children}</MainLayout>;
}
