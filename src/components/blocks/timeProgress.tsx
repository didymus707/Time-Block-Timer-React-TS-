interface TimeProgressProps {
  label: string;
  elapsed: number;
  planned: number;
  remaining?: number;
  variant?: "session" | "task" | "total";
}

export const TimeProgress = ({
  elapsed,
  planned,
  remaining,
  label = "Time Progress",
  variant = "total",
}: TimeProgressProps) => {
  const progress = planned > 0 ? Math.min((elapsed / planned) * 100, 100) : 0;

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center">
        <p className="font-medium text-gray-700 mb-2">{label}</p>
        <span className="text-sm text-gray-500">{progress}%</span>
      </div>

      {/* Placeholder for now */}
      <div className="w-full h-2 bg-gray-200 rounded-full my-2">
        <div
          className="h-full bg-black rounded-full transition-all"
          style={{ width: "0%" }}
        />
      </div>

      <div className="text-sm text-gray-500 flex justify-between">
        <span>Elapsed: 0m</span>
        {variant !== "total" && <span>{remaining}</span>}
        {variant === "total" && <span>Planned</span>}
        {variant === "session" && <span>Total: 0</span>}
        {variant === "task" && <span>Duration: </span>}
      </div>
    </div>
  );
};

// elapsed: time used or spent in minutes in a time context(overall, session, task)
// planned: total time planned for the all the sessions in hours and minutes
// remaining: time left in a session or task in minutes
