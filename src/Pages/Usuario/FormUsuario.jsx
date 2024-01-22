import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';

function FormUsuario({ show, onHide,initialData  }) {
  const initialFormData = {
    SERE_chAPEPAT: '',
    SERE_chAPEMAT: '',
    SERE_chNOM: '',
    SERE_P_chDNI: '',
    SERE_chCLAVE: '',
    SERE_chRol: null,
    SERE_chTELEF: '',
    SERE_chEMAIL: '',
    SERE_chSEXO: null,
    SERE_chRUC: '',
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (initialData) {
      setFormData({
        SERE_chAPEPAT: initialData.SERE_chAPEPAT || '',
        SERE_chAPEMAT: initialData.SERE_chAPEMAT || '',
        SERE_chNOM: initialData.SERE_chNOM || '',
        SERE_P_chDNI: initialData.SERE_P_chDNI || '',
        SERE_chCLAVE: initialData.SERE_chCLAVE || '',
        SERE_chRol: initialData.SERE_chRol || null,
        SERE_chTELEF: initialData.SERE_chTELEF || '',
        SERE_chEMAIL: initialData.SERE_chEMAIL || '',
        SERE_chSEXO: initialData.SERE_chSEXO || null,
        SERE_chRUC: initialData.SERE_chRUC || '',
      });
    } else {
      setFormData(initialFormData);
    }
  }, [initialData]);

  const clearForm = () => {
    setFormData(initialFormData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const apiUrl = initialData
        ? `http://190.117.85.58:5005/pi123_M_MAES_SEREN_ACT/${initialData.SERE_P_chDNI}/`
        : 'http://190.117.85.58:5005/pi122_M_MAES_SEREN_ADD/';
  
      const method = initialData ? 'PUT' : 'POST';
  
      const response = await fetch(apiUrl, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        console.log(initialData ? 'Actualización exitosa' : 'Registro exitoso');
  
        const successMessage = initialData
          ? 'El Usuario se actualizó correctamente.'
          : 'El Usuario se registró correctamente.';
  
        Swal.fire({
          icon: 'success',
          title: initialData ? 'Actualización de Usuario' : 'Registro de Usuario',
          text: successMessage,
        }).then(() => {
          clearForm();
          onHide();
        });
      } else {
        console.error(initialData ? 'Error en la actualización' : 'Error en el registro');
      }
    } catch (error) {
      console.error('Error de red:', error);
      const errorMessage = initialData
        ? 'No se pudo actualizar el usuario.'
        : 'El usuario ya ha sido registrado anteriormente.';
  
      Swal.fire({
        icon: 'error',
        title: initialData ? 'Error al actualizar usuario' : 'Error al registrar usuario',
        text: errorMessage,
      });
    }
  };
  return (
    <Modal show={show} onHide={onHide} >
      <Modal.Header closeButton  style={{"background-color": "#0085e0"}}>
        <Modal.Title style={{"color": "#fff", "text-align": "center"}}><h2>{initialData ? "Actualizar Usuario ": "Crear Usuario"}</h2></Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <div className="row">
        <div className="col-xs-12 col-sm-12 col-md-12">
          <div className="col-xs-12 col-sm-12 col-md-12" >
            <div className="form-group">
              <label htmlFor="SERE_chNOM">Nombres:</label>
              <input 
              type="text" 
              name="SERE_chNOM" 
              className="form-control"             
              value={formData.SERE_chNOM}
              onChange={handleChange}/>
            </div>
          </div>
          <div className="row" style={{"margin-top":'10px '}}>
            <div className="col-xs-6 col-sm-6 col-md-6">
              <div className="form-group">
                  <label htmlFor="">Apellido Paterno:</label>
                  <input type="text" 
                  name="SERE_chAPEPAT" 
                  className="form-control" 
                  value={formData.SERE_chAPEPAT}
                onChange={handleChange}/>
              </div> 
            </div>
            <div className="col-xs-6 col-sm-6 col-md-6">
              <div className="form-group">
                  <label htmlFor="">Apellido Materno:</label>
                  <input type="text" 
                  name="SERE_chAPEMAT" 
                  className="form-control" 
                  value={formData.SERE_chAPEMAT}
                  onChange={handleChange}/>
              </div> 
            </div>
          </div>
          <div className="row" style={{"margin-top":'10px '}}>
            <div className="col-xs-6 col-sm-6 col-md-6">
              <div className="form-group">
                  <label htmlFor="">Telefono:</label>
                  <input 
                  type="text" 
                  name="SERE_chTELEF" 
                  className="form-control"
                  value={formData.SERE_chTELEF}
                  onChange={handleChange}/>
              </div> 
            </div>
            <div className="col-xs-6 col-sm-6 col-md-6">
              <div className="form-group">
                  <label htmlFor="">Sexo:</label>
                  <select 
                  className="form-select"  
                  name="SERE_chSEXO"           
                  value={formData.SERE_chSEXO}
                  onChange={handleChange}>
                  <option disabled selected>Selecciona el sexo</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenimo</option>
                </select>              
              </div> 
            </div>
          </div>
          <div className="col-xs-12 col-sm-12 col-md-12"style={{"margin-top":'10px '}} >
            <div className="form-group">
              <label htmlFor="">Email:</label>
              <input 
              type="email" 
              name="SERE_chEMAIL" 
              className="form-control"
              value={formData.SERE_chEMAIL}
              onChange={handleChange}/>
            </div>
          </div>
          <div className="row" style={{"margin-top":'10px '}}>
            <div className="col-xs-6 col-sm-6 col-md-6">
              <div className="form-group">
                  <label htmlFor="">Documento:</label>
                  <input 
                  type="text" 
                  name="SERE_P_chDNI" 
                  className="form-control" 
                  value={formData.SERE_P_chDNI}
                  onChange={handleChange}/>
              </div> 
            </div>
            <div className="col-xs-6 col-sm-6 col-md-6">
              <div className="form-group">
                  <label htmlFor="">Ruc:</label>
                  <input 
                  type="text" 
                  name="SERE_chRUC" 
                  className="form-control" 
                  value={formData.SERE_chRUC}
                  onChange={handleChange}/>
              </div> 
            </div>
          </div>
          <div className="col-xs-12 col-sm-12 col-md-12" style={{"margin-top":'10px '}}>
            <div className="form-group">
              <label htmlFor="">Cargo:</label>
              <select 
                className="form-select" 
                name='SERE_chRol'
                value={formData.SERE_chRol}
                onChange={handleChange}>
                <option disabled selected>Selecciona un rol</option>
                <option value="0">Administrador</option>
                <option value="1">Supervisor Sereno</option>
                <option value="2">Fiscalizador Puerta</option>
                <option value="3">Supervisor</option>
                <option value="4">Supervisor Fiscalizador Registro</option>
                <option value="5">Usuario</option>
              </select>
            </div>
          </div>
          <div className="col-xs-12 col-sm-12 col-md-12" style={{"margin-top":'10px '}} >
            <div className="form-group">
              <label htmlFor="">Clave:</label>
              <input 
              type="password" 
              name="SERE_chCLAVE" 
              className="form-control" 
              value={formData.SERE_chCLAVE}
                onChange={handleChange}/>
            </div>
          </div>
        </div>
      </div>

      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
        <Button variant="primary"  onClick={handleSubmit}>Registrar</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default FormUsuario;