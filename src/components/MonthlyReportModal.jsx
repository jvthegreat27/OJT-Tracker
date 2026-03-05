import React, { useState, useRef } from 'react';
import { useOJT } from '../context/OJTContext';
import { toPng } from 'html-to-image';

const MonthlyReportModal = ({ onClose }) => {
  const { currentIntern, generateMonthlyReport } = useOJT();
  const [monthStart, setMonthStart] = useState(() => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    return firstDayOfMonth.toISOString().split('T')[0];
  });
  const [report, setReport] = useState(null);
  const [formData, setFormData] = useState({
    activities: '',
    learnings: '',
    department: '',
    supervisorName: '',
    chairmanName: ''
  });
  const reportRef = useRef(null);

  const handleGenerate = () => {
    const generatedReport = generateMonthlyReport(currentIntern?.id, monthStart);
    setReport(generatedReport);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPNG = async () => {
    if (!reportRef.current) return;
    
    try {
      // Configure html-to-image options
      const dataUrl = await toPng(reportRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        width: reportRef.current.offsetWidth,
        height: reportRef.current.offsetHeight,
        style: {
          transform: 'none',
          margin: '0',
          padding: '20px',
          boxSizing: 'border-box'
        }
      });
      
      // Create download link
      const link = document.createElement('a');
      link.download = `OJT_Monthly_Report_${currentIntern?.name.replace(/\s+/g, '_')}_${monthStart}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again or use Print to PDF instead.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal modal-large ${report ? 'report-view' : ''}`} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Monthly OJT Report Generator</h3>
          <button className="btn-icon" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {!report ? (
          <div className="report-generator-sticky">
            <div className="report-generator">
              <div className="form-group">
                <label>Select Month</label>
                <input
                  type="month"
                  value={monthStart.slice(0, 7)}
                  onChange={(e) => setMonthStart(e.target.value + '-01')}
                  className="form-control"
                />
              </div>

              <button className="btn btn-primary" onClick={handleGenerate}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
                Generate Report
              </button>
            </div>
          </div>
        ) : (
          <div className="report-output">
            {/* Official Monthly Report Form - A4 Size */}
            <div className="monthly-report-form" ref={reportRef}>
              <div className="report-form-header">
                <h2>OFFICE OF THE OJT COORDINATOR</h2>
                <h3>{currentIntern?.program || 'OJT PROGRAM'}</h3>
              </div>
              
              <div className="report-form-title">
                <h4>Monthly OJT Status Report</h4>
                <span className="encoded-entry">(encoded entry)</span>
              </div>

              <div className="report-form-grid">
                <div className="form-field">
                  <label>Name of OJT:</label>
                  <span className="field-value">{currentIntern?.name}</span>
                </div>
                <div className="form-field">
                  <label>Course & Major:</label>
                  <span className="field-value">{currentIntern?.program}</span>
                </div>
                
                <div className="form-field">
                  <label>Name of Host Establishment Industry:</label>
                  <span className="field-value">{currentIntern?.establishment}</span>
                </div>
                <div className="form-field">
                  <label>(Inclusive Date) From:</label>
                  <span className="field-value">{report.periodFrom}</span>
                </div>
                
                <div className="form-field editable-field">
                  <label>Department:</label>
                  <input
                    type="text"
                    className="field-input"
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    placeholder="Enter department"
                  />
                </div>
                <div className="form-field">
                  <label>To:</label>
                  <span className="field-value">{report.periodTo}</span>
                </div>
              </div>

              <div className="report-form-sections">
                <div className="form-section editable">
                  <label>Summary of Monthly Activities:</label>
                  <textarea
                    className="editable-textarea"
                    value={formData.activities}
                    onChange={(e) => setFormData({...formData, activities: e.target.value})}
                    placeholder="Enter your monthly activities here..."
                    rows={4}
                  />
                  {report.keyAccomplishments.length > 0 && (
                    <div className="auto-suggestions">
                      <small>Suggested from logs:</small>
                      <ul>
                        {report.keyAccomplishments.slice(0, 3).map((acc, idx) => (
                          <li key={idx}>{acc}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                <div className="form-section editable">
                  <label>Learning / Insights:</label>
                  <textarea
                    className="editable-textarea"
                    value={formData.learnings}
                    onChange={(e) => setFormData({...formData, learnings: e.target.value})}
                    placeholder="Enter your learnings and insights here..."
                    rows={4}
                  />
                  {report.learnings.length > 0 && (
                    <div className="auto-suggestions">
                      <small>Suggested from logs:</small>
                      <ul>
                        {report.learnings.slice(0, 3).map((learning, idx) => (
                          <li key={idx}>{learning}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="report-form-remarks">
                <div className="remarks-section">
                  <label>Statistics:</label>
                  <div className="remarks-content">
                    <p><strong>Total Hours:</strong> {report.totalHours} hours</p>
                    <p><strong>Days Worked:</strong> {report.daysWorked} days</p>
                    <p><strong>Average Hours/Day:</strong> {report.averageHoursPerDay} hours</p>
                  </div>
                </div>
                
                <div className="remarks-section">
                  <label>AI-Generated Summary:</label>
                  <div className="remarks-content ai-summary">
                    <p>{report.summary}</p>
                  </div>
                </div>
              </div>

              <div className="report-form-signatures">
                <div className="signature-block editable-signature">
                  <div className="signature-line"></div>
                  <input
                    type="text"
                    className="signature-input"
                    value={formData.supervisorName}
                    onChange={(e) => setFormData({...formData, supervisorName: e.target.value})}
                    placeholder="OJT Supervisor Name"
                  />
                  <p className="signature-note">(Signature Over Printed Name)</p>
                </div>
                
                <div className="signature-block editable-signature">
                  <div className="signature-line"></div>
                  <input
                    type="text"
                    className="signature-input"
                    value={formData.chairmanName}
                    onChange={(e) => setFormData({...formData, chairmanName: e.target.value})}
                    placeholder="OJT Chairman Name"
                  />
                  <p className="signature-note">(Signature Over Printed Name)</p>
                </div>
              </div>
            </div>

            <div className="modal-actions no-print">
              <button className="btn btn-secondary" onClick={handlePrint}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <polyline points="6 9 6 2 18 2 18 9"/>
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                  <rect x="6" y="14" width="12" height="8"/>
                </svg>
                Print Report
              </button>
              <button className="btn btn-primary" onClick={handleExportPNG}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
                Export as PNG
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlyReportModal;
