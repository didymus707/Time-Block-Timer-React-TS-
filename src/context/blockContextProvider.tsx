import { useReducer } from "react";
import { BlockContext } from "./blockContext";
import { blockReducer } from "../reducers/reducer";
import type { Block, BlockContextType } from "../types";

const initialState: Block[] = [];

export const BlockProvider = ({ children }: { children: React.ReactNode }) => {
  const [blocks, dispatch] = useReducer(blockReducer, initialState);
  return (
    <BlockContext.Provider value={{ blocks, dispatch } as BlockContextType}>
      {children}
    </BlockContext.Provider>
  );
};

