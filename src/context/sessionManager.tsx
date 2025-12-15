import { useRef, useState } from "react";
import type { Task, Block } from "../types";
import { useBlock } from "./blockContext";
import { SessionContext } from "./sessionContext";

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { dispatch } = useBlock();

  // GLOBAL STATE
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [activeBlock, setActiveBlock] = useState<Block | null>(null);

  // GLOBAL REFS
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedRef = useRef<number>(0);
  const remainingRef = useRef<number>(0);

  const start = (block: Block, task: Task) => {
    // 1. Stop any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // 2. Register active session
    setActiveBlock(block);
    setActiveTask(task);

    // 3. Initialize refs
    const total = task.duration * 60;
    const initialElapsed = task.elapsed ?? 0;
    const initialRemaining =
      task.remaining ?? Math.max(total - initialElapsed, 0);

    elapsedRef.current = initialElapsed;
    remainingRef.current = initialRemaining;

    // 4. Update block status
    dispatch({
      type: "UPDATE_BLOCK",
      payload: { ...block, status: "running" },
    });

    // 5. Start global interval
    intervalRef.current = setInterval(() => {
      const nextElapsed = Math.min(elapsedRef.current + 1, total);
      const nextRemaining = Math.max(total - nextElapsed, 0);
      const nextProgress = (nextElapsed / total) * 100;

      // Update refs
      elapsedRef.current = nextElapsed;
      remainingRef.current = nextRemaining;

      // Push update to reducer
      dispatch({
        type: "UPDATE_TASK",
        payload: {
          blockId: block.id,
          taskId: task.id,
          data: {
            elapsed: nextElapsed,
            remaining: nextRemaining,
            progress: nextProgress,
          },
        },
      });

      // If completed, finalize
      if (nextElapsed >= total) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;

        dispatch({
          type: "UPDATE_TASK",
          payload: {
            blockId: block.id,
            taskId: task.id,
            data: {
              completed: true,
              elapsed: total,
              remaining: 0,
              progress: 100,
            },
          },
        });

        dispatch({
          type: "UPDATE_BLOCK",
          payload: { ...block, status: "idle" },
        });
      }
    }, 1000);
  };

  const pause = () => {
    if (!intervalRef.current || !activeTask || !activeBlock) return;

    // 1. Stop the global interval
    clearInterval(intervalRef.current);
    intervalRef.current = null;

    const total = activeTask.duration * 60;
    const progress = total === 0 ? 0 : (elapsedRef.current / total) * 100;

    // 2. Persist task state
    dispatch({
      type: "UPDATE_TASK",
      payload: {
        blockId: activeBlock.id,
        taskId: activeTask.id,
        data: {
          elapsed: elapsedRef.current,
          remaining: remainingRef.current,
          progress,
        },
      },
    });

    // 3. Update block status
    dispatch({
      type: "UPDATE_BLOCK",
      payload: { ...activeBlock, status: "paused" },
    });
  };

  const reset = () => {
    if (!activeTask || !activeBlock) return;

    // 1. Stop interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const total = activeTask.duration * 60;

    // 2. Reset refs
    elapsedRef.current = 0;
    remainingRef.current = total;

    // 3. Reset task in reducer
    dispatch({
      type: "UPDATE_TASK",
      payload: {
        blockId: activeBlock.id,
        taskId: activeTask.id,
        data: {
          completed: false,
          elapsed: 0,
          remaining: total,
          progress: 0,
        },
      },
    });

    // 4. Reset block status
    dispatch({
      type: "UPDATE_BLOCK",
      payload: { ...activeBlock, status: "idle" },
    });
  };

  return (
    <SessionContext.Provider
      value={{
        activeTask,
        activeBlock,
        start,
        pause,
        reset,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
