//cat > src/components/BarrierLibrary.jsx <<'EOF'
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, BookOpen, X } from 'lucide-react';

const LIBRARY_STORAGE_KEY = 'bowtie_barrier_library';

export default function BarrierLibrary({ onSelectBarrier, isOpen, onClose }) {
  const [library, setLibrary] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newBarrier, setNewBarrier] = useState({
    description: '',
    category: 'hardware',
    notes: ''
  });

  useEffect(() => {
    const stored = localStorage.getItem(LIBRARY_STORAGE_KEY);
    if (stored) {
      try {
        setLibrary(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to load barrier library:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (library.length > 0) {
      localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(library));
    }
  }, [library]);

  const addToLibrary = () => {
    if (!newBarrier.description.trim()) {
      alert('Please enter a barrier description');
      return;
    }

    const barrier = {
      id: Date.now().toString(),
      ...newBarrier,
      createdAt: new Date().toISOString()
    };

    setLibrary([...library, barrier]);
    setNewBarrier({ description: '', category: 'hardware', notes: '' });
    setIsAdding(false);
  };

  const deleteFromLibrary = (id) => {
    if (confirm('Remove this barrier from library?')) {
      setLibrary(library.filter(b => b.id !== id));
    }
  };

  const handleDragStart = (e, barrier) => {
    e.dataTransfer.setData('barrier', JSON.stringify(barrier));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      hardware: '🔧',
      procedure: '📋',
      people: '👤'
    };
    return icons[category] || '🛡️';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6" />
            <h2 className="text-xl sm:text-2xl font-bold">Barrier Library</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-all">
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">How to Use</h3>
              <ul className="text-xs sm:text-sm text-blue-800 space-y-1">
                <li>• Click on any barrier to use it in your project</li>
                <li>• Drag and drop barriers onto threats or consequences</li>
                <li>• Build your own library of reusable safety barriers</li>
              </ul>
            </div>
          </div>

          {!isAdding ? (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full mb-4 py-3 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all flex items-center justify-center gap-2 text-purple-600 font-medium"
            >
              <Plus className="w-5 h-5" />
              Add New Barrier to Library
            </button>
          ) : (
            <div className="mb-4 p-4 border-2 border-purple-200 rounded-lg bg-purple-50">
              <h3 className="font-bold text-purple-900 mb-3">New Barrier</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={newBarrier.description}
                    onChange={(e) => setNewBarrier({ ...newBarrier, description: e.target.value })}
                    placeholder="e.g., Emergency shutdown system"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newBarrier.category}
                    onChange={(e) => setNewBarrier({ ...newBarrier, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  >
                    <option value="hardware">🔧 Hardware</option>
                    <option value="procedure">📋 Procedure</option>
                    <option value="people">👤 People</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Notes (Optional)</label>
                  <textarea
                    value={newBarrier.notes}
                    onChange={(e) => setNewBarrier({ ...newBarrier, notes: e.target.value })}
                    placeholder="Additional information..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    rows={2}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={addToLibrary}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium text-sm"
                  >
                    Add to Library
                  </button>
                  <button
                    onClick={() => {
                      setIsAdding(false);
                      setNewBarrier({ description: '', category: 'hardware', notes: '' });
                    }}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 font-medium text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {library.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Your barrier library is empty</p>
              <p className="text-sm mt-2">Add reusable barriers to speed up your workflow</p>
            </div>
          ) : (
            <div className="space-y-2">
              {library.map((barrier) => (
                <div
                  key={barrier.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, barrier)}
                  onClick={() => {
                    onSelectBarrier(barrier);
                    onClose();
                  }}
                  className="bg-white border-2 border-slate-200 rounded-lg p-4 hover:shadow-lg transition-all cursor-move hover:border-purple-400"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <span className="text-2xl">{getCategoryIcon(barrier.category)}</span>
                      <div className="flex-1">
                        <p className="font-medium text-slate-800">{barrier.description}</p>
                        {barrier.notes && (
                          <p className="text-xs text-slate-500 mt-1">{barrier.notes}</p>
                        )}
                        <p className="text-xs text-slate-400 mt-2">
                          Added: {new Date(barrier.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFromLibrary(barrier.id);
                      }}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
//EOF
