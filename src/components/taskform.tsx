import { useState } from "react";
import type { Task } from "../types";

interface TaskFormProps {
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const TaskForm: React.FC<TaskFormProps> = ({ setTasks }) => {
  const [taskValue, setTaskValue] = useState<string>("");
  const [taskDuration, setTaskDuration] = useState<string | undefined>(
    undefined
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskValue.trim() || !taskDuration || Number(taskDuration) <= 0) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      blockId: "",
      name: taskValue,
      duration: Number(taskDuration),
      completed: false,
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
    setTaskValue("");
    setTaskDuration("");
  };

  return (
    <>
      <div className="task-card">
        <div className="task-card-container">
          <div className="task-form">
            <div className="session-tasks-wrapper">
              <p className="session-tasks my-4 text-lg font-medium">
                Add Tasks to your Session
              </p>
              <div className="flex justify-between w-full gap-4">
                <input
                  id="task-name"
                  type="text"
                  value={taskValue}
                  className="bg-gray-100 rounded-lg p-2 mt-2 basis-[65%] focus:border-4 focus:border-gray-300 focus:outline-gray-300"
                  onChange={(e) => setTaskValue(e.target.value)}
                  placeholder="Task name( e.g Read Percy Jackson)"
                />
                <input
                  min={0}
                  type="number"
                  id="task-in-minutes"
                  placeholder="Minutes"
                  name="task-in-minutes"
                  value={taskDuration ?? ""}
                  className="bg-gray-100 rounded-lg p-2 mt-2 basis-[15%] focus:border-4 focus:border-gray-300 focus:outline-gray-300"
                  onChange={(e) => setTaskDuration(e.target.value || "")}
                />
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!taskValue || !taskDuration}
                  className="basis-[15%] border-1 border-gray-200 rounded-lg p-2 mt-2 cursor-pointer disabled:cursor-not-allowed hover:bg-gray-200 hover:text-black hover:font-medium"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskForm;
