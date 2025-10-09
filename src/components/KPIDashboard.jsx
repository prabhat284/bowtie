//cat > src/components/KPIDashboard.jsx <<'EOF'
import React from 'react';
import { TrendingDown, AlertTriangle, CheckCircle, Clock, Shield, Activity } from 'lucide-react';
import { calculateKPIs } from '../utils';

export default function KPIDashboard({ projects }) {
  const kpis = calculateKPIs(projects);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {/* Average Risk Reduction */}
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all">
        <div className="flex items-center justify-between mb-4">
          <TrendingDown className="w-8 h-8 opacity-80" />
          <span className="text-3xl font-bold">{kpis.avgRiskReduction}%</span>
        </div>
        <h3 className="text-sm font-semibold opacity-90">Avg. Risk Reduction</h3>
        <p className="text-xs opacity-75 mt-1">Inherent vs Residual Risk</p>
      </div>

      {/* Total Barriers */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all">
        <div className="flex items-center justify-between mb-4">
          <Shield className="w-8 h-8 opacity-80" />
          <span className="text-3xl font-bold">{kpis.totalBarriers}</span>
        </div>
        <h3 className="text-sm font-semibold opacity-90">Total Barriers</h3>
        <p className="text-xs opacity-75 mt-1">Across all projects</p>
      </div>

      {/* Barrier Health */}
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all">
        <div className="flex items-center justify-between mb-4">
          <Activity className="w-8 h-8 opacity-80" />
          <span className="text-3xl font-bold">{kpis.barrierHealth}%</span>
        </div>
        <h3 className="text-sm font-semibold opacity-90">Barrier Health</h3>
        <p className="text-xs opacity-75 mt-1">{kpis.goodBarriers} of {kpis.totalBarriers} are good</p>
      </div>

      {/* Good Barriers */}
      <div className="bg-gradient-to-br from-green-400 to-green-500 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all">
        <div className="flex items-center justify-between mb-4">
          <CheckCircle className="w-8 h-8 opacity-80" />
          <span className="text-3xl font-bold">{kpis.goodBarriers}</span>
        </div>
        <h3 className="text-sm font-semibold opacity-90">Good Barriers</h3>
        <p className="text-xs opacity-75 mt-1">Fully operational</p>
      </div>

      {/* Weak Barriers */}
      <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all">
        <div className="flex items-center justify-between mb-4">
          <AlertTriangle className="w-8 h-8 opacity-80" />
          <span className="text-3xl font-bold">{kpis.weakBarriers}</span>
        </div>
        <h3 className="text-sm font-semibold opacity-90">Weak Barriers</h3>
        <p className="text-xs opacity-75 mt-1">Need attention</p>
      </div>

      {/* Overdue Barriers */}
      <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all">
        <div className="flex items-center justify-between mb-4">
          <Clock className="w-8 h-8 opacity-80" />
          <span className="text-3xl font-bold">{kpis.overdueBarriers}</span>
        </div>
        <h3 className="text-sm font-semibold opacity-90">Overdue Testing</h3>
        <p className="text-xs opacity-75 mt-1">Requires immediate action</p>
      </div>
    </div>
  );
}

