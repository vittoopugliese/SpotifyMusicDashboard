import IconTitle from "@/components/icon-title";
import { Radio } from "lucide-react";

export default function FactsPage() {
    return (
      <div className="p-6 space-y-6">
        <IconTitle icon={<Radio className="h-8 w-8" />} title="Facts" />
      </div>
    );
  }
  