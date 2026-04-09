import { useState, useEffect } from 'react';
import { areas } from './mockData';
export const useCopilotEngine = (initialPatient = null) => {
  const [patient, setPatient] = useState(() => {
    const saved = localStorage.getItem('copilot_patient');
    return saved ? JSON.parse(saved) : initialPatient;
  });

  const [cloudUrl, setCloudUrlState] = useState(() => localStorage.getItem('copilot_cloud_url') || 'https://medpilot-ai-default-rtdb.firebaseio.com');
  const isCloudEnabled = !!cloudUrl;

  // Sincronizar el paciente local con localStorage en todo momento para evitar deslogueos al recargar
  useEffect(() => {
    if (patient) {
      localStorage.setItem('copilot_patient', JSON.stringify(patient));
    }
  }, [patient]);

  const setCloudUrl = (url) => {
    localStorage.setItem('copilot_cloud_url', url);
    setCloudUrlState(url);
  };

  const [clinicLoad, setClinicLoad] = useState('improving');
  const [allPatients, setAllPatients] = useState([]);

  // Fetch from cloud or use mocks
  useEffect(() => {
    if (!isCloudEnabled || !cloudUrl) {
      const names = ['Ana García', 'Roberto Solis', 'Elena Rivas', 'Carlos Slim', 'Marta Sánchez', 'Diego Luna'];
      const areasIds = ['lab', 'xray', 'optometry', 'ultrasound', 'recep'];
      const mocks = names.map((name, i) => ({
        id: `SD-${1000 + i}`,
        name,
        phone: `55-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
        email: `${name.split(' ')[0].toLowerCase()}@ejemplo.com`,
        appointmentTime: `10:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} AM`,
        currentArea: areasIds[Math.floor(Math.random() * areasIds.length)],
        status: Math.random() > 0.5 ? 'waiting' : 'in-progress',
        isMock: true
      }));
      
      // If we have a local real patient, add it to the list too so we can see ourselves
      if (patient && patient.role === 'paciente') {
        const localP = {
          id: patient.patientId,
          name: patient.name,
          phone: patient.phone,
          email: `${patient.name.split(' ')[0].toLowerCase()}@ejemplo.com`,
          appointmentTime: patient.appointmentTime,
          currentArea: patient.studies && patient.studies.length > 0 ? patient.studies[0].steps.find(s => s.status === 'current' || s.status === 'pending')?.areaId || 'recep' : 'recep',
          status: 'waiting',
          isMock: false
        };
        setAllPatients([localP, ...mocks]);
      } else {
        setAllPatients(mocks);
      }
      return;
    }

    const pollCloud = async () => {
      try {
        const res = await fetch(`${cloudUrl}/patients.json`);
        const data = await res.json();
        if (data) {
          const list = Object.keys(data).map(key => data[key]);
          setAllPatients(list);
          
          if (patient && patient.role === 'paciente' && patient.patientId) {
            const meInCloud = data[patient.patientId];
            // Si el médico nos avanzó en la nube, sincronizamos nuestro estado local hacia adelante
            if (meInCloud && meInCloud.fullState && meInCloud.lastUpdate > (patient.lastSync || 0)) {
               setPatient(prev => ({ ...prev, ...meInCloud.fullState, lastSync: Date.now(), queuePosition: meInCloud.fullState.queuePosition || 0 }));
            }
          }
        } else {
          setAllPatients([]);
        }
      } catch (err) {
        console.error("Cloud fetch failed:", err);
      }
    };

    const interval = setInterval(pollCloud, 3000);
    pollCloud();
    return () => clearInterval(interval);
  }, [isCloudEnabled, cloudUrl, patient?.role, patient?.patientId, patient?.lastSync]);

  // Push local real patient to cloud ONLY initially or when we make an explicit action
  useEffect(() => {
    if (!isCloudEnabled || !cloudUrl || !patient || patient.role !== 'paciente' || !patient.patientId) return;

    // Solo empujamos si recién creamos el registro o no se ha sincronizado
    if (patient.lastSync) return;

    const pushData = async () => {
      try {
        const payload = {
          id: patient.patientId,
          name: patient.name,
          phone: patient.phone,
          appointmentTime: patient.appointmentTime || 'N/A',
          currentArea: patient.studies && patient.studies.length > 0 ? patient.studies[patient.activeStudyIndex || 0].steps.find(s => s.status === 'current' || s.status === 'pending')?.areaId || 'recep' : 'recep',
          status: 'waiting',
          studyNames: patient.studyNamesDisplay || 'Estudio Estándar',
          studiesList: patient.studies ? patient.studies.filter(s => s.id !== 'final-results').map(s => s.name) : [],
          lastUpdate: Date.now(),
          fullState: patient
        };
        await fetch(`${cloudUrl}/patients/${patient.patientId}.json`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        setPatient(prev => ({ ...prev, lastSync: Date.now() }));
      } catch (err) {
        console.error("Cloud push failed:", err);
      }
    };

    pushData();
  }, [patient, isCloudEnabled, cloudUrl]);

  const movePatient = (id, newArea) => {
    if (isCloudEnabled && cloudUrl) {
      // Optimiztic update local
      setAllPatients(prev => prev.map(p => p.id === id ? { ...p, currentArea: newArea } : p));
      fetch(`${cloudUrl}/patients/${id}.json`, {
        method: 'PATCH',
        body: JSON.stringify({ currentArea: newArea, lastUpdate: Date.now() })
      });
    } else {
      setAllPatients(prev => prev.map(p => p.id === id ? { ...p, currentArea: newArea } : p));
    }
  };

  const finishConsultation = (id) => {
    const targetPatient = allPatients.find(p => p.id === id);
    if (!targetPatient) return;

    let nextArea = 'results';
    let newStatus = 'completed';
    let newFullState = targetPatient.fullState ? JSON.parse(JSON.stringify(targetPatient.fullState)) : null;

    if (newFullState && newFullState.studies) {
      const activeIdx = newFullState.activeStudyIndex || 0;
      const studies = newFullState.studies;
      
      if (activeIdx < studies.length) {
        const steps = studies[activeIdx].steps;
        const curIdx = steps.findIndex(s => s.status === 'current' || s.status === 'pending');
        
        if (curIdx !== -1) {
          steps[curIdx].status = 'completed';
          
          if (curIdx < steps.length - 1) {
            steps[curIdx + 1].status = 'pending';
            nextArea = steps[curIdx + 1].areaId;
            newStatus = 'waiting';
          } else if (activeIdx < studies.length - 1) {
            newFullState.activeStudyIndex += 1;
            const nextStudySteps = studies[newFullState.activeStudyIndex].steps;
            const nextStep = nextStudySteps.find(s => s.status === 'pending') || nextStudySteps[1] || nextStudySteps[0];
            if (nextStep) nextStep.status = 'pending';
            nextArea = nextStep ? nextStep.areaId : 'results';
            newStatus = 'waiting';
            newFullState.queuePosition = Math.floor(Math.random() * 3) + 1; // Simulated queue for the next area
          }
        } else if (activeIdx < studies.length - 1) {
          newFullState.activeStudyIndex += 1;
          const nStep = studies[newFullState.activeStudyIndex].steps[1] || studies[newFullState.activeStudyIndex].steps[0];
          nextArea = nStep.areaId;
          newStatus = 'waiting';
        }
      }
    }

    if (isCloudEnabled && cloudUrl) {
      const patchData = { status: newStatus, currentArea: nextArea, lastUpdate: Date.now() };
      if (newFullState) patchData.fullState = newFullState;
      
      setAllPatients(prev => prev.map(p => p.id === id ? { ...p, ...patchData } : p));
      fetch(`${cloudUrl}/patients/${id}.json`, {
        method: 'PATCH',
        body: JSON.stringify(patchData)
      });
    } else {
      setAllPatients(prev => prev.map(p => p.id === id ? { ...p, status: newStatus, currentArea: nextArea, fullState: newFullState || p.fullState } : p));
    }
  };

  const notifyNextPatient = (id) => {
    const targetPatient = allPatients.find(p => p.id === id);
    if (!targetPatient || !targetPatient.phone) {
      alert("El paciente no tiene un número de teléfono registrado.");
      return;
    }
    
    // Limpiar caracteres no numéricos del teléfono
    let phoneNum = targetPatient.phone.replace(/\D/g, '');
    // Asumir lada de México si tiene 10 dígitos
    if (phoneNum.length === 10) phoneNum = '52' + phoneNum;

    // Obtener nombre real del área
    const areaName = areas.find(a => a.id === targetPatient.currentArea)?.name || 'Consulta';

    const message = `Hola ${targetPatient.name || 'Paciente'}, es tu turno en Salud Digna. Por favor pasa a tu área asignada (${areaName}). ¡Te esperamos!`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNum}&text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  useEffect(() => {
    // Si estamos en la nube, el control del tiempo y avance lo tiene 100% el médico y Firebase.
    if (!patient || !patient.studies || isCloudEnabled) return;

    const interval = setInterval(() => {
      setPatient(prev => {
        if (!prev) return prev;
        const now = Date.now();

        // 1. Si no hay un tiempo de fin para el paso actual, lo creamos (10-15 min)
        if (!prev.currentStepEndAt) {
          const randomMin = Math.floor(Math.random() * (15 - 10 + 1)) + 10;
          prev.currentStepEndAt = now + (randomMin * 60 * 1000);
        }

        // 2. ¿Se cumplió el tiempo del paso actual?
        if (now >= prev.currentStepEndAt) {
          let updated = JSON.parse(JSON.stringify(prev));
          
          if (updated.queuePosition > 0) {
            updated.queuePosition -= 1;
            if (updated.queuePosition === 0) {
              const activeIdx = updated.activeStudyIndex || 0;
              const study = updated.studies[activeIdx];
              const step = study.id === 'final-results' ? study.steps[0] : study.steps[1];
              if (step) step.status = 'current';
            }
          } else {
            const activeIdx = updated.activeStudyIndex || 0;
            const steps = updated.studies[activeIdx].steps;
            const curIdx = steps.findIndex(s => s.status === 'current');

            if (curIdx !== -1) {
              steps[curIdx].status = 'completed';
              if (curIdx < steps.length - 1) {
                steps[curIdx + 1].status = 'current';
              } else if (activeIdx < updated.studies.length - 1) {
                updated.activeStudyIndex += 1;
                updated.queuePosition = Math.floor(Math.random() * 5) + 1;
              }
            }
          }

          const nextMin = Math.floor(Math.random() * (15 - 10 + 1)) + 10;
          updated.currentStepEndAt = Date.now() + (nextMin * 60 * 1000);
          
          localStorage.setItem('copilot_patient', JSON.stringify(updated));
          return updated;
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [patient?.patientId, isCloudEnabled]);

  return { 
    patient, 
    setPatient, 
    allPatients, 
    clinicLoad, 
    movePatient,
    finishConsultation,
    notifyNextPatient,
    setCloudUrl,
    isCloudEnabled,
    logout: () => { 
      setPatient(null); 
      localStorage.removeItem('copilot_patient'); 
    }
  };
};