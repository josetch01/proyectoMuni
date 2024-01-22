import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

function SubirImagen() {
    const [imagen, setImagen] = useState(null);
    const [imagenPreview, setImagenPreview] = useState(null);
    const [imagenes, setImagenes] = useState([]);
    const [imagenSeleccionada, setImagenSeleccionada] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const navigate = useNavigate()

    useEffect(() => {
      obtenerDatos();
    }, []); 

  
    const handleDownload = async (imageId, imageName) => {
      try {
        const response = await axios.get(`http://190.117.85.58:5005/download-filemssql/${imageId}`, {
          responseType: 'blob',
        });
    
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', imageName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error al descargar la imagen:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error al descargar imagen',
          text: 'No se pudo descargar la imagen',
        });
      }
    };
    const handlePreview = (imageId) => {
      try {
        const imageUrl = `http://190.117.85.58:5005/download-filemssql/${imageId}`;
        console.log('URL de previsualización:', imageUrl); 
        setImagenSeleccionada(imageUrl);
        setModalVisible(true);
      } catch (error) {
        console.error('Error al previsualizar la imagen:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error al previsualizar imagen',
          text: 'No se pudo previsualizar la imagen',
        });
      }
    };
    const obtenerDatos = async () => {
      try {
        const respuesta = await axios.get(`http://190.117.85.58:5005/listar_filemssql/?limit=1000`);
        setImagenes(respuesta.data);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };
  
    const handleFileChange = (event) => {
      const selectedImagen = event.target.files[0];
      setImagen(selectedImagen);
  
      const imagenPreviewUrl = URL.createObjectURL(selectedImagen);
      setImagenPreview(imagenPreviewUrl);
    };
  
    const handleUpload = async (event) => {
      event.preventDefault();
  
      try {
        const formData = new FormData();
        formData.append('file', imagen);
        setModalVisible(false);
        const response = await axios.post('http://190.117.85.58:5005/upload-filemssql/', formData);
  
        console.log('Respuesta de la API:', response);
  
        if (response.status >= 200 && response.status < 300) {
          console.log('Archivo subido correctamente');
          Swal.fire({
            icon: 'success',
            title: 'Subida Exitosa',
            text: 'La imagen se subió correctamente.',
          }).then(() => {
            navigate('');
            obtenerDatos(); 
          });
        } else {
          console.log('Fallo en la subida del archivo');
          Swal.fire({
            icon: 'error',
            title: 'Error al registrar imagen',
            text: 'No se pudo subir la imagen',
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
    const customStyles = {
      content: {
        maxWidth: '80%',
        maxHeight: '80%',
        margin: 'auto',
        transform: 'translate(-50%, -50%)',
        top: '50%', 
        left: '50%'
      },
    };
    const modalImageStyle = {
      maxWidth: '100%',
      maxHeight: '100%',
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

      <h2>Subir Imagen</h2>
      <form onSubmit={handleUpload}>
        {imagenPreview && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: '1px solid #000',
              padding: '5px',
            }}
          >
            <img
              src={imagenPreview}
              alt="Vista previa"
              style={{
                maxWidth: '100%',
                maxHeight: '200px',
              }}
            />
          </div>
        )}

        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit" disabled={!imagen}>
          Subir Imagen
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
            {imagenes.map((imagen, index) => (
              <tr key={index}>
                <td>{imagen.Id}</td>
                <td>{imagen.Nombre}</td>
                <td>
                 <button onClick={() => handleDownload(imagen.Id, imagen.Nombre)}>Descargar</button>
                 <button onClick={() => handlePreview(imagen.Id)}>Previsualizar</button>

                </td>

              </tr>
            ))}
          </tbody>
            </table>
          </div>
          {modalVisible && (
      <Modal
        isOpen={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        style={customStyles}
        contentLabel="Previsualización"
      >
        <div>
        <img
      src={imagenSeleccionada}
      alt="Previsualización"
      style={modalImageStyle}
    />
        </div>
      </Modal>
    )}
    </div>
  );
}

export default SubirImagen;