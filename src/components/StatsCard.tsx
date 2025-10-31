import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  variant?: 'default' | 'success';
}

const StatsCard = ({ title, value, icon: Icon, trend, variant = 'default' }: StatsCardProps) => {
  return (
    <Card className={`overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
      variant === 'success' ? 'bg-gradient-to-br from-success to-success/90' : 'bg-gradient-to-br from-primary to-primary/90'
    } group`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1.5 text-white">
            <p className="text-sm font-semibold opacity-95 uppercase tracking-wide">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {trend && <p className="text-xs opacity-80 mt-1">{trend}</p>}
          </div>
          <div className="p-3.5 bg-white/25 rounded-xl backdrop-blur-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
            <Icon className="h-7 w-7 text-white" strokeWidth={2.5} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
