import { useState } from "react";
import { useBlock } from "../context/blockContext";
import { Card } from "../components/primitives/card";
import Button from "../components/primitives/button";
import { useNavigate, useParams } from "react-router";
import { Clock } from "../components/primitives/icons";
import { TaskModal } from "../components/modals/task";
// import { TimeProgress } from "../components/blocks/timeProgress";

export const CardDetails = () => {
  const { blocks } = useBlock();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const { id } = useParams<{ id: string }>();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const block = blocks.find((b) => b.id === id);

  if (!block) {
    return <div className="p-6 text-gray-600">Block not found.</div>;
  }

  const openTaskModal = (id: string) => {
    setSelectedBlockId(id);
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setSelectedBlockId(null);
  };

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
        <div className="mt-8 border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex">
            <h3 className="font-medium text-gray-700 mb-2">Current Task</h3>:
            <span className="text-gray-600">No active task.</span>
          </div>

          {/* <TimeProgress /> */}
          <div className="mt-2">
            <div className="flex justify-between items-center">
              <p className="font-medium text-gray-700 mb-2">Time Progress</p>
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
              <span>Planned: 0m</span>
            </div>
          </div>
        </div>

        {/* Task Queue */}
        <div className="task-queue">
          <h3 className="font-medium text-gray-700 mb-2 mt-6">Task Queue</h3>
          {block.tasks.length === 0 ? (
            <>
              <p className="text-gray-600">No tasks in the queue.</p>
              <Button
                onClick={() => openTaskModal(block.id)}
                size="sm"
                variant="primary"
                className="hover:cursor-pointer mt-4"
              >
                Add tasks
              </Button>
            </>
          ) : (
            <ul className="space-y-2 text-gray-700">
              {block.tasks.map((task) => (
                <li
                  key={task.id}
                  className="border border-gray-200 p-2 rounded-lg bg-gray-100"
                >
                  {task.name} — {task.duration} min
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>

      <TaskModal
        blockId={selectedBlockId}
        isOpen={isTaskModalOpen}
        onClose={closeTaskModal}
      />
    </div>
  );
};
