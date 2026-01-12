import { useSession } from "../../context/sessionContext";
import { useDerivedTime } from "../hooks/useDerivedTime";
import Button from "../primitives/button";
import { Pause, Play, Skip, Cancel } from "../primitives/icons";

export const FocusMode = ({ onClose }: { onClose: () => void }) => {
  const { activeBlock, pause, start, sessionTime } = useSession();

  // Use your new hook to get the live pulse for the specific active block
  const { remaining } = useDerivedTime(activeBlock!);

  if (!activeBlock) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isRunning = activeBlock.status === "running";

  return (
    <div className="fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
      {/* Top Controls */}
      <button
        onClick={onClose}
        className="absolute top-8 right-8 text-gray-400 hover:text-gray-900 transition-colors"
      >
        <Cancel size="2rem" />
      </button>

      {/* Main Timer Display */}
      <div className="text-center space-y-4">
        <p className="text-sm font-medium tracking-widest text-blue-600 uppercase">
          Current Task
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          {activeBlock.tasks.find((t) => !t.completed)?.name ||
            "Finishing up..."}
        </h1>

        <div className="py-20">
          <span className="text-[10rem] md:text-[15rem] font-light tracking-tighter tabular-nums text-gray-900 leading-none">
            {formatTime(remaining)}
          </span>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-8">
        <Button
          variant="secondary"
          size="lg"
          className="rounded-full p-6 h-20 w-20 shadow-xl border-gray-100"
          onClick={isRunning ? pause : () => start(activeBlock)}
        >
          {isRunning ? <Pause size="2rem" /> : <Play size="2rem" />}
        </Button>

        <Button
          variant="ghost"
          size="lg"
          className="text-gray-400 hover:text-gray-900"
          onClick={() => {
            /* Logic for skip task */
          }}
        >
          <Skip size="1.5rem" />
        </Button>
      </div>

      {/* Progress Footer */}
      <div className="absolute bottom-12 w-full max-w-md px-6">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Session Progress</span>
          <span>{activeBlock.name}</span>
        </div>
        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-1000"
            style={{ width: `${sessionTime.progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
