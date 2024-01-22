import React, { useState } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { useEffect } from "react";
import moment from "moment";


function Registroasistencia() {
  const [datos, setDatos] = useState(null);
  const [documento, setDocumento] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showModalTabla, setShowModalTabla] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [nombreSereno, setNombreSereno] = useState("");
  const [fechaConsulta, setFechaConsulta] = useState("");
  const [horaConsulta, setHoraConsulta] = useState("");
  const [asistencias, setAsistencias] = useState([]);
  const nombre = Cookies.get("nombre")
  const apellidopat = Cookies.get("apellidopat")
  const apellidomat = Cookies.get("apellidomat")
  const [horaActual, setHoraActual] = useState("");
  const [funcion, setFuncion] = useState("");
  const [tregistro, settRegistro]= useState("")
  const [desact, setDesact]= useState("")

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
    setErrorMessage(""); 
  };
  const handleShow = () => setShowModal(true);
  const handleShowTabla = () => setShowModalTabla(true);
  const handleFuncionChange = (e) => {
    setFuncion(e.target.value);
  };
  const handletregistroChange = (e) => {
    settRegistro(e.target.value);
  };
  const obtenerDatos = async () => {
    try {
      const respuesta = await axios.get(`http://190.117.85.58:5005/pi121_M_MAES_SEREN_DNIQR/${documento}/1`);
      setDatos(respuesta.data);
      setErrorMessage('!Se encontró la placa¡');
      handleShow();
      const dni = respuesta.data.SERE_P_chDNI;
      const horaActual = new Date();
      const fechaActual = new Date();
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
      setErrorMessage('!La persona no se encuentra registrada¡');
    }
  };
  const registrarAsistencia= async (tipoAsistencia) =>  {
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
        asis_chentsal: tipoAsistencia,
        asis_choapp: "appwebasis",
        asis_chfun: funcion, 
        asis_chtipreg: tregistro, 
        asis_chdesact: desact, 

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
    } catch (error) {
      console.error('Error al registrar la asistencia:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al registrar la asistencia',
        text: 'El usuarió ya registró su asistencia Hoy.',
      });
    }
  };
  const obtenerDatosporDNI = async () => {
    try {
      const respuesta = await axios.get(`http://190.117.85.58:5005/pi011_asis_sereno_dni/${documento}/`);
      setAsistencias(respuesta.data);
      handleShowTabla();
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };
  useEffect(() => {
    const updateHoraActual = () => {
      const currentHora = new Date().toLocaleTimeString();
      setHoraActual(currentHora);
    };

    const intervalId = setInterval(updateHoraActual, 1000);

    return () => clearInterval(intervalId);
  }, []); 
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
  useEffect(() => {
    const rol = Cookies.get('rol');
    const dnilogin = Cookies.get('dnilogin');

    if (rol === '5') {
      document.getElementById('verasistenciabtn').style.display = 'none';
      setDocumento(dnilogin);

    } else{
      
    }

  }, []);
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
      <h3 className="horaactual">{horaActual}</h3>
      <h3 className="datos-usuario">{nombre} {apellidopat} {apellidomat}</h3>
      <h1 className="tituloregistro">Registro de Asistencia</h1>

          {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}
      <div className="input-container">
        <label htmlFor="placaInput">Ingrese Documento/Codigo: </label>
        <input
          type="text"
          id="placaInput"
          value={documento}
          onChange={(e) => setDocumento(e.target.value)}
        />
      </div>

      <Modal show={showModal} onHide={handleClose} className="custom-modal" size={'lg'} centered>
        <Modal.Header className="header">
            <h2 className="titulodatos">Datos de la Persona</h2>       
        </Modal.Header>
        {funcion ? <span className="funcionseleccionada">`Seleccionaste la Funcion {funcion}`</span>:<span className="funcionnoseleccionada">!Debes seleccionar una función para poder marcar su asistencia¡</span>}

        <Modal.Body className="datos">
          {datos && (
            <div>
              <p>Nombres: {datos.SERE_chNOM} {datos.SERE_chAPEPAT} {datos.SERE_chAPEMAT}</p>
              <p>DNI: {datos.SERE_P_chDNI}</p>
              <p> Funcion <select
              className="selectfuncion"
              name="SERE_chRol"
              value={funcion}
              onChange={handleFuncionChange} 
            >
                <option value="" disabled selected>Selecciona una función</option>
                <option value="01-Radio Operador">Radio Operador</option>
                <option value="02-Operador de Camara">Operador de Camara</option>
                <option value="03-Telefonista">Telefonista</option>
                <option value="04-Operador de GPS">Operador de GPS</option>
                <option value="05-Supervisor">Supervisor</option>
                </select>
              </p>
              <p> Tipo de Registro <select
              className="selectfuncion"
              value={tregistro}
              onChange={handletregistroChange} 

            >
                <option value="" disabled selected>Selecciona el tipo de registro</option>
                <option value="Asis">Asistencia</option>
                <option value="Acti">Actividad</option>
                </select>
              </p>
              { tregistro==="Acti" ?
              <textarea  cols="100"
              value={desact}
              onChange={(e) => setDesact(e.target.value)}></textarea> 
              :
              ""               }  
              <div className="datosfechayhora">
              <p >Fecha: <strong className="fechayhora"> {fechaConsulta}</strong></p>
              <p >Hora: <strong className="fechayhora">{horaConsulta}</strong></p>
              </div>

              <div className="botonesmodal">
           
              <Button className="botoncerrar" onClick={handleClose}>
              Cerrar
            </Button>
            <Button
              className="botonentrada"
              onClick={() => {
                registrarAsistencia("E");
              }}
              disabled={!funcion}
            >
              Registrar Entrada
            </Button>
            <Button
              className="botonsalida"
              onClick={() => {
                registrarAsistencia("S");
              }}
              disabled={!funcion}

            >
              Registrar Salida
            </Button>
              </div>
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
                  <th>DNI</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Tipo Registro</th>
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
                    <td>{asistencia.asis_chtipreg === 'Asis' ? 'Asistencia' :asistencia.asis_chtipreg === 'Acti' ?'Actividad':""}</td>
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
      <button className="obtener-datos-btn" onClick={obtenerDatos}>Registrar Asistencia</button>
      <button className="obtener-datos-btn" id="verasistenciabtn" onClick={obtenerDatosporDNI}>Ver Asistencias</button>

    </div>

</div>

  );
}

export default Registroasistencia;