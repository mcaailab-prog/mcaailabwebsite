import { RED } from "../lib/constants";

interface BadgeProps {
  text: string;
  color?: string;
}

export default function Badge({ text, color = RED }: BadgeProps) {
  return (
    <span
      style={{
        background: color + "22",
        color,
        border: `1px solid ${color}55`,
        borderRadius: 100,
        padding: "2px 10px",
        fontSize: 11,
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </span>
  );
}
