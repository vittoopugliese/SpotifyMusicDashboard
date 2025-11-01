import { redirect } from "next/navigation";

export default function ArtistsPage() {
  return redirect("/artists/search");
}