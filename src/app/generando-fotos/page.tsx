import { WaitingComponent } from "./waiting";
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Route } from "next";

export default async function Page() {
  const { userId } = auth().protect();
  const { modelStatus } = await db.userSettings.findUniqueOrThrow({
    where: {
      userId,
    },
  });
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
  const url: Route = '/galeria';
  redirect(url);
}
