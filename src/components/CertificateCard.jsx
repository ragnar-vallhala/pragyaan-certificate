import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';

const CertificateCard = ({ certificate, type }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const getTypeDetails = () => {
    switch (type) {
      case 'staff':
        return <p>Staff Certificate</p>;
      case 'student':
        return (
          <>
            <p>Project: {certificate.project}</p>
            <p>School: {certificate.school}</p>
          </>
        );
      case 'volunteer':
        return <p>Designation: {certificate.designation}</p>;
      default:
        return null;
    }
  };

  const downloadCertificate = async () => {
    setIsLoading(true);
    setProgress(0);
    
    try {
      // Update progress - fetching PDF
      setProgress(20);
      const response = await fetch(certificate.file);
      const arrayBuffer = await response.arrayBuffer();
      
      // Update progress - PDF loaded
      setProgress(40);
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // Update progress - creating new PDF
      setProgress(60);
      const newPdf = await PDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(pdfDoc, [certificate.page - 1]);
      newPdf.addPage(copiedPage);
      
      // Update progress - saving PDF
      setProgress(80);
      const pdfBytes = await newPdf.save();
      
      // Create and trigger download
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${certificate.name.replace(/[^a-z0-9]/gi, '_')}_${type}_certificate.pdf`;
      link.click();
      
      // Clean up
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
    <div className="certificate-card">
      <h3>{certificate.name}</h3>
      {getTypeDetails()}
      
      <button 
        onClick={downloadCertificate} 
        className="download-btn"
        disabled={isLoading}
      >
        {isLoading ? 'Processing...' : 'Download Certificate'}
      </button>
      
      {isLoading && (
        <div className="progress-container">
          <div 
            className="progress-bar" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default CertificateCard;