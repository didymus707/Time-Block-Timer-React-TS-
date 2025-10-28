import { useNavigate } from "react-router";
import type { Block } from "../types";
import { Card } from "./primitives/card";
import { Clock, Task } from "./primitives/icons";

interface BlockCardProps {
  block: Block;
}

export const BlockCard = ({ block }: BlockCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/block/${block.id}`);
  };

  return (
    <div>
      <Card
        title={block.name}
        onClick={handleCardClick}
        className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition cursor-pointer"
      >
        <div className="text-sm text-gray-400 flex items-center gap-1">
          <div className="duration flex items-center gap-1">
            <Clock color="black" />
            <span>{block.duration} min</span>
          </div>
          <div className="tasks flex items-center gap-1 ml-4">
            <Task color="black" />
            <span>{block.tasks.length} tasks</span>
          </div>
        </div>
        <div className="mt-3 bg-gray-700 h-2 rounded-full">
          <div
            className="h-2 bg-blue-500 rounded-full"
            style={{ width: `${block.progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">{block.progress}% complete</p>

        <ul className="text-sm text-gray-400 mt-2">
          {block.tasks.slice(0, 3).map((t) => (
            <li key={t.id}>• {t.name}</li>
          ))}
          {block.tasks.length > 3 && <li>+{block.tasks.length - 3} more</li>}
        </ul>
      </Card>
    </div>
  );
};
