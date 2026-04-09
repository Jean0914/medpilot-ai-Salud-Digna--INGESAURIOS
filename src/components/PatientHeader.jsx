import React from 'react';

const PatientHeader = ({ name, id, appointmentTime, t }) => {
  return (
    <div className="patient-header">
      <div className="patient-info">
        <h2>{name}</h2>
        <p>Folio: {id} • {t('appointmentTime') || 'Turno'}: {appointmentTime}</p>
      </div>
      <div className="header-status-badge">
        {t('statusInProgress')}
      </div>
    </div>
  );
};

export default PatientHeader;
