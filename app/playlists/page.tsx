import { redirect } from "next/navigation";

export default function PlaylistsPage() {
  return redirect("/playlists/yours");
}