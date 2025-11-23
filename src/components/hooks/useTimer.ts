import { useState, useRef, useEffect } from "react";
import type { Block } from "../../types";
import { useBlock } from "../../context/blockContext";

interface UseTimerProps {
  block: Block;
}

export const useTimer = ({ block }: UseTimerProps) => {
  const { dispatch } = useBlock();
  const totalSeconds = block.duration * 60;
  const [elapsed, setElapsed] = useState<number>(0);
  const [remaining, setRemaining] = useState<number>(totalSeconds); // in seconds
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1;
        if (next >= totalSeconds) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;

          dispatch({
            type: "UPDATE_BLOCK",
            payload: {
              ...block,
              completed: true,
              status: "completed",
              progress: 100,
            },
          });

          return totalSeconds;
        }
        return next;
      });
      setRemaining((prev) => Math.max(prev - 1, 0));
    }, 1000);

    dispatch({
      type: "UPDATE_BLOCK",
      payload: { ...block, status: "running" },
    });
  };

  const pause = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;

      dispatch({
        type: "UPDATE_BLOCK",
        payload: { ...block, status: "paused" },
      });
    }
  };

  const reset = () => {
    pause();
    setElapsed(0);
    setRemaining(totalSeconds);

    dispatch({
      type: "UPDATE_BLOCK",
      payload: { ...block, status: "idle", progress: 0, completed: false },
    });
  };

  useEffect(() => {
    const progress = Math.min((elapsed / totalSeconds) * 100, 100);

    dispatch({
      type: "UPDATE_PROGRESS",
      payload: { id: block.id, progress },
    });
  }, [block.id, dispatch, totalSeconds, elapsed]);

  return {
    elapsed,
    remaining,
    planned: totalSeconds,
    start,
    pause,
    reset,
  };
};
