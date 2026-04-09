import React, { useState, useEffect } from 'react';
import './App.css';
import AuthView from './components/AuthView';
import PatientView from './components/PatientView';
import AppointmentBooking from './components/AppointmentBooking';
import StaffView from './components/StaffView';
import DoctorView from './components/DoctorView';
import { useCopilotEngine } from './useCopilotEngine';

function App() {
  const [theme, setTheme] = useState('light');
  const { patient, allPatients, clinicLoad, movePatient, finishConsultation, notifyNextPatient, setPatient, logout, setCloudUrl, isCloudEnabled } = useCopilotEngine();

  useEffect(() => { 
    document.documentElement.setAttribute('data-theme', theme); 
  }, [theme]);

  const handleBooking = (bookingData) => {
    const studyNames = (bookingData.studies || []).map(s => s.name).join(' • ');
    const baseStudies = (bookingData.studies || []).map((s, i) => ({
      ...s,
      steps: [
        { id: `r-${i}`, areaId: 'recep', title: 'Registro', status: 'completed' },
        { id: `s-${i}`, areaId: s.type || 'lab', title: s.name, status: 'pending' }
      ]
    }));

    setPatient({
      ...patient,
      role: 'paciente',
      patientId: `SD-${Math.floor(Math.random()*9000)+1000}`,
      studies: [...baseStudies, {
        id: 'final-results',
        name: 'Entrega de Resultados',
        steps: [{ id: 'res', areaId: 'results', title: 'Resultados', status: 'pending' }]
      }],
      activeStudyIndex: 0,
      queuePosition: Math.floor(Math.random() * 8) + 1,
      appointmentTime: bookingData.time || '09:00 AM',
      studyNamesDisplay: studyNames
    });
  };

  const renderView = () => {
    if (!patient) return <AuthView onLogin={(userData) => setPatient(userData)} />;
    
    if (patient.role === 'personal') {
      return (
        <StaffView 
          allPatients={allPatients || []}
          clinicLoad={clinicLoad || 'improving'}
          movePatient={movePatient}
          logout={logout}
          setCloudUrl={setCloudUrl}
          isCloudEnabled={isCloudEnabled}
          t={(k) => k}
        />
      );
    }

    if (patient.role === 'medico') {
      return (
        <DoctorView 
          patient={patient}
          allPatients={allPatients || []}
          finishConsultation={finishConsultation}
          notifyNextPatient={notifyNextPatient}
          logout={logout}
        />
      );
    }

    // Patient flow
    if (!patient.studies) {
      return <AppointmentBooking onBookingComplete={handleBooking} />;
    }

    return (
      <div className="view-wrapper animate-fade-in">
        <div className="patient-legend-data">
          <h2>{patient.name}</h2>
          <p className="patient-sub-info">
            Folio: <strong>{patient.patientId}</strong> • {patient.studyNamesDisplay}
          </p>
        </div>
        <PatientView patient={patient} />
      </div>
    );
  };

  return (
    <div className={`app-container ${theme}-theme`}>
      <header className="main-header glass-panel">
        <div className="header-left">
          <span className="brand-logo">💚</span>
          <div className="brand-info">
            <h1>MedPilot</h1>
            <span className="brand-tagline">AI</span>
          </div>
        </div>
        <div className="header-right">
          {patient && <button className="logout-header-btn" onClick={logout}>Cerrar Sesión</button>}
          <button className="theme-toggle" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      <main className="main-viewport">
        {renderView()}
      </main>
    </div>
  );
}

export default App;