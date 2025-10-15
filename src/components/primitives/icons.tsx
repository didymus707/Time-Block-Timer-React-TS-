import { FaPlus } from "react-icons/fa6";
import { LuClock4 } from "react-icons/lu";
import { FaRegEdit } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
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
export const Clock = createIcon(LuClock4);
export const Edit = createIcon(FaRegEdit);
export const Delete = createIcon(MdDelete);
export const Check = createIcon(FaCheck);
export const Cancel = createIcon(MdOutlineCancel);