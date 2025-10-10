import { BlockList } from "./components/BlockList";
import { Add } from "./components/primitives/icons";

function App() {
  return (
    <>
      <div className="app-container w-full h-full flex flex-col gap-4 p-4 font-sans">
        <div className="header flex flex-col justify-center text-center">
          <h1 className="my-4 text-3xl font-bold">Time Block Manager</h1>
          <p className="subtitle text-xl antialiased text-[#717182]">
            Create a focused time blocks with sequential tasks to maximize your
            productivity
          </p>
        </div>

        <div className="main-content w-full">
          <div className="flex text-center justify-center mx-auto my-6">
            <div className="flex bg-black p-3 rounded-lg" onClick={() => {}}>
              <Add size="1.4em" color={"white"} classNames={["mr-4"]} />
              <p className="text-md text-white pr-2">Create Time Block</p>
            </div>
          </div>

          <div className="info flex flex-col text-center justify-center py-12  text-[#717182]">
            <p className="text-center text-lg">
              No time blocks yet. Create your first session to get started!
            </p>
            <span className="text-md py-2">
              Example: 4-hour study block with reading (20min), guitar practice
              (30min), coding challenges (1hr), and project work (90min)
            </span>

            <div
              role="button"
              className="flex bg-black p-3 rounded-lg mt-2 align-center justify-center w-[14%] mx-auto"
              onClick={() => {}}
            >
              <Add size="1.4em" color={"white"} classNames={["mr-4"]} />
              <p className="text-md text-white pr-2">
                Create Your First Time Block
              </p>
            </div>
          </div>
          <BlockList />
        </div>
      </div>
    </>
  );
}

export default App;
