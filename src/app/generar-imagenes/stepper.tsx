'use client';

import { useLocalStorage } from 'react-use-storage'
import { Style } from '@prisma/client';

import { ChooseGender } from '@/components/choose-gender';
import { ChooseStyles } from '@/components/choose-styles';
import { CreateAccountComponent } from '@/components/create-account';
import { UploadPhotosComponent } from '@/components/upload-photos';
import { ChoosePaymentComponent } from '@/components/choose-payment';

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
