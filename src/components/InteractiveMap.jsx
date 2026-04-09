import React from 'react';
import './InteractiveMap.css';

const InteractiveMap = ({ studies = [] }) => {
  const nodes = [{ id: 'recep', label: 'Recepción', status: 'completed' }];
  
  // 1. Agregamos los estudios médicos intermedios
  studies.forEach(study => {
    study.steps.forEach(step => {
      if (step.areaId !== 'recep' && step.areaId !== 'results') {
        nodes.push({ 
          id: step.id, 
          label: study.name, 
          status: step.status 
        });
      }
    });
  });

  // 2. BUSCAMOS EL ESTUDIO DE RESULTADOS REAL
  // En lugar de inventar el estado, buscamos el que ya trae el motor (current, pending o completed)
  const resultsStudy = studies.find(s => s.id === 'final-results' || s.type === 'results');
  const resultsStatus = resultsStudy ? resultsStudy.steps[0].status : 'pending';

  nodes.push({ 
    id: 'results', 
    label: 'Resultados', 
    status: resultsStatus 
  });

  return (
    <div className="interactive-map-container">
      <h3>📍 Tu Ruta de Atención</h3>
      <div className="map-wrapper">
        <svg viewBox="0 0 750 200" className="clinic-svg">
          {nodes.map((node, i) => {
            const x = 80 + (590 / (nodes.length - 1)) * i;
            const y = 60;
            const isCurrent = node.status === 'current';
            
            const words = node.label.split(' ');
            const hasManyWords = words.length > 1 && node.label.length > 8;

            return (
              <g key={node.id}>
                {i < nodes.length - 1 && (
                  <line x1={x} y1={y} x2={80 + (590 / (nodes.length - 1)) * (i+1)} y2={y} stroke="#e2e8f0" strokeWidth="4" />
                )}
                
                {isCurrent && (
                  <circle cx={x} cy={y} r="32" fill="none" stroke="#f97316" strokeWidth="2" className="ping-circle" />
                )}

                <circle 
                  cx={x} cy={y} r="25" 
                  fill={node.status === 'completed' ? '#22c55e' : isCurrent ? '#f97316' : '#d1d5db'} 
                />

                <text x={x} y={y + 5} textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
                  {node.status === 'completed' ? '✓' : isCurrent ? '⧗' : ''}
                </text>
                
                <text x={x} y={y + 58} textAnchor="middle" className="map-label-simple">
                  {hasManyWords ? (
                    <>
                      <tspan x={x} dy="0">{words.slice(0, Math.ceil(words.length/2)).join(' ')}</tspan>
                      <tspan x={x} dy="18">{words.slice(Math.ceil(words.length/2)).join(' ')}</tspan>
                    </>
                  ) : (
                    node.label
                  )}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="status-legend-compact">
        <div className="status-badge"><span className="status-circle" style={{background:'#d1d5db'}}></span><span>En Espera</span></div>
        <div className="status-badge"><span className="status-circle" style={{background:'#f97316'}}></span><span>En Proceso</span></div>
        <div className="status-badge"><span className="status-circle" style={{background:'#22c55e'}}></span><span>Finalizado</span></div>
      </div>
    </div>
  );
};

export default InteractiveMap;
