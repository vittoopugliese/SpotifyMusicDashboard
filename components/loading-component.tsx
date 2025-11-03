import { Spinner } from "./ui/spinner";

export default function LoadingComponent({message = ""}: {message?: string}) {
  return (
    <div className="flex items-center flex-col justify-center py-12">
      <Spinner className="size-12" />
      <p className="text-lg text-muted-foreground mt-4">{message}</p>
    </div>
  );
}
