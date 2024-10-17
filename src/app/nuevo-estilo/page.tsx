import { NewStyleComponent } from "./new-style";
import { db } from "@/server/clients";
import { auth } from "@clerk/nextjs/server";

export default async function NewStyle() {
  const { userId } = auth().protect();
  const { gender, credits } = await db.userSettings.findUniqueOrThrow({
    where: { userId },
  });
  const styles = await db.style.findMany({
    where: {
      gender,
    },
    include: {
      _count: {
        select: {
          prompts: true,
        },
      },
    },
  });
  return <NewStyleComponent credits={credits} styles={styles} />;
}
