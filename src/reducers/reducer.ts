import type { Action, Block } from "../types";

export const blockReducer = (state: Block[], action: Action): Block[] => {
  switch (action.type) {
    case "ADD_BLOCK":
      return [...state, action.payload];
    case "UPDATE_BLOCK":
      return state.map((block: Block) => {
        if (block.id === action.payload.id) {
          return { ...block, ...action.payload };
        }
        return block;
      });
    case "TOGGLE_STATUS":
      return state.map((block: Block) =>
        block.id === action.payload.id
          ? {
              ...block,
              status:
                block.status === "running"
                  ? "paused"
                  : block.status === "paused" || block.status === "idle"
                  ? "running"
                  : block.status, // completed or stopped remains unchanged
            }
          : block
      );
    case "UPDATE_PROGRESS":
      return state.map((block) =>
        block.id === action.payload.id
          ? { ...block, progress: action.payload.progress }
          : block
      );
    case "DELETE_BLOCK":
      return state.filter((block: Block) => block.id !== action.payload.id);
    case "ADD_TASK_TO_BLOCK":
      return state.map((block: Block) =>
        block.id === action.payload.blockId ? {
          ...block,
          tasks: [...block.tasks, action.payload.task],
        } : block
      );

    // case "STOP_BLOCK":
    //   return state.map((block: Block) =>
    //     block.id === action.payload.id
    //       ? { ...block, status: "stopped", progress: 0 }
    //       : block
    //   );

    // case "COMPLETE_BLOCK":
    //   return state.map((block: Block) =>
    //     block.id === action.payload.id
    //       ? { ...block, status: "completed", progress: 100 }
    //       : block
    //   );
    default:
      return state;
  }
};
