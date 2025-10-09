//cat > src/components/BowTieVisual.jsx <<'EOF'
import React, { useState } from 'react';
import { Shield, Target, AlertTriangle, FileText, Image as ImageIcon, Eye, Download, ExternalLink, Camera, File } from 'lucide-react';
import { getEffectivenessColor } from '../utils';

export default function BowTieVisual({ project }) {
  const [previewFile, setPreviewFile] = useState(null);

  if (!project.hazardEvent) {
    return (
      <div className="text-center py-16 text-slate-500">
        <AlertTriangle className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p className="text-lg">Define the hazard event in Setup to view the bow tie.</p>
      </div>
    );
  }

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    const name = fileName.toUpperCase();

    if (name.startsWith('PHOTO-') || name.startsWith('IMG-')) {
      return <Camera className="w-4 h-4 text-purple-600" />;
    } else if (['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(ext)) {
      return <ImageIcon className="w-4 h-4 text-blue-600" />;
    } else if (ext === 'pdf') {
      return <FileText className="w-4 h-4 text-red-600" />;
    } else {
      return <File className="w-4 h-4 text-slate-600" />;
    }
  };

  const isImage = (file) => {
    if (file.mimeType) return file.mimeType.startsWith('image/');
    const ext = file.name.split('.').pop().toLowerCase();
    return ['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(ext);
  };

  const isPDF = (file) => {
    if (file.mimeType) return file.mimeType === 'application/pdf';
    const ext = file.name.split('.').pop().toLowerCase();
    return ext === 'pdf';
  };

  const handleDownloadFile = (file) => {
    const fileName = typeof file === 'string' ? file : file.name;
    const fileData = file.data;
    
    if (!fileData) {
      alert('File data not available for download');
      return;
    }

    const link = document.createElement('a');
    link.href = fileData;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenFile = (file) => {
    const fileData = file.data;
    
    if (!fileData) {
      alert('File data not available');
      return;
    }

    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>${file.name}</title>
            <style>
              body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f0f0f0; }
              img { max-width: 100%; max-height: 100vh; object-fit: contain; }
              iframe { width: 100vw; height: 100vh; border: none; }
            </style>
          </head>
          <body>
            ${file.mimeType && file.mimeType.startsWith('image/') 
              ? `<img src="${fileData}" alt="${file.name}" />`
              : `<iframe src="${fileData}" type="${file.mimeType || 'application/pdf'}"></iframe>`
            }
          </body>
        </html>
      `);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // In BowTieVisual.jsx, update the BarrierCard to show category icon
const BarrierCard = ({ barrier, type }) => {
  const hasFiles = (barrier.evidence && barrier.evidence.length > 0) || 
                   (barrier.attachments && barrier.attachments.length > 0);
  
  const getCategoryIcon = (category) => {
    const icons = {
      hardware: '🔧',
      procedure: '📋',
      people: '👤'
    };
    return icons[category] || '🛡️';
  };
  
  return (
    <div className="text-xs flex items-start gap-2 bg-white bg-opacity-60 p-2 rounded-lg">
      <div className={`w-2 h-2 ${getEffectivenessColor(barrier.effectiveness)} rounded-full mt-1 flex-shrink-0`}></div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 flex-1">
            <span className="text-sm">{getCategoryIcon(barrier.category)}</span>
            <span className="font-medium flex-1">{barrier.description || 'Unnamed barrier'}</span>
          </div>
          {barrier.owner && (
            <span className={`text-xs font-semibold ${type === 'threat' ? 'text-blue-600' : 'text-green-600'}`}>
              {barrier.owner}
            </span>
          )}
        </div>
        
        {/* Rest of the BarrierCard remains the same... */}
          
          {hasFiles && (
            <div className="mt-2 space-y-1">
              {/* Evidence Files */}
              {barrier.evidence && barrier.evidence.length > 0 && (
                <div className="space-y-1">
                  {barrier.evidence.map((file, idx) => {
                    const fileName = typeof file === 'string' ? file : file.name;
                    return (
                      <div key={idx} className="flex items-center gap-2 bg-blue-50 p-1.5 rounded">
                        {getFileIcon(fileName)}
                        <span className="text-xs flex-1 truncate font-medium text-slate-700">{fileName}</span>
                        {file.data && (
                          <div className="flex items-center gap-1">
                            {(isImage(file) || isPDF(file)) && (
                              <button
                                onClick={() => setPreviewFile(file)}
                                className="p-1 hover:bg-blue-200 rounded"
                                title="Preview"
                              >
                                <Eye className="w-3 h-3 text-blue-600" />
                              </button>
                            )}
                            <button
                              onClick={() => handleOpenFile(file)}
                              className="p-1 hover:bg-green-200 rounded"
                              title="Open"
                            >
                              <ExternalLink className="w-3 h-3 text-green-600" />
                            </button>
                            <button
                              onClick={() => handleDownloadFile(file)}
                              className="p-1 hover:bg-purple-200 rounded"
                              title="Download"
                            >
                              <Download className="w-3 h-3 text-purple-600" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              
              {/* Attachments */}
              {barrier.attachments && barrier.attachments.length > 0 && (
                <div className="space-y-1">
                  {barrier.attachments.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-green-50 p-1.5 rounded">
                      {file.type === 'image' ? (
                        <ImageIcon className="w-4 h-4 text-blue-600" />
                      ) : (
                        <FileText className="w-4 h-4 text-slate-600" />
                      )}
                      <span className="text-xs flex-1 truncate font-medium text-slate-700">{file.name}</span>
                      {file.data && (
                        <div className="flex items-center gap-1">
                          {(isImage(file) || isPDF(file)) && (
                            <button
                              onClick={() => setPreviewFile(file)}
                              className="p-1 hover:bg-blue-200 rounded"
                              title="Preview"
                            >
                              <Eye className="w-3 h-3 text-blue-600" />
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenFile(file)}
                            className="p-1 hover:bg-green-200 rounded"
                            title="Open"
                          >
                            <ExternalLink className="w-3 h-3 text-green-600" />
                          </button>
                          <button
                            onClick={() => handleDownloadFile(file)}
                            className="p-1 hover:bg-purple-200 rounded"
                            title="Download"
                          >
                            <Download className="w-3 h-3 text-purple-600" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Bow Tie Diagram */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-8 overflow-x-auto">
        <div className="min-w-max flex items-center gap-8">
          {/* Threats Side */}
          <div className="w-96 space-y-3">
            <h3 className="font-bold text-xl text-red-700 mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6" />
              Threats & Prevention
            </h3>
            {project.threats.map((threat, idx) => (
              <div key={threat.id} className="bg-gradient-to-br from-red-100 to-orange-100 border-l-4 border-red-600 p-4 rounded-xl shadow-lg">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-slate-800">{threat.threat || 'Unnamed threat'}</p>
                    <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white">
                      {threat.likelihood.toUpperCase()}
                    </span>
                  </div>
                </div>
                {threat.barriers.length > 0 && (
                  <div className="mt-3 pl-11 space-y-2">
                    <p className="text-xs font-bold text-blue-800 flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Preventive Barriers:
                    </p>
                    {threat.barriers.map((barrier) => (
                      <BarrierCard key={barrier.id} barrier={barrier} type="threat" />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Center Hazard Event */}
          <div className="flex flex-col items-center px-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative w-52 h-52 bg-gradient-to-br from-orange-500 via-red-600 to-red-700 rounded-full flex items-center justify-center shadow-2xl border-4 border-white">
                <div className="text-center text-white p-4">
                  <AlertTriangle className="w-14 h-14 mx-auto mb-3 animate-pulse" />
                  <p className="font-bold text-sm leading-tight">{project.hazardEvent}</p>
                </div>
              </div>
            </div>
            <div className="mt-6 text-center space-y-2">
              <span className={`inline-block px-4 py-2 rounded-full text-base font-bold ${
                project.riskLevel === 'high' ? 'bg-red-100 text-red-700 border-2 border-red-300' :
                project.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-300' :
                'bg-green-100 text-green-700 border-2 border-green-300'
              }`}>
                {(project.riskLevel || 'medium').toUpperCase()} RISK
              </span>
              <p className="text-xs text-slate-600 font-medium">{project.department}</p>
            </div>
          </div>

          {/* Consequences Side */}
          <div className="w-96 space-y-3">
            <h3 className="font-bold text-xl text-orange-700 mb-4 flex items-center gap-2">
              <Target className="w-6 h-6" />
              Consequences & Mitigation
            </h3>
            {project.consequences.map((consequence, idx) => (
              <div key={consequence.id} className="bg-gradient-to-br from-orange-100 to-yellow-100 border-r-4 border-orange-600 p-4 rounded-xl shadow-lg">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-slate-800">{consequence.consequence || 'Unnamed consequence'}</p>
                    <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold bg-orange-600 text-white">
                      {consequence.severity.toUpperCase()}
                    </span>
                  </div>
                </div>
                {consequence.barriers.length > 0 && (
                  <div className="mt-3 pl-11 space-y-2">
                    <p className="text-xs font-bold text-green-800 flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Mitigation Barriers:
                    </p>
                    {consequence.barriers.map((barrier) => (
                      <BarrierCard key={barrier.id} barrier={barrier} type="consequence" />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <h4 className="font-bold text-green-900">Good (Green)</h4>
          </div>
          <p className="text-sm text-green-800">Barrier tested, effective, owner assigned</p>
        </div>
        <div className="p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
            <h4 className="font-bold text-yellow-900">Degraded (Yellow)</h4>
          </div>
          <p className="text-sm text-yellow-800">Performance declining, action needed</p>
        </div>
        <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <h4 className="font-bold text-red-900">Failed (Red)</h4>
          </div>
          <p className="text-sm text-red-800">Critical failure, immediate attention required</p>
        </div>
      </div>

      {/* Barrier Summary with Files */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-3">Preventive Barriers Status</h3>
          {project.threats.length === 0 ? (
            <p className="text-slate-500 text-sm">No threats defined yet.</p>
          ) : (
            project.threats.map((threat, idx) => (
              <div key={threat.id} className="mb-4 bg-white p-4 rounded-lg shadow">
                <p className="text-sm font-semibold text-slate-700 mb-2">Threat {idx + 1}: {threat.threat?.substring(0, 50)}...</p>
                <div className="space-y-2">
                  {threat.barriers.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No barriers defined</p>
                  ) : (
                    threat.barriers.map((barrier) => (
                      <BarrierCard key={barrier.id} barrier={barrier} type="threat" />
                    ))
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-3">Mitigation Barriers Status</h3>
          {project.consequences.length === 0 ? (
            <p className="text-slate-500 text-sm">No consequences defined yet.</p>
          ) : (
            project.consequences.map((cons, idx) => (
              <div key={cons.id} className="mb-4 bg-white p-4 rounded-lg shadow">
                <p className="text-sm font-semibold text-slate-700 mb-2">Consequence {idx + 1}: {cons.consequence?.substring(0, 50)}...</p>
                <div className="space-y-2">
                  {cons.barriers.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No barriers defined</p>
                  ) : (
                    cons.barriers.map((barrier) => (
                      <BarrierCard key={barrier.id} barrier={barrier} type="consequence" />
                    ))
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* File Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-slate-800 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getFileIcon(previewFile.name)}
                <div>
                  <h3 className="font-semibold">{previewFile.name}</h3>
                  <p className="text-xs text-slate-300">
                    {previewFile.size && formatFileSize(previewFile.size)} • {new Date(previewFile.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadFile(previewFile)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                  title="Download"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleOpenFile(previewFile)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setPreviewFile(null)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <AlertTriangle className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto bg-slate-100 p-4 flex items-center justify-center">
              {isImage(previewFile) ? (
                <img 
                  src={previewFile.data} 
                  alt={previewFile.name}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                />
              ) : isPDF(previewFile) ? (
                <iframe
                  src={previewFile.data}
                  className="w-full h-full min-h-[600px] rounded-lg shadow-lg bg-white"
                  title={previewFile.name}
                />
              ) : (
                <div className="text-center p-8">
                  <File className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 mb-4">Preview not available for this file type</p>
                  <button
                    onClick={() => handleDownloadFile(previewFile)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download File
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
//EOF
