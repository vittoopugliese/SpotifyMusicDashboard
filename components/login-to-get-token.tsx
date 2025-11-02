// import Image from "next/image";
import { LogIn } from "lucide-react";
import { Button } from "./ui/button";

export default function LoginToGetTokenMessage({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="p-2">
      <div className="bg-muted border border-border rounded-lg p-8 text-center">
        <div className="flex items-center justify-center gap-4 mb-2">
          <LogIn className="size-10 text-primary" />
          <h2 className="text-3xl font-semibold mb-2">Authentication Required</h2>
        </div>
        <p className="text-lg text-muted-foreground mb-4">To access to your Spotify data, you need to login.</p>
        <Button onClick={onLogin}>
          {/* <Image src="https://www.svgrepo.com/show/349511/spotify.svg" width={20} height={20} /> */}
          Login with Spotify</Button>
      </div>
    </div>
  );
}
