"use client";

import { useEffect } from "react";
import Lottie from "lottie-react";
import animation from "./animacion.json";
import { useRouter } from "next/navigation";
import * as Sentry from "@sentry/nextjs";

// 1. Define the prop types
interface WaitingComponentProps {
  aproxTime: 5 | 30;
}

export function WaitingComponent({ aproxTime }: WaitingComponentProps) {
  const router = useRouter();

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        try {
          router.refresh();
        } catch (error) {
          Sentry.captureException(error);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [router]);

  useEffect(() => {
    const THIRTY_SECONDS = 30000;
    const intervalId = setInterval(() => {
      try {
        router.refresh();
      } catch (error) {
        Sentry.captureException(error);
      }
    }, THIRTY_SECONDS);

    return () => {
      clearInterval(intervalId);
    };
  }, [router]);

  return (
    <div className="flex size-full flex-col px-2 pb-4 pt-2 text-[#F5F5F5]">
      <div className="mb-4 flex w-full space-x-2">
        <h1 className="flex size-16 scroll-m-20 items-center justify-center rounded-lg border-x-4 border-l-[#4776E6] border-r-[#8E54E9] bg-no-repeat text-[32px] font-semibold tracking-[0.02em] text-[#8E54E9] [background-image:linear-gradient(90deg,#4776E6,#8E54E9),linear-gradient(90deg,#4776E6,#8E54E9)] [background-position:0_0,0_100%] [background-size:100%_4px]">
          ✓
        </h1>
        <h3 className="flex grow scroll-m-20 items-center justify-center rounded-lg border-x-4 border-l-[#8E54E9] border-r-[#4776E6] bg-no-repeat text-[20px] font-semibold tracking-[0.02em] [background-image:linear-gradient(90deg,#8E54E9,#4776E6),linear-gradient(90deg,#8E54E9,#4776E6)] [background-position:0_0,0_100%] [background-size:100%_4px]">
          ¡Éxito!
        </h3>
      </div>

      <div className="mx-auto flex w-full max-w-md grow flex-col items-center">
        <h2 className="mb-4 text-center text-[20px] font-semibold tracking-[0.02em]">
          ¡Tus fotos se estan generando!
        </h2>
        <div className="flex w-full max-w-md grow items-center justify-center">
          <Lottie animationData={animation} loop={true} />
        </div>
        <p className="mt-4 text-[12px] font-semibold leading-[20px] tracking-[0.02em]">
          Puedes salir de esta pagina y volver en {aproxTime} minutos aprox.
        </p>
      </div>
    </div>
  );
}
