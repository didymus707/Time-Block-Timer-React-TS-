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
