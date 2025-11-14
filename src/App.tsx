import { Outlet } from "react-router";
import { Add } from "./components/primitives/icons";
import { useBlock, useBlockUI } from "./context/blockContext";
import { BlockForm } from "./components/blockForm";
import type { Block } from "./types";

function App() {
  const {  dispatch } = useBlock();
  const { isModalOpen, openModal, closeModal } = useBlockUI();

  const handleAddingBlock = (newBlock: Block) => {
      dispatch({ type: "ADD_BLOCK", payload: newBlock });
      closeModal();
    };

  return (
    <>
      <div className="min-h-screen bg-gray-50 text-gray-800">
        <header className="flex justify-between items-center mb-8 p-4 shadow-sm bg-white">
          <h1 className="text-2xl font-bold tracking-tight">Blokr</h1>
          <button
            onClick={openModal}
            className="flex items-center px-4 py-2 bg-black hover:bg-gray-800 rounded-lg text-white font-medium transition"
          >
            <Add size="1.2em" classNames={["mr-4"]} />
            Add Block
          </button>
        </header>

        {isModalOpen && (
          <BlockForm addBlock={handleAddingBlock} closeForm={closeModal} />
        )}

        {/* 👇 Nested routes render here (Home or CardDetails) */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default App;
