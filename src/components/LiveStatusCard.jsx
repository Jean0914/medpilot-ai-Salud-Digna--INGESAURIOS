import React from 'react';

const LiveStatusCard = ({ step, studyName, queuePos }) => {
  if (!step) return null;

  return (
    <div className="card-status-progress glass-panel" style={{ padding: '30px' }}>
      <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '10px' }}>
        En Progreso
      </p>
      <h2 style={{ fontSize: '1.7rem', fontWeight: '800', margin: '0 0 8px 0', color: '#0f172a' }}>
        {queuePos > 0 ? `Esperando turno en ${studyName}` : `Atendiendo: ${studyName}`}
      </h2>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ color: '#94a3b8', fontSize: '1.2rem', fontWeight: '600' }}>16mins</span>
        <span style={{ color: '#cbd5e1', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase' }}>eta</span>
      </div>
      
      <p style={{ marginTop: '20px', color: '#475569', fontSize: '0.95rem' }}>
        {queuePos > 0 
          ? `Quedan exactamente ${queuePos} personas adelante en la fila de atención.` 
          : 'Es tu turno. Por favor, dirígete al consultorio indicado.'}
      </p>
    </div>
  );
};

export default LiveStatusCard;