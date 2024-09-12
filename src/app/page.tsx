import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';

export default function Page() {
  return (
    <>
      <h1>Este sera el dashboard en un futuro</h1>
      <UserButton />
      <Link href="/generar-imagenes">Generar imagenes</Link>
    </>
  );
}
