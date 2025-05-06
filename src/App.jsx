import React, { useState, useEffect } from 'react';
import SearchBox from './components/SearchBox';
import CertificateCard from './components/CertificateCard';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [certificates, setCertificates] = useState({ staff: [], student: [], volunteer: [] });
  const [filteredCertificates, setFilteredCertificates] = useState({ staff: [], student: [], volunteer: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await fetch('/certificates.json');
        if (!response.ok) {
          throw new Error('Failed to load certificates');
        }
        const data = await response.json();
        setCertificates(data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredCertificates({ staff: [], student: [], volunteer: [] });
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = {
      staff: certificates.staff.filter(cert =>
        cert.name.toLowerCase().includes(term)
      ),
      student: certificates.student.filter(cert =>
        cert.name.toLowerCase().includes(term)
      ),
      volunteer: certificates.volunteer.filter(cert =>
        cert.name.toLowerCase().includes(term)
      )
    };

    setFilteredCertificates(filtered);
  };

  const hasResults = () => {
    return (
      filteredCertificates.staff.length > 0 ||
      filteredCertificates.student.length > 0 ||
      filteredCertificates.volunteer.length > 0
    );
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading certificates...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-container">Error: {error}</div>;
  }

  return (
    <div className="App">
      <header className="header">
        <div className="header-content">
          <img src="/IITJ_Blue.png" alt="IIT Jammu Logo" className="logo" />
          <div className="title-container">
            <h1>Pragyaan - an Open Day</h1>
            <h2>Download Certificates</h2>
            <p className="subtitle">Celebrating Innovation and Knowledge at IIT Jammu</p>
          </div>
          <img src="/pragyaan_logo.png" alt="Pragyaan Logo" className="logo" />
        </div>
      </header>

      <main className="main-content">
        <div className="search-container">
          <SearchBox
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onSearchSubmit={handleSearch}
          />
        </div>

        <div className="results-container">
          {hasResults() ? (
            <div className="results-grid">
              {filteredCertificates.staff.length > 0 && (
                <section className="certificate-section">
                  <h3>Staff Certificates</h3>
                  <div className="certificates-list">
                    {filteredCertificates.staff.map((cert, index) => (
                      <CertificateCard key={`staff-${index}`} certificate={cert} type="staff" />
                    ))}
                  </div>
                </section>
              )}

              {filteredCertificates.student.length > 0 && (
                <section className="certificate-section">
                  <h3>Student Certificates</h3>
                  <div className="certificates-list">
                    {filteredCertificates.student.map((cert, index) => (
                      <CertificateCard key={`student-${index}`} certificate={cert} type="student" />
                    ))}
                  </div>
                </section>
              )}

              {filteredCertificates.volunteer.length > 0 && (
                <section className="certificate-section">
                  <h3>Volunteer Certificates</h3>
                  <div className="certificates-list">
                    {filteredCertificates.volunteer.map((cert, index) => (
                      <CertificateCard key={`volunteer-${index}`} certificate={cert} type="volunteer" />
                    ))}
                  </div>
                </section>
              )}
            </div>
          ) : searchTerm ? (
            <p className="no-results">No certificates found for "{searchTerm}"</p>
          ) : (
            <p className="instructions">Enter your name to search for certificates</p>
          )}
        </div>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <p>© 2025 Indian Institute of Technology Jammu</p>
          <p className="developer-info">
            Developer: Ashutosh Vishwakarma 
            <a href='https://github.com/ragnar-vallhala' target='_blank' rel="noopener noreferrer">GitHub</a> | 
            <a href='https://www.linkedin.com/in/ashutosh-vishwakarma-083305257/' target='_blank' rel="noopener noreferrer">LinkedIn</a>
          </p>
          <p>Pragyaan - Open Day Organizing Committee</p>
        </div>
      </footer>
    </div>
  );
}

export default App;