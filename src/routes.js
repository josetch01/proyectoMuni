import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import Registroasistencia from './Pages/Asistencia/Registroasistencia';
import RegistroaQr from './Pages/Asistencia/RegistroaQr';
import Principal from './Pages/Asistencia/Principal';
import Registroentrada from './Pages/Placas/Registroentrada';
import Subirarchivo from './Pages/Archivos/Subirarchivo';
import SubirImagen from './Pages/Archivos/SubirImagen';
import PersonalSeguridad from './Pages/Personalseguridad/PersonalSeguridad';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/principal" element={<Principal />} />
      <Route path="/placa-registro" element={<Registroentrada />} />
      <Route path="/asistencia-dni" element={<Registroasistencia />} />
      <Route path="/asistencia-qr" element={<RegistroaQr />} />
      <Route path="/subirarchivo" element={<Subirarchivo />} />
      <Route path="/subirimagen" element={<SubirImagen />} />
      <Route path="/personalseguridad" element={<PersonalSeguridad />} />

    </Routes>
  );
}

function AppContainer() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export { AppContainer as Routes };