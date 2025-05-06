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
    return <div className="container">Loading certificates...</div>;
  }

  if (error) {
    return <div className="container error">Error: {error}</div>;
  }

  return (
    <div className="App">
      <div className="container">
        <div className='flex'>
          <img src='/IITJ_Blue.png' className='logo_iitj' />
          <div>

            <h1>Pragyaan - an Open Day<br /> Download Certificates</h1>
            Celebrating Innovation and Knowledge at IIT Jammu
          </div>
          <img src='/pragyaan_logo.png' className='logo_iitj' />
        </div>
        <SearchBox
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSearchSubmit={handleSearch}
        />
        {hasResults() ? (
          <div className='result'>
            {filteredCertificates.staff.length > 0 && (
              <section>
                <h2>Staff Certificates</h2>
                <div className="certificates-grid">
                  {filteredCertificates.staff.map((cert, index) => (
                    <CertificateCard key={`staff-${index}`} certificate={cert} type="staff" />
                  ))}
                </div>
              </section>
            )}

            {filteredCertificates.student.length > 0 && (
              <section>
                <h2>Student Certificates</h2>
                <div className="certificates-grid">
                  {filteredCertificates.student.map((cert, index) => (
                    <CertificateCard key={`student-${index}`} certificate={cert} type="student" />
                  ))}
                </div>
              </section>
            )}

            {filteredCertificates.volunteer.length > 0 && (
              <section>
                <h2>Volunteer Certificates</h2>
                <div className="certificates-grid">
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
      <footer>
        <p>© 2023 Indian Institute of Technology Jammu</p>
        <p>Developer Ashutosh Vishwakarma <a href='https://github.com/ragnar-vallhala' target='_blank'>Github</a> <a href='https://www.linkedin.com/in/ashutosh-vishwakarma-083305257/'>LinkedIn</a></p>
        <p>Pragyaan - Open Day Organizing Committee</p>
      </footer>
    </div>
  );
}

export default App;