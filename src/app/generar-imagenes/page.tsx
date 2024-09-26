import { db } from '@/server/db';
import { translateZodErrors } from '@/lib/es-zod';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import { Stepper } from './stepper';

export default async function Page() {
  await translateZodErrors();
  const { userId } = auth();
  if (userId) {
    const userSettings = await db.userSettings.findUnique({
      where: {
        userId,
      },
    });
    if (userSettings) {
      if (userSettings.modelStatus === 'ready') {
        redirect('/home');
      } else if (userSettings.modelStatus === 'training') {
        redirect('/generando-fotos');
      }
    }
  }
  const maleStyles = await db.style.findMany({
    where: {
      gender: 'male',
    },
    take: 4,
  });
  const femaleStyles = await db.style.findMany({
    where: {
      gender: 'female',
    },
    take: 4,
  });
  return <Stepper maleStyles={maleStyles} femaleStyles={femaleStyles} />;
}
