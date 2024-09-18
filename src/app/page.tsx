import Link from 'next/link';
import { UserButton, SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <>
      <h1>Este sera el dashboard en un futuro</h1>
      <UserButton />
      <SignIn />
      <Link href="/generar-imagenes">Generar imagenes</Link>
    </>
  );
}
