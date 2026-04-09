import React, { useState, useEffect } from 'react';
import ProgressTracker from './ProgressTracker';
import InteractiveMap from './InteractiveMap';
import { areas } from '../mockData';
import './PatientView.css';

const PatientView = ({ patient }) => {
  const [hoursText, setHoursText] = useState("");
  const [minsSecsText, setMinsSecsText] = useState("");

  const studies = patient.studies || [];
  const queuePos = patient.queuePosition || 0;
  const isAllFinished = studies[studies.length - 1]?.steps.every(s => s.status === 'completed');

  // Rastrear cambios en el estudio activo para mostrar la alerta
  const [lastNotifiedIndex, setLastNotifiedIndex] = useState(patient.activeStudyIndex || 0);

  useEffect(() => {
    const currentIndex = patient.activeStudyIndex || 0;
    if (currentIndex > lastNotifiedIndex) {
      // El paciente avanzó a una nueva área
      const currentAreaId = studies[currentIndex]?.steps.find(s => s.status === 'pending' || s.status === 'current')?.areaId || 'recep';
      const areaInfo = areas.find(a => a.id === currentAreaId);
      
      alert(`🔔 Notificación de Sistema:\n\nEs tu turno de avanzar. Por favor dirígete al área de: ${areaInfo?.name || 'Consulta'}.`);
      setLastNotifiedIndex(currentIndex);
    }
  }, [patient?.activeStudyIndex, lastNotifiedIndex, studies]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isAllFinished) {
        const currentAreaId = patient.studies && patient.studies.length > 0 ? patient.studies[patient.activeStudyIndex || 0].steps.find(s => s.status === 'current' || s.status === 'pending')?.areaId || 'recep' : 'recep';
        const areaInfo = areas.find(a => a.id === currentAreaId) || { baseTime: 12 };
        
        // Base time in MS for full queue + current position
        const totalBaseWaitMs = queuePos * areaInfo.baseTime * 60 * 1000;
        
        // Elapsed time since the doctor last updated our status
        const elapsedSinceSync = Date.now() - (patient.lastSync || Date.now());
        
        // Visual time remaining
        // Never let it go negative strictly, but let the seconds tick nicely
        let timeToShow = totalBaseWaitMs - elapsedSinceSync;
        if (timeToShow < 0 && queuePos > 0) timeToShow = 60 * 1000; // Si estamos en fila, mínimo queda 1 min visual

        if (timeToShow <= 0 || queuePos === 0) {
          setHoursText("");
          setMinsSecsText("Es tu turno");
        } else {
          const h = Math.floor(timeToShow / (1000 * 60 * 60));
          const m = Math.floor((timeToShow % (1000 * 60 * 60)) / (1000 * 60));
          const s = Math.floor((timeToShow % (1000 * 60)) / 1000);
          setHoursText(h > 0 ? `${h}h ` : "");
          setMinsSecsText(`${m}m ${s}s`);
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [queuePos, isAllFinished, patient?.lastSync, patient?.activeStudyIndex]);

  const handleWhatsAppShare = () => {
    const message = `*MedPilot AI* ✨\n\nHola *${patient.name}*, este es el resumen de tu cita:\n\n🆔 *Folio:* ${patient.patientId}\n📝 *Estudios:* ${patient.studyNamesDisplay}\n⏰ *Hora:* ${patient.appointmentTime}\n\n¡Te esperamos!`;
    const cleanPhone = patient.phone.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="patient-view animate-fade-in">
      <div className="layout-grid">
        <div className="main-content">
          <div className="card-horizontal-status glass-panel">
            <div className="status-left">
              <span className={isAllFinished ? "queue-number-finished" : "queue-number-green"}>
                {isAllFinished ? "✓" : queuePos}
              </span>
              <p className="queue-text">PACIENTES ADELANTE</p>
              {!isAllFinished && (
                <div className="next-move-timer">
                  <span className="timer-label">{queuePos > 0 ? "Espera estimada: " : "Terminas en: "}</span>
                  <strong>{hoursText}{minsSecsText}</strong>
                </div>
              )}
            </div>
            <div className="vertical-divider"></div>
            <div className="status-right">
              <span className="ticket-label-top">TICKET</span>
              <div className="ticket-badge-clean">{patient.patientId}</div>
            </div>
          </div>
          <div className="card-map-container glass-panel">
            <InteractiveMap studies={studies} />
          </div>
        </div>

        <div className="side-panel">
          <div className="card-nextstep glass-panel">
            <h3 className="centered-panel-title">Tu Ruta de Salud</h3>
            <ProgressTracker patient={patient} />
          </div>
          <button className="whatsapp-btn" onClick={handleWhatsAppShare}>
            Compartir por WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientView;