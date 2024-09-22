import { HomeComponent } from "@/components/home";
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
export default async function Home() {
  const { userId } = auth().protect();
  const { modelStatus, credits, pendingPhotos } = await db.userSettings.findUniqueOrThrow({
    where: { userId },
    select: { modelStatus: true, credits: true, pendingPhotos: true },
  });
  if (modelStatus === "pending") {
    redirect("/generar-imagenes");
  } else if (modelStatus === "training") {
    redirect("/waiting");
  } else if (pendingPhotos > 0) {
    redirect("/waiting-for-photos");
  }
  const photoUrls = await db.generatedPhoto.findMany({
    where: { userId },
    select: { photoUrl: true },
    orderBy: { createdAt: "desc" },
  });
  return <HomeComponent numberOfPhotos={credits} imageUrls={photoUrls.map((photo) => photo.photoUrl)} />;
}
