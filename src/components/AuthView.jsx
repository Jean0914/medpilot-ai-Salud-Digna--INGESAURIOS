import React, { useState } from 'react';
import './AuthView.css';
import { areas } from '../mockData';

const AuthView = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState('paciente'); // paciente | personal | medico
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [doctorArea, setDoctorArea] = useState('lab');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ name, phone, role: activeTab, doctorArea: activeTab === 'medico' ? doctorArea : null });
  };

  return (
    <div className="auth-screen-wrapper">
      <div className="auth-card-portal">
        <div className="auth-tabs-header">
          <button 
            className={`tab-item ${activeTab === 'paciente' ? 'active' : ''}`}
            onClick={() => setActiveTab('paciente')}
          >
            Paciente
          </button>
          <button 
            className={`tab-item ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            Staff
          </button>
          <button 
            className={`tab-item ${activeTab === 'medico' ? 'active' : ''}`}
            onClick={() => setActiveTab('medico')}
          >
            Médico
          </button>
        </div>

        <div className="auth-content-body">
          <div className="brand-icon-main">💚</div>
          <h2 className="portal-title">
            {activeTab === 'paciente' ? 'Portal Paciente' : 
             activeTab === 'personal' ? 'Portal Operativo (Staff)' : 'Portal Médico'}
          </h2>
          <p className="portal-subtitle">Identifícate para continuar</p>

          <form onSubmit={handleSubmit} className="portal-form">
            <div className="form-group-custom">
              <label>Nombre Completo</label>
              <input 
                type="text" 
                placeholder={activeTab === 'paciente' ? "Ej. Eduardo Cabrera" : "Ej. Dra. Ramírez"}
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>

            {activeTab === 'paciente' && (
              <div className="form-group-custom">
                <label>Número de Teléfono</label>
                <input 
                  type="tel" 
                  placeholder="Ej. 529811234567"
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  required 
                />
              </div>
            )}

            {activeTab === 'medico' && (
              <div className="form-group-custom">
                <label>Área Asignada</label>
                <select value={doctorArea} onChange={(e) => setDoctorArea(e.target.value)}>
                  {areas.filter(a => a.id !== 'recep' && a.id !== 'results').map(a => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>
            )}

            <button type="submit" className="btn-portal-submit">
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthView;