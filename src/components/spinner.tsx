import { motion } from "motion/react";
import type { HTMLMotionProps } from "motion/react";

type SpinnerProps = {
  size?: number;
  className?: string;
  color?: string;
} & HTMLMotionProps<"span">;

export function Spinner({
  size = 16,
  className = "",
  color = "#020617", // default: slate-950 (dark)
  ...rest
}: SpinnerProps) {
  const dimension = `${size}px`;

  return (
    <motion.span
      aria-hidden="true"
      className={[
        "inline-flex items-center justify-center rounded-full",
        className,
      ].join(" ")}
      {...rest}
    >
      <motion.span
        className="box-border rounded-full border-2 border-t-transparent"
        style={{
          width: dimension,
          height: dimension,
          borderColor: color,
          borderTopColor: "transparent",
        }}
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 0.7,
        }}
      />
    </motion.span>
  );
}

