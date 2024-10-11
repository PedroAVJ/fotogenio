import { ChooseStyles } from "./choose-styles";
import { Gender, Style } from "@prisma/client";
import { db } from "@/server/db";

export default async function Page({
  searchParams: { gender },
}: {
  searchParams: {
    gender: Gender;
  };
}) {
  let styles: Style[] = [];
  if (gender === Gender.male) {
    styles = await db.style.findMany({
      where: { gender: Gender.male },
      take: 4,
    });
  } else if (gender === Gender.female) {
    styles = await db.style.findMany({
      where: { gender: Gender.female },
      take: 4,
    });
  }
  return <ChooseStyles styles={styles} />;
}
