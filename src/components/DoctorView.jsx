import React, { useState } from 'react';
import './DoctorView.css';
import { areas } from '../mockData';

const DoctorView = ({ patient, allPatients = [], finishConsultation, notifyNextPatient, logout }) => {
  const doctorAreaId = patient?.doctorArea || 'lab';
  const doctorAreaInfo = areas.find(a => a.id === doctorAreaId) || { name: 'Consultorio', baseTime: 15 };

  // Solo los pacientes en esta área
  const queue = allPatients.filter(p => p.currentArea === doctorAreaId);

  return (
    <div className="doctor-view animate-fade-in">
      <header className="doctor-header glass-panel">
        <div className="header-info">
          <h2>Panel Médico - {doctorAreaInfo.name}</h2>
          <p>Dr. {patient?.name} | {queue.length} pacientes en cola</p>
        </div>
        <button className="secondary-btn" onClick={logout}>Cerrar Sesión</button>
      </header>

      <div className="doctor-content">
        <div className="queue-section glass-panel">
          <h3>Cola de Pacientes</h3>
          {queue.length === 0 ? (
            <p className="empty-queue">No hay pacientes esperando en esta área.</p>
          ) : (
            <div className="queue-list">
              {queue.map((p, idx) => {
                const waitMins = idx * doctorAreaInfo.baseTime;
                return (
                  <div key={p.id} className={`queue-card ${idx === 0 ? 'active' : ''}`}>
                    <div className="queue-card-header">
                      <div className="patient-main">
                        <div className="avatar">{(p.name || '?').charAt(0)}</div>
                        <div>
                          <h4>{p.name}</h4>
                          <span className="patient-id">{p.id}</span>
                        </div>
                      </div>
                      {idx === 0 && <span className="status-badge active">Siguiente</span>}
                    </div>
                    
                    <div className="patient-details">
                      <p><strong>Hora Cita:</strong> {p.appointmentTime || 'N/A'}</p>
                      <p><strong>Contacto:</strong> {p.phone || p.email || 'N/A'}</p>
                      <p><strong>Tiempo Espera:</strong> {idx === 0 ? 'Turno Actual' : `~${waitMins} min`}</p>
                    </div>

                    <div className="card-actions">
                      <button 
                        className="primary-btn sm" 
                        onClick={() => finishConsultation(p.id)}
                      >
                        Liberar Espacio / Finalizar
                      </button>
                      <button 
                        className="whatsapp-btn sm" 
                        onClick={() => notifyNextPatient(p.id)}
                      >
                        Notificar (WhatsApp)
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        <div className="doctor-insights glass-panel">
          <h3>Flujo Inteligente</h3>
          <p>El sistema asigna pacientes a esta área dinámicamente para optimizar tu carga de trabajo.</p>
          <div className="insight-stat">
            <span>Tiempo base por paciente:</span>
            <strong>{doctorAreaInfo.baseTime} min</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorView;
