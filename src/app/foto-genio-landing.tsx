import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Work_Sans } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown } from 'lucide-react'
import diana from './mujeres/diana.png'
import dianaVestidoBlanco from './mujeres/diana-vestido-blanco.png'
import santiago from './hombres/santiago.png'
import santiagoSuperman from './hombres/santiago-superman.png'
import reseñaOscarGutierrez from './hombres/reseña-oscar-gutierrez.png'

const workSans = Work_Sans({ 
  subsets: ['latin'],
  variable: '--font-work-sans',
})

import mujerAsombradaEnLaCama from './mujeres/mujer-asombrada-en-la-cama.png'
import hombreEleganteConTatuajes from './hombres/hombre-elegante-con-tatuajes.png'
import mujerRubiaConTatuajesYFondoRojo from './mujeres/mujer-rubia-con-tatuajes-y-fondo-rojo.png'
import hombreCyberpunkConLuces from './hombres/hombre-cyberpunk-con-luces.png'
import hombreConCamisaEstampada from './hombres/hombre-con-camisa-estampada.png'

const personajesFavoritos = [
  {
    photo: mujerAsombradaEnLaCama,
    alternativeText: 'Mujer joven sorprendida en la cama de noche.',
  },
  {
    photo: hombreEleganteConTatuajes,
    alternativeText: 'Hombre con traje y tatuajes visibles caminando en una calle.',
  },
  {
    photo: hombreCyberpunkConLuces,
    alternativeText: 'Hombre con estilo cyberpunk y tatuajes, iluminado con luces rojas.',
  },
  {
    photo: hombreConCamisaEstampada,
    alternativeText: 'Hombre con bigote luciendo una camisa estampada y reloj elegante.',
  },
  {
    photo: mujerRubiaConTatuajesYFondoRojo,
    alternativeText: 'Mujer rubia con tatuajes y estilo punk, posando sobre fondo rojo.',
  },
]

import glamourEnAmbienteLujoso from './mujeres/glamour-en-ambiente-lujoso.png'
import mujerConGafasEnJardin from './mujeres/mujer-con-gafas-en-jardin.png'
import mujerEleganteEnAbrigo from './mujeres/mujer-elegante-en-abrigo-de-piel.png'

const rotatedPhotos = [
  {
    rotate: -15, 
    left: -10, 
    zIndex: 1,
    photo: glamourEnAmbienteLujoso,
    alternativeText: 'Mujer elegante con joyas disfrutando de un entorno lujoso.',
  },
  {
    rotate: 0,
    left: 0,
    zIndex: 2,
    photo: mujerConGafasEnJardin,
    alternativeText: 'Mujer sofisticada con gafas de sol y abrigo de piel, sentada en escaleras de mármol.',
  },
  {
    rotate: 15,
    left: 10,
    zIndex: 3,
    photo: mujerEleganteEnAbrigo,
    alternativeText: 'Mujer elegante con abrigo de piel, posando en un ambiente moderno.',
  },
]

import personajeAnimadoConAtuendoOriental from './mujeres/personaje-animado-con-atuendo-oriental.png'
import hombreEnCiudadLluviosaFuturista from './hombres/hombre-en-ciudad-lluviosa-futurista.png'
import mujerConTrajeTradicionalMexicano from './mujeres/mujer-con-traje-tradicional-mexicano.png'
import hombreFuerteLevantandoPesas from './hombres/hombre-fuerte-levantando-pesas.png'
import mujerEleganteConBotasPlateadas from './mujeres/mujer-elegante-con-botas-plateadas.png'
import superman from './hombres/superman.jpg'

const estilos = [
  { label: "Princesa", emoji: "👑", src: personajeAnimadoConAtuendoOriental, alt: "Mujer con cabello oscuro y joyas doradas" },
  { label: "Avatar", emoji: "🦹", src: hombreEnCiudadLluviosaFuturista, alt: "Hombre con pelo largo en un escenario cyberpunk" },
  { label: "México", emoji: "🇲🇽", src: mujerConTrajeTradicionalMexicano, alt: "Mujer con un vestido mexicano colorido y flores" },
  { label: "GYM", emoji: "💪", src: hombreFuerteLevantandoPesas, alt: "Hombre musculoso levantando pesas" },
  { label: "Sexy", emoji: "👗", src: mujerEleganteConBotasPlateadas, alt: "Mujer con vestido negro en un sofá verde" },
  { label: "Superhéroe", emoji: "🦸", src: superman, alt: "Superman con un traje oscuro" },
]

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
              {personajesFavoritos.slice(0, 3).map((personaje, index) => (
                <Image
                  key={index}
                  src={personaje.photo}
                  alt={personaje.alternativeText}
                  priority
                  className="rounded-lg object-cover w-[155px] h-[226px]"
                />
              ))}
            </div>
            <div className="flex justify-center gap-4">
              {personajesFavoritos.slice(3, 6).map((personaje, index) => (
                <Image
                  key={index}
                  src={personaje.photo}
                  alt={personaje.alternativeText}
                  priority
                  className="rounded-lg object-cover w-[155px] h-[226px]"
                />
              ))}
            </div>
          </div>
          <Button 
            className="bg-gradient-to-r from-[#4776E6] to-[#8E54E9] text-white font-semibold text-[20px] leading-[12px] tracking-[0.02em] rounded-[12px] hover:opacity-90 transition-opacity duration-300 py-6 px-12"
            size="lg"
            asChild
          >
            <Link href="/registrarse/selecciona-genero">¡Empieza Ahora!</Link>
          </Button>
          <p className="text-white text-[20px] font-normal leading-[25px] tracking-[0.02em] mt-4 mb-8 text-center w-full">
            Creamos fotos de ti usando inteligencia artificial.
          </p>
          <div className="flex flex-col items-center space-y-4 w-full max-w-md">
            <Image 
              src={santiago} 
              alt="Selfie de Santiago"
              className="rounded-lg w-[225px] h-[400px] object-cover"
            />
            <ArrowDown className="text-[#8E54E9] w-8 h-8" />
            <Image 
              src={santiagoSuperman} 
              alt="Santiago posando como superman"
              className="rounded-lg w-[225px] h-[400px] object-cover"
            />
            <Image 
              src={diana} 
              alt="Selfie de Diana"
              className="rounded-lg w-[225px] h-[400px] object-cover"
            />
            <ArrowDown className="text-[#8E54E9] w-8 h-8" />
            <Image 
              src={dianaVestidoBlanco} 
              alt="Diana con vestido blanco"
              className="rounded-lg w-[225px] h-[400px] object-cover"
            />
          </div>
          <div className="w-full max-w-md mt-12">
            <div className="rounded-lg p-6">
              <p className="text-white text-2xl font-semibold mb-4 text-center">
                &ldquo;Ahora tengo las mejores fotos para redes sociales&rdquo;
              </p>
              <div className="flex items-center justify-center">
                <Image 
                  src={reseñaOscarGutierrez} 
                  alt="Imagen de Oscar Gutiérrez para la reseña."
                  className="rounded-full mr-4 w-[45px] h-[45px] object-cover object-top"
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
              {rotatedPhotos.map((style, index) => (
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
                    src={style.photo}
                    alt={style.alternativeText}
                    className="rounded-lg object-cover w-[100px] h-[114px]"
                  />
                </div>
              ))}
            </div>
          </div>
          <ArrowDown className="text-white w-8 h-8 mt-8" />
          
          <div className="w-full max-w-2xl mt-12 grid grid-cols-2 gap-4">
            {estilos.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <Image
                  src={item.src}
                  alt={item.alt}
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
            <Link href="/registrarse/selecciona-genero">Comenzar</Link>
          </Button>
        </div>
      </ScrollArea>
    </main>
  )
}