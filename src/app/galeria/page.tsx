import { HomeComponent } from "./home";
import { db } from "@/server/clients";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  const { userId } = auth().protect();
  const { credits } = await db.userSettings.findUniqueOrThrow({
    where: { userId },
  });
  const generatedPhotos = await db.generatedPhoto.findMany({
    where: { userId, photoUrl: { not: null } },
    orderBy: {
      createdAt: "desc",
      promptId: "asc",
    },
  });
  return <HomeComponent credits={credits} generatedPhotos={generatedPhotos} />;
}
