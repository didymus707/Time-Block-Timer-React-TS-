import { useState } from "react";
import type { Block } from "../types";
import { BlockForm } from "../components/blockForm";
import { BlockCard } from "../components/blockCard";

export const Home = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleAddBlock = (newBlock: Block) => {
    setBlocks((prevBlocks) => [...prevBlocks, newBlock]);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight">
          Blokr
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition"
        >
          + Add Block
        </button>
      </header>

      {/* Block List */}
      {blocks.length === 0 ? (
        <div className="text-center mt-32 text-gray-400">
          <p className="text-lg">No blocks yet.</p>
          <p>Create your first block to start tracking your focus time.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg"
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

      {/* Modal */}
      {isModalOpen && (
        <BlockForm
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddBlock}
        />
      )}
    </div>
  );
};
