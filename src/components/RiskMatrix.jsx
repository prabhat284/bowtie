//cat > src/components/RiskMatrix.jsx <<'EOF'
import React from 'react';

export default function RiskMatrix({ project, mode = 'residual' }) {
  const likelihood = mode === 'inherent' ? project.inherentRisk?.likelihood || 3 : project.residualRisk?.likelihood || 2;
  const severity = mode === 'inherent' ? project.inherentRisk?.severity || 3 : project.residualRisk?.severity || 2;

  const getRiskLevel = (l, s) => {
    const score = l * s;
    if (score >= 15) return { level: 'Critical', color: 'bg-red-600' };
    if (score >= 9) return { level: 'High', color: 'bg-orange-500' };
    if (score >= 4) return { level: 'Medium', color: 'bg-yellow-500' };
    return { level: 'Low', color: 'bg-green-500' };
  };

  const currentRisk = getRiskLevel(likelihood, severity);

  return (
    <div className="bg-white rounded-lg p-4 border-2 border-slate-200">
      <h4 className="font-bold text-sm text-slate-800 mb-3">
        {mode === 'inherent' ? 'Inherent Risk' : 'Residual Risk'}
      </h4>
      <div className="grid grid-cols-5 gap-1 mb-3">
        {[5, 4, 3, 2, 1].map(l => (
          <React.Fragment key={l}>
            {[1, 2, 3, 4, 5].map(s => {
              const risk = getRiskLevel(l, s);
              const isSelected = likelihood === l && severity === s;
              return (
                <div
                  key={`${l}-${s}`}
                  className={`h-8 ${risk.color} ${isSelected ? 'ring-4 ring-blue-600' : 'opacity-60'} flex items-center justify-center text-xs font-bold text-white`}
                >
                  {isSelected && '●'}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-600">L: {likelihood} × S: {severity}</span>
        <span className={`px-2 py-1 rounded ${currentRisk.color} text-white font-bold`}>
          {currentRisk.level}
        </span>
      </div>
    </div>
  );
}
//EOF
