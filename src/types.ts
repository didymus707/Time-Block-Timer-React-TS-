export type Status = "idle" | "running" | "paused" | "completed";

export interface Block {
  id: string;
  name: string;
  tasks: Task[];
  status: Status;
  duration: number;
  progress: number;
  createdAt: string
  completed: boolean;
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
  | { type: "UPDATE_PROGRESS"; payload: { id: string; progress: number } }
  | { type: "ADD_TASK_TO_BLOCK"; payload: { blockId: string; task: Task } }

export interface BlockContextType {
  blocks: Block[];
  dispatch: React.Dispatch<Action>;
}

export interface BlockUIContextType {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}