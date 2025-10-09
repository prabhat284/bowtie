//cat > src/components/EscalationFactors.jsx <<'EOF'
import React from 'react';
import { AlertTriangle, Plus, X } from 'lucide-react';

export default function EscalationFactors({ factors = [], onChange, type = 'threat' }) {
  const addFactor = () => {
    onChange([...factors, '']);
  };

  const updateFactor = (index, value) => {
    const updated = [...factors];
    updated[index] = value;
    onChange(updated);
  };

  const removeFactor = (index) => {
    onChange(factors.filter((_, i) => i !== index));
  };

  return (
    <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold text-red-900 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Escalation Factors
        </h4>
        <button
          onClick={addFactor}
          className="flex items-center gap-1 text-xs px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 font-medium"
        >
          <Plus className="w-3 h-3" />
          Add Factor
        </button>
      </div>
      <p className="text-xs text-red-700 mb-3">
        What could cause this {type} to occur or increase its likelihood/severity?
      </p>
      {factors.length === 0 ? (
        <p className="text-xs text-red-600 italic text-center py-2">No escalation factors defined</p>
      ) : (
        <div className="space-y-2">
          {factors.map((factor, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={factor}
                onChange={(e) => updateFactor(index, e.target.value)}
                placeholder="e.g., Poor maintenance, Inadequate training, Equipment age"
                className="flex-1 px-3 py-2 text-sm border border-red-300 rounded-lg bg-white focus:ring-2 focus:ring-red-500"
              />
              <button
                onClick={() => removeFactor(index)}
                className="p-2 bg-red-200 hover:bg-red-300 rounded-lg text-red-800 transition-colors"
                title="Remove"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

