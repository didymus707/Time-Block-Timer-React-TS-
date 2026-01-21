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
    activeTaskId,
    sessionTime: { elapsed, remaining, progress },
  } = useSession();
  const block = blocks.find((b) => b.id === id);
  const { elapsed: sessionElapsed, remaining: sessionRemaining } =
    useDerivedTime(block ? block : []);

  const activeTask = activeBlock
    ? (activeBlock.tasks.find((t) => !t.completed) ?? null)
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
        <div className="task-queue w-full mx-auto">
          <div className="flex justify-between items-center mb-6 mt-8">
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-medium text-gray-400">
              Task Queue
            </h3>
            {block.tasks.length > 0 && (
              <button
                onClick={() => openTaskModal(block.id)}
                className="text-[10px] uppercase tracking-widest text-black hover:opacity-60 transition-opacity"
              >
                + Add
              </button>
            )}
          </div>

          {block.tasks.length === 0 ? (
            <div className="flex flex-col items-center py-12 border border-dashed border-gray-200 rounded-sm">
              <p className="text-sm text-gray-400 mb-4">
                No tasks in the queue.
              </p>
              <Button
                onClick={() => openTaskModal(block.id)}
                size="sm"
                variant="primary"
                className="text-[10px] uppercase tracking-widest px-6"
              >
                Initialize Queue
              </Button>
            </div>
          ) : (
            <ul className="space-y-3">
              {block.tasks.map((task) => {
                const isActive = activeTaskId === task.id;
                const isCompleted = task.completed;

                return (
                  <li key={task.id} className="group">
                    <button
                      onClick={() => {
                        if (!isCompleted) {
                          start(block);
                        }
                      }}
                      disabled={isCompleted}
                      className={`
                w-full flex items-center justify-between p-4 rounded-sm transition-all duration-300
                ${isActive ? "bg-black text-white" : "bg-transparent border border-gray-100 hover:border-black"}
                ${isCompleted ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
              `}
                    >
                      <div className="flex items-center gap-3">
                        {/* Active Indicator Dot */}
                        {isActive && (
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                        )}

                        <span
                          className={`text-sm font-medium ${isCompleted ? "line-through" : ""}`}
                        >
                          {task.name}
                        </span>
                      </div>

                      <span
                        className={`text-[10px] tabular-nums tracking-wider ${isActive ? "text-gray-300" : "text-gray-400"}`}
                      >
                        {task.duration}m
                      </span>
                    </button>
                  </li>
                );
              })}
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

        {(activeBlock?.status === "running" ||
          activeBlock?.status === "paused") && (
          <div className="flex flex-col items-center w-full">
            <button
              onClick={() => setIsFocusMode(true)}
              className="mt-6 px-4 py-2 text-[10px] uppercase tracking-widest text-black bg-transparent hover:bg-gray-50 hover:tracking-[0.3em] transition-all duration-300 ease-in-out"
              // className="mt-6 px-6 py-2 text-[10px] uppercase tracking-[0.2em] text-black bg-transparent hover:bg-black hover:text-white transition-all duration-300 rounded-full font-medium"
              // className="relative mt-6 px-2 py-2 text-[10px] uppercase tracking-widest text-black bg-transparent after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-[2px] after:bg-black after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
            >
              Expand to Focus Mode
            </button>
          </div>
        )}

        {isFocusMode && <FocusMode onClose={() => setIsFocusMode(false)} />}
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
