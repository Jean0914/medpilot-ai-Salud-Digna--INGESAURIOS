export const areas = [
  { id: 'recep', name: 'Recepción', capacity: 10, baseTime: 5, price: 0 },
  { id: 'lab', name: 'Laboratorio Clínico', capacity: 8, baseTime: 20, price: 450 },
  { id: 'xray', name: 'Rayos X', capacity: 4, baseTime: 30, price: 850 },
  { id: 'ultrasound', name: 'Ultrasonido', capacity: 5, baseTime: 25, price: 1200 },
  { id: 'optometry', name: 'Optometría', capacity: 4, baseTime: 15, price: 300 },
  { id: 'ecg', name: 'Electrocardiograma', capacity: 3, baseTime: 20, price: 500 },
  { id: 'ct', name: 'Tomografía CT', capacity: 2, baseTime: 40, price: 2500 },
  { id: 'nutrition', name: 'Nutrición', capacity: 4, baseTime: 30, price: 60 },
  { id: 'gynecology', name: 'Ginecología', capacity: 3, baseTime: 25, price: 850 },
  { id: 'vaccination', name: 'Vacunación', capacity: 6, baseTime: 10, price: 500 },
  { id: 'results', name: 'Entrega de Resultados', capacity: 15, baseTime: 10, price: 0 }
];

export const initialSteps = [
  { 
    id: 1, 
    areaId: 'recep',
    title: 'Registro Inicial', 
    status: 'completed', 
    estimatedWaitTime: 0,
    description: 'Verificación de datos y confirmación de cita.'
  },
  { 
    id: 2, 
    areaId: 'lab',
    title: 'Toma de Muestras', 
    status: 'current', 
    estimatedWaitTime: 15,
    description: 'Proceso de extracción sanguínea para análisis.'
  },
  { 
    id: 3, 
    areaId: 'xray',
    title: 'Imagenología', 
    status: 'pending', 
    estimatedWaitTime: 25,
    description: 'Toma de placas de Rayos X solicitadas.'
  },
  { 
    id: 4, 
    areaId: 'results',
    title: 'Resultados Digitales', 
    status: 'pending', 
    estimatedWaitTime: 10,
    description: 'Entrega de diagnósticos y consulta digital.'
  }
];

// Estructura mejorada para soportar múltiples estudios
export const createStudyFromSteps = (studyId, studyName, stepsList) => ({
  id: studyId,
  name: studyName,
  status: 'in-progress',
  steps: stepsList,
  createdAt: new Date().toISOString()
});

export const mockStudies = [
  createStudyFromSteps('study-1', 'Análisis de Sangre', initialSteps)
];

export const studyCatalog = [
  { id: 'study-1', name: 'Análisis de Sangre Completo', type: 'lab', price: '$450 MXN' },
  { id: 'study-2', name: 'Rayos X de Tórax', type: 'xray', price: '$850 MXN' },
  { id: 'study-3', name: 'Ultrasonido Abdominal', type: 'ultrasound', price: '$1200 MXN' },
  { id: 'study-4', name: 'Examen Oftalmológico', type: 'optometry', price: '$300 MXN' },
  { id: 'study-5', name: 'Electrocardiograma', type: 'ecg', price: '$500 MXN' },
  { id: 'study-6', name: 'Tomografía CT', type: 'ct', price: '$2500 MXN' },
  { id: 'study-7', name: 'Consulta Nutricional', type: 'nutrition', price: '$60 MXN' },
  { id: 'study-8', name: 'Papanicolaou', type: 'gynecology', price: '$850 MXN' },
  { id: 'study-9', name: 'Covid-19', type: 'vaccination', price: '$500 MXN' }
];

export const availableClinics = [
  { id: 'clinic-1', name: 'Centro Médico Downtown', address: 'Calle Principal 123, Centro' },
  { id: 'clinic-2', name: 'Clínica Zona Rosa', address: 'Avenida Paseo 456, Zona Rosa' },
  { id: 'clinic-3', name: 'Consultorio Médico San Ángel', address: 'Boulevard Cerrada 789, San Ángel' },
  { id: 'clinic-4', name: 'Clínica del Norte', address: 'Avenida Tecnológico 321, Polanco' }
];

export const availableTimeSlots = [
  '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM',
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM', '05:00 PM'
];

export const mockStaffSuggestions = [
  {
    id: 'sug-1',
    type: 'warning',
    priority: 'high',
    title: 'Congestión en Laboratorio',
    description: 'Se detecta un incremento inusual de pacientes. Se sugiere reasignar personal.',
    actionPending: true
  },
  {
    id: 'sug-2',
    type: 'success',
    priority: 'low',
    title: 'Flujo Optimizado',
    description: 'El área de Rayos X tiene capacidad libre activa.',
    actionPending: false
  }
];
