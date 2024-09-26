import { HomeComponent } from "./home";
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = auth().protect();
  const userSettings = await db.userSettings.findUnique({
    where: { userId },
    select: { credits: true, pendingPhotos: true },
  });
  if (!userSettings) {
    redirect('/generar-imagenes')
  }
  const { pendingPhotos, credits } = userSettings;
  if (pendingPhotos > 0) {
    redirect("/waiting-for-photos");
  }
  const generatedPhotos = await db.generatedPhoto.findMany({
    where: { userId },
    select: { photoUrl: true },
    orderBy: { createdAt: "desc" },
  });
  const imageUrls = generatedPhotos.map((generatedPhoto) => generatedPhoto.photoUrl);
  return <HomeComponent numberOfPhotos={credits} imageUrls={imageUrls} />;
}
