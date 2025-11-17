import { useNavigate, useParams } from "react-router";
import { useBlock } from "../context/blockContext";
import { Card } from "../components/primitives/card";
import { Clock } from "../components/primitives/icons";

export const CardDetails = () => {
  const { blocks } = useBlock()
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const { id } = useParams<{ id: string }>();

  const block = blocks.find((b) => b.id === id);

  if (!block) {
    return <div className="p-6 text-gray-600">Block not found.</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <button
        onClick={goBack}
        className="text-blue-600 hover:underline mb-4 flex items-center gap-1"
      >
        ← Back
      </button>

      <Card
        title={block.name}
        icon={<Clock color="black" classNames={["mr-2"]} />}
        className="bg-transparent p-6 rounded-2xl border border-gray-200 mb-6"
        headerRight={<span>{block.status}</span>}
      >
        {/*  PROGRESS BAR  */}
        <div className="mt-8">
          <div className="flex justify-between items-center">
            <p className="font-medium text-gray-700 mb-2">Session Progress</p>
            <span className="text-sm text-gray-500">0%</span>
          </div>

          {/* Placeholder for now */}
          <div className="w-full h-2 bg-gray-200 rounded-full my-2">
            <div
              className="h-full bg-black rounded-full transition-all"
              style={{ width: "0%" }}
            />
          </div>

          <div className="text-sm text-gray-500 flex justify-between">
            <span>Elapsed: 0m</span>
            <span>Remaining: 0m</span>
            <span>Planned: 0m</span>
          </div>
        </div>

        {/* Current Task */}
        
      </Card>
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
