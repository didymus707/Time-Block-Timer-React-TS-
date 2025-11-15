import { useEffect, useReducer, useState, type ReactNode } from "react";
import { BlockContext, BlockUIContext } from "./blockContext";
import { blockReducer } from "../reducers/reducer";
import type { Block, BlockContextType } from "../types";

const initialState: Block[] = [];

export const BlockProvider = ({ children }: { children: ReactNode }) => {
  const loadStoredData = (): Block[] => {
    const storedBlocks = localStorage.getItem('blocks');
    return storedBlocks ? JSON.parse(storedBlocks) as Block[] : [];
  }
  const [blocks, dispatch] = useReducer(
    blockReducer,
    initialState,
    loadStoredData
  );

  useEffect(() => {
      localStorage.setItem('blocks', JSON.stringify(blocks));
    })

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

