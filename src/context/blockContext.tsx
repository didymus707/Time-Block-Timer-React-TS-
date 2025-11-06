import { createContext, useContext } from "react";
import type { BlockContextType } from "../types";

export const BlockContext = createContext<BlockContextType>({
  blocks: [],
  dispatch: () => {},
});

export const useBlock = () => useContext(BlockContext);
