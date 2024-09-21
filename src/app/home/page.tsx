import { HomeComponent } from "@/components/home";
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
export default async function Home() {
  const { userId } = auth().protect();
  const { modelStatus } = await db.userSettings.findUniqueOrThrow({
    where: { userId },
    select: { modelStatus: true },
  });
  if (modelStatus === "pending") {
    redirect("/generar-imagenes");
  } else if (modelStatus === "training") {
    redirect("/waiting");
  }
  return <HomeComponent />;
}
