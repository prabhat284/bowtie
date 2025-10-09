import * as d3 from "d3"; // ensure d3 installed
import { useEffect, useMemo, useRef } from "react";
import BarrierPill from "./BarrierPill";
import { AlertTriangle } from "lucide-react";

export default function BowTieCanvas({ project, filterCell, mode = "residual" }) {
  const ref = useRef(null);
  const width = 1200, height = 560;
  const cx = width/2, cy = height/2;
  const leftX = 220, rightX = width - 220;

  const threats = project?.threats ?? [];
  const cons = project?.consequences ?? [];

  const filtered = useMemo(() => ({ threats, cons }), [threats, cons]);

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const yL = d3.scalePoint().domain(d3.range(filtered.threats.length)).range([80, height-80]);
    const yR = d3.scalePoint().domain(d3.range(filtered.cons.length)).range([80, height-80]);

    // center node
    svg.append("g")
      .attr("transform", `translate(${cx},${cy})`)
      .call(g => {
        g.append("circle").attr("r", 70).attr("fill", "url(#teGrad)");
        g.append("text")
          .attr("text-anchor","middle")
          .attr("y", 4)
          .attr("fill", "white")
          .attr("font-weight", 700)
          .attr("font-size", 12)
          .text(project?.hazardEvent || "Hazard Event");
      });

    // defs gradient
    const defs = svg.append("defs");
    const grad = defs.append("linearGradient").attr("id","teGrad").attr("x1","0%").attr("x2","100%");
    grad.append("stop").attr("offset","0%").attr("stop-color","#fb923c"); // orange-400
    grad.append("stop").attr("offset","100%").attr("stop-color","#ef4444"); // red-500

    // left links + nodes
    filtered.threats.forEach((t, i) => {
      const y = yL(i);
      const path = d3.path();
      path.moveTo(leftX, y);
      path.bezierCurveTo(leftX+160, y, cx-160, cy, cx-8, cy);
      svg.append("path")
        .attr("d", path.toString())
        .attr("fill","none")
        .attr("stroke","#94a3b8")   // slate-400
        .attr("stroke-width", 2)
        .attr("opacity", 0.8);

      // node
      const g = svg.append("g").attr("transform", `translate(${leftX-150},${y-24})`);
      g.append("rect").attr("rx",12).attr("width", 300).attr("height", 48).attr("fill","#fee2e2"); // red-100
      g.append("text").attr("x",150).attr("y",28).attr("text-anchor","middle").attr("font-size",12).attr("font-weight",600).text(t.threat || "Threat");
    });

    // right links + nodes
    filtered.cons.forEach((c, i) => {
      const y = yR(i);
      const path = d3.path();
      path.moveTo(cx+8, cy);
      path.bezierCurveTo(cx+160, cy, rightX-160, y, rightX, y);
      svg.append("path")
        .attr("d", path.toString())
        .attr("fill","none")
        .attr("stroke","#94a3b8")
        .attr("stroke-width", 2)
        .attr("opacity", 0.8);

      const g = svg.append("g").attr("transform", `translate(${rightX-150},${y-24})`);
      g.append("rect").attr("rx",12).attr("width", 300).attr("height", 48).attr("fill","#ffedd5"); // orange-100
      g.append("text").attr("x",150).attr("y",28).attr("text-anchor","middle").attr("font-size",12).attr("font-weight",600).text(c.consequence || "Consequence");
    });
  }, [project, filtered]);

  // Barriers: render in HTML overlay for richer interactivity
  return (
    <div className="relative w-full">
      <svg ref={ref} className="w-full h-[560px] bg-white rounded-xl shadow-sm" />
      {/* Left (threat) barrier stacks */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-4 top-20 space-y-6">
          {(project?.threats ?? []).map((t, i) => (
            <div key={t.id ?? i} className="pointer-events-auto">
              <div className="mb-1 text-[11px] text-slate-500 font-semibold">Barriers</div>
              <div className="flex flex-wrap gap-2 max-w-[380px]">
                {(t.barriers ?? []).map((b, j) => {
                  const obj = typeof b === "string" ? { text: b } : b;
                  return (
                    <BarrierPill
                      key={j}
                      text={obj.text || obj}
                      owner={obj.owner}
                      effectiveness={obj.effectiveness || "good"}
                      next_due_at={obj.next_due_at}
                      findings_open={obj.findings_open ?? 0}
                    />
                  );
                })}
              </div>
              {(t.escalationFactors ?? []).length > 0 && (
                <div className="mt-1 text-[11px] text-yellow-700">
                  Escalation: {(t.escalationFactors||[]).join("; ")}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right (consequence) barrier stacks */}
        <div className="absolute right-4 top-20 space-y-6 text-right">
          {(project?.consequences ?? []).map((c, i) => (
            <div key={c.id ?? i} className="pointer-events-auto">
              <div className="mb-1 text-[11px] text-slate-500 font-semibold">Mitigation</div>
              <div className="flex flex-wrap gap-2 max-w-[380px] justify-end">
                {(c.barriers ?? []).map((b, j) => {
                  const obj = typeof b === "string" ? { text: b } : b;
                  return (
                    <BarrierPill
                      key={j}
                      text={obj.text || obj}
                      owner={obj.owner}
                      effectiveness={obj.effectiveness || "good"}
                      next_due_at={obj.next_due_at}
                      findings_open={obj.findings_open ?? 0}
                    />
                  );
                })}
              </div>
              {(c.escalationFactors ?? []).length > 0 && (
                <div className="mt-1 text-[11px] text-yellow-700">
                  Escalation: {(c.escalationFactors||[]).join("; ")}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Center badge */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[300px] text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 text-white text-xs">
            <AlertTriangle className="w-3.5 h-3.5" />
            {(project?.riskLevel || "medium").toUpperCase()} RISK
          </div>
        </div>
      </div>
    </div>
  );
}

