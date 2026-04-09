import React, { useState } from 'react';
import { studyCatalog, availableClinics, availableTimeSlots } from '../mockData';
import './AppointmentBooking.css';

const AppointmentBooking = ({ onBookingComplete }) => {
  const [step, setStep] = useState(1);
  const [selectedStudy, setSelectedStudy] = useState(null);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [addedStudies, setAddedStudies] = useState([]); // Array de estudios agregados

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleAddStudy = () => {
    if (selectedStudy) {
      setAddedStudies([...addedStudies, { ...selectedStudy, id: `${selectedStudy.id}-${Date.now()}` }]);
      setSelectedStudy(null); // Reset para agregar otro
    }
  };

  const handleRemoveStudy = (studyToRemove) => {
    setAddedStudies(addedStudies.filter(s => s.id !== studyToRemove.id));
  };

  const handleConfirm = () => {
    const finalStudies = addedStudies.length > 0 ? addedStudies : (selectedStudy ? [selectedStudy] : []);
    
    // Return the selected appointment details with support for multiple studies
    onBookingComplete({
      studies: finalStudies.map((study, idx) => ({
        id: `study-${idx + 1}`,
        name: study.name,
        type: study.type || 'general',
        status: 'in-progress',
        steps: [], // Los pasos se asignarán en el engine
        createdAt: new Date().toISOString()
      })),
      clinic: selectedClinic,
      time: selectedTime,
      date: 'Mañana', // Hardcoded for prototype simplicity
      price: finalStudies.reduce((sum, s) => sum + parseFloat(s.price.replace('$', '').replace(' MXN', '')), 0)
    });
  };

  const totalCost = addedStudies.length > 0 
    ? addedStudies.reduce((sum, s) => sum + parseFloat(s.price.replace('$', '').replace(' MXN', '')), 0)
    : (selectedStudy ? parseFloat(selectedStudy.price.replace('$', '').replace(' MXN', '')) : 0);

  return (
    <div className="booking-container animate-fade-in">
      <div className="booking-header">
        <h2>Agendar Nuevo Estudio</h2>
        <p>Paso {step} de 4</p>
        <div className="step-progress-bar">
          <div className="step-progress-fill" style={{ width: `${(step / 4) * 100}%` }}></div>
        </div>
      </div>

      {step === 1 && (
        <div className="booking-step animate-fade-in">
          <h3>Selecciona el Estudio</h3>
          <div className="options-list">
            {studyCatalog.map(study => (
              <div 
                key={study.id} 
                className={`option-card ${selectedStudy?.id === study.id ? 'selected' : ''}`}
                onClick={() => setSelectedStudy(study)}
              >
                <div className="option-info">
                  <h4>{study.name}</h4>
                  <span className="price">{study.price}</span>
                </div>
                <div className="radio-circle"></div>
              </div>
            ))}
          </div>

          {/* Lista de estudios agregados */}
          {addedStudies.length > 0 && (
            <div className="added-studies-section">
              <h4>📋 Estudios Agregados ({addedStudies.length})</h4>
              <div className="studies-list">
                {addedStudies.map(study => (
                  <div key={study.id} className="study-item">
                    <div className="study-info">
                      <span className="study-name">{study.name}</span>
                      <span className="study-price">{study.price}</span>
                    </div>
                    <button 
                      className="remove-btn"
                      onClick={() => handleRemoveStudy(study)}
                      title="Remover estudio"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="btn-group">
            <button 
              className="secondary-action-btn" 
              disabled={!selectedStudy}
              onClick={handleAddStudy}
            >
              + Agregar Otro Estudio
            </button>
            <button 
              className="primary-action-btn" 
              disabled={!selectedStudy && addedStudies.length === 0}
              onClick={handleNext}
            >
              Continuar {addedStudies.length > 0 && `(${addedStudies.length + 1})`}
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="booking-step animate-fade-in">
          <h3>¿En dónde quieres tu cita?</h3>
          <div className="options-list">
            {availableClinics.map(clinic => (
              <div 
                key={clinic.id} 
                className={`option-card ${selectedClinic?.id === clinic.id ? 'selected' : ''}`}
                onClick={() => setSelectedClinic(clinic)}
              >
                <div className="option-info">
                  <h4>{clinic.name}</h4>
                  <span className="address">{clinic.address}</span>
                </div>
                <div className="radio-circle"></div>
              </div>
            ))}
          </div>
          <div className="btn-group">
            <button className="secondary-action-btn" onClick={handleBack}>Regresar</button>
            <button 
              className="primary-action-btn" 
              disabled={!selectedClinic}
              onClick={handleNext}
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="booking-step animate-fade-in">
          <h3>Elige un Horario</h3>
          <p className="date-subtitle">Mostrando horarios para: Mañana</p>
          <div className="time-grid">
            {availableTimeSlots.map(time => (
              <div 
                key={time} 
                className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </div>
            ))}
          </div>

          <div className="btn-group">
            <button className="secondary-action-btn" onClick={handleBack}>Regresar</button>
            <button 
              className="primary-action-btn" 
              disabled={!selectedTime}
              onClick={handleNext}
            >
              Confirmar Cita
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="booking-step animate-fade-in">
          <h3>Resumen de tu Cita</h3>
          
          <div className="summary-card">
            <h4>📋 Estudios ({addedStudies.length + (selectedStudy ? 1 : 0)})</h4>
            <div className="studies-summary">
              {addedStudies.map(study => (
                <div key={study.id} className="summary-item">
                  <span>{study.name}</span>
                  <span className="price">{study.price}</span>
                </div>
              ))}
              {selectedStudy && (
                <div className="summary-item">
                  <span>{selectedStudy.name}</span>
                  <span className="price">{selectedStudy.price}</span>
                </div>
              )}
            </div>
          </div>

          <div className="summary-card">
            <p><strong>Clínica:</strong> {selectedClinic?.name}</p>
            <p><strong>Horario:</strong> {selectedTime}</p>
            <p><strong>Fecha:</strong> Mañana</p>
            <p className="total-price"><strong>Total a pagar:</strong> <span className="highlight-price">${totalCost} MXN</span></p>
          </div>

          <div className="btn-group">
            <button className="secondary-action-btn" onClick={handleBack}>Regresar</button>
            <button 
              className="primary-action-btn" 
              onClick={handleConfirm}
            >
              Confirmar Cita
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentBooking;
