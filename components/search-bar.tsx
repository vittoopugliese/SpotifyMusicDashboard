"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  labelTitle?: string;
  buttonText?: string;
  buttonAction?: () => void;
}

export default function SearchBar({ value, onChange, placeholder = "Search...", className, labelTitle, buttonText, buttonAction}: SearchBarProps) {
  return (
    <div className={cn("relative", className)}>
      { labelTitle && <Label htmlFor="search">{labelTitle}</Label> }
      <div className="relative mt-3">
        <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input type="text" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className={cn("pr-11 w-full h-12", buttonText && "pr-28")} draggable={false} />
        { buttonText && buttonAction && <Button onClick={buttonAction} disabled={!value} className="absolute right-2 top-1/2 -translate-y-1/2" >{buttonText}</Button> }
      </div>
    </div>
  );
}