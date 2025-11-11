import { useState } from "react";
import type { Block } from "../types";
import { useBlock } from "../context/blockContext";
import { BlockForm } from "../components/blockForm";
import { BlockCard } from "../components/blockCard";

export const Home = () => {
  const { blocks, dispatch } = useBlock();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleAddingBlock = (newBlock: Block) => {
    dispatch({ type: "ADD_BLOCK", payload: newBlock });
    setIsModalOpen(false);
  };

  const closeForm = () => setIsModalOpen(false);

  return (
    <>
      <div className="p-6 bg-gray-50 text-gray-800">
        {/* blocklist */}
        {blocks.length === 0 ? (
          <div className="text-center mt-32 text-gray-400">
            <p className="text-lg">
              No blocks yet. <br /> Create your first block to start tracking
              your focus time.
            </p>
            <p>
              Example: 4-hour study block with reading (20min), guitar practice
              (30min), coding challenges (1hr), and project work (90min)
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 px-4 py-2 bg-black hover:bg-gray-800 rounded-lg text-white"
            >
              Create Block
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blocks.map((block) => (
              <BlockCard key={block.id} block={block} />
            ))}
          </div>
        )}

        {isModalOpen && (
          <BlockForm addBlock={handleAddingBlock} closeForm={closeForm} />
        )}
      </div>
    </>
  );
};
