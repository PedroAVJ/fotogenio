import { WaitingComponent } from "./waiting";
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const { userId } = auth().protect();
  const userSettings = await db.userSettings.findUnique({
    where: {
      userId,
    },
  });
  if (!userSettings) {
    redirect('/registrarse/selecciona-genero')
  }
  const { modelStatus } = userSettings;
  if (modelStatus === 'pending' || modelStatus === 'training') {
    return <WaitingComponent aproxTime={30} />;
  }
  const pendingPhotos = await db.generatedPhoto.count({
    where: {
      userId,
      photoUrl: null,
    },
  });
  if (pendingPhotos > 0) {
    return <WaitingComponent aproxTime={5} />;
  }
  redirect('/inicio');
}
