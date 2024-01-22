import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import '../CSS/App.css';
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import moment from "moment";

function Registroentrada() {
  const [datos, setDatos] = useState(null);
  const [placa, setPlaca] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [key, setKey] = useState("22hODJ7K5mFYgFbTx7SPgJ54GdY6A0z3");
  const [fechaConsulta, setFechaConsulta] = useState("");
  const [horaConsulta, setHoraConsulta] = useState("");
  const [nombreplaca, setNombrePlaca] = useState("");
  const [apellidopaternoplaca, setApellidoPaternoPlaca] = useState("");
  const [apellidomaternoplaca, setApellidoMaternoPlaca] = useState("");
  const [asistencias, setAsistencias] = useState([]);
  const [showModalTabla, setShowModalTabla] = useState(false);
  const [ultimaAsistencia, setUltimaAsistencia] = useState("");
  //PAGINACION
  const [itemsPerPage, setItemsPerPage]= useState(5);
  const [itemsPerPageOptions] = useState([5, 10, 15, 'all']);
  const [currentPage, setCurrentPage]= useState(1);
  const totalProducts = datos ? datos.length : 0;
  const lastIndex = currentPage * itemsPerPage 
  const firstIndex = lastIndex - itemsPerPage

  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setItemsPerPage(selectedValue === 'all' ? totalProducts : parseInt(selectedValue, 10));
    setCurrentPage(1); 
  };
    // FIN DE PAGINACION
  const handleClose = () => {
    setShowModal(false);
    setShowModalTabla(false);
    setErrorMessage(""); // Limpiar el mensaje de error al cerrar el modal
  };
  const handleShow = (tipoAsistencia) => {
    setShowModal(true);
    const ultimaAsistenciaCookies = Cookies.get("ultimaAsistencia");
    setUltimaAsistencia(ultimaAsistenciaCookies);
  };
  const handleShowTabla = () => setShowModalTabla(true);

  const obtenerDatos = async () => {
    try {
      const respuesta = await axios.get(`http://190.117.85.58:5005/placas/${placa}/${key}`);
      setDatos(respuesta.data);
      setErrorMessage('!Se encontró la placa¡');

      handleShow();
      const nombres = respuesta.data.nombres;
      const apellidopaterno = respuesta.data.apellidopaterno;
      const apellidomaterno = respuesta.data.apellidomaterno;

      const fechaActual = new Date();
      const horaActual = new Date();
      setNombrePlaca(nombres);
      setApellidoPaternoPlaca(apellidopaterno);
      setApellidoMaternoPlaca(apellidomaterno);

      setPlaca(placa);

      const horaConsultaFormato = horaActual.toLocaleTimeString();
      const fechaConsultaFormato = fechaActual.toLocaleDateString().replace(/\//g, '');

      setFechaConsulta(fechaConsultaFormato);
      setHoraConsulta(horaConsultaFormato);
      Cookies.set("horaConsulta", horaConsultaFormato);
      Cookies.set("fechaConsulta", fechaConsultaFormato);
      Cookies.set("nombres", nombres);
      Cookies.set("apellidopaterno", apellidopaterno);
      Cookies.set("apellidomaterno", apellidomaterno);
      Cookies.set("placa", placa);


    } catch (error) {
      console.error('Error al obtener los datos:', error);
      setErrorMessage('!La placa no se encuentra registrada¡');
    }
  };
  const registrarAsistencia= async (tipoAsistencia) =>  {
    try {
      const placa = Cookies.get("placa");
      const horaGuardada = Cookies.get("horaConsulta");
      const fechaguardada = Cookies.get("fechaConsulta");

      if (!placa || !horaGuardada || !fechaguardada) {
        console.error('No hay datos guardados para registrar la asistencia.');
        return;
      }

      const datosAsistencia = {
        sere_p_chdni: placa,
        asis_chhor: horaGuardada,
        asis_chfec: fechaguardada,
        asis_chentsal: tipoAsistencia,
        asis_choapp: "appwebplacas",
      };

      const respuestaPost = await axios.post("http://190.117.85.58:5005/pi011_asis_sereno_entsal/", datosAsistencia);

      console.log('Respuesta de la API:', respuestaPost.data);
      Swal.fire({
        icon: tipoAsistencia === "E" ?"success": "warning",
        title:tipoAsistencia === "E" ? "Registro de Entrada":"Registro de Salida",
        text: tipoAsistencia === "E" ? "La entrada se registró correctamente." : "La salida se registró correctamente.",
      }).then(() => {
        window.location.reload();
      });
      Cookies.set("ultimaAsistencia", tipoAsistencia);

    } catch (error) {
      console.error('Error al registrar la asistencia:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al registrar la asistencia',
        text: 'El usuarió ya registró su asistencia Hoy.',
      });
    }
  };
  const calcularTiempoTranscurrido = (entrada, salida) => {
    if (entrada && salida) {
      const horaEntrada = moment(entrada.asis_chhor, 'HH:mm:ss');
      const horaSalida = moment(salida.asis_chhor, 'HH:mm:ss');
  
      const tiempoTranscurrido = moment.duration(horaSalida.diff(horaEntrada));
  
      return `${tiempoTranscurrido.minutes()}:${tiempoTranscurrido.seconds()}`;
    } else {
      return ''; 
    }
  };
  
  const obtenerDatosporDNI = async () => {
    try {
      const respuesta = await axios.get(`http://190.117.85.58:5005/pi011_asis_sereno_dni/${placa}/`);
      setAsistencias(respuesta.data);
      handleShowTabla();
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };
  return (
<div className="app"> 
    <header>
      <img src={require("../../componentes/logoerlan.png")} className="logoerlan"/>
      <img src={require("../../componentes/slogan.png")} className="sloganerlan"/>

    </header>
    <nav>
    <a className="atras" href="/principal"><i class="fa-solid fa-arrow-rotate-left"></i> Atras</a>
      <a className="salir"href="/"><i class="fa-solid fa-users-slash"></i> Cerrar Sesión</a>
    </nav>
    <div className="app-container"> 
      <h2 className="control">Control: PUERTA N° 01</h2>
      <h1 className="tituloregistro">REGISTRAR INGRESO</h1>

          {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}
      <div className="input-container">
        

        <label htmlFor="placaInput">N° de Placa: </label>
        <input
          type="text"
          id="placaInput"
          value={placa}
          onChange={(e) => setPlaca(e.target.value)}
        />
        
      </div>


      <Modal show={showModal} onHide={handleClose} className="custom-modal">
        <Modal.Header className="header">
            <h2 className="titulodatos">Datos del Propietario  </h2>       

        </Modal.Header>
        <Modal.Body className="datos">
          {datos && (
            <div>
              <p>Nombres: {datos.nombres}</p>
              <p>Apellido Paterno: {datos.apellidopaterno}</p>
              <p>Apellido Materno: {datos.apellidomaterno}</p>
              <p>Codigo QR: <strong className="strongqr"> {datos.codigo_qr} </strong></p>
              <p className="textplaca">Placa: <strong>{datos.placa}</strong> </p>
              <p>Fecha y Hora: {fechaConsulta} - {horaConsulta}</p>
              <Button variant="secondary" onClick={handleClose}>
              Cerrar
            </Button>
            <Button
              className="botonentrada"
              onClick={() => {
                registrarAsistencia("E");
                handleClose();
              }}
              disabled={ultimaAsistencia === "E"} 
            >
              Registrar Entrada
            </Button>
            <Button
              className="botonsalida"
              onClick={() => {
                registrarAsistencia("S");
                handleClose();
              }}
              disabled={ultimaAsistencia === "S"}
            >
              Registrar Salida
            </Button>

            </div>
            
          )}
        </Modal.Body>

      </Modal>
      <Modal show={showModalTabla} onHide={handleClose} dialogClassName="modal-lg">
        <Modal.Header className="header">
            <h2 className="titulodatos">Asistencias Registradas  </h2>       
            <button className="xcerrar" onClick={handleClose}>X</button>
        </Modal.Header>
        <Modal.Body className="tabladedatos">
        <div className="d-flex justify-content-start align-items-center mt-4 mb-4">
          <span className="me-2">Mostrar:</span>
          <select
            className="form-select form-select-sm"
            style={{  width: '80px' }} 

            value={itemsPerPage === totalProducts ? 'all' : itemsPerPage}
            onChange={handleItemsPerPageChange}
          >
            {itemsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
          <div className="table-responsive overflow-auto text-center">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Placa</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Tipo</th>
                  <th>Tiempo Transcurrido</th>
                </tr>
              </thead>
              <tbody>
                {asistencias.map((asistencia, index) => (
                  <tr key={index}>
                    <td>{asistencia.sere_p_chdni}</td>
                    <td>{asistencia.segu_chfeccre}</td>
                    <td>{asistencia.asis_chhor}</td>
                    <td style={{ backgroundColor: asistencia.asis_chentsal === 'E' ? 'rgb(73, 224, 73)' : 'rgb(242, 61, 61)' }}>
                      {asistencia.asis_chentsal === 'E' ? 'Entrada' : 'Salida'}
                    </td>                    
                    <td>
                      {calcularTiempoTranscurrido(asistencias[index - 1], asistencia) !== null
                        ? `${calcularTiempoTranscurrido(asistencias[index - 1], asistencia)} min`
                        : ''}
                    </td>
                  </tr>
                )).slice(firstIndex,lastIndex)}
              </tbody>
            </table>
          </div>
        </Modal.Body>

      </Modal>
      <button className="obtener-datos-btn" onClick={obtenerDatos}>Obtener Datos</button>
      <button className="obtener-datos-btn" onClick={obtenerDatosporDNI}>Ver Registro de placas</button>

    </div>
</div>
  );
}

export default Registroentrada;