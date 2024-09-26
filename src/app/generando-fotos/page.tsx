import { WaitingComponent } from "@/components/waiting";
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
    redirect('/generar-imagenes')
  }
  const { modelStatus, pendingPhotos } = userSettings;
  if (modelStatus === 'pending' || modelStatus === 'training') {
    return <WaitingComponent aproxTime={30} />;
  }
  if (pendingPhotos > 0) {
    return <WaitingComponent aproxTime={5} />;
  }
  redirect('/home');
}
