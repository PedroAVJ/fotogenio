import { ChooseStyles } from "./choose-styles";
import { db } from "@/lib/clients";
import { searchParamsCache } from "./searchParams";

export default async function Page({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>
}) {
  const { gender } = searchParamsCache.parse(searchParams)
  if (!gender) {
    throw new Error('Gender was null')
  }
  const styles = await db.style.findMany({
    where: { gender },
    take: 4,
  });
  return <ChooseStyles styles={styles} />;
}
