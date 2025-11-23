import { useState } from "react";
import { useBlock } from "../context/blockContext";
import { Card } from "../components/primitives/card";
import Button from "../components/primitives/button";
import { useNavigate, useParams } from "react-router";
import { Clock } from "../components/primitives/icons";
import { TaskModal } from "../components/modals/task";
import { blockTimer } from "../components/hooks/blockTimer";
import { formatHM, formatMmSs } from "../logic";
import { useTaskTimer } from "../components/hooks/useTaskTimer";
import { TimeProgress } from "../components/blocks/timeProgress";

export const CardDetails = () => {
  const { blocks, dispatch } = useBlock();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const { id } = useParams<{ id: string }>();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const block = blocks.find((b) => b.id === id);
  const { planned, elapsed, remaining, progress } = blockTimer({
    block: block!,
  });

  const activeTask = block?.activeTaskId
    ? block?.tasks.find((t) => t.id === block.activeTaskId)
    : block?.tasks[0];

  if (!block) {
    return <div className="p-6 text-gray-600">Block not found.</div>;
  }
  const taskTimer = activeTask
    ? useTaskTimer({ task: activeTask, block })
    : null;

  const setActiveTask = (taskId: string) => {
    dispatch({
      type: "SET_ACTIVE_TASK",
      payload: { blockId: block.id, taskId },
    });
  };

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
        {/*  PROGRESS BAR for Session */}

        <TimeProgress
          label="Session Progress"
          elapsed={elapsed}
          planned={planned}
          remaining={remaining}
          progress={progress}
          variant="session"
        />

        {/* Current Task */}
        <div className="mt-8 border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex items-center">
            <h3 className="font-medium text-gray-700">Current Task:</h3>

            {activeTask ? (
              <span className="text-gray-800 ml-4 text-md">
                {activeTask.name}
              </span>
            ) : (
              <span className="text-gray-600 ml-4">No active task</span>
            )}
          </div>

          {/* TimeProgress for Task */}
          {activeTask && (
            <TimeProgress
              label="Task Progress"
              elapsed={activeTask.elapsed}
              planned={activeTask.duration * 60}
              remaining={activeTask.remaining}
              progress={activeTask.progress}
              variant="task"
            />
          )}

         
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
                className="hover:cursor-pointer mt-4 text-sm px-4"
              >
                Add tasks
              </Button>
            </>
          ) : (
            <ul className="space-y-2 text-gray-700">
              {block.tasks.map((task) => (
                <li key={task.id}>
                  <button
                    onClick={() => setActiveTask(task.id)}
                    className="border border-gray-200 p-2 rounded-lg bg-gray-100 w-full "
                  >
                    {task.name} ({task.duration})min
                  </button>
                </li>
                // <li
                //   key={task.id}
                //   className="border border-gray-200 p-2 rounded-lg bg-gray-100"
                // >
                //   {task.name} — {task.duration} min
                // </li>
              ))}
            </ul>
          )}
        </div>

        <Button variant="primary" className="mx-auto mt-8 flex items-center">
          Start Session
        </Button>
      </Card>

      <TaskModal
        blockId={selectedBlockId}
        isOpen={isTaskModalOpen}
        onClose={closeTaskModal}
      />
    </div>
  );
};
