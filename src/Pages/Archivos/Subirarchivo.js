import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function Subirarchivo() {
  const [archivo, setArchivo] = useState(null);
  const [archivos, setArchivos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    obtenerDatos();
  }, []); 
  const handleFileChange = (event) => {
    setArchivo(event.target.files[0]);
  };
  const navigate = useNavigate();
  const obtenerDatos = async () => {
    try {
      const respuesta = await axios.get(`http://190.117.85.58:5005/listar_filemssql/?limit=1000`);
      setArchivos(respuesta.data);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  const handleUpload = async (event) => {
    event.preventDefault(); // Evitar el comportamiento predeterminado del formulario
  
    try {
      const formData = new FormData();
      formData.append('file', archivo);
  
      const response = await axios.post('http://190.117.85.58:5005/upload-filemssql/', formData);
  
      console.log('Respuesta de la API:', response);
  
      if (response.status >= 200 && response.status < 300) {
        console.log('Archivo subido correctamente');
        Swal.fire({
          icon: 'success',
          title: 'Subida Exitosa',
          text: 'El Archivo se subió correctamente.',
        }).then(() => {
          navigate("");
        });
      } else {
        console.log('Fallo en la subida del archivo');
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar archivo',
          text: 'No se pudo subir el archivo',
        });
      }
    } catch (error) {
      console.error('Error al subir el archivo:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al registrar archivo',
        text: 'No se pudo subir el archivo',
      });
    }
  };
  const verPdf = (idArchivo) => {
    const pdfUrl = `http://190.117.85.58:5005/download-filemssql/${idArchivo}`;
    setPdfUrl(pdfUrl);
    console.log(pdfUrl)
  };

  const limpiarPdf = () => {
    setPdfUrl(null);
  };

  return (
    <div>
    <header className='headerru'>
      <img src={require("../../componentes/logoerlan.png")} className="logoerlanru"/>
      <img src={require("../../componentes/slogan.png")} className="sloganerlanru"/>

    </header>
    <nav>
    <a className="atras" href="/principal"><i class="fa-solid fa-arrow-rotate-left"></i> Atras</a>
    <a className="salir"href="/"><i class="fa-solid fa-users-slash"></i> Cerrar Sesión</a>

    </nav>
    <div className='formulariousuario'>

      <h2>Subir Archivo</h2>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit" disabled={!archivo}>
          Subir Archivo
        </button>
      </form>

    </div>
    <div className="table-responsive overflow-auto text-center">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Nombre</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
            {archivos.map((archivo, index) => (
              <tr key={index}>
                <td>{archivo.Id}</td>
                <td>{archivo.Nombre}</td>
                <td>
                <button onClick={() => verPdf(archivo.Id)}>Descargar</button>

                </td>

              </tr>
            ))}
          </tbody>
            </table>
          </div>
          {pdfUrl && (
        <div>
          <button onClick={limpiarPdf}>Cerrar PDF</button>
          <embed src={pdfUrl} type="application/pdf" width="100%" height="600px" />
        </div>
      )}
    </div>
  );
}

export default Subirarchivo;