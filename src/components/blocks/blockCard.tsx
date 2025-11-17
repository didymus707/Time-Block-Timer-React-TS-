import type { Block } from "../../types";
import { Card } from "../primitives/card";
import { useNavigate } from "react-router";
import { Clock, Task } from "../primitives/icons";
import { useBlock } from "../../context/blockContext";

interface BlockCardProps {
  block: Block;
}

export const BlockCard = ({ block }: BlockCardProps) => {
  const navigate = useNavigate();
  const { dispatch } = useBlock();

  const handleCardClick = () => {
    navigate(`/block/${block.id}`);
  };

  const toggleBlockStatus = (blockId: string) => {
    dispatch({ type: "TOGGLE_STATUS", payload: { id: blockId } });
  };

  return (
    <div>
      <Card
        title={block.name}
        headerRight={
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                block.status === "running"
                  ? "bg-green-100 text-green-700"
                  : block.status === "paused"
                  ? "bg-yellow-100 text-yellow-700"
                  : block.status === "completed"
                  ? "bg-gray-200 text-gray-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {block.status}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation(); // prevent Card onClick
                toggleBlockStatus(block.id);
              }}
              className="px-3 py-1 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
            >
              {block.status === "running" ? "Pause" : "Start"}
            </button>
          </div>
        }
        onClick={handleCardClick}
        className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition cursor-pointer"
      >
        <div className="text-sm text-gray-400 flex items-center gap-1">
          <div className="duration flex items-center gap-1">
            <Clock color="red" />
            <span>{block.duration} min</span>
          </div>
          <div className="tasks flex items-center gap-1 ml-4">
            <Task color="purple" />
            <span>{block.tasks.length} tasks</span>
          </div>
        </div>
        <div className="mt-3 bg-gray-200 h-2 rounded-full">
          <div
            className="h-2 bg-black rounded-full"
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
