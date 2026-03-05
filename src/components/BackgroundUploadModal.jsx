import React, { useState, useRef } from 'react';

const BackgroundUploadModal = ({ onClose, currentBg, onSave, onRemove }) => {
  const [preview, setPreview] = useState(currentBg);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleSave = () => {
    if (preview) {
      onSave(preview);
    }
    onClose();
  };

  const handleRemove = () => {
    setPreview(null);
    onRemove();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Customize Time Clock Background</h3>
          <button className="btn-icon" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="bg-upload-content">
          {preview ? (
            <div className="bg-preview-container">
              <img src={preview} alt="Background preview" className="bg-preview" />
              <div className="bg-preview-overlay-demo">
                <span className="preview-time">01:08 PM</span>
                <span className="preview-date">Wednesday, March 4, 2026</span>
              </div>
            </div>
          ) : (
            <div 
              className={`bg-dropzone ${dragActive ? 'active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="48" height="48">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <p>Drag & drop an image here</p>
              <p className="text-muted">or click to browse</p>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </div>
          )}

          <div className="bg-info">
            <p>💡 <strong>Tip:</strong> The system automatically applies a dark overlay to ensure text remains readable regardless of your image.</p>
          </div>
        </div>

        <div className="modal-actions bg-modal-actions">
          <div className="modal-actions-left">
            {preview && (
              <button className="btn btn-text" onClick={() => setPreview(null)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Change Photo
              </button>
            )}
            {currentBg && preview && (
              <button className="btn btn-text-danger" onClick={handleRemove}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
                Remove
              </button>
            )}
          </div>
          <div className="modal-actions-right">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handleSave}
              disabled={!preview}
            >
              Save Background
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackgroundUploadModal;
