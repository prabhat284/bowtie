//cat > src/components/BarrierPanel.jsx <<'EOF'
import React, { useState, useRef } from 'react';
import { X, Upload, FileText, Image, Trash2, Calendar, AlertCircle, CheckCircle, Camera, File } from 'lucide-react';

export default function BarrierPanel({ barrier, onUpdate, onClose }) {
  const evidenceInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const documentInputRef = useRef(null);

  const [formData, setFormData] = useState({
    description: barrier.description || '',
    owner: barrier.owner || '',
    effectiveness: barrier.effectiveness || 'good',
    inherentRisk: barrier.inherentRisk || 'medium',
    residualRisk: barrier.residualRisk || 'low',
    lastTestDate: barrier.lastTestDate || '',
    nextDue: barrier.nextDue || '',
    findingsOpen: barrier.findingsOpen || 0,
    testFrequency: barrier.testFrequency || 'quarterly',
    notes: barrier.notes || '',
    evidence: barrier.evidence || [],
    attachments: barrier.attachments || []
  });

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Generate file name with proper convention
  const generateFileName = (originalName, type) => {
    const timestamp = new Date().toISOString().split('T')[0];
    const barrierShort = formData.description
      .slice(0, 30)
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .toLowerCase();
    
    const extension = originalName.split('.').pop().toLowerCase();
    
    const prefixes = {
      sop: 'SOP',
      pid: 'PID',
      drawing: 'DWG',
      test: 'TEST',
      cert: 'CERT',
      photo: 'PHOTO',
      diagram: 'DIAGRAM',
      document: 'DOC'
    };

    const prefix = prefixes[type] || 'FILE';
    return `${prefix}-${barrierShort}-${timestamp}.${extension}`;
  };

  // Handle evidence file selection
  const handleEvidenceUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        // Ask user to select type
        const typeChoice = prompt(
          `Select type for "${file.name}":\n\n` +
          '1. SOP (Standard Operating Procedure)\n' +
          '2. PID (P&ID Drawing)\n' +
          '3. DWG (Technical Drawing)\n' +
          '4. TEST (Test Report)\n' +
          '5. CERT (Certificate)\n\n' +
          'Enter number (1-5):'
        );

        const typeMap = {
          '1': 'sop',
          '2': 'pid',
          '3': 'drawing',
          '4': 'test',
          '5': 'cert'
        };

        const fileType = typeMap[typeChoice] || 'document';
        const suggestedName = generateFileName(file.name, fileType);
        
        const customName = prompt(
          `Rename file for consistency:\n\nOriginal: ${file.name}\nSuggested: ${suggestedName}\n\nEnter file name:`,
          suggestedName
        );

        if (customName) {
          const newEvidence = {
            name: customName,
            type: fileType,
            originalName: file.name,
            size: file.size,
            data: event.target.result,
            uploadedAt: new Date().toISOString()
          };

          setFormData(prev => ({
            ...prev,
            evidence: [...prev.evidence, newEvidence]
          }));
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = ''; // Reset input
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageType = prompt(
          `Select type for "${file.name}":\n\n` +
          '1. PHOTO (On-site photo)\n' +
          '2. DIAGRAM (Technical diagram)\n' +
          '3. SCREEN (Screenshot)\n\n' +
          'Enter number (1-3):'
        );

        const typeMap = {
          '1': 'photo',
          '2': 'diagram',
          '3': 'screen'
        };

        const imgType = typeMap[imageType] || 'photo';
        const suggestedName = generateFileName(file.name, imgType);
        
        const customName = prompt(
          `Rename image:\n\nOriginal: ${file.name}\nSuggested: ${suggestedName}\n\nEnter file name:`,
          suggestedName
        );

        if (customName) {
          const newAttachment = {
            type: 'image',
            name: customName,
            category: imgType,
            originalName: file.name,
            size: file.size,
            data: event.target.result,
            uploadedAt: new Date().toISOString()
          };

          setFormData(prev => ({
            ...prev,
            attachments: [...prev.attachments, newAttachment]
          }));
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = ''; // Reset input
  };

  // Handle document upload
  const handleDocumentUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const suggestedName = generateFileName(file.name, 'document');
        
        const customName = prompt(
          `Rename document:\n\nOriginal: ${file.name}\nSuggested: ${suggestedName}\n\nEnter file name:`,
          suggestedName
        );

        if (customName) {
          const newAttachment = {
            type: 'document',
            name: customName,
            originalName: file.name,
            size: file.size,
            data: event.target.result,
            uploadedAt: new Date().toISOString()
          };

          setFormData(prev => ({
            ...prev,
            attachments: [...prev.attachments, newAttachment]
          }));
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = ''; // Reset input
  };

  const handleFileRemove = (fileType, index) => {
    if (fileType === 'evidence') {
      setFormData({
        ...formData,
        evidence: formData.evidence.filter((_, i) => i !== index)
      });
    } else {
      setFormData({
        ...formData,
        attachments: formData.attachments.filter((_, i) => i !== index)
      });
    }
  };

  const handleSave = () => {
    onUpdate({ ...barrier, ...formData });
  };

  const getEffectivenessIcon = (effectiveness) => {
    switch (effectiveness) {
      case 'good': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'weak': return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'failed': return <AlertCircle className="w-5 h-5 text-red-600" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    const name = fileName.toUpperCase();

    if (name.startsWith('PHOTO-') || name.startsWith('IMG-')) {
      return <Camera className="w-5 h-5 text-purple-600" />;
    } else if (['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(ext)) {
      return <Image className="w-5 h-5 text-blue-600" />;
    } else if (ext === 'pdf') {
      return <FileText className="w-5 h-5 text-red-600" />;
    } else {
      return <File className="w-5 h-5 text-slate-600" />;
    }
  };

  const getFileTypeLabel = (file) => {
    const fileName = typeof file === 'string' ? file : file.name;
    const name = fileName.toUpperCase();
    
    if (file.type) return file.type.toUpperCase();
    if (name.startsWith('SOP-')) return 'SOP';
    if (name.startsWith('PID-')) return 'P&ID';
    if (name.startsWith('DWG-')) return 'Drawing';
    if (name.startsWith('TEST-')) return 'Test Report';
    if (name.startsWith('CERT-')) return 'Certificate';
    if (name.startsWith('PHOTO-')) return 'Photo';
    if (name.startsWith('DIAGRAM-')) return 'Diagram';
    if (name.startsWith('SCREEN-')) return 'Screenshot';
    return 'Document';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 flex items-center justify-between rounded-t-xl z-10">
          <h2 className="text-2xl font-bold">Configure Barrier</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Barrier Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe the safety barrier..."
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          {/* Owner and Effectiveness */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Barrier Owner
              </label>
              <input
                type="text"
                value={formData.owner}
                onChange={(e) => handleChange('owner', e.target.value)}
                placeholder="e.g., BF Area Engineer"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                Effectiveness {getEffectivenessIcon(formData.effectiveness)}
              </label>
              <select
                value={formData.effectiveness}
                onChange={(e) => handleChange('effectiveness', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="good">Good - Fully Functional</option>
                <option value="weak">Weak - Degraded Performance</option>
                <option value="failed">Failed - Non-Functional</option>
              </select>
            </div>
          </div>

          {/* Risk Levels */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Inherent Risk (Without Barrier)
              </label>
              <select
                value={formData.inherentRisk}
                onChange={(e) => handleChange('inherentRisk', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Residual Risk (With Barrier)
              </label>
              <select
                value={formData.residualRisk}
                onChange={(e) => handleChange('residualRisk', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Testing Schedule */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Test Frequency
              </label>
              <select
                value={formData.testFrequency}
                onChange={(e) => handleChange('testFrequency', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annually">Annually</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Last Test Date
              </label>
              <input
                type="date"
                value={formData.lastTestDate}
                onChange={(e) => handleChange('lastTestDate', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Next Due Date
              </label>
              <input
                type="date"
                value={formData.nextDue}
                onChange={(e) => handleChange('nextDue', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Findings Open */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Open Findings / Action Items
            </label>
            <input
              type="number"
              min="0"
              value={formData.findingsOpen}
              onChange={(e) => handleChange('findingsOpen', parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Evidence Files */}
          <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 bg-blue-50">
            <div className="flex items-center justify-between mb-3">
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Evidence Files (SOPs, P&IDs, Test Reports, Certificates)
                </label>
                <p className="text-xs text-slate-500 mt-1">
                  Upload PDF, Word, Excel, or image files
                </p>
              </div>
              <button
                onClick={() => evidenceInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                <Upload className="w-4 h-4" />
                Upload Evidence
              </button>
              <input
                ref={evidenceInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                onChange={handleEvidenceUpload}
                className="hidden"
              />
            </div>
            
            {formData.evidence.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-blue-200 rounded-lg">
                <Upload className="w-12 h-12 text-blue-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No evidence files attached</p>
                <p className="text-xs text-slate-400 mt-1">Click "Upload Evidence" to add files</p>
              </div>
            ) : (
              <div className="space-y-2">
                {formData.evidence.map((file, index) => {
                  const fileName = typeof file === 'string' ? file : file.name;
                  return (
                    <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm border border-blue-200">
                      <div className="flex items-center gap-3 flex-1">
                        {getFileIcon(fileName)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-700 truncate">{fileName}</p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded font-medium">
                              {getFileTypeLabel(file)}
                            </span>
                            {file.size && (
                              <span className="text-xs text-slate-500">
                                {formatFileSize(file.size)}
                              </span>
                            )}
                            {file.uploadedAt && (
                              <span className="text-xs text-slate-500">
                                {new Date(file.uploadedAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleFileRemove('evidence', index)}
                        className="p-2 hover:bg-red-100 rounded transition-colors ml-2"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Additional Attachments */}
          <div className="border-2 border-dashed border-green-300 rounded-lg p-4 bg-green-50">
            <div className="flex items-center justify-between mb-3">
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Additional Attachments (Photos, Diagrams, Documents)
                </label>
                <p className="text-xs text-slate-500 mt-1">
                  Site photos, technical diagrams, checklists
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => imageInputRef.current?.click()}
                  className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                >
                  <Camera className="w-4 h-4" />
                  Add Image
                </button>
                <button
                  onClick={() => documentInputRef.current?.click()}
                  className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
                >
                  <FileText className="w-4 h-4" />
                  Add Doc
                </button>
              </div>
              <input
                ref={imageInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <input
                ref={documentInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                onChange={handleDocumentUpload}
                className="hidden"
              />
            </div>

            {formData.attachments.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-green-200 rounded-lg">
                <Camera className="w-12 h-12 text-green-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No additional attachments</p>
                <p className="text-xs text-slate-400 mt-1">Add images or documents</p>
              </div>
            ) : (
              <div className="space-y-2">
                {formData.attachments.map((att, index) => (
                  <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm border border-green-200">
                    <div className="flex items-center gap-3 flex-1">
                      {att.type === 'image' ? (
                        <Image className="w-5 h-5 text-blue-600" />
                      ) : (
                        <FileText className="w-5 h-5 text-slate-600" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700 truncate">{att.name}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded font-medium">
                            {att.type.toUpperCase()}
                          </span>
                          {att.size && (
                            <span className="text-xs text-slate-500">
                              {formatFileSize(att.size)}
                            </span>
                          )}
                          <span className="text-xs text-slate-500">
                            {new Date(att.uploadedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleFileRemove('attachment', index)}
                      className="p-2 hover:bg-red-100 rounded transition-colors ml-2"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* File Naming Guidelines */}
          <div className="bg-slate-100 border border-slate-300 rounded-lg p-4">
            <h4 className="font-semibold text-slate-700 mb-2 text-sm">📋 File Naming Guidelines</h4>
            <div className="grid grid-cols-2 gap-3 text-xs text-slate-600">
              <div>
                <p className="font-medium text-slate-700 mb-1">Evidence Files:</p>
                <ul className="space-y-1">
                  <li>• SOP-[system]-[date].pdf</li>
                  <li>• PID-[area]-[number].pdf</li>
                  <li>• TEST-[equipment]-[date].pdf</li>
                  <li>• CERT-[type]-[date].pdf</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-slate-700 mb-1">Attachments:</p>
                <ul className="space-y-1">
                  <li>• PHOTO-[location]-[date].jpg</li>
                  <li>• DIAGRAM-[system].png</li>
                  <li>• CHECKLIST-[type]-[date].pdf</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Additional Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Any additional information about this barrier..."
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-50 p-6 flex items-center justify-end gap-3 rounded-b-xl border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Save Barrier
          </button>
        </div>
      </div>
    </div>
  );
}
//EOF
