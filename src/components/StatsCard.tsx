import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  variant?: "default" | "success" | "warning";
}

const StatsCard = ({ title, value, icon: Icon, trend, variant = "default" }: StatsCardProps) => {
  const variantStyles = {
    default: "from-primary/10 to-primary/5",
    success: "from-success/10 to-success/5",
    warning: "from-warning/10 to-warning/5",
  };

  const iconStyles = {
    default: "text-primary bg-primary/10",
    success: "text-success bg-success/10",
    warning: "text-warning bg-warning/10",
  };

  return (
    <Card className="shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border-none overflow-hidden relative">
      <div className={`absolute inset-0 bg-gradient-to-br ${variantStyles[variant]} opacity-50`} />
      <CardContent className="p-6 relative">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">{title}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {trend && (
              <p className="text-xs text-muted-foreground font-medium">{trend}</p>
            )}
          </div>
          <div className={`p-3 rounded-xl ${iconStyles[variant]} group-hover:scale-110 transition-transform shadow-md`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
