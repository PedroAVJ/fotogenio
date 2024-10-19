'use client'

import { Work_Sans } from 'next/font/google'
import { useSignUp } from '@clerk/nextjs'

const workSans = Work_Sans({ subsets: ['latin'] })

export function CreateAccountComponent() {
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
            4
          </h1>
          <h3 className="scroll-m-20 text-xl tracking-tight flex grow justify-center rounded-lg border-x-4 border-l-[#8E54E9] border-r-[#4776E6] bg-no-repeat p-4 font-semibold [background-image:linear-gradient(90deg,#8E54E9,#4776E6),linear-gradient(90deg,#8E54E9,#4776E6)] [background-size:100%_4px] [background-position:0_0,0_100%]">
            Crea tu cuenta
          </h3>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center w-56 max-w-md space-y-6 flex-grow">
        <GoogleSignUpButton />
      </div>
    </main>
  )
}

import { Button } from "@/components/ui/button"
import Image from 'next/image'
import GoogleLogo from './google-logo.svg'
import { Route } from 'next'
import { useSearchParams } from 'next/navigation'
import { StaticImageData } from 'next/image'

function GoogleSignUpButton() {
  const { signUp } = useSignUp()
  const searchParams = useSearchParams()
  function signUpWithGoogle() {
    if (!signUp) return null
    const redirectUrl: Route = '/sso-callback'
    const redirectUrlComplete: Route = `/registrarse/pago?${searchParams.toString()}`
    return signUp.authenticateWithRedirect({
      strategy: 'oauth_google',
      redirectUrl,
      redirectUrlComplete,
    })
  }
  return (
    <Button 
      variant="outline" 
      onClick={function () {
        void signUpWithGoogle()
      }}
      className="w-full max-w-sm flex items-center justify-center gap-3 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors rounded-lg"
    >
      <Image
        src={GoogleLogo as StaticImageData}
        alt="Google logo"
        className="size-5"
      />
      <span className="font-semibold">Registrarse con Google</span>
    </Button>
  )
}
