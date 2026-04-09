import React from 'react';
import './ProgressTracker.css';

const ProgressTracker = ({ patient }) => {
  const studies = patient.studies || [];
  const activeIdx = patient.activeStudyIndex || 0;
  const queuePos = patient.queuePosition || 0;

  // 1. Construimos la lista plana de pasos
  const steps = [
    { 
      id: 'reg', 
      label: 'Recepción', 
      sub: 'Registro y Confirmación de Datos', 
      status: 'completed',
      icon: '✅' 
    }
  ];

  // Agregamos los estudios contratados
  studies.filter(s => s.id !== 'final-results').forEach((study, i) => {
    let status = 'pending';
    let subText = 'Esperando turno...';
    
    if (i < activeIdx) {
      status = 'completed';
      subText = 'Paso completado';
    } else if (i === activeIdx) {
      // Si es el actual y la fila llegó a 0 -> NARANJA PULSANTE
      if (queuePos === 0) {
        status = 'current';
        subText = 'En proceso • Tu turno';
      } else {
        status = 'pending';
        subText = `En espera (${queuePos} personas adelante)`;
      }
    }

    steps.push({
      id: study.id,
      label: study.name,
      sub: subText,
      status: status,
      icon: i === activeIdx && queuePos === 0 ? '💉' : ''
    });
  });

  // Paso final
  const isAllDone = studies.every(s => s.steps.every(st => st.status === 'completed'));
  steps.push({
    id: 'res',
    label: 'Entrega de Resultados',
    sub: isAllDone ? 'Resultados listos' : 'Esperando confirmación',
    status: isAllDone ? 'completed' : 'pending',
    icon: '📄'
  });

  return (
    <div className="progress-path-container">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        
        return (
          <div key={step.id} className={`step-row ${step.status}`}>
            <div className="step-visual">
              <div className={`step-node ${step.status}`}>
                {step.status === 'completed' && <span className="check-icon">✓</span>}
                {step.status === 'current' && <div className="pulse-core"></div>}
                {step.status === 'pending' && <span className="step-number">{index + 1}</span>}
              </div>
              {!isLast && (
                <div className={`step-line ${step.status === 'completed' ? 'filled' : ''}`}></div>
              )}
            </div>
            
            <div className="step-info">
              <div className="step-header">
                <h4 className="step-title">{step.label}</h4>
                <span className={`status-pill ${step.status}`}>
                  {step.status === 'completed' ? 'Completado' : step.status === 'current' ? 'En proceso' : 'Pendiente'}
                </span>
              </div>
              <p className="step-subtitle">
                {step.sub} {step.icon}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProgressTracker;