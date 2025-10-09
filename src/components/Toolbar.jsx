//cat > src/components/Toolbar.jsx <<'EOF'
import React, { useRef } from 'react';
import { FileDown, FileUp, Printer } from 'lucide-react';

export default function Toolbar({ project, onImport }) {
  const fileInputRef = useRef(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        onImport(imported);
      } catch (error) {
        alert('Failed to import file. Please check the file format.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleExportJSON = () => {
    const data = JSON.stringify(project, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bowtie-${project.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="flex gap-2 flex-wrap">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <button
        onClick={handleImportClick}
        className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-medium transition-all text-sm"
        title="Import JSON"
      >
        <FileUp className="w-4 h-4" />
        <span className="hidden sm:inline">Import</span>
      </button>

      <button
        onClick={handleExportJSON}
        className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all text-sm"
        title="Export as JSON"
      >
        <FileDown className="w-4 h-4" />
        <span className="hidden sm:inline">Export JSON</span>
      </button>

      <button
        onClick={handleExportPDF}
        className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all text-sm"
        title="Print/Export PDF"
      >
        <Printer className="w-4 h-4" />
        <span className="hidden sm:inline">Print PDF</span>
      </button>
    </div>
  );
}
//EOF
