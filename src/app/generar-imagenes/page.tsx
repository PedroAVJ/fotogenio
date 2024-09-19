import { db } from '@/server/db';
import { translateZodErrors } from '@/lib/es-zod';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import { Stepper } from './stepper';

export default async function Page() {
  const { userId } = auth().protect();
  await translateZodErrors();
  const hasModel = await db.userSettings.findFirst({
    where: {
      userId,
    },
    select: {
      hasModel: true,
    },
  });
  if (!hasModel) {
    redirect('/home');
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
