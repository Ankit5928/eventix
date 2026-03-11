import React from "react";

interface ProgressBarProps {
  label?: string;
  current: number;
  total: number;
  showPercentage?: boolean;
  color?: string; // Tailwind bg class like "bg-blue-600"
  size?: "sm" | "md" | "lg";
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  label,
  current,
  total,
  showPercentage = true,
  color = "bg-blue-600",
  size = "md",
}) => {
  // Calculate percentage safely
  const percentage =
    total > 0 ? Math.min(Math.round((current / total) * 100), 100) : 0;

  const heightClasses = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-1.5">
        {label && (
          <span className="text-sm font-semibold text-gray-700">{label}</span>
        )}
        {showPercentage && (
          <span className="text-xs font-bold text-gray-500">{percentage}%</span>
        )}
      </div>

      {/* Outer Track */}
      <div
        className={`w-full bg-gray-200 rounded-full overflow-hidden ${heightClasses[size]}`}
      >
        {/* Inner Fill */}
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${color}`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      <div className="mt-1 flex justify-between">
        <span className="text-[10px] text-gray-400 font-medium">
          {current.toLocaleString()} / {total.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;
