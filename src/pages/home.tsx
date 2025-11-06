import { useState } from "react";
import type { Block } from "../types";
import { BlockForm } from "../components/blockForm";
import { BlockCard } from "../components/blockCard";
import { Add } from "../components/primitives/icons";
import { useBlock } from "../context/blockContext";

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
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Blokr</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition"
          >
            <Add size="1.2em" classNames={["mr-4"]} />
            Add Block
          </button>
        </header>

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
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white"
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
