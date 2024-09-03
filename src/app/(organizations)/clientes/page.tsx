import { auth } from '@clerk/nextjs/server';

import { db } from '@/server/db';

import { ClienteDatatable } from './cliente-datatable';

export default async function Page() {
  const { orgId } = auth();
  const clientes = await db.cliente.findMany({
    where: {
      orgId: orgId ?? '',
    },
  });
  return (
    <div className="flex w-full flex-col gap-4">
      <ClienteDatatable clientes={clientes} />
    </div>
  );
}
