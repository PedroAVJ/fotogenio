import { db } from '@/server/db';
import { translateZodErrors } from '@/lib/es-zod';

import { Stepper } from './stepper';

export default async function Page() {
  await translateZodErrors();
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
