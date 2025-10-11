import { useState } from "react";
import type { Block, Task } from "../types";
import { BlockForm } from "./blockForm";

export const BlockList = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);

  const addNewBlock = (newBlock: Block) => {
    setBlocks((prevBlocks) => [...prevBlocks, newBlock]);
  };

  // const addTasksToBlock = (blockId: string, task: Task) => {
  //   setBlocks((prevBlock) =>
  //     prevBlock.map((block) =>
  //       block.id === blockId
  //         ? { ...block, tasks: [...block.tasks, task] }
  //         : block
  //     )
  //   );
  // };

  return (
    <>
      <div className="block-list-container">
        <BlockForm addBlock={addNewBlock} />
        {/* if no block exist, add the tasks, then on creating a block, 
              add block id into the tasks associated with it */}
        {blocks.length === 0 && <></>}

        {/* if a block exist, add the task to the block */}
        <>
          {blocks.map((block) => (
            <div className="blocklist-wrapper" key={block.id}></div>
          ))}
        </>
      </div>
    </>
  );
};
