import { ChooseStyles } from "./choose-styles";
import { db } from "@/lib/clients";
import { searchParamsCache } from "./searchParams";

export default async function Page({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const { gender } = searchParamsCache.parse(searchParams);
  if (!gender) {
    throw new Error("Gender was null");
  }
  if (gender === "female") {
    // These are our top picks for female styles
    const narcoBebeId = "009d9fc3-16ab-438d-b21b-18848b41eee8";
    const mexicanaId = "10e3b4ba-a4fe-448d-bc2d-de0d10e389b4";
    const princesaId = "2ceac102-5794-4ceb-9dd3-3dbdf4a896a1";
    const rancheraId = "9f3b5a54-1e37-474a-a94c-a7fd65ead223";
    const styles = await db.style.findMany({
      where: {
        id: {
          in: [narcoBebeId, mexicanaId, princesaId, rancheraId],
        },
      },
    });
    return <ChooseStyles styles={styles} />;
  } else {
    // These are our top picks for male styles
    const gymId = "7ea3ad3b-9afa-47d8-bd95-0e362d8f6b25";
    const superheroeId = "f389d232-3d31-4776-91d0-681131f14799";
    const ricoId = "86fd972a-b8b9-4b08-8e5f-d5f3482cc2e9";
    const rancheroId = "b423d2bc-4469-4646-b803-ffcbf08fec27";
    const styles = await db.style.findMany({
      where: {
        id: {
          in: [gymId, superheroeId, ricoId, rancheroId],
        },
      },
    });
    return <ChooseStyles styles={styles} />;
  }
}
