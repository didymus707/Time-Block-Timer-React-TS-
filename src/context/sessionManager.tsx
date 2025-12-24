import { useEffect, useRef, useState } from "react";
import type { Block } from "../types";
import { useBlock } from "./blockContext";
import { SessionContext } from "./sessionContext";

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { dispatch, blocks } = useBlock();

  const SESSION_KEY = "active-session";

  // GLOBAL STATE
  const [activeBlock, setActiveBlock] = useState<Block | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const activeTask = activeBlock
    ? activeBlock.tasks.find((t) => t.id === activeTaskId) ?? null
    : null;

  const hasRestoredRef = useRef(false);

  // GLOBAL REFS
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedRef = useRef<number>(0);
  const remainingRef = useRef<number>(0);
  const activeTaskIdRef = useRef<string | null>(null);

  const terminateSession = () => {
    // stop the interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // reset refs
    elapsedRef.current = 0;
    remainingRef.current = 0;

    // reset block status if it exists
    if (activeBlock) {
      dispatch({
        type: "UPDATE_BLOCK",
        payload: { ...activeBlock, status: "idle" },
      });
    }

    // clear session state
    setActiveBlock(null);
    setActiveTaskId(null);
    activeTaskIdRef.current = null;

    // Clear persisted session
    localStorage.removeItem(SESSION_KEY);
  };

  const startInterval = (block: Block, taskId: string) => {
    // clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    activeTaskIdRef.current = taskId;

    // start new interval
    intervalRef.current = setInterval(() => {
      // interval logic here
      const liveBlock = blocks.find((b) => b.id === block.id);
      const liveTask = liveBlock?.tasks.find(
        (t) => t.id === activeTaskIdRef.current
      );
      if (!liveBlock || !liveTask) {
        // terminate if block or task no longer exist
        terminateSession();
        return;
      }

      const total = liveTask.duration * 60;
      const nextElapsed = Math.min(elapsedRef.current + 1, total);
      const nextRemaining = Math.max(total - nextElapsed, 0);
      const nextProgress = total === 0 ? 0 : (nextElapsed / total) * 100;

      elapsedRef.current = nextElapsed;
      remainingRef.current = nextRemaining;

      // Push update to reducer
      dispatch({
        type: "UPDATE_TASK",
        payload: {
          blockId: liveBlock.id,
          taskId: liveTask.id,
          data: {
            elapsed: nextElapsed,
            remaining: nextRemaining,
            progress: nextProgress,
          },
        },
      });

      // If completed, finalize
      if (nextElapsed >= total) {
        // stop interval
        clearInterval(intervalRef.current!);
        intervalRef.current = null;

        // update task as completed
        dispatch({
          type: "UPDATE_TASK",
          payload: {
            blockId: liveBlock.id,
            taskId: liveTask.id,
            data: {
              completed: true,
              elapsed: total,
              remaining: 0,
              progress: 100,
            },
          },
        });
      }

      const currentIndex = liveBlock.tasks.findIndex(
        (t) => t.id === liveTask.id
      );
      const nextTask = liveBlock.tasks[currentIndex + 1];

      if (nextTask) {
        setActiveTaskId(nextTask.id);

        elapsedRef.current = nextTask.elapsed ?? 0;
        remainingRef.current = nextTask.remaining ?? nextTask.duration * 60;

        startInterval(liveBlock, nextTask.id);
        return;
      }

      dispatch({
        type: "UPDATE_BLOCK",
        payload: { ...liveBlock, completed: true, status: "idle" },
      });

      terminateSession();
    }, 1000);
  };

  const start = (block: Block) => {
    const firstTask = block.tasks.find((t) => !t.completed);
    if (!firstTask) return;

    // 1. Register active session
    setActiveBlock(block);
    setActiveTaskId(firstTask.id);
    activeTaskIdRef.current = firstTask.id;

    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        blockId: block.id,
        taskId: firstTask.id,
      })
    );

    // 3. Initialize refs
    const total = firstTask.duration * 60;

    elapsedRef.current = firstTask.elapsed ?? 0;
    remainingRef.current =
      firstTask.remaining ?? Math.max(total - elapsedRef.current, 0);

    // 4. Update block status
    dispatch({
      type: "UPDATE_BLOCK",
      payload: { ...block, status: "running" },
    });

    // 5. Start interval
    startInterval(block, firstTask.id);
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

    localStorage.removeItem(SESSION_KEY);
  };

  // restoring from local storage on mount
  useEffect(() => {
    if (hasRestoredRef.current) return;
    hasRestoredRef.current = true;

    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return;

    try {
      const { blockId, taskId } = JSON.parse(stored);
      const block = blocks.find((b) => b.id === blockId);
      const task = block?.tasks.find((b) => b.id === taskId);

      if (block && task && !task.completed && block.tasks.length > 0) {
        setActiveBlock(block);
        setActiveTaskId(taskId);

        elapsedRef.current = task.elapsed ?? 0;
        remainingRef.current = task.remaining ?? task.duration * 60;

        dispatch({
          type: "UPDATE_BLOCK",
          payload: { ...block, status: "running" },
        });
      } else {
        localStorage.removeItem(SESSION_KEY);
      }
    } catch {
      localStorage.removeItem(SESSION_KEY);
    }
  }, [blocks]);

  // terminate session if block or task no longer exist
  useEffect(() => {
    if (!activeBlock || !activeTaskId) return;

    const block = blocks.find((b) => b.id === activeBlock.id);
    if (!block) {
      terminateSession();
      return;
    }

    const taskStillExists = block?.tasks.some((t) => t.id === activeTaskId);

    if (!taskStillExists) {
      terminateSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocks]);

  return (
    <SessionContext.Provider
      value={{
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
