'use client'

import React, { useState } from 'react'
import { Work_Sans } from 'next/font/google'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { useLocalStorage } from 'react-use-storage'
import { Mail } from 'lucide-react'
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod'
import { useSignUp } from '@clerk/nextjs'
import { addUserSettingsAction } from '@/app/generar-imagenes/actions'
import { Gender } from '@prisma/client'

const workSans = Work_Sans({ subsets: ['latin'] })

const formSchema = z.object({
  emailAddress: z.string().email('Por favor ingresa una dirección de correo electrónico válida'),
})

type FormData = z.infer<typeof formSchema>

export function CreateAccountComponent() {
  const { signUp, setActive, isLoaded } = useSignUp()
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      emailAddress: '',
    },
  })

  const [step, setStep] = useLocalStorage<number>('step', 3)
  const [gender] = useLocalStorage<Gender>('selectedGender')
  const [styleIds] = useLocalStorage<string[]>('selectedStyles')
  const [codeSent, setCodeSent] = useState(false)

  async function handleSendCode() {
    if (!isLoaded) return
    setCodeSent(true)
    await signUp.create({
      emailAddress: form.getValues('emailAddress'),
    })
    await signUp.prepareEmailAddressVerification()
  }

  async function handleCodeChange(code: string) {
    if (code.length !== 6) return
    if (!isLoaded) return
    const signInAttempt = await signUp.attemptEmailAddressVerification({
      code,
    })
    await setActive({ session: signInAttempt.createdSessionId })
    await addUserSettingsAction({
      gender,
      styleIds,
    })
    setStep(4)
  }
  const isValid = form.formState.isValid

  return (
    <main className={`
      ${workSans.className}
      h-dvh w-dvw
      flex size-full flex-col items-center justify-between
      px-4 pb-8 pt-4
      text-[#F5F5F5]
      bg-gradient-to-b from-[#534E4E] to-[#171717]
    `}>
      <div className="flex flex-col items-center justify-center w-full max-w-md space-y-6">
        <div className="flex w-full space-x-2">
          <h1 
            className="scroll-m-20 text-3xl tracking-tight lg:text-5xl flex size-16 items-center justify-center rounded-lg border-x-4 border-l-[#4776E6] border-r-[#8E54E9] bg-no-repeat font-semibold text-[#8E54E9] [background-image:linear-gradient(90deg,#4776E6,#8E54E9),linear-gradient(90deg,#4776E6,#8E54E9)] [background-size:100%_4px] [background-position:0_0,0_100%]"
          >
            {step}
          </h1>
          <h3 className="scroll-m-20 text-xl tracking-tight flex grow justify-center rounded-lg border-x-4 border-l-[#8E54E9] border-r-[#4776E6] bg-no-repeat p-4 font-semibold [background-image:linear-gradient(90deg,#8E54E9,#4776E6),linear-gradient(90deg,#8E54E9,#4776E6)] [background-size:100%_4px] [background-position:0_0,0_100%]">
            Crea tu cuenta
          </h3>
        </div>
        <div className="flex flex-col items-center justify-center w-full max-w-md space-y-6">
          <div className="w-full h-24 bg-gradient-to-r from-[#8E54E9] to-[#4776E6] rounded-lg flex items-center justify-center">
            <Mail className="w-12 h-12 text-white" />
          </div>
          <h4 className="text-xl font-semibold">Verifica tu dirección de correo electrónico</h4>
          <p className="text-xs text-left">
            Por favor introduce el <span className="font-extrabold">código</span> que te enviamos a tu <span className="font-extrabold">correo electrónico</span>.
          </p>
          <Form {...form}>
            <FormField
              control={form.control}
              name="emailAddress"
              render={({ field }) => {
                return (
                  <>
                    <FormItem className="w-full flex items-center space-x-4 px-3 py-2">
                      <Mail className="h-8 w-8 text-gray-400 flex-shrink-0" />
                      <FormControl>
                        <Input
                          type="email"
                          {...field}
                          className="bg-transparent text-white py-6 px-6 w-full text-lg"
                          placeholder="Ingresa tu dirección de correo electrónico"
                        />
                      </FormControl>
                    </FormItem>
                    <FormMessage />
                  </>
                )
              }}
            />
          </Form>
          {!codeSent ? (
            <Button
              onClick={() => form.handleSubmit(handleSendCode)()}
              className={`w-full bg-gradient-to-r from-[#4776E6] to-[#8E54E9] text-white py-2 rounded-lg transition-opacity ${
                isValid ? 'hover:opacity-90' : 'opacity-50 cursor-not-allowed'
              }`}
              disabled={!isValid}
            >
              Enviar código
            </Button>
          ) : (
            <>
              <InputOTP
                onChange={handleCodeChange}
                maxLength={6}
              >
                <InputOTPGroup className="gap-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className={`
                        w-12 h-12 text-center text-lg bg-transparent text-white rounded-md
                        focus:border-[#8E54E9] focus:ring-1 focus:ring-[#8E54E9]
                        border border-[#4776E6]
                      `}
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              <div className="w-full">
                <button onClick={() => handleSendCode()} className="text-[#8E54E9] text-sm text-left">
                  ¿Pedir otro código?
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <Button
        size="lg"
        className="w-full font-semibold max-w-md rounded-md text-[#F5F5F5] bg-gradient-to-r from-[#4776E6] to-[#8E54E9] opacity-50 cursor-not-allowed"
        disabled
      >
        Siguiente
      </Button>
    </main>
  )
}
