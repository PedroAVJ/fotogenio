import { NewStyleComponent } from "./new-style";
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function NewStyle() {
  const { userId } = auth().protect();
  const userSettings = await db.userSettings.findUnique({
    where: { userId },
  });
  if (!userSettings) {
    redirect('/generar-imagenes')
  }
  const { pendingPhotos, gender, credits } = userSettings;
  if (pendingPhotos > 0) {
    redirect("/waiting-for-photos");
  }
  const chosenStyles = await db.chosenStyle.findMany({
    where: {
      userId,
    },
    select: {
      styleId: true,
    },
  });
  const notChosenStyles = await db.style.findMany({
    where: {
      id: {
        notIn: chosenStyles.map((chosenStyle) => chosenStyle.styleId),
      },
      gender,
    },
    include: {
      prompts: {
        select: {
          id: true,
        },
      },
    },
  });
  const styles = notChosenStyles.map((style) => ({
    ...style,
    imageCount: style.prompts.length,
  }));
  return <NewStyleComponent initialCredits={credits} styles={styles} />;
}
