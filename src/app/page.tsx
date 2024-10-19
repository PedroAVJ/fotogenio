import { FotoGenioLandingComponent } from "./foto-genio-landing";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Route } from "next";

export default function Page() {
  const { userId } = auth();
  if (userId) {
    const url: Route = '/galeria';
    redirect(url);
  }
  return <FotoGenioLandingComponent />;
}
