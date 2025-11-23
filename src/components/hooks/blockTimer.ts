import type { Block } from "../../types";

export const blockTimer = ({ block }: { block: Block }) => {
  // If block has tasks → block time is computed
  if (block.tasks.length > 0) {
    const planned = block.tasks.reduce(
      (acc, t) => acc + (t.duration || 0) * 60,
      0
    );
    const elapsed = block.tasks.reduce(
      (acc, t) => acc + (t.elapsed || 0),
      0
    );

    const progress =
      planned === 0 ? 0 : (elapsed / planned) * 100;

    const remaining = Math.max(planned - elapsed, 0);

    return { planned, elapsed, remaining, progress };
  }

  // If no tasks → fallback to block-level
  return {
    planned: (block.duration || 0) * 60,
    elapsed: block.elapsed || 0,
    remaining: block.remaining || 0,
    progress: block.progress || 0,
  };
};