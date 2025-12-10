import { createContext, useContext, useRef, useState } from "react";
import type { Task, Block } from "../types";
import { useBlock } from "./blockContext";

interface SessionContextType {
  activeTask: Task | null;
  activeBlock: Block | null;
  start: (block: Block, task: Task) => void;
  pause: () => void;
  reset: () => void;
}

const SessionContext = createContext<SessionContextType>({
  activeTask: null,
  activeBlock: null,
  start: () => {},
  pause: () => {},
  reset: () => {},
});

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { dispatch, blocks } = useBlock();

  // GLOBAL STATE
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [activeBlock, setActiveBlock] = useState<Block | null>(null);

  // GLOBAL REFS (never lost across navigation)
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const elapsedRef = useRef<number>(0);
  const remainingRef = useRef<number>(0);

  // THESE WILL BE IMPLEMENTED AS WE GO
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
