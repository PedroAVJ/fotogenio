import { NewStyleComponent } from "./new-style";
import { db } from "@/lib/clients";
import { auth } from "@clerk/nextjs/server";

export default async function NewStyle() {
  const { userId } = auth().protect();
  const { gender, credits } = await db.userSettings.findUniqueOrThrow({
    where: { userId },
  });
  // This style doesn't match our quality standards
  // Omit it for now
  const superheroinaId = "013ad1bb-c9eb-42a4-bfd8-09402e144074";
  const styles = await db.style.findMany({
    where: {
      gender,
      id: {
        not: superheroinaId,
      },
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
