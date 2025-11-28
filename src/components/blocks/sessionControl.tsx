import Button from "../primitives/button";

interface Props {
  status: "idle" | "running" | "paused" | string;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export const SessionControl = ({
  status,
  onStart,
  onPause,
  onReset,
}: Props) => {
  return (
    <div className="flex justify-center mt-8">
      {status === "idle" || status === "paused" ? (
        <Button variant="primary" onClick={onStart}>
          Start Session
        </Button>
      ) : (
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onPause}>
            Pause
          </Button>
          <Button variant="ghost" onClick={onReset}>
            Reset
          </Button>
        </div>
      )}
    </div>
  );
};
