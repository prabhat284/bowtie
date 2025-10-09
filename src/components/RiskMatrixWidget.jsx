import { useMemo } from "react";

const DEFAULT_LIK = ["Very Low","Low","Medium","High","Very High"];
const DEFAULT_SEV = ["Minor","Moderate","Serious","Major","Catastrophic"];

// Map qualitative to 1..5
const q2n = (q) => {
  const m = { "very low":1, low:2, medium:3, high:4, "very high":5,
              minor:1, moderate:2, serious:3, major:4, catastrophic:5 };
  return m[(q||"").toString().toLowerCase()] ?? 3;
};

export default function RiskMatrixWidget({
  items = [],                 // [{ id, likelihood, severity, type: 'threat'|'consequence', label }]
  mode = "residual",          // 'inherent' | 'residual'
  onFilterCell,               // (rowIdx, colIdx) => void
  className = ""
}) {
  const matrix = useMemo(() => {
    const grid = Array.from({length:5}, () => Array.from({length:5}, () => []));
    items.forEach(it => {
      const L = q2n(it[mode === "inherent" ? "likelihood_inherent" : "likelihood"] || it.likelihood);
      const S = q2n(it[mode === "inherent" ? "severity_inherent" : "severity"] || it.severity);
      const r = Math.min(5, Math.max(1, L)) - 1;
      const c = Math.min(5, Math.max(1, S)) - 1;
      grid[r][c].push(it);
    });
    return grid;
  }, [items, mode]);

  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-slate-800">Risk Matrix ({mode})</h3>
        <div className="text-xs text-slate-500">Likelihood × Severity</div>
      </div>
      <div className="grid grid-cols-6 gap-1 text-xs">
        <div />
        {DEFAULT_SEV.map((s, i) => (
          <div key={i} className="text-center font-medium text-slate-600">{s}</div>
        ))}
        {DEFAULT_LIK.map((l, r) => (
          <>
            <div key={`l-${r}`} className="font-medium text-slate-600 flex items-center">{l}</div>
            {DEFAULT_SEV.map((_, c) => {
              const cell = matrix[r][c];
              const heat = r + c; // simple gradient
              const bg =
                heat >= 6 ? "bg-red-100" :
                heat >= 4 ? "bg-yellow-100" : "bg-green-100";
              return (
                <button
                  key={`c-${r}-${c}`}
                  onClick={() => onFilterCell?.(r, c)}
                  className={`h-16 rounded-md ${bg} border border-white p-1 text-left overflow-hidden`}
                  title={`${cell.length} item(s)`}
                >
                  <div className="text-[10px] font-semibold mb-1">{cell.length} item(s)</div>
                  <div className="space-y-0.5 max-h-10 overflow-y-auto pr-1">
                    {cell.slice(0,3).map((it, i) => (
                      <div key={i} className="truncate leading-4">
                        <span className="px-1 rounded bg-white/60">{it.type === 'threat' ? 'T' : 'C'}</span> {it.label}
                      </div>
                    ))}
                    {cell.length > 3 && <div className="text-[10px] text-slate-600">+{cell.length-3} more</div>}
                  </div>
                </button>
              );
            })}
          </>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <span className="px-2 py-1 text-[10px] rounded bg-green-100">Low</span>
        <span className="px-2 py-1 text-[10px] rounded bg-yellow-100">Medium</span>
        <span className="px-2 py-1 text-[10px] rounded bg-red-100">High</span>
      </div>
    </div>
  );
}

