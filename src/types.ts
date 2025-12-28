export type Status = "idle" | "running" | "paused" | "completed";

export interface PauseEvent {
  pausedAt: number;
  resumedAt?: number;
  reason?: string; // optional user note
}

export interface Block {
  id: string;
  name: string;
  tasks: Task[];
  status: Status;
  // timeTracking
  actualDuration: number;
  plannedDuration: number;
  // precise tracking
  startedAt?: number;
  completedAt?: number;
  pauses: PauseEvent[];
  createdAt: string;
  activeTaskId?: string | null;
}

export interface Task {
  id: string;
  name: string;
  blockId: string;
  elapsed: number;
  progress: number;
  duration: number;
  remaining: number;
  completed: boolean;
}

export type Action =
  | { type: "ADD_BLOCK"; payload: Block }
  | { type: "UPDATE_BLOCK"; payload: Block }
  | { type: "DELETE_BLOCK"; payload: Block }
  | { type: "TOGGLE_STATUS"; payload: { id: string } }
  | { type: "UPDATE_PROGRESS"; payload: { id: string; progress: number } }
  | { type: "ADD_TASK_TO_BLOCK"; payload: { blockId: string; task: Task } }
  | {
      type: "UPDATE_TASK";
      payload: { blockId: string; taskId: string; data: Partial<Task> };
    }
  | {
      type: "SET_ACTIVE_TASK";
      payload: { blockId: string; taskId: string | null };
    }
  | { type: "PAUSE_BLOCK"; blockId: string }
  | { type: "RESUME_BLOCK"; blockId: string; reason?: string };

export interface BlockContextType {
  blocks: Block[];
  dispatch: React.Dispatch<Action>;
}

export interface BlockUIContextType {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export interface SessionContextType {
  activeBlock: Block | null;
  start: (block: Block) => void;
  pause: () => void;
  reset: () => void;
}
