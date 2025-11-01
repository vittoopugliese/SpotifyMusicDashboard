// import Image from "next/image";
import { Button } from "./ui/button";

export default function LoginToGetTokenMessage({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="p-2">
      <div className="bg-muted border border-border rounded-lg p-8 text-center">
        <h2 className="text-3xl font-semibold mb-2">Authentication Required</h2>
        <p className="text-lg text-muted-foreground mb-4">To access to your Spotify data, you need to login.</p>
        <Button onClick={onLogin}>
          {/* <Image src="https://www.svgrepo.com/show/349511/spotify.svg" width={20} height={20} /> */}
          Login with Spotify</Button>
      </div>
    </div>
  );
}
