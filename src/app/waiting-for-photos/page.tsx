import { WaitingComponent } from "@/components/waiting";
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const { userId } = auth().protect();
  const { modelStatus, pendingPhotos } = await db.userSettings.findFirstOrThrow({
    where: {
      userId,
    },
    select: {
      modelStatus: true,
      pendingPhotos: true,
    },
  });
  if (modelStatus === 'ready') {
    redirect('/home');
  } else if (modelStatus === 'pending') {
    redirect('/generar-imagenes');
  } else if (pendingPhotos === 0) {
    redirect('/home');
  }
  return <WaitingComponent aproxTime={5} />;
}
