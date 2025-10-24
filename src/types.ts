export interface Block {
  id: string;
  name: string;
  tasks: Task[];
  duration: number;
  progress: number;
  completed: boolean;
}

export interface Task {
  id: string;
  blockId: string;
  name: string;
  duration: number;
  completed: boolean;
}
