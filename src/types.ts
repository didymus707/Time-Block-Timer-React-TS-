export type Status = "idle" | "running" | "paused" | "completed";

export interface Block {
  id: string;
  name: string;
  tasks: Task[];
  duration: number;
  progress: number;
  completed: boolean;
  status: Status;
}

export interface Task {
  id: string;
  blockId: string;
  name: string;
  duration: number;
  completed: boolean;
}

export type Action =
  | { type: "ADD_BLOCK"; payload: Block }
  | { type: "UPDATE_BLOCK"; payload: Block }
  | { type: "DELETE_BLOCK"; payload: Block }
  | { type: "TOGGLE_STATUS"; payload: { id: string } }
  | { type: "UPDATE_PROGRESS"; payload: { id: string; progress: number } };

export interface BlockContextType {
  blocks: Block[];
  dispatch: React.Dispatch<Action>;
}

export interface BlockUIContextType {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}