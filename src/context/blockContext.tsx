import { createContext } from "react";
import type { BlockContextType } from "../types";

export const BlockContext = createContext<BlockContextType | null>(null);
