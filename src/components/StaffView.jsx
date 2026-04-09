import React, { useState } from 'react';
import './StaffView.css';
import { areas } from '../mockData';

const StaffView = ({ allPatients, clinicLoad, movePatient, logout, setCloudUrl, isCloudEnabled, t }) => {

  return (
    <div className="staff-view animate-fade-in">
      <header className="staff-header glass-panel">
        <div className="header-top">
          <div className="staff-info">
            <h2>Panel Operativo Clínico</h2>
            <p>Control de flujo en tiempo real (MedPilot AI)</p>
          </div>
          <button className="secondary-btn" onClick={logout}>Cerrar Sesión</button>
        </div>

        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-label">Carga de Clínica</span>
            <span className={`stat-value ${clinicLoad === 'congested' ? 'status-warning' : 'status-success'}`}>
              {clinicLoad === 'congested' ? t('aiTrendCongested') : t('aiTrendImproving')}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Pacientes en Espera</span>
            <span className="stat-value">{allPatients.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Tiempo Promedio</span>
            <span className="stat-value">
              {Math.round(allPatients.reduce((acc, p) => acc + (areas.find(a => a.id === p.currentArea)?.baseTime || 15), 0) / (allPatients.length || 1))} min
            </span>
          </div>
          <div className="stat-card cloud-settings">
            <span className="stat-label">Configuración Demo (Nube)</span>
            {!isCloudEnabled ? (
              <div className="cloud-input-group">
                <input 
                  type="text" 
                  placeholder="Firebase Project ID or URL" 
                  id="cloudUrlInput"
                />
                <button 
                  className="primary-btn sm"
                  onClick={() => {
                    const val = document.getElementById('cloudUrlInput').value;
                    if (val) setCloudUrl(val.startsWith('http') ? val : `https://${val}.firebaseio.com`);
                  }}
                >
                  Conectar
                </button>
              </div>
            ) : (
              <div className="cloud-status active">
                <span>🟢 Sincronizado</span>
                <button className="text-btn sm" onClick={() => setCloudUrl('')}>Desconectar</button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="staff-grid">
        <section className="patients-section glass-panel">
          <div className="section-header">
            <h3>Gestión de Pacientes</h3>
            <span className="badge">LIVE</span>
          </div>
          
          <div className="patients-table-container">
            <table className="patients-table">
              <thead>
                <tr>
                  <th>Paciente</th>
                  <th>Ticket</th>
                  <th>Ubicación Actual</th>
                  <th>Estudios Solicitados</th>
                  <th>Contacto</th>
                  <th>Horario</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {allPatients.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div className="patient-cell">
                        <div className="avatar">{(p.name || '?').charAt(0)}</div>
                        <span>{p.name || 'Paciente'}</span>
                      </div>
                    </td>
                    <td><code className="ticket-code">{p.id}</code></td>
                    <td><div className="area-badge">{areas.find(a => a.id === p.currentArea)?.name || 'Área general'}</div></td>
                    <td>
                      {p.studiesList && p.studiesList.length > 0 ? (
                        <details className="studies-dropdown">
                          <summary className="studies-summary-btn">
                            Ver Estudios ({p.studiesList.length})
                          </summary>
                          <ul className="studies-dropdown-list">
                            {p.studiesList.map((study, idx) => (
                              <li key={idx}>▸ {study}</li>
                            ))}
                          </ul>
                        </details>
                      ) : (
                        <div className="studies-list-staff">{p.studyNames || 'Estudio Estándar'}</div>
                      )}
                    </td>
                    <td>{p.phone || p.email || 'N/A'}</td>
                    <td>{p.appointmentTime || 'Demo/Sin Cita'}</td>
                    <td>
                      <span className={`status-pill ${p.status}`}>
                        {p.status === 'waiting' ? 'En espera' : 'Atendiendo'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="ai-insights glass-panel">
          <h3>🩺 {t('areaSaturation') || 'Saturación por Área'}</h3>
          <div className="prediction-content">
            {areas.filter(a => a.id !== 'recep' && a.id !== 'results').map(area => {
              const patientsInArea = allPatients.filter(p => p.currentArea === area.id).length;
              const saturation = Math.min((patientsInArea / area.capacity) * 100, 100);
              const status = saturation > 80 ? 'high' : saturation > 40 ? 'medium' : 'low';
              
              return (
                <div key={area.id} className="prediction-item">
                  <div className="item-header">
                    <span>{area.name}</span>
                    <span className={`load-tag ${status}`}>
                      {patientsInArea} / {area.capacity} {t('patients')}
                    </span>
                  </div>
                  <div className="load-bar">
                    <div 
                      className={`fill ${status}`} 
                      style={{width: `${saturation}%`}}
                    ></div>
                  </div>
                </div>
              );
            })}

            <div className="ai-global-trend">
              <h4>🧠 {t('aiPredictionTitle')}</h4>
              <p>Se detecta flujo lento en Laboratorio. Se sugiere habilitar cubículo 4 para descongestión inmediata.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default StaffView;
