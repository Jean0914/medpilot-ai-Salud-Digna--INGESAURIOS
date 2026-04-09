import React from 'react';
import './SinglePathTracker.css';

const SinglePathTracker = ({ patient }) => {
  const studies = patient.studies || [];
  const currentActiveIndex = patient.activeStudyIndex || 0;
  
  if (!studies || studies.length === 0) return null;

  // 1. Consolidamos un 'Registro' global para el inicio
  const registroStep = {
    id: 'registro-global',
    label: 'Registro',
    status: 'completed', // Registro inicial para la cita es completado
    description: 'Registro inicial y validación de datos.'
  };

  // 2. Extraemos cada estudio y determinamos su estado en la ruta lineal
  const studySteps = studies
    .filter(s => s.id !== 'final-results') // Excluimos el paso de resultados final por ahora
    .map((study, index) => ({
      id: study.id,
      label: study.name,
      // Status en la ruta lineal
      status: index < currentActiveIndex ? 'completed' : (index === currentActiveIndex ? 'current' : 'pending'),
      description: `Procedimiento en área de ${study.name}.`
    }));

  // 3. Consolidamos una 'Entrega de Resultados' global para el final
  const finalResultsStudy = studies.find(s => s.id === 'final-results');
  const resultsStep = {
    id: 'results-global',
    label: 'Entrega de Resultados',
    status: finalResultsStudy ? finalResultsStudy.steps[0].status : 'pending',
    description: 'Recoja sus resultados consolidados.'
  };

  // Combinamos todo en una sola ruta plana y lineal
  const flatSteps = [registroStep, ...studySteps, resultsStep];

  return (
    <div className="single-path-tracker card glass-panel animate-fade-in">
      <div className="tracker-header">
        <span className="icon">📋</span>
        <h3>Tu Ruta de Salud</h3>
      </div>
      
      <div className="timeline">
        {flatSteps.map((step, index) => (
          <div key={step.id} className={`timeline-item ${step.status}`}>
            <div className="timeline-left">
              <div className={`status-node ${step.status}`}>
                {step.status === 'completed' && <span className="check-mark">✓</span>}
                {step.status === 'current' && <div className="pulse-inner"></div>}
              </div>
              {index < flatSteps.length - 1 && <div className="connector-line"></div>}
            </div>
            
            <div className="timeline-content">
              <p className="step-title">{step.label}</p>
              <p className="step-desc">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SinglePathTracker;