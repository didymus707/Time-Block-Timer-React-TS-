import { FaPlus } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";
import { FaPlay } from "react-icons/fa";
import { LuClock4 } from "react-icons/lu";
import { MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { FaPause } from "react-icons/fa6";
import { GoTasklist } from "react-icons/go";
import { MdOutlineCancel } from "react-icons/md";

type IconProps = {
  size?: string;
  color?: string;
  onClick?: () => void;
  classNames?: string[];
  label?: string;
};

const createIcon = (IconComponent: React.ComponentType<IconProps>) => {
  return ({
    classNames = [],
    size = "1.2em",
    color = "currentColor",
    onClick,
    label,
  }: IconProps) => {
    const Wrapper = onClick ? "button" : "span";
    const combinedClass = [
      ...classNames,
      onClick
        ? "cursor-pointer hover:opacity-80 active:scale-95 transition"
        : "",
    ].join(" ");

    return (
      <Wrapper
        onClick={onClick}
        type={onClick ? "button" : undefined}
        className={combinedClass}
        aria-label={label}
      >
        <IconComponent size={size} color={color} />
      </Wrapper>
    );
  };
};

export const Add = createIcon(FaPlus);
export const Play = createIcon(FaPlay);
export const Check = createIcon(FaCheck);
export const Pause = createIcon(FaPause);
export const Clock = createIcon(LuClock4);
export const Edit = createIcon(FaRegEdit);
export const Delete = createIcon(MdDelete);
export const Task = createIcon(GoTasklist);
export const Cancel = createIcon(MdOutlineCancel);