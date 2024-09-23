'use client'

import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Work_Sans } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown } from 'lucide-react'

const workSans = Work_Sans({ 
  subsets: ['latin'],
  variable: '--font-work-sans',
})

export function FotoGenioLandingComponent() {
  return (
    <main className={`h-screen w-full bg-gradient-to-b from-[#323133] to-[#4776E6] ${workSans.variable} font-sans`}>
      <ScrollArea className="h-full w-full">
        <div className="flex flex-col items-center p-6">
          <div className="w-full">
            <h1 className="text-[32px] font-bold leading-[38px] tracking-[0.02em] mb-8">
              <span className="mr-2">📸</span>
              <span className="text-white">Foto</span>
              <span className="text-[#007AFF]">Genio</span>
              <span className="ml-2">🧞‍♀️</span>
            </h1>
          </div>
          <div className="text-center max-w-md mx-auto mb-12">
            <p className="text-[32px] font-semibold leading-[30px] tracking-[0.02em] text-white">
              Conviértete en tus
            </p>
            <p className="text-[32px] font-semibold leading-[30px] tracking-[0.02em]">
              <span className="inline-block bg-gradient-to-r from-[#8E54E9] to-[#F5F5F5] text-transparent bg-clip-text">
                personajes
              </span>
            </p>
            <p className="text-[32px] font-semibold leading-[30px] tracking-[0.02em] text-white">
              favoritos!
            </p>
          </div>
          <div className="w-full max-w-[495px] space-y-4 mb-8">
            <div className="grid grid-cols-3 gap-4">
              <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-9hQY2WxwMjda00PnoIVe8S1H6byQZr.png" alt="Blonde woman in blue lighting" width={155} height={226} className="rounded-lg object-cover w-[155px] h-[226px]" />
              <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-9zCRfc7NCVffAWiU9Px8KDvYCL3AbM.png" alt="Man in suit with tattoos" width={155} height={226} className="rounded-lg object-cover w-[155px] h-[226px]" />
              <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-oHWovo6g4knA5s1aixSDKD1nerYJ8Q.png" alt="Man with cyberpunk aesthetic" width={155} height={226} className="rounded-lg object-cover w-[155px] h-[226px]" />
            </div>
            <div className="flex justify-center gap-4">
              <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-R0A3pM2o1r3E62bIgoAAiXac4Cg384.png" alt="Man in patterned shirt" width={155} height={226} className="rounded-lg object-cover w-[155px] h-[226px]" />
              <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-lvBoMIcNaRxxLFUsvx287jbFAZj2WD.png" alt="Blonde woman with tattoos on red background" width={155} height={226} className="rounded-lg object-cover w-[155px] h-[226px]" />
            </div>
          </div>
          <Button 
            className="bg-gradient-to-r from-[#4776E6] to-[#8E54E9] text-white font-semibold text-[20px] leading-[12px] tracking-[0.02em] rounded-[12px] hover:opacity-90 transition-opacity duration-300 py-6 px-12"
            size="lg"
            asChild
          >
            <Link href="/generar-imagenes">¡Empieza Ahora!</Link>
          </Button>
          <p className="text-white text-[20px] font-normal leading-[25px] tracking-[0.02em] mt-4 mb-8 text-center w-full">
            Creamos fotos de ti usando inteligencia artificial.
          </p>
          <div className="flex flex-col items-center space-y-4 w-full max-w-md">
            <Image 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-uM386HQLvMXAreCPoLHmqgRzWgQwKm.png" 
              alt="Young man with dark hair smiling in a restaurant" 
              width={225} 
              height={400} 
              className="rounded-lg w-[225px] h-[400px] object-cover"
            />
            <ArrowDown className="text-[#8E54E9] w-8 h-8" />
            <Image 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-NlUQiMtWgr1Bv37dmoiEDRSk1HE3cG.png" 
              alt="Muscular man posing in a gym" 
              width={225} 
              height={400} 
              className="rounded-lg w-[225px] h-[400px] object-cover"
            />
            <Image 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-j88v8EkPTzSD3yARcQ783slKFP7zl5.png" 
              alt="Young woman with long dark hair wearing a purple sweater" 
              width={225} 
              height={400} 
              className="rounded-lg w-[225px] h-[400px] object-cover"
            />
            <ArrowDown className="text-[#8E54E9] w-8 h-8" />
            <Image 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-jHDDBHF7I51o7P6I05ExEyu4NCYmJj.png" 
              alt="Young blonde woman in a white lace dress holding white tulips" 
              width={225} 
              height={400} 
              className="rounded-lg w-[225px] h-[400px] object-cover"
            />
          </div>
          <div className="w-full max-w-md mt-12">
            <div className="rounded-lg p-6">
              <p className="text-white text-2xl font-semibold mb-4 text-center">
                "Ahora tengo las mejores fotos para redes sociales"
              </p>
              <div className="flex items-center justify-center">
                <Image 
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ZYDAQYQ8JPRRmvl6KqRkBELQCutOpM.png" 
                  alt="Oscar Gutierrez" 
                  width={45} 
                  height={45} 
                  className="rounded-full mr-4"
                />
                <p className="text-white font-bold text-[14px] leading-[29px] tracking-[-0.2px]">
                  Oscar Gutierrez
                </p>
              </div>
            </div>
          </div>
          <div className="w-full max-w-md mt-12 rounded-lg p-6">
            <h2 className="text-[32px] font-semibold leading-[30px] tracking-[0.02em] text-center bg-gradient-to-r from-[#8E55E9] to-white text-transparent bg-clip-text">
              Sube tus fotos y se los siguientes estilos
            </h2>
          </div>
          <div className="flex justify-center items-end w-full max-w-md h-40 mt-12">
            <div className="relative w-[120px] h-[114px]">
              {[
                { 
                  rotate: -15, 
                  left: -10, 
                  zIndex: 1, 
                  src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-QE7kUjqWaaj4P2Ry9qix9zDgnNSncO.png",
                  alt: "Blonde woman in a black dress at a dining table"
                },
                { 
                  rotate: 0, 
                  left: 0, 
                  zIndex: 2, 
                  src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-klogHJaO107IfQWEFPLLOEf5jD7RsR.png",
                  alt: "Woman with long dark hair and glasses"
                },
                { 
                  rotate: 15, 
                  left: 10, 
                  zIndex: 3, 
                  src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-SkZbmDzysqmDA4duEybo3tM0ufD6v9.png",
                  alt: "Woman in a black fur coat on wooden steps"
                },
              ].map((style, index) => (
                <div
                  key={index}
                  style={{
                    position: 'absolute',
                    transform: `rotate(${style.rotate}deg)`,
                    left: `${style.left}px`,
                    bottom: '0px',
                    zIndex: style.zIndex,
                    transformOrigin: 'bottom center',
                    overflow: 'hidden',
                  }}
                >
                  <Image
                    src={style.src}
                    alt={style.alt}
                    width={100}
                    height={114}
                    objectFit="cover"
                  />
                </div>
              ))}
            </div>
          </div>
          <ArrowDown className="text-white w-8 h-8 mt-8" />
          
          <div className="w-full max-w-2xl mt-12 grid grid-cols-2 gap-4">
            {[
              { label: "Princesa", emoji: "👑", src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-LQ1b2ZwdgIkkzzHQMAQz1sWfiLBLFb.png", alt: "Woman with dark hair and golden jewelry" },
              { label: "Avatar", emoji: "🦹", src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ppuifls2gKu8UvGL9VB9mAtN1p5cjh.png", alt: "Man with long hair in a cyberpunk setting" },
              { label: "México", emoji: "🇲🇽", src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-hflAUSjyvUiNlqelxdGYcywR0qB8DH.png", alt: "Woman in a colorful Mexican dress with flowers" },
              { label: "GYM", emoji: "💪", src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-jl6iTPKTjzcsw8sPS2LXpl84EJKIRs.png", alt: "Muscular man lifting weights" },
              { label: "Sexy", emoji: "👗", src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ugKNbZLizWFZ8N5nahKe3BNnTFLMkh.png", alt: "Woman in a black dress on a green couch" },
              { label: "SuperHeroe", emoji: "🦸", src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-j832p9V84OvtW8dvnQoGQus1HGL69e.png", alt: "Superman in a dark suit" },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={155}
                  height={226}
                  className="rounded-lg object-cover w-[155px] h-[226px]"
                />
                <p className="text-white text-[20px] font-normal leading-[25px] tracking-[0.02em] mt-2 font-work-sans">
                  {item.label} {item.emoji}
                </p>
              </div>
            ))}
          </div>
          
          <p className="text-white text-[20px] font-normal leading-[25px] tracking-[0.02em] mt-8 font-work-sans">
            ¡Y muchos más!
          </p>

          <Button 
            className="bg-gradient-to-r from-[#C9BDDC] to-[#8E55E9] text-white font-bold text-[20px] leading-[12px] tracking-[0.02em] rounded-[12px] hover:opacity-90 transition-opacity duration-300 mt-8 py-6 px-12 mb-[60px]"
            size="lg"
            asChild
          >
            <Link href="/generar-imagenes">Comenzar</Link>
          </Button>
        </div>
      </ScrollArea>
    </main>
  )
}