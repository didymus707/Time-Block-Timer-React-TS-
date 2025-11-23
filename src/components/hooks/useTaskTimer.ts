import { useRef } from "react";
import { useBlock } from "../../context/blockContext";
import type { Task, Block } from "../../types";

export const useTaskTimer = ({ task, block }: { task: Task; block: Block }) => {
  const { dispatch } = useBlock();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsed = task.elapsed;
  const totalSeconds = task.duration * 60;

  const tick = () => {
    const nextElapsed = elapsed + 1;
    const nextRemaining = Math.max(task.remaining - 1, 0);
    const nextProgress = Math.min((nextElapsed / totalSeconds) * 100, 100);

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

    if (nextElapsed >= totalSeconds) {
      clearInterval(intervalRef.current!);
      intervalRef.current = null;

      dispatch({
        type: "UPDATE_TASK",
        payload: {
          blockId: block.id,
          taskId: task.id,
          data: { completed: true },
        },
      });
    }
  };

  const start = () => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(tick, 1000);
  };

  const pause = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const reset = () => {
    pause();
    dispatch({
      type: "UPDATE_TASK",
      payload: {
        blockId: block.id,
        taskId: task.id,
        data: {
          elapsed: 0,
          remaining: totalSeconds,
          progress: 0,
          completed: false,
        },
      },
    });
  };
  return { start, pause, reset };
};
