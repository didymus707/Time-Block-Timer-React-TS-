import type { Block, Task } from "../../types";
import { useBlock } from "../../context/blockContext";
import { useEffect, useRef, useState, useMemo } from "react";

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
  console.log('remainingTask ========>', remainingTask)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  

  // refs holding immediate values and avoid state closure issues
  const activeTaskRef = useRef<Task | null>(activeTask);
  const elapsedRef = useRef<number>(activeTask ? activeTask.elapsed : 0);
  const initialRemaining = (t: Task | null) => {
    if (!t) return 0;
    const elapsed = t.elapsed ?? 0;
    const total = t.duration * 60;
    return t.remaining ?? Math.max(total - elapsed, 0);
  };

  const remainingRef = useRef<number>(initialRemaining(activeTask));

  // deriving freshest block from context by id with latest state
  const freshBlock = useMemo(() => {
    const found = blocks.find((b) => b.id === block.id);
    return found ?? block;
  }, [blocks, block]);

  useEffect(() => {
    console.log("[DEBUG] freshBlock.tasks on mount/update:", freshBlock.tasks);
    console.log(
      "[DEBUG] Computed sessionElapsed:",
      freshBlock.tasks.reduce((acc, task) => acc + task.elapsed, 0)
    );
    console.log(
      "[DEBUG] Computed sessionRemaining:",
      freshBlock.tasks.reduce((acc, task) => acc + task.remaining, 0)
    );
    console.log(
      "[DEBUG] Computed sessionPlanned:",
      freshBlock.tasks.reduce((acc, task) => acc + task.duration * 60, 0)
    );
  }, [freshBlock.tasks]);

  //  keep refs in sync when active task changes
  useEffect(() => {
    activeTaskRef.current = activeTask ?? null;

    if (!activeTask) {
      setTaskElapsed(0);
      setRemainingTask(0);
      elapsedRef.current = 0;
      remainingRef.current = 0;
      return;
    }

    const initialElapsed =
      typeof activeTask.elapsed === "number" ? activeTask.elapsed : 0;
    const initialRemaining =
      initialElapsed === 0
        ? activeTask.duration * 60
        : activeTask.remaining ?? activeTask.duration * 60 - initialElapsed;

    // sync incoming active task values in state + refs
    setTaskElapsed(initialElapsed);
    setRemainingTask(initialRemaining);
    elapsedRef.current = initialElapsed;
    remainingRef.current = initialRemaining;
  }, [activeTask]);

  // For Session Timer logic
  const sessionElapsed = useMemo(() => {
    return freshBlock.tasks.reduce((acc, task) => acc + task.elapsed, 0);
  }, [freshBlock.tasks]);

  const sessionRemaining = useMemo(() => {
    return freshBlock.tasks.reduce((acc, task) => acc + task.remaining, 0);
  }, [freshBlock.tasks]);

  const sessionPlanned = useMemo(() => {
    return freshBlock.tasks.reduce((acc, task) => acc + task.duration * 60, 0);
  }, [freshBlock.tasks]);

  // for App Timer logic
  const appElapsed = useMemo(() => {
    return blocks.reduce((acc, block) => {
      return (
        acc + block.tasks.reduce((taskAcc, task) => taskAcc + task.elapsed, 0)
      );
    }, 0);
  }, [blocks]);

  const appPlanned = useMemo(() => {
    return blocks.reduce(
      (acc, block) =>
        acc +
        block.tasks.reduce((taskAcc, task) => taskAcc + task.duration * 60, 0),
      0
    );
  }, [blocks]);
  const appProgress = (appElapsed / appPlanned) * 100;

  // Start Task Timer -
  const startTimer = () => {
    if (!activeTask) return;
    if (intervalRef.current) return; // Timer already running

    dispatch({
      type: "UPDATE_BLOCK",
      payload: { ...block, status: "running" },
    });

    intervalRef.current = setInterval(() => {
      const task = activeTaskRef.current;

      if (!task) {
        // no active task, stop timer
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return;
      }

      const maxSecs = task.duration * 60;

      // compute next values from refs
      const nextElapsed = Math.min(elapsedRef.current + 1, maxSecs);
      const nextRemaining = Math.max(maxSecs - nextElapsed, 0);
      const nextProgress = (nextElapsed / maxSecs) * 100;

      // update refs
      elapsedRef.current = nextElapsed;
      remainingRef.current = nextRemaining;

      // update React State for local UI updates
      setTaskElapsed(nextElapsed);
      setRemainingTask(nextRemaining);

      // dispatch live update to context so other components stay in sync
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

      // If task completed this tick, finalize and stop interval
      if (nextElapsed >= maxSecs) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        // Final update to mark task as completed
        dispatch({
          type: "UPDATE_TASK",
          payload: {
            blockId: block.id,
            taskId: task.id,
            data: {
              completed: true,
              elapsed: maxSecs,
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

  // Pause Task Timer
  const pauseTimer = () => {
    if (!intervalRef.current) return; // Timer not running

    clearInterval(intervalRef.current);
    intervalRef.current = null;

    const t = activeTaskRef.current;
    if (t) {
      dispatch({
        type: "UPDATE_TASK",
        payload: {
          blockId: freshBlock.id,
          taskId: t.id,
          data: {
            elapsed: elapsedRef.current,
            remaining: remainingRef.current,
            progress:
              t.duration * 60 === 0
                ? 0
                : (elapsedRef.current / (t.duration * 60)) * 100,
          },
        },
      });
    }

    dispatch({
      type: "UPDATE_BLOCK",
      payload: { ...freshBlock, status: "paused" },
    });
  };

  // Reset Task Timer
  const resetTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const t = activeTaskRef.current;
    const initialRemaining = t ? Math.max(t.duration * 60, 0) : 0;

    elapsedRef.current = 0;
    remainingRef.current = initialRemaining;

    setTaskElapsed(0);
    setRemainingTask(activeTask ? initialRemaining : 0);

    dispatch({
      type: "UPDATE_TASK",
      payload: {
        blockId: freshBlock.id,
        taskId: t ? t.id : "",
        data: {
          completed: false,
          elapsed: 0,
          remaining: t ? initialRemaining : 0,
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
    const t = activeTaskRef.current;
    if (!t) return;

    dispatch({
      type: "UPDATE_TASK",
      payload: {
        blockId: freshBlock.id,
        taskId: t.id,
        data: {
          elapsed: taskElapsed,
          remaining: remainingTask,
          progress:
            t.duration * 60 === 0 ? 0 : (taskElapsed / (t.duration * 60)) * 100,
        },
      },
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskElapsed, remainingTask]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

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

    // App Timer
    appElapsed,
    appPlanned,
    appProgress,
  };
};
