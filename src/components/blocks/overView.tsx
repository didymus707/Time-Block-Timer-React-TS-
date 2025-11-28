import type { ReactNode } from "react";
import { Card } from "../primitives/card";
import { useBlock } from "../../context/blockContext";
import { CheckCircle, Clock, Pause, Play, Task } from "../primitives/icons";
import { TimeProgress } from "./timeProgress";
import { blockTimer } from "../hooks/blockTimer";

export const Overview = () => {
  const { blocks } = useBlock();

  const total = blocks.length;
  const paused = blocks.filter((b) => b.status === "paused").length;
  const running = blocks.filter((b) => b.status === "running").length;
  const completed = blocks.filter((b) => b.status === "completed").length;
  const tasksCompleted = blocks.reduce(
    (acc, block) => acc + block.tasks.filter((t) => t.completed).length,
    0
  );
  const totalTasks = blocks.reduce((acc, block) => acc + block.tasks.length, 0);

  const totalPlanned = blocks.reduce(
    (acc, b) => acc + blockTimer({ block: b }).planned,
    0
  );
  const totalElapsed = blocks.reduce(
    (acc, b) => acc + blockTimer({ block: b }).elapsed,
    0
  );
  const progress = totalPlanned === 0 ? 0 : (totalElapsed / totalPlanned) * 100;

  return (
    <>
      <Card
        className="bg-transparent mb-8 px-6 py-8 border border-gray-200 shadow-none "
        title="Sessions Overview"
        icon={<Clock color="black" classNames={["mr-2"]} />}
      >
        {/*  TASKS GRID  */}
        <div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <StatBox
              label="Completed"
              value={completed}
              icon={<CheckCircle color="green" />}
            />
            <StatBox
              label="Running"
              value={running}
              icon={<Play color="blue" />}
            />
            <StatBox
              label="Paused"
              value={paused}
              icon={<Pause color="orange" />}
            />
            <StatBox
              label="Total Sessions"
              value={total}
              icon={<Clock color="gray" />}
            />
            <StatBox
              label="Tasks Done"
              icon={<Task color="purple" />}
              value={tasksCompleted + " / " + totalTasks}
            />
            {/*   */}
          </div>
        </div>

        {/*  PROGRESS BAR  */}
        <TimeProgress
          label="Time Progress"
          elapsed={totalElapsed}
          planned={totalPlanned}
          progress={progress}
          variant="total"
        />
      </Card>
    </>
  );
};

const StatBox = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon?: ReactNode;
}) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg flex flex-col items-center justify-center space-y-1">
      <span className="text-2xl">{icon}</span>
      <span className="text-xl font-bold text-gray-900 py-2">{value}</span>
      <span className="text-md text-gray-600">{label}</span>
    </div>
  );
};
