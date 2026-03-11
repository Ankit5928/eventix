import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  colorClass?: string; // e.g., "text-blue-600"
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
  trend,
  colorClass = "text-gray-900",
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            {label}
          </p>
          <h3 className={`text-2xl font-bold mt-1 ${colorClass}`}>{value}</h3>

          {trend && (
            <div
              className={`flex items-center mt-2 text-xs font-semibold ${
                trend.isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              <span>
                {trend.isPositive ? "↑" : "↓"} {trend.value}%
              </span>
              <span className="text-gray-400 ml-1 font-normal">
                vs last month
              </span>
            </div>
          )}
        </div>

        {Icon && (
          <div className="p-3 bg-gray-50 rounded-xl">
            <Icon
              className={`w-6 h-6 ${colorClass.replace("text-", "text-opacity-80 text-")}`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
