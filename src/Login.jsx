//cat > src/Login.jsx <<'EOF'
import React, { useState } from 'react';
import { Shield, AlertTriangle, X } from 'lucide-react';

const CORRECT_PASSWORD = 'Safety2025';

export default function LoginPage({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      onLogin('admin', password);
    } else {
      setError('Incorrect password. Please try again.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-white opacity-5 rounded-full -mr-32 -mt-32 sm:-mr-48 sm:-mt-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-white opacity-5 rounded-full -ml-32 -mb-32 sm:-ml-48 sm:-mb-48"></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 sm:w-64 sm:h-64 bg-white opacity-5 rounded-full -ml-24 -mt-24 sm:-ml-32 sm:-mt-32"></div>
      </div>

      <div className={`relative z-10 w-full max-w-md ${isShaking ? 'animate-shake' : ''}`}>
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full mb-4 shadow-lg">
              <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Bow Tie Safety Platform</h1>
            <p className="text-slate-600 text-sm sm:text-base">Tata Steel - Risk Assessment System</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Access Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter password"
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
                  autoFocus
                />
                <AlertTriangle className="w-5 h-5 text-slate-400 absolute right-3 top-3.5" />
              </div>
              {error && (
                <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                  <X className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all text-base"
            >
              Access Platform
            </button>
          </form>

          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-200">
            <div className="flex items-start gap-2 text-xs text-slate-500">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p>
                This is a secure internal platform for Tata Steel safety team. 
                Unauthorized access is prohibited. For access credentials, contact your safety administrator.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-white text-xs sm:text-sm opacity-80">
            © 2025 Tata Steel Safety Team. All rights reserved.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.5s;
        }
      `}</style>
    </div>
  );
}
//EOF
