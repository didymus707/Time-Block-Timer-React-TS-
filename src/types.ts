export interface Block {
  id: string;
  name: string;
  duration: number;
  tasks: Task[];
  completed: boolean;
}

export interface Task {
  id: string;
  blockId: string;
  name: string;
  duration: number;
  completed: boolean;
}
