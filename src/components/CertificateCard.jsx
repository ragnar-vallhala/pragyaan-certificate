import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import './CertificateCard.css';

const CertificateCard = ({ certificate, type }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const getTypeDetails = () => {
    switch (type) {
      case 'staff':
        return <p className="cert-meta">Staff Certificate</p>;
      case 'student':
        return (
          <>
            <p className="cert-meta"><strong>Project:</strong> {certificate.project}</p>
            <p className="cert-meta"><strong>School:</strong> {certificate.school}</p>
          </>
        );
      case 'volunteer':
        return <p className="cert-meta"><strong>Designation:</strong> {certificate.designation}</p>;
      default:
        return null;
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'staff': return '👨‍🏫';
      case 'student': return '🎓';
      case 'volunteer': return '🤝';
      default: return '';
    }
  };

  const downloadCertificate = async () => {
    setIsLoading(true);
    setProgress(0);
    
    try {
      setProgress(20);
      const response = await fetch(certificate.file);
      const arrayBuffer = await response.arrayBuffer();
      
      setProgress(40);
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      setProgress(60);
      const newPdf = await PDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(pdfDoc, [certificate.page - 1]);
      newPdf.addPage(copiedPage);
      
      setProgress(80);
      const pdfBytes = await newPdf.save();
      
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${certificate.name.replace(/[^a-z0-9]/gi, '_')}_${type}_certificate.pdf`;
      link.click();
      
      URL.revokeObjectURL(link.href);
      setProgress(100);
    } catch (error) {
      console.error('Error downloading certificate:', error);
      alert('Failed to download certificate. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`certificate-card ${type}`}>
      <div className="cert-header">
        <span className="cert-icon">{getTypeIcon()}</span>
        <h3 className="cert-name">{certificate.name}</h3>
      </div>
      
      <div className="cert-details">
        {getTypeDetails()}
      </div>
      
      <button 
        onClick={downloadCertificate} 
        className="download-btn"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span className="spinner-small"></span>
            Processing...
          </>
        ) : (
          'Download Certificate'
        )}
      </button>
      
      {isLoading && (
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
      )}
    </div>
  );
};

export default CertificateCard;