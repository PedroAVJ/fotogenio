import {
  Building,
  FolderOpen,
  LineChart,
  PackageOpen,
  RouteIcon,
  ShoppingCart,
  Truck,
  Wrench,
} from 'lucide-react';

import { MainLayout } from '@/app/main-layout';
import { NavLink } from '@/app/nav-link';
import { Muted } from '@/components/ui/typography';

function Sidebar({ divisionId }: { divisionId: string }) {
  return (
    <aside className="flex w-80 flex-col gap-12 overflow-y-auto p-6">
      <NavLink href="/">
        <Building size={24} />
        Organización
      </NavLink>
      <div className="flex flex-col gap-3">
        <Muted>Catálogos</Muted>
        <nav className="flex flex-col gap-1">
          <NavLink href={`/division/${divisionId}/agregar/producto`}>
            <PackageOpen size={16} />
            Productos
          </NavLink>
          <NavLink href={`/division/${divisionId}/agregar/vehiculo`}>
            <Truck size={24} />
            Vehículos
          </NavLink>
          <NavLink href={`/division/${divisionId}/agregar/ruta`}>
            <RouteIcon size={20} />
            Rutas
          </NavLink>
        </nav>
      </div>
      <div className="flex flex-col gap-3">
        <Muted>Movimientos</Muted>
        <nav className="flex flex-col gap-1">
          <NavLink href={`/division/${divisionId}/agregar/pedido`}>
            <ShoppingCart size={20} />
            Pedidos
          </NavLink>
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
    </aside>
  );
}

export default function RootLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: { divisionId: string } }>) {
  return (
    <MainLayout sidebar={<Sidebar divisionId={params.divisionId} />}>
      {children}
    </MainLayout>
  );
}
