import { useReducer, useState, type ReactNode } from "react";
import { BlockContext, BlockUIContext } from "./blockContext";
import { blockReducer } from "../reducers/reducer";
import type { Block, BlockContextType } from "../types";

const initialState: Block[] = [];

export const BlockProvider = ({ children }: { children: ReactNode }) => {
  const [blocks, dispatch] = useReducer(blockReducer, initialState);
  return (
    <BlockContext.Provider value={{ blocks, dispatch } as BlockContextType}>
      {children}
    </BlockContext.Provider>
  );
};

export const BlockUIProvider = ({children}: {children: ReactNode}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <BlockUIContext.Provider value={{isModalOpen, openModal, closeModal}}>
      {children}
    </BlockUIContext.Provider>
  );
}

