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
  const [elapsed, setElapsed] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [remaining, setRemaining] = useState<number>(0);

  const activeTask = activeBlock
    ? activeBlock.tasks.find((t) => t.id === activeTaskId) ?? null
    : null;

  const hasRestoredRef = useRef(false);

  // GLOBAL REFS
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedRef = useRef<number>(0);
  const remainingRef = useRef<number>(0);
  const activeTaskIdRef = useRef<string | null>(null);
  const startTimeRef = useRef<number | null>(null);

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
    const task = block.tasks.find((t) => t.id === taskId);
    if (!task) return;

    // initialize refs
    // mental note:
    // actualTime is Date.now()
    // timeAlreadySpent is elapsedRef.current or task.elapsed as at when starting/resuming
    // virtualTime which is the onTickTime or startTimeRef.current is the actualTime - timeAlreadySpent
    elapsedRef.current = task.elapsed ?? 0;
    startTimeRef.current = Date.now() - elapsedRef.current * 1000;
    remainingRef.current = task.remaining ?? task.duration * 60;
    const total = task.duration * 60;

    // start new interval
    intervalRef.current = setInterval(() => {
      // calculate elapsed time
      elapsedRef.current =
        (Date.now() - (startTimeRef.current ?? Date.now())) / 1000;
      setElapsed(Math.floor(elapsedRef.current));

      // calculate remaining time
      remainingRef.current = Math.max(total - elapsedRef.current, 0);
      setRemaining(Math.floor(remainingRef.current));

      // calculate progress
      const progress = total === 0 ? 0 : (elapsedRef.current / total) * 100;
      setProgress(progress);

      if (elapsedRef.current >= total) {
        // complete task
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

        clearInterval(intervalRef.current!);
        intervalRef.current = null;

        const taskIndex = block.tasks.findIndex((t) => t.id === task.id);
        const nextTask = block.tasks[taskIndex + 1];

        if (nextTask && !nextTask.completed) {
          // start next task
          setActiveTaskId(nextTask.id);
          startInterval(block, nextTask.id);

          // persist session
          localStorage.setItem(
            SESSION_KEY,
            JSON.stringify({
              blockId: block.id,
              taskId: nextTask.id,
              isPaused: false,
              lastStartedAt: Date.now(),
            })
          );
        } else {
          // complete block
          dispatch({
            type: "UPDATE_BLOCK",
            payload: { ...block, status: "completed" },
          });

          // terminate session
          terminateSession();
        }
      }
    }, 1000);
  };

  const start = (block: Block) => {
    // 1. Register active session
    setActiveBlock(block);

    const firstTask = block.tasks.find((t) => !t.completed);
    if (!firstTask) return;

    setActiveTaskId(firstTask.id);
    activeTaskIdRef.current = firstTask.id;

    // 2. Persist session
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        blockId: block.id,
        taskId: firstTask.id,
        isPaused: false,
        lastStartedAt: Date.now(),
      })
    );

    // 3. Update block status
    dispatch({
      type: "UPDATE_BLOCK",
      payload: { ...block, status: "running" },
    });

    // 4. Start interval
    startInterval(block, firstTask.id);
  };

  const pause = () => {
    if (!intervalRef.current || !activeTaskId || !activeBlock) return;
    const activeTask = activeBlock.tasks.find((t) => t.id === activeTaskId);
    if (!activeTask) return;

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

    // 4. Persist session state
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          ...data,
          isPaused: true,
          lastElapsed: elapsedRef.current,
        })
      );
    }
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
        taskId: activeTaskId ?? '',
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
    if (hasRestoredRef.current || blocks.length === 0) return;
    hasRestoredRef.current = true;

    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return;

    try {
      const { blockId, taskId, lastStartedAt, isPaused, lastElapsed } =
        JSON.parse(stored);
      const block = blocks.find((b) => b.id === blockId);
      const task = block?.tasks.find((b) => b.id === taskId);

      if (block && task && !task.completed && block.tasks.length > 0) {
        setActiveBlock(block);
        setActiveTaskId(taskId);

        const now = Date.now();
        const timeSpentSinceLastStartInSecs = (now - lastStartedAt) / 1000;
        // 1. If it was paused when they closed it, use the saved elapsed time
        // 2. If it was running, calculate the gap
        const updatedElapsed = isPaused
          ? lastElapsed
          : (task.elapsed ?? 0) + timeSpentSinceLastStartInSecs;
        elapsedRef.current = updatedElapsed;
        remainingRef.current = task.remaining ?? task.duration * 60;
        startTimeRef.current = now - updatedElapsed * 1000;

        setElapsed(Math.floor(elapsedRef.current));
        setRemaining(Math.floor(remainingRef.current));

        const total = task.duration * 60;
        const progress =
          total === 0 ? 0 : (elapsedRef.current / total) * 100;
        setProgress(progress);

        if (!isPaused) {
          // start interval if it was not paused
          startInterval(block, taskId);
        }

        dispatch({
          type: "UPDATE_BLOCK",
          payload: { ...block, status: isPaused ? "paused" : "running" },
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
        sessionTime: { elapsed, remaining, progress },
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
