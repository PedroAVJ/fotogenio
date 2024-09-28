'use client';

import { useLocalStorage } from 'react-use-storage'
import { Style } from '@prisma/client';

import { ChooseGender } from './choose-gender';
import { ChooseStyles } from './choose-styles';
import { CreateAccountComponent } from './create-account';
import { UploadPhotosComponent } from './upload-photos';
import { ChoosePaymentComponent } from './choose-payment';

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
  } else if (currentStep === 2) {
    return <ChooseStyles maleStyles={maleStyles} femaleStyles={femaleStyles} />;
  } else if (currentStep === 3) {
    return <CreateAccountComponent />;
  } else if (currentStep === 4) {
    return <UploadPhotosComponent />
  }
  return <ChoosePaymentComponent />;
}