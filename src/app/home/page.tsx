import { HomeComponent } from "./home";
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = auth().protect();
  const { credits, pendingPhotos } = await db.userSettings.findUniqueOrThrow({
    where: { userId },
    select: { credits: true, pendingPhotos: true },
  });
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
