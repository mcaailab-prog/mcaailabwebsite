import { BORDER, CARD_BG, MID, RED_DARK } from "../lib/constants";

interface StatCardProps {
  value: number | string;
  label: string;
}

export default function StatCard({ value, label }: StatCardProps) {
  return (
    <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "1rem 1.25rem", textAlign: "center", boxShadow: "0 10px 22px rgba(0,0,0,0.05)" }}>
      <div style={{ fontSize: 28, fontWeight: 700, color: RED_DARK, fontFamily: "Georgia, serif" }}>{value}</div>
      <div style={{ fontSize: 12, color: MID, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
    </div>
  );
}
