import { createContext, useContext } from "react";
import type { SessionContextType } from "../types";

export const SessionContext = createContext<SessionContextType>({
  activeTask: null,
  activeBlock: null,
  start: () => {},
  pause: () => {},
  reset: () => {},
});

export const useSession = () => useContext(SessionContext);