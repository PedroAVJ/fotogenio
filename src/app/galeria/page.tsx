import { HomeComponent } from "./home";
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = auth().protect();
  const userSettings = await db.userSettings.findUnique({
    where: { userId },
  });
  if (!userSettings) {
    redirect('/registrarse/selecciona-genero')
  }
  const { credits } = userSettings;
  const generatedPhotos = await db.generatedPhoto.findMany({
    where: { userId, photoUrl: { not: null } },
    orderBy: { createdAt: "desc" },
  });
  return <HomeComponent credits={credits} generatedPhotos={generatedPhotos} />;
}
