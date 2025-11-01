import { redirect } from "next/navigation";

export default function AlbumsPage() {
  return redirect("/albums/search");
}