'use client';

import { useLocalStorage } from 'usehooks-ts';

import { ChooseGender } from './choose-gender';
import { ChooseStyles } from './choose-styles';

export default function Page() {
  const [currentStep] = useLocalStorage('step', 1);
  if (currentStep === 1) {
    return <ChooseGender />;
  }
  return <ChooseStyles />;
}
