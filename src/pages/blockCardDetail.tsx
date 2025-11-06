import { useParams } from "react-router";
import { useBlock } from "../context/blockContext";

export const CardDetails = () => {
  const { blocks } = useBlock()
  const { id } = useParams<{ id: string }>();
  
  console.log("first", "rendering CardDetails with id:", id);

  const block = blocks.find((b) => b.id === id);

  if (!block) {
    return <div className="p-6 text-gray-600">Block not found.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-2">{block.name}</h1>
      <p className="text-gray-500 mb-4">
        Duration: {block.duration} min | {block.tasks.length} tasks | Status:{" "}
        <span className="font-medium text-blue-600">{block.status}</span>
      </p>
      <div className="h-2 bg-gray-200 rounded-full mb-2">
        <div
          className="h-2 bg-blue-500 rounded-full"
          style={{ width: `${block.progress}%` }}
        />
      </div>
      <p className="text-sm text-gray-500 mb-4">{block.progress}% complete</p>

      <h2 className="font-semibold text-lg mb-2">Tasks</h2>
      <ul className="list-disc list-inside text-gray-600">
        {block.tasks.map((task) => (
          <li key={task.id}>
            {task.name} — {task.duration} min
          </li>
        ))}
      </ul>
    </div>
  );
};
