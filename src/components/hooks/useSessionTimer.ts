import { useEffect, useRef, useState } from "react";
import type { Block, Task } from "../../types";
import { useBlock } from "../../context/blockContext";

interface UseSessionTimerProps {
  block: Block;
  activeTask: Task | null;
}

export const useSessionTimer = ({
  block,
  activeTask,
}: UseSessionTimerProps) => {
  const { dispatch, blocks } = useBlock();

  // active task timer states
  const [taskElapsed, setTaskElapsed] = useState<number>(0);
  const [remainingTask, setRemainingTask] = useState<number>(
    activeTask ? activeTask.duration * 60 : 0
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // For Session Timer logic
  const sessionElapsed = block.tasks.reduce(
    (acc, task) => acc + task.elapsed,
    0
  );
  const sessionRemaining = block.tasks.reduce(
    (acc, task) => acc + task.remaining,
    0
  );
  const sessionPlanned = block.tasks.reduce(
    (acc, task) => acc + task.duration,
    0
  );
  const sessionProgress =
    sessionPlanned === 0 ? 0 : (sessionElapsed / sessionPlanned) * 100;

  // for App Timer logic
  const appElapsed = blocks.reduce((acc, block) => {
    return (
      acc + block.tasks.reduce((taskAcc, task) => taskAcc + task.elapsed, 0)
    );
  }, 0);
  const appPlanned = blocks.reduce((acc, block) => {
    return (
      acc + block.tasks.reduce((taskAcc, task) => taskAcc + task.duration, 0)
    );
  }, 0);
  const appProgress = (appElapsed / appPlanned) * 100;

  // Start Task Timer
  const startTimer = () => {
    if (!activeTask) return;
    if (intervalRef.current) return; // Timer already running

    dispatch({
      type: "UPDATE_BLOCK",
      payload: { ...block, status: "running" },
    });

    intervalRef.current = setInterval(() => {
      setTaskElapsed((prev) => {
        const next = prev + 1;

        // if task is completed
        if (next >= activeTask.duration * 60) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;

          // Update Task as completed
          dispatch({
            type: "UPDATE_TASK",
            payload: {
              blockId: block.id,
              taskId: activeTask.id,
              data: {
                completed: true,
                elapsed: activeTask.duration * 60,
                remaining: 0,
                progress: 100,
              },
            },
          });

          return activeTask.duration * 60;
        }

        return next;
      });

      // Task completed

      setRemainingTask((prev) => Math.max(prev - 1, 0));
    }, 1000);
  };

  // Pause Task Timer
  const pauseTimer = () => {
    if (!intervalRef.current) return; // Timer not running

    clearInterval(intervalRef.current);
    intervalRef.current = null;

    dispatch({
      type: "UPDATE_BLOCK",
      payload: { ...block, status: "paused" },
    });
  };

  // Reset Task Timer
  const resetTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setTaskElapsed(0);
    setRemainingTask(activeTask ? activeTask.duration * 60 : 0);

    dispatch({
      type: "UPDATE_TASK",
      payload: {
        blockId: block.id,
        taskId: activeTask ? activeTask.id : "",
        data: {
          completed: false,
          elapsed: 0,
          remaining: activeTask ? activeTask.duration * 60 : 0,
          progress: 0,
        },
      },
    });

    dispatch({
      type: "UPDATE_BLOCK",
      payload: { ...block, status: "idle" },
    });
  };

  // -------------------
  // SYNC ACTIVE TASK TO CONTEXT
  // -------------------
  useEffect(() => {
    if (!activeTask) return;

    dispatch({
      type: "UPDATE_TASK",
      payload: {
        blockId: block.id,
        taskId: activeTask.id,
        data: {
          elapsed: taskElapsed,
          remaining: remainingTask,
          progress: (taskElapsed / (activeTask.duration * 60)) * 100,
        },
      },
    });
  }, [taskElapsed, remainingTask]);

  return {
    // Task Timer
    taskElapsed,
    remainingTask,
    startTimer,
    pauseTimer,
    resetTimer,
    // Session Timer
    sessionElapsed,
    sessionRemaining,
    sessionPlanned,
    sessionProgress,
    // App Timer
    appElapsed,
    appPlanned,
    appProgress,
  };
};
