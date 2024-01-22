import React, { useState } from "react";
import axios from "axios";
import './Pages/CSS/estilos.css'; 
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function App() {
  const [dni, setDni] = useState("");
  const [rol, setRol] = useState("");
  const [clave, setClave] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isAuthenticate, setIsAuthenticate] = useState(false);
  const navigate = useNavigate();

  const obtenerDatos = async () => {
    try {
      const respuesta = await axios.get(
        `http://190.117.85.58:5005/pi124_M_MAES_SEREN_LOGIN/${dni}/${clave}`
      );
      setIsAuthenticate(true);
      navigate("/Principal");
      const rol = respuesta.data.SERE_chRol;
      const nombre = respuesta.data.SERE_chNOM;
      const apellidopat = respuesta.data.SERE_chAPEPAT;
      const apellidomat = respuesta.data.SERE_chAPEMAT;
      const dnilogin = respuesta.data.SERE_P_chDNI;

      setRol(rol);
      Cookies.set("rol", rol);
      Cookies.set("nombre", nombre);
      Cookies.set("apellidopat", apellidopat);
      Cookies.set("apellidomat", apellidomat);
      Cookies.set("dnilogin", dnilogin);

    } catch (error) {
      console.error("Error al obtener los datos:", error);
      setErrorMessage("!Los datos ingresados son incorrectos");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    obtenerDatos();
  };

  return (
    <div className="global">
      <header>
        <img src={require("./componentes/logoerlan.png")} className="logoerlan"/>
        <img src={require("./componentes/slogan.png")} className="sloganerlan"/>

      </header>
      {errorMessage &&        <div className="error-message2">
        {errorMessage}</div>}
        <div className="card">

        <form onSubmit={handleSubmit}  class="form card">
          <div class="card_header">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path fill="currentColor" d="M4 15h2v5h12V4H6v5H4V3a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6zm6-4V8l5 4-5 4v-3H2v-2h8z"></path>
            </svg>
            <h1 class="form_heading">Inicio de Sesión</h1>
          </div>
          <div class="field">
          <label className="label">
            DNI:
          </label>
          <input
            className="input"
              type="text"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
            />
          </div>
          <div class="field">
          <label className="label">
            Clave:
          </label>
          <input
              className="input"
              type="password"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
            />
          </div>
          <div class="field">
            <button type="submit" className="botonlogin">Ingresar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;