import { useState } from "react";
// import { getDefaultTask } from "../utils";
import { useBlock } from "../context/blockContext";
import { Card } from "../components/primitives/card";
import Button from "../components/primitives/button";
import { useNavigate, useParams } from "react-router";
import { Clock } from "../components/primitives/icons";
import { TaskModal } from "../components/modals/task";
import { useSession } from "../context/sessionContext";
import { TimeProgress } from "../components/blocks/timeProgress";
import { SessionControl } from "../components/blocks/SessionControl";
import { useDerivedTime } from "../components/hooks/useDerivedTime";
import { FocusMode } from "../components/blocks/FocusMode";

export const CardDetails = () => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const { blocks, dispatch } = useBlock();
  const { id } = useParams<{ id: string }>();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const {
    activeBlock,
    start,
    pause,
    reset,
    resume,
    sessionTime: { elapsed, remaining, progress },
  } = useSession();
  const block = blocks.find((b) => b.id === id);
  const { elapsed: sessionElapsed, remaining: sessionRemaining } =
    useDerivedTime(block ? block : []);

  const activeTask = activeBlock
    ? activeBlock.tasks.find((t) => !t.completed) ?? null
    : null;

  if (!block) {
    return <div className="p-6 text-gray-600">Block not found.</div>;
  }

  const isSameBlock = activeBlock?.id === block.id;
  const hasPausedTask = isSameBlock && activeTask && block.status === "paused";

  const handleStartSession = () => {
    // Fresh start case
    start(block);
  };

  const resumeSession = () => {
    if (hasPausedTask && activeBlock && activeTask) {
      resume(activeBlock, activeTask.id);
      return;
    }
  };

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
        headerRight={
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
        }
      >
        {/*  PROGRESS BAR for Session */}
        {block && (
          <TimeProgress
            label="Session Progress"
            elapsed={sessionElapsed}
            planned={block.plannedDuration * 60}
            remaining={sessionRemaining}
            progress={(sessionElapsed / (block.plannedDuration * 60)) * 100}
            variant="session"
          />
        )}

        {/* Current Task */}
        <div className="mt-8 border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex items-center">
            <h3 className="font-medium text-gray-700">Current Task:</h3>

            {activeTask ? (
              <span className="text-gray-800 text-md">{activeTask.name}</span>
            ) : (
              <span className="text-gray-600 ml-4">No active task</span>
            )}
          </div>

          {/* TimeProgress for Task */}
          {activeTask && (
            <TimeProgress
              label="Task Progress"
              remaining={remaining}
              planned={activeTask.duration * 60}
              elapsed={elapsed}
              progress={progress}
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
                    onClick={() => {
                      setActiveTask(task.id);
                      start(block);
                    }}
                    className="border border-gray-200 p-2 rounded-lg bg-gray-100 w-full "
                  >
                    {task.name} ({task.duration})min
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <SessionControl
          onPause={pause}
          onReset={reset}
          status={block.status}
          onResume={resumeSession}
          onStart={handleStartSession}
          hasPausedTask={hasPausedTask}
        />
      </Card>

      <TaskModal
        blockId={selectedBlockId}
        isOpen={isTaskModalOpen}
        onClose={closeTaskModal}
      />

      {isFocusMode && <FocusMode onClose={() => setIsFocusMode(false)} />}
    </div>
  );
};
