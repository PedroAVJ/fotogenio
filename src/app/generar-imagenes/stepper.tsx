'use client';

import { useLocalStorage } from 'usehooks-ts';
import { Style } from '@prisma/client';

import { ChooseGender } from './choose-gender';
import { ChooseStyles } from './choose-styles';

export function Stepper({
  maleStyles,
  femaleStyles,
}: {
  maleStyles: Style[];
  femaleStyles: Style[];
}) {
  const [currentStep] = useLocalStorage('step', 1);
  if (currentStep === 1) {
    return <ChooseGender />;
  }
  return <ChooseStyles maleStyles={maleStyles} femaleStyles={femaleStyles} />;
}
