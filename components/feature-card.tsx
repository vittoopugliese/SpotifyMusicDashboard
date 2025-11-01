import { LucideIcon } from "lucide-react";

export default function FeatureCard({ icon: Icon, title, description, index }: { icon: LucideIcon; title: string; description: string; index: number; }) {
  return (
    <div key={index} className="group relative bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 cursor-pointer" style={{ userSelect: "none" }}>
        <div className="flex flex-col space-y-4">
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Icon className="w-6 h-6 text-primary" />
        </div>
        <div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
        </div>
        </div>
    </div>
  )
}