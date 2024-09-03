import { zodResolver } from '@hookform/resolvers/zod';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';
import { sampleSize } from 'lodash';
import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';
import { useForm, useFormContext } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { z } from '@/lib/es-zod';

function runCipher(
  submittedCode: string,
  generatedCode: string,
  direction: 'left' | 'right',
  corner: 'topLeft' | 'bottomRight',
) {
  const choices = {
    left: {
      topLeft: ['I', 'T', 'G', 'B', 'Y', 'H', 'N', 'U', 'J', 'M'],
      bottomRight: ['I', 'M', 'J', 'U', 'N', 'H', 'Y', 'B', 'G', 'T'],
    },
    right: {
      topLeft: ['R', 'Q', 'A', 'Z', 'W', 'S', 'X', 'E', 'D', 'C'],
      bottomRight: ['R', 'C', 'D', 'E', 'X', 'S', 'W', 'Z', 'A', 'Q'],
    },
  };
  const processedCode = generatedCode
    .split('')
    .map((digit) => choices[direction][corner][parseInt(digit, 10)])
    .join('');
  return processedCode === submittedCode;
}

function validateCode(submittedCode: string, generatedCode: string) {
  const regex = /^[A-Z]{4}$/;
  if (!regex.test(submittedCode)) {
    return false;
  }
  const firstDigit = generatedCode[0] ? parseInt(generatedCode[0], 10) : 0;
  const secondDigit = generatedCode[1] ? parseInt(generatedCode[1], 10) : 0;
  const code =
    secondDigit % 2 === 1
      ? generatedCode.split('').reverse().join('')
      : generatedCode;
  return runCipher(
    submittedCode,
    code,
    firstDigit % 2 === 0 ? 'left' : 'right',
    secondDigit % 2 === 0 ? 'topLeft' : 'bottomRight',
  );
}

const cipherSchema = z.object({
  submittedCode: z.string().min(4),
});

type CipherSchema = z.infer<typeof cipherSchema>;

function PasswordInput() {
  const { control } = useFormContext<CipherSchema>();
  return (
    <FormField
      control={control}
      name="submittedCode"
      render={({ field }) => (
        <FormItem className="flex flex-col items-center gap-2">
          <FormLabel>Nueva clave de seguridad</FormLabel>
          <FormControl>
            <InputOTP
              maxLength={4}
              {...field}
              pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

interface CipherFormProps {
  setIsSupervisor: Dispatch<SetStateAction<boolean>>;
}

export function CipherDialogForm({ setIsSupervisor }: CipherFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  useEffect(() => {
    const digits = '0123456789';
    setGeneratedCode(sampleSize(digits, 4).join(''));
  }, []);
  const form = useForm<CipherSchema>({
    resolver: zodResolver(cipherSchema),
    defaultValues: {
      submittedCode: '',
    },
  });
  function onSubmit(data: CipherSchema) {
    if (!validateCode(data.submittedCode, generatedCode)) {
      toast.error('Clave incorrecta');
      return;
    }
    setIsSupervisor(true);
    setIsOpen(false);
  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">Habilitar edición de crédito</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{generatedCode}</DialogTitle>
          <DialogDescription>
            Ingrese la nueva clave de seguridad.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <PasswordInput />
        </Form>
        <DialogFooter>
          <Button onClick={form.handleSubmit(onSubmit)}>Verificar clave</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
