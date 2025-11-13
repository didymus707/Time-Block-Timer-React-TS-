import { Outlet } from "react-router";
import { Add } from "./components/primitives/icons";

function App() {
  return (
    <>
      <div className="min-h-screen bg-gray-50 text-gray-800">
        <header className="flex justify-between items-center mb-8 p-4 shadow-sm bg-white">
          <h1 className="text-2xl font-bold tracking-tight">Blokr</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-black hover:bg-gray-800 rounded-lg text-white font-medium transition"
          >
            <Add size="1.2em" classNames={["mr-4"]} />
            Add Block
          </button>
        </header>

        {/* 👇 Nested routes render here (Home or CardDetails) */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default App;
