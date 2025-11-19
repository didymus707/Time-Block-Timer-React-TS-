import { useState } from "react";
import { useBlock } from "../../context/blockContext";
import { Input } from "../primitives/input";
import Button from "../primitives/button";

interface TaskModalProps {
  blockId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TaskModal = ({ blockId, isOpen, onClose }: TaskModalProps) => {
  const { dispatch } = useBlock();
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");

  if (!isOpen || !blockId) return null;

  const handleSubmit = () => {
    if (!name.trim() || !duration) return;

    dispatch({
      type: "ADD_TASK_TO_BLOCK",
      payload: {
        blockId,
        task: {
          id: crypto.randomUUID(),
          blockId,
          name,
          duration: Number(duration),
          completed: false,
        },
      },
    });

    setName("");
    setDuration("");

    onClose();
  };
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-xl w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Add Task</h2>

        <div className="space-y-4">
          <div className="flex justify-between gap-2 w-full">
            <Input
              type="text"
              placeholder="Task name"
              inputValue={name}
              setValue={setName}
              className={'w-[70%]'}
            />

            <Input
              type="number"
              placeholder="Minutes"
              inputValue={duration}
              setValue={setDuration}
              className={'w-[25%]'}
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button className="px-4" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button className="px-4" variant="primary" onClick={handleSubmit}>
              Add Task
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
