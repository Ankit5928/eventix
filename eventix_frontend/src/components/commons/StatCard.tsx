import { cn } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';

interface StatCardProps {
  label: string;
  value: string | number;
  colorClass?: string;
  icon?: React.ReactNode;
}

export default function StatCard({ label, value, colorClass, icon }: StatCardProps) {
  return (
    <Card className="hover:border-primary/30 transition-colors">
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
          <p className={cn("text-3xl font-bold font-heading", colorClass)}>
            {value}
          </p>
        </div>
        {icon && (
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
