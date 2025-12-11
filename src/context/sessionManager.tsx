import { useRef, useState } from "react";
import type { Task, Block } from "../types";
import { useBlock } from "./blockContext";
import { SessionContext } from "./sessionContext";

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { dispatch, blocks } = useBlock();

  // GLOBAL STATE
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [activeBlock, setActiveBlock] = useState<Block | null>(null);

  // GLOBAL REFS
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const elapsedRef = useRef<number>(0);
  const remainingRef = useRef<number>(0);

  const start = (block: Block, task: Task) => {};
  const pause = () => {};
  const reset = () => {};

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
