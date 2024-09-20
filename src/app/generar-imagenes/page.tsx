import { db } from '@/server/db';
import { translateZodErrors } from '@/lib/es-zod';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import { Stepper } from './stepper';

export default async function Page() {
  const { userId } = auth().protect();
  await translateZodErrors();
  const { modelStatus } = await db.userSettings.findFirstOrThrow({
    where: {
      userId,
    },
    select: {
      modelStatus: true,
    },
  });
  if (modelStatus === 'ready') {
    redirect('/home');
  } else if (modelStatus === 'training') {
    redirect('/wait')
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
