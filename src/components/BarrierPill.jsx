import { useMemo } from "react";
import { Info } from "lucide-react";

export default function BarrierPill({
  text,
  owner = "",
  effectiveness = "good",   // good | weak | failed
  next_due_at,               // "YYYY-MM-DD"
  findings_open = 0,
  size = "sm",
}) {
  const color = useMemo(() => {
    switch (effectiveness) {
      case "failed": return "bg-red-100 text-red-800 ring-1 ring-red-300";
      case "weak":   return "bg-yellow-100 text-yellow-900 ring-1 ring-yellow-300";
      default:       return "bg-green-100 text-green-800 ring-1 ring-green-300";
    }
  }, [effectiveness]);

  const pad = size === "lg" ? "px-3 py-1.5 text-sm" : "px-2.5 py-1 text-xs";

  return (
    <div className={`inline-flex items-center gap-2 rounded-full ${pad} ${color} relative group`}>
      <span className="font-medium">{text || "Barrier"}</span>
      {owner && (
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-black/10 text-[10px] font-bold">
          {owner.split(" ").map(s => s[0]).join("").slice(0,2).toUpperCase()}
        </span>
      )}
      <Info className="w-3.5 h-3.5 opacity-70" />

      {/* Tooltip */}
      <div className="absolute z-50 hidden group-hover:block -left-2 top-7 w-max max-w-xs">
        <div className="rounded-lg border border-slate-200 bg-white shadow-xl p-3 text-[11px] leading-4">
          <div className="font-semibold mb-1">{text || "Barrier"}</div>
          <div><span className="text-slate-500">Owner:</span> {owner || "—"}</div>
          <div><span className="text-slate-500">Health:</span> {effectiveness}</div>
          <div><span className="text-slate-500">Next due:</span> {next_due_at || "—"}</div>
          <div><span className="text-slate-500">Open findings:</span> {findings_open ?? 0}</div>
        </div>
      </div>
    </div>
  );
}

