# MedPilot AI
### Un Proyecto de: **INGESAURIOS**

**Integrantes del Equipo:**
* Jean Carlos Chan Noh
* Eduardo Cabrera Rendon
* Rodrigo Criollo Castillo
* Leonardo Colli Arroyo
* Fernando Sabido Quijano

---

MedPilot AI es un sistema de gestión clínica inteligente en tiempo real, diseñado para optimizar el flujo de pacientes, la monitorización pasiva del personal clínico (Staff) y la asignación dinámica en consultorios médicos. El sistema cuenta con 3 portales interconectados impulsados por React y Firebase para crear una experiencia omnicanal ininterrumpida.

---

## Características Principales

*   **Sincronización en Tiempo Real:** Todos los dispositivos operan en sincronía a través de Firebase Realtime Database para enviar a los pacientes de un área médica a otra sin fricción.
*   **Recorridos Multi-Estudio:** Los pacientes pueden programar múltiples estudios consecutivos (ej. Laboratorio, Rayos X, Nutrición). La IA enruta automáticamente al paciente a su siguiente destino al ser liberado sin mandarlo a resultados prematuramente.
*   **Monitorización Pasiva (Staff):** Panel diseñado rigurosamente bajo el principio de "cero clics" que permite al equipo directivo o enfermeros observar dónde están todos los pacientes y la saturación clínica al segundo sin tocar botones.
*   **Notificaciones WhatsApp Nativas:** API de Click-To-Chat de WhatsApp que inyecta automáticamente el destino clínico del paciente y su número de teléfono real.
*   **Cero Desfases (Prevención Split-Brain):** Sincronización continua en la nube que da autoridad absoluta a los médicos y protege la base de datos contra cachés agresivos y tiempos desfasados en los celulares de los usuarios.

---

## Tecnologías Empleadas

*   **Frontend:** React.js, Vite
*   **Gestión de Estados:** React Hooks avanzados (`useState`, `useEffect`) y `localStorage` para hidratación pre-despliegue y protección anti-deslogueos.
*   **Backend (Base de Datos):** Firebase Realtime Database (Operando vía API REST).
*   **Despliegues en Vivo:** Nodos locales usando `npx serve` montados en túneles reescribibles SSH (`Serveo`/`Ngrok`).

---

## Roles del Sistema

El sistema categoriza tres perfiles principales al momento de iniciar sesión:

1.  **Paciente:** Panel gráfico de fácil lectura con temporizador biológico. Muestra cuántos turnos faltan para entrar a su siguiente estudio, un mapa ilustrado, y levanta pop-ups en su teléfono de forma interactiva en cuanto un doctor los llama.
2.  **Médico:** Listado de pacientes enfilados para su especialidad exacta (`lab`, `ultrasound`, etc.). Al oprimir **"Finalizar"**, deciden el futuro del paciente en el sistema y pueden emitir la alerta de WhatsApp.
3.  **Staff:** Una vista gerencial de lectura pasiva. Proporciona índices de congestión basados en la suma de pacientes activos por departamento clínico.

---

## Cómo Iniciar el Proyecto Localmente

Para iniciar labores de desarrollo o despliegues de la aplicación:

### 1. Clonar e Instalar Dependencias
```bash
# Asumiendo que ya tienes clonado el proyecto
cd nodal-telescope
npm install
```

### 2. Levantar el Entorno de Desarrollo (Modo Pruebas)
Para hacer ediciones y ver cambios al instante:
```bash
npm run dev
```
*(Esto abrirá el módulo en `http://localhost:5173`)*

### 3. Crear el Ejecutable de Producción (Obligatorio para túneles)
Cuando hayas finalizado las ediciones del código o se reestablezca un componente vital, siempre empaca el código:
```bash
npm run build
```
La carpeta cruda estará dentro de `dist/`.

### 4. Lanzamiento al Mundo Exterior (Crear un Túnel Público)
Para poder usar la plataforma desde tu teléfono y la laptop médica al mismo tiempo, necesitas desplegar el servidor local a un entorno global.

1.  **Hospeda tus archivos locales:**
    Abre una Terminal (PowerShell o CMD) en el directorio del proyecto y ejecuta:
    ```bash
    npx serve -s dist
    ```
    *(Normalmente alojará en el puerto `3000`)*

2.  **Genera el puente público:**
    Abre **otra** ventana del Terminal simultáneamente e inyecta este comando si usas Serveo:
    ```bash
    ssh -R 80:localhost:3000 -o ServerAliveInterval=60 -o StrictHostKeyChecking=no serveo.net
    ```
    La terminal te otorgará un enlace que termina en `.serveousercontent.com`. ¡Distribúyelo!

---

## Herramientas de Mantenimiento

*   **Reinicio Total de Pacientes (Purga Inmediata):** 
    Si durante el ensayo los datos del Firebase se corrompen, están atascados en memoria de red, o deseas borrar todos los registros con un solo clic, lanza el siguiente comando en tu Powershell:
    ```powershell
    Invoke-RestMethod -Uri "https://medpilot-ai-default-rtdb.firebaseio.com/patients.json" -Method Delete
    ```

*   **Evitar Choques de Identidad:** 
    Es fuertemente recomendable separar roles durante pruebas usando ventanas de **Navegación Privada/Incógnito**. Si pruebas el Médico y el Paciente al mismo tiempo en el mismo navegador, `localStorage` colisionará.