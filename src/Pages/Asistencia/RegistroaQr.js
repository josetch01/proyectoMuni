import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap';
import { QrReader } from 'react-qr-reader';
import Swal from 'sweetalert2';
import '../CSS/App.css';

function RegistroaQr() {
  const [result, setResult] = useState('');
  const [datos, setDatos] = useState(null);
  const [codigo, setCodigo] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [nombreSereno, setNombreSereno] = useState("");
  const [fechaConsulta, setFechaConsulta] = useState("");
  const [horaConsulta, setHoraConsulta] = useState("");

  const codigocookie = Cookies.get("codigo");
  const codigoResultado = codigocookie ? codigocookie.replace("vic.qrs.pe?fun=", "") : "";

  const handleClose = () => {
    setShowModal(false);
    setErrorMessage(""); 
  };
  const handleShow = () => setShowModal(true);
  const obtenerDatos = async () => {
    try {
      const respuesta = await axios.get(`http://190.117.85.58:5005/M_MAES_SEREN/1/${codigoResultado}/`);
      setDatos(respuesta.data);
      setErrorMessage('!Se encontró los datos');
      handleShow();
      const dni = respuesta.data.SERE_P_chDNI;
      const fechaActual = new Date();
      const horaActual = new Date();
      const horaConsultaFormato = horaActual.toLocaleTimeString();
      const fechaConsultaFormato = fechaActual.toLocaleDateString().replace(/\//g, '');
      setNombreSereno(dni);
      setFechaConsulta(fechaConsultaFormato);
      setHoraConsulta(horaConsultaFormato);
      Cookies.set("horaConsulta", horaConsultaFormato);
      Cookies.set("fechaConsulta", fechaConsultaFormato);
      Cookies.set("dnisereno", dni);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
      setErrorMessage('!La placa no se encuentra registrada¡');
    }
  };
  const handleScan = (data) => {
    if (data) {
      console.log('Datos Escaneados:', data);
      setResult(data);
    }
  }
  const handleError = (err) => {
    console.error('Error al acceder a la cámara:', err);
  }
  const handleResult = (result) => {
    if (result) {
      console.log('Resultado del escaneo:', result);
      
      setResult(result);
      Cookies.set("codigo", result);
    }
  };
  const registrarAsistencia = async () => {
    try {
      const dni = Cookies.get("dnisereno");
      const horaGuardada = Cookies.get("horaConsulta");
      const fechaguardada = Cookies.get("fechaConsulta");

      if (!dni || !horaGuardada || !fechaguardada) {
        console.error('No hay datos guardados para registrar la asistencia.');
        return;
      }

      const datosAsistencia = {
        sere_p_chdni: dni,
        asis_chhor: horaGuardada,
        asis_chfec: fechaguardada,

      };

      const respuestaPost = await axios.post("http://190.117.85.58:5005/asis_sereno/", datosAsistencia);

      console.log('Respuesta de la API:', respuestaPost.data);
      Swal.fire({
        icon: 'success',
        title: 'Registro de asistencia',
        text: 'La asistencia se registró correctamente.',
      });
    } catch (error) {
      console.error('Error al registrar la asistencia:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al registrar la asistencia',
        text: 'El usuarió ya registró su asistencia Hoy.',
      });
    }
  };
  const qrReaderStyle = {
    width: '80%',
    objectFit: 'cover',
    borderRadius: '8px',
  };
  return (
    <div>
    <header>
      <img src={require("../../componentes/logoerlan.png")} className="logoerlan"/>
      <img src={require("../../componentes/slogan.png")} className="sloganerlan"/>

    </header>
    <nav>
    <a className="atras" href="/principal"><i class="fa-solid fa-arrow-rotate-left"></i> Atras</a>
    <a className="salir"href="/"><i class="fa-solid fa-users-slash"></i> Cerrar Sesión</a>

    </nav>
    <div style={{ width: '100%', maxWidth: '400px', margin: 'auto' }}>
    <QrReader
      delay={300}
      onError={handleError}
      onScan={handleScan}
      onResult={handleResult}  
      style={qrReaderStyle}
    />
        <div className="input-container">
        <label htmlFor="placaInput">N° de codigo: {codigoResultado}</label>
       
      </div>
      <Modal show={showModal} onHide={handleClose} className="custom-modal">
        <Modal.Header className="header">
            <h2 className="titulodatos">Datos del Sereno  </h2>       

        </Modal.Header>
        <Modal.Body className="datos">
          {datos && (
            <div>
              <p>Nombres: {datos.SERE_chNOM}</p>
              <p>Apellidos: {datos.SERE_chAPEPAT} {datos.SERE_chAPEMAT}</p>
              <p>Telefono: {datos.SERE_chTELEF}</p>
              <p>DNI: {datos.SERE_P_chDNI}</p>
              <div className="botonesmodal">
           
              <Button variant="secondary" onClick={handleClose}>
              Cerrar
            </Button>
            <Button variant="primary"  onClick={registrarAsistencia}>
              Registrar Asistencia
            </Button>
              </div>
            </div>
            
          )}
        </Modal.Body>

      </Modal>

      <button className="obtener-datos-btnqr" onClick={obtenerDatos}>Obtener Datos</button>
    </div>
    </div>
  )
}

export default RegistroaQr