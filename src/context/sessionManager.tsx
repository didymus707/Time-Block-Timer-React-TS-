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
    
  const hasActiveSession = !!activeBlock && !!activeTask;
  const hasRestoredRef = useRef(false);

  // GLOBAL REFS
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedRef = useRef<number>(0);
  const remainingRef = useRef<number>(0);
  const activeTaskIdRef = useRef<string | null>(null);

  const terminateSession = () => {
    if (!hasActiveSession) return;

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

    // 5. Clear persisted session
    localStorage.removeItem(SESSION_KEY);
  };

  const startInterval = (block: Block, taskId: string) => {
    
  }

  const start = (block: Block) => {
    const firstTask = block.tasks.find(t => !t.completed);
    if (!firstTask) return

    

    // 1. Stop any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // 2. Register active session
    setActiveBlock(block);
    setActiveTaskId(firstTask.id);

    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        blockId: block.id,
        taskId: firstTask.id,
      })
    );

    // 3. Initialize refs
    const total = firstTask.duration * 60;
    const initialElapsed = firstTask.elapsed ?? 0;
    const initialRemaining =
      firstTask.remaining ?? Math.max(total - initialElapsed, 0);

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
          taskId: firstTask.id,
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
            blockId: block.id,
            taskId: firstTask.id,
            data: {
              completed: true,
              elapsed: total,
              remaining: 0,
              progress: 100,
            },
          },
        });

        const currentIndex = block.tasks.findIndex(
          (t) => t.id === firstTask.id
        );
        const nextTask = block.tasks[currentIndex + 1];

        if (nextTask) {
            setActiveTaskId(nextTask.id);

          elapsedRef.current = nextTask.elapsed ?? 0;
          remainingRef.current = nextTask.remaining ?? nextTask.duration * 60;

          start(block);
          return;
        }

        dispatch({
          type: "UPDATE_BLOCK",
          payload: { ...block, completed: true, status: "idle" },
        });

        setActiveTaskId(null);
        setActiveBlock(null);
        localStorage.removeItem(SESSION_KEY);
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
