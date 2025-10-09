//cat > src/components/PDFExporter.jsx <<'EOF'
import React, { useState } from 'react';
import { FileDown, Loader } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function PDFExporter({ project }) {
  const [isExporting, setIsExporting] = useState(false);

  const exportToPDF = async () => {
    setIsExporting(true);
    
    try {
      // Create a temporary container for print-friendly content
      const printContainer = document.createElement('div');
      printContainer.style.position = 'absolute';
      printContainer.style.left = '-9999px';
      printContainer.style.width = '210mm'; // A4 width
      printContainer.style.backgroundColor = 'white';
      printContainer.style.padding = '20px';
      document.body.appendChild(printContainer);

      // Build the report HTML
      printContainer.innerHTML = `
        <div style="font-family: Arial, sans-serif;">
          <!-- Header -->
          <div style="border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px;">
            <h1 style="color: #1e40af; margin: 0; font-size: 32px;">Bow Tie Safety Analysis Report</h1>
            <p style="color: #64748b; margin: 10px 0 0 0; font-size: 14px;">Tata Steel Safety Management System</p>
          </div>

          <!-- Project Information -->
          <div style="background: #f1f5f9; padding: 20px; border-radius: 10px; margin-bottom: 30px;">
            <h2 style="color: #334155; margin: 0 0 15px 0; font-size: 20px;">Project Information</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 150px;">Project Name:</td>
                <td style="padding: 8px 0;">${project.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Department:</td>
                <td style="padding: 8px 0;">${project.department || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Safety Officer:</td>
                <td style="padding: 8px 0;">${project.owner || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Review Date:</td>
                <td style="padding: 8px 0;">${project.reviewDate || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Last Updated:</td>
                <td style="padding: 8px 0;">${new Date(project.updatedAt).toLocaleString()}</td>
              </tr>
            </table>
          </div>

          <!-- Hazard Event -->
          <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; margin-bottom: 30px;">
            <h2 style="color: #991b1b; margin: 0 0 10px 0; font-size: 20px;">Critical Hazard Event</h2>
            <p style="margin: 0; font-size: 16px; line-height: 1.6;">${project.hazardEvent || 'Not defined'}</p>
          </div>

          <!-- Risk Assessment -->
          <div style="margin-bottom: 30px;">
            <h2 style="color: #334155; margin: 0 0 15px 0; font-size: 20px;">Risk Assessment</h2>
            <div style="display: flex; gap: 20px;">
              <div style="flex: 1; background: #fef2f2; padding: 15px; border-radius: 8px;">
                <h3 style="margin: 0 0 10px 0; color: #dc2626; font-size: 16px;">Inherent Risk</h3>
                <p style="margin: 5px 0;"><strong>Likelihood:</strong> ${project.inherentRisk?.likelihood || 3}/5</p>
                <p style="margin: 5px 0;"><strong>Severity:</strong> ${project.inherentRisk?.severity || 3}/5</p>
                <p style="margin: 5px 0;"><strong>Risk Score:</strong> ${(project.inherentRisk?.likelihood || 3) * (project.inherentRisk?.severity || 3)}</p>
              </div>
              <div style="flex: 1; background: #f0fdf4; padding: 15px; border-radius: 8px;">
                <h3 style="margin: 0 0 10px 0; color: #16a34a; font-size: 16px;">Residual Risk</h3>
                <p style="margin: 5px 0;"><strong>Likelihood:</strong> ${project.residualRisk?.likelihood || 2}/5</p>
                <p style="margin: 5px 0;"><strong>Severity:</strong> ${project.residualRisk?.severity || 2}/5</p>
                <p style="margin: 5px 0;"><strong>Risk Score:</strong> ${(project.residualRisk?.likelihood || 2) * (project.residualRisk?.severity || 2)}</p>
              </div>
            </div>
            <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin-top: 15px;">
              <p style="margin: 0; font-size: 14px; color: #1e40af;">
                <strong>Risk Reduction:</strong> ${Math.max(0, ((1 - ((project.residualRisk?.likelihood || 2) * (project.residualRisk?.severity || 2)) / ((project.inherentRisk?.likelihood || 3) * (project.inherentRisk?.severity || 3))) * 100)).toFixed(0)}%
              </p>
            </div>
          </div>

          <!-- Threats -->
          <div style="page-break-inside: avoid; margin-bottom: 30px;">
            <h2 style="color: #334155; margin: 0 0 15px 0; font-size: 20px;">Threats & Preventive Barriers</h2>
            ${project.threats && project.threats.length > 0 ? project.threats.map((threat, idx) => `
              <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin-bottom: 15px; border-radius: 4px; page-break-inside: avoid;">
                <h3 style="margin: 0 0 10px 0; color: #991b1b; font-size: 16px;">Threat ${idx + 1}: ${threat.threat || 'Unnamed'}</h3>
                <p style="margin: 5px 0; font-size: 14px;"><strong>Likelihood:</strong> <span style="text-transform: uppercase;">${threat.likelihood}</span></p>
                
                ${threat.escalationFactors && threat.escalationFactors.length > 0 ? `
                  <div style="margin-top: 10px;">
                    <strong style="color: #dc2626; font-size: 14px;">Escalation Factors:</strong>
                    <ul style="margin: 5px 0; padding-left: 20px;">
                      ${threat.escalationFactors.map(factor => `<li style="font-size: 13px; margin: 3px 0;">${factor}</li>`).join('')}
                    </ul>
                  </div>
                ` : ''}
                
                ${threat.barriers && threat.barriers.length > 0 ? `
                  <div style="margin-top: 15px;">
                    <strong style="color: #2563eb; font-size: 14px;">Preventive Barriers:</strong>
                    ${threat.barriers.map(barrier => `
                      <div style="background: white; padding: 10px; margin: 8px 0; border-radius: 4px; border: 1px solid #e2e8f0;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                          <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${
                            barrier.effectiveness === 'good' ? '#22c55e' : 
                            barrier.effectiveness === 'weak' ? '#eab308' : '#ef4444'
                          };"></span>
                          <span style="font-size: 13px;">${getCategoryIcon(barrier.category)} ${barrier.description || 'Unnamed barrier'}</span>
                        </div>
                        ${barrier.owner ? `<p style="margin: 5px 0 0 18px; font-size: 12px; color: #64748b;"><strong>Owner:</strong> ${barrier.owner}</p>` : ''}
                        ${barrier.nextDue ? `<p style="margin: 3px 0 0 18px; font-size: 12px; color: #64748b;"><strong>Next Due:</strong> ${new Date(barrier.nextDue).toLocaleDateString()}</p>` : ''}
                      </div>
                    `).join('')}
                  </div>
                ` : '<p style="margin-top: 10px; font-style: italic; font-size: 13px; color: #64748b;">No barriers defined</p>'}
              </div>
            `).join('') : '<p style="font-style: italic; color: #64748b;">No threats defined</p>'}
          </div>

          <!-- Consequences -->
          <div style="page-break-inside: avoid; margin-bottom: 30px;">
            <h2 style="color: #334155; margin: 0 0 15px 0; font-size: 20px;">Consequences & Mitigation Barriers</h2>
            ${project.consequences && project.consequences.length > 0 ? project.consequences.map((cons, idx) => `
              <div style="background: #fef3c7; border-left: 4px solid #f97316; padding: 15px; margin-bottom: 15px; border-radius: 4px; page-break-inside: avoid;">
                <h3 style="margin: 0 0 10px 0; color: #c2410c; font-size: 16px;">Consequence ${idx + 1}: ${cons.consequence || 'Unnamed'}</h3>
                <p style="margin: 5px 0; font-size: 14px;"><strong>Severity:</strong> <span style="text-transform: uppercase;">${cons.severity}</span></p>
                
                ${cons.escalationFactors && cons.escalationFactors.length > 0 ? `
                  <div style="margin-top: 10px;">
                    <strong style="color: #f97316; font-size: 14px;">Escalation Factors:</strong>
                    <ul style="margin: 5px 0; padding-left: 20px;">
                      ${cons.escalationFactors.map(factor => `<li style="font-size: 13px; margin: 3px 0;">${factor}</li>`).join('')}
                    </ul>
                  </div>
                ` : ''}
                
                ${cons.barriers && cons.barriers.length > 0 ? `
                  <div style="margin-top: 15px;">
                    <strong style="color: #16a34a; font-size: 14px;">Mitigation Barriers:</strong>
                    ${cons.barriers.map(barrier => `
                      <div style="background: white; padding: 10px; margin: 8px 0; border-radius: 4px; border: 1px solid #e2e8f0;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                          <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${
                            barrier.effectiveness === 'good' ? '#22c55e' : 
                            barrier.effectiveness === 'weak' ? '#eab308' : '#ef4444'
                          };"></span>
                          <span style="font-size: 13px;">${getCategoryIcon(barrier.category)} ${barrier.description || 'Unnamed barrier'}</span>
                        </div>
                        ${barrier.owner ? `<p style="margin: 5px 0 0 18px; font-size: 12px; color: #64748b;"><strong>Owner:</strong> ${barrier.owner}</p>` : ''}
                        ${barrier.nextDue ? `<p style="margin: 3px 0 0 18px; font-size: 12px; color: #64748b;"><strong>Next Due:</strong> ${new Date(barrier.nextDue).toLocaleDateString()}</p>` : ''}
                      </div>
                    `).join('')}
                  </div>
                ` : '<p style="margin-top: 10px; font-style: italic; font-size: 13px; color: #64748b;">No barriers defined</p>'}
              </div>
            `).join('') : '<p style="font-style: italic; color: #64748b;">No consequences defined</p>'}
          </div>

          <!-- Footer -->
          <div style="margin-top: 50px; padding-top: 20px; border-top: 2px solid #e2e8f0; text-align: center; color: #64748b; font-size: 12px;">
            <p style="margin: 0;">Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            <p style="margin: 5px 0 0 0;">Tata Steel - Bow Tie Safety Platform | Confidential Document</p>
          </div>
        </div>
      `;

      // Helper function for category icons
      function getCategoryIcon(category) {
        const icons = {
          hardware: '🔧',
          procedure: '📋',
          people: '👤'
        };
        return icons[category] || '🛡️';
      }

      // Capture the content as canvas
      const canvas = await html2canvas(printContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      // Remove temporary container
      document.body.removeChild(printContainer);

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      // Add image to PDF with pagination
      let heightLeft = imgHeight * ratio;
      let position = 0;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      heightLeft -= pdfHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight * ratio;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, imgHeight * ratio);
        heightLeft -= pdfHeight;
      }

      // Save PDF
      const fileName = `bowtie-report-${project.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.pdf`;
      pdf.save(fileName);

      setIsExporting(false);
    } catch (error) {
      console.error('PDF Export Error:', error);
      alert('Failed to generate PDF. Please try again.');
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={exportToPDF}
      disabled={isExporting}
      className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      title="Export as PDF Report"
    >
      {isExporting ? (
        <>
          <Loader className="w-4 h-4 animate-spin" />
          <span className="hidden sm:inline">Generating...</span>
        </>
      ) : (
        <>
          <FileDown className="w-4 h-4" />
          <span className="hidden sm:inline">Export PDF</span>
        </>
      )}
    </button>
  );
}
//EOF
