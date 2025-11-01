import { redirect } from "next/navigation";

export default function TracksPage() {
  return redirect("/tracks/search");
}