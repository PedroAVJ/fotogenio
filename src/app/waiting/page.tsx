import { WaitingComponent } from "@/components/waiting";
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const { userId } = auth().protect();
  const { modelStatus } = await db.userSettings.findFirstOrThrow({
    where: {
      userId,
    },
    select: {
      modelStatus: true,
    },
  });
  if (modelStatus === 'ready') {
    redirect('/home');
  }
  return <WaitingComponent />;
}
