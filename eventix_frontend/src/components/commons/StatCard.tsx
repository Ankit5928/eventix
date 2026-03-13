import { cn } from '../ui/Button'; // Assuming your cn utility is here
import { Card, CardContent } from '../ui/Card';

interface StatCardProps {
  label: string;
  value: string | number;
  className?: string; // Fixed: Added className to interface
  colorClass?: string;
  icon?: React.ReactNode;
}

export default function StatCard({ label, value, className, colorClass, icon }: StatCardProps) {
  return (
    <Card
      className={cn(
        // International Luxury Styles
        "relative overflow-hidden border-white/5 bg-white/[0.03] transition-all duration-500 group hover:border-[#FF3333]/40 hover:bg-white/[0.05] shadow-2xl",
        className
      )}
    >
      {/* Background Decorative Glow */}
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#FF3333]/5 blur-3xl group-hover:bg-[#FF3333]/10 transition-all duration-700" />

      <CardContent className="p-8 flex items-center justify-between relative z-10">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 group-hover:text-white/60 transition-colors">
            {label}
          </p>
          <p className={cn(
            "text-3xl font-bold tracking-tighter text-white italic transition-transform duration-500 group-hover:translate-x-1",
            colorClass
          )}>
            {value}
          </p>
        </div>

        {icon && (
          <div className="h-14 w-14 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-[#FF3333] shadow-inner group-hover:scale-110 group-hover:bg-[#FF3333]/10 group-hover:border-[#FF3333]/20 transition-all duration-500">
            <div className="drop-shadow-[0_0_8px_rgba(255,51,51,0.4)]">
              {icon}
            </div>
          </div>
        )}
      </CardContent>

      {/* Bottom Accent Trace */}
      <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-gradient-to-r from-transparent via-[#FF3333] to-transparent transition-all duration-1000 group-hover:w-full opacity-50" />
    </Card>
  );
}