import React, { useEffect, useRef, useState } from 'react';
import '../CSS/Principal.css';
import 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs5';
import axios from 'axios';
import { Button, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import FormUsuario from '../Usuario/FormUsuario';

function PersonalSeguridad(){
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [archivo, setArchivo] = useState(null);
  const [tipoarchivo, setTipoArchivo] = useState('img');
  const [clasearchivo, setClaseArchivo] = useState('');
  const dataTableRef = useRef(null);
  const [selectedDocumento, setSelectedDocumento] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [showFormUsuarioModal, setShowFormUsuarioModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editUserData, setEditUserData] = useState(null);
  const obtenerDatos = async () => {
    try {
      const respuesta = await axios.get(
        `http://190.117.85.58:5005/pi120_M_MAES_SEREN_LIST/?limit=1000`
      );
      setData(respuesta.data);
      console.log(respuesta.data);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };
  useEffect(() => {
    obtenerDatos();
  }, []);
  const handleChange = (event) => {
    const selectedValue = event.target.value;
    setClaseArchivo(selectedValue);
  };
  useEffect(() => {
    if (data.length > 0) {
      if ($.fn.DataTable.isDataTable('#example')) {
        dataTableRef.current.destroy();
      }
      dataTableRef.current = $('#example').DataTable({
        columnDefs: [
          { width: '10%', targets: 0 }, // Acciones
          { width: '10%', targets: 1 }, // Documento
          { width: '20%', targets: 2 }, // Nombres y Apellidos
          { width: '10%', targets: 3 }, // Nacimiento
          { width: '10%', targets: 4 }, // Sexo
          { width: '10%', targets: 5 }, // Ruc
        ],
      });
    }
    return () => {
      if ($.fn.DataTable.isDataTable('#example')) {
        dataTableRef.current.destroy();
      }
    };
  }, [data]);
  const handleModalOpen = (documento) => {
    setShowModal(true);
    setSelectedDocumento(documento);
    console.log(selectedDocumento)
    
  };
    const clearEditUserData = () => {
    setEditUserData(null);
    setIsEditMode(false);
  };
  const handleModalEditOpen = (documento) => {
    const userToEdit = data.find((user) => user.SERE_P_chDNI === documento);

    if (userToEdit) {
      setEditUserData(userToEdit);
      setIsEditMode(true);
    } else {
      setEditUserData(null);
      setIsEditMode(false);
    }

    setShowFormUsuarioModal(true);
  };


  const handleModalClose = () => {
    setShowModal(false);
  };
  const handleTipoArchivoChange = (tipo) => {
    setTipoArchivo(tipo);
  };
  const handleFileChange = (event) => {
    const selectedArchivo = event.target.files[0];
    setArchivo(selectedArchivo);
  
    if (selectedArchivo) {
      const imagenPreviewUrl = URL.createObjectURL(selectedArchivo);
      setImagenPreview(imagenPreviewUrl);
    } else {
      setImagenPreview(null);
    }
  };
  const handleUpload = async (event) => {
    event.preventDefault();
  
    try {
      const formData = new FormData();
      formData.append('file', archivo);
      console.log(archivo)
      const response = await axios.post(
        `http://190.117.85.58:5005/pi020-upload-archisql/${tipoarchivo}/${selectedDocumento}/${clasearchivo}`,
        formData
      );
  
      if (response.status >= 200 && response.status < 300) {
        console.log('Archivo subido correctamente');
        Swal.fire({
          icon: 'success',
          title: 'Subida Exitosa',
          text: 'La imagen se subió correctamente.',
        }).then(() => {
          setShowModal(false); 
          setImagenPreview(null); 

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
    }
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
    <div >
      <br/>
    </div>
    <div class="card" style={{ width: '90%' }}>
    <div class="card-body">
    <button
        type="button"
        className="btn btn-success mb-1"
        onClick={() => setShowFormUsuarioModal(true)}
      >
    <strong>Registrar Usuario </strong>
    <i class="fa-solid fa-user-plus"></i>
    </button>
    <hr style={{ width: '100%' }}/>
    <table id="example" className="table table-striped" style={{ width: '100%' }}>
      <thead>
          <tr>
              <th>Acciones</th>
              <th>Documento</th>
              <th>Nombres y Apellidos</th>
              <th>Nacimiento</th>
              <th>Sexo</th>
              <th>Ruc</th>

          </tr>
      </thead>
      <tbody>
      {data !== null && data.map((index) => (
        <tr key={index}>
        <td>
          <button type="button" class="btn btn-info btn-sm">
            <i class="fa-solid fa-images"></i>
          </button>
          <span style={{ margin: '0 3px' }}></span>
          <button type="button" class="btn btn-info btn-sm">
            <i class="fa-solid fa-file-pdf"></i>
          </button>
          <span style={{ margin: '0 3px' }}></span>
          <button type="button" class="btn btn-success btn-sm" onClick={() => handleModalOpen(index.SERE_P_chDNI)}>
            <i class="fa-solid fa-file-arrow-up"></i>
          </button>
          <span style={{ margin: '0 3px' }}></span>
          <button
            type="button"
            class="btn btn-warning btn-sm"
            onClick={() => handleModalEditOpen(index.SERE_P_chDNI)}
          >
            <i class="fas fa-edit"></i>
          </button>
        </td>
          <td>{index.SERE_P_chDNI}</td>
          <td>{index.SERE_chNOM} {index.SERE_chAPEPAT} {index.SERE_chAPEMAT}</td>
          <td>{index.SERE_dtFECNAC}</td>
          <td>{index.SERE_chSEXO}</td>
          <td>{index.SERE_chRUC}</td>
        </tr>
      ))}
      </tbody>
  </table>
  </div>
  </div>
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Upload File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
          <input
            type="radio"
            className="btn-check"
            name="options"
            id="option1"
            autoComplete="off"
            checked={tipoarchivo === 'img'}
            onChange={() => handleTipoArchivoChange('img')}
            />            
            <label className="btn btn-secondary" htmlFor="option1">
              Subir Imagen
            </label>

            <input
              type="radio"
              className="btn-check"
              name="options"
              id="option2"
              autoComplete="off"
              checked={tipoarchivo === 'files'}
              onChange={() => handleTipoArchivoChange('files')}
            />            
            <label className="btn btn-secondary" htmlFor="option2">
              Subir Archivo
            </label>
          </div>
          { tipoarchivo === 'img'?
            <div style={{ marginTop: '10px' }}>
            <div className="form-group">
              <label htmlFor="">Cargo:</label>
              <select 
                className="form-select" 
                name='clasearchivo'
                value={clasearchivo}
                onChange={handleChange}>
                <option value="" disabled>Selecciona un tipo de Archivo</option>
                <option value="fotoperfil">Foto de Perfil</option>
                <option value="incidencia">Incidencia</option>

              </select>
            </div>
            <div
            style={{
              marginTop: '10px',   
            }}
              >
            <input type="file" accept="image/*" onChange={handleFileChange} style={{ width: '100%' }}/>
            </div>

          {imagenPreview && (
            <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '5px',
              marginBottom: '10px',
               
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
            </div>

            :
            <div style={{ marginTop: '10px' }}>
              <div className="form-group">
                <label htmlFor="">Cargo:</label>
                <select 
                  className="form-select" 
                  name='clasearchivo'
                  value={clasearchivo}
                  onChange={handleChange}>
                  <option value="" disabled>Selecciona un tipo de Archivo</option>
                  <option value="curriculum">Curriculum</option>
                  <option value="incidencia">Incidencia</option>
                </select>
              </div>
              <div
            style={{
              marginTop: '10px',   
            }}
              >
                <input 
                type="file"
                accept=".pdf, .doc, .docx"
                onChange={handleFileChange} 
                style={{ width: '100%' }}/>
              </div>
            </div>
          }
        </Modal.Body>
        <Modal.Footer>
        <Button variant="secondary" onClick={handleModalClose}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={handleUpload}>
          Guardar
        </Button>
      </Modal.Footer>
      </Modal>

      <FormUsuario
        show={showFormUsuarioModal}
        onHide={() => {
          setShowFormUsuarioModal(false);
          clearEditUserData();
        }}
        initialData={isEditMode ? editUserData : null}
      />

</div>
  )
}
export default PersonalSeguridad