import React, { useState } from 'react';
import { areas } from '../mockData';
import './BookingView.css';

const BookingView = ({ onConfirm, t }) => {
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');

  // Fallback t function if not provided
  const translate = (key) => typeof t === 'function' ? t(key) : key;
  
  const availableTimes = [
    '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', 
    '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'
  ];

  const handleAreaClick = (area) => {
    console.log('Selected Area:', area);
    setSelectedArea(area);
  };

  const handleConfirm = () => {
    if (selectedArea && selectedTime && onConfirm) {
      onConfirm({
        areaId: selectedArea.id,
        areaName: selectedArea.name,
        time: selectedTime,
        price: selectedArea.price
      });
    }
  };

  const bookingAreas = (areas || []).filter(a => (a.price || 0) > 0);

  return (
    <div className="booking-container animate-fade-in">
      <div className="glass-panel booking-card">
        <h2>🏥 {translate('scheduleAppointment')}</h2>
        <p className="booking-subtitle">{translate('selectArea')}</p>

        <div className="booking-section">
          <h3>{translate('chooseArea')}</h3>
          <div className="area-grid">
            {bookingAreas.map(area => (
              <div 
                key={area.id} 
                className={`area-item ${selectedArea && selectedArea.id === area.id ? 'active' : ''}`}
                onClick={() => handleAreaClick(area)}
                role="button"
                tabIndex="0"
              >
                <div className="area-info">
                  <span className="area-name">{area.name}</span>
                  <span className="area-price">${area.price} MXN</span>
                </div>
                {selectedArea && selectedArea.id === area.id && <div className="selected-badge">✓</div>}
              </div>
            ))}
          </div>
        </div>

        {selectedArea && (
          <div className="booking-section animate-fade-in">
            <h3>{translate('chooseTime')}</h3>
            <div className="time-grid">
              {availableTimes.map(time => (
                <button 
                  key={time}
                  className={`time-chip ${selectedTime === time ? 'active' : ''}`}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="booking-footer">
          {selectedArea && selectedTime && (
            <div className="summary-info">
              <span>Total: <strong>${selectedArea.price} MXN</strong></span>
              <span>Horario: <strong>{selectedTime}</strong></span>
            </div>
          )}
          <button 
            className="primary-btn full-width"
            disabled={!selectedArea || !selectedTime}
            onClick={handleConfirm}
          >
            {translate('confirmBooking')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingView;
