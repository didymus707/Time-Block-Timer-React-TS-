import type { ReactNode } from "react";

interface CardProps {
  title?: string;
  icon?: ReactNode;
  children?: ReactNode;
  onClick?: () => void;
  className?: string;
}

export const Card = ({
  title,
  icon,
  children,
  onClick,
  className = "",
}: CardProps) => {
  return (
    <div
      onClick={onClick}
      className={`bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer ${className}`}
    >
      {/* Header section */}
      <div className="flex items-center gap-2 mb-3">
        {icon && <div className="text-blue-400 text-xl">{icon}</div>}
        {title && <h2 className="text-lg font-semibold text-white">{title}</h2>}
      </div>

      {/* Content */}
      <div className="text-gray-300 text-sm">{children}</div>
    </div>
  );
};
// Example: 4-hour study block with reading (20min), guitar practice (30min), coding challenges (1hr), and project work (90min)
