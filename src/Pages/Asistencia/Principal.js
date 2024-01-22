import React, { useEffect } from 'react'
import '../CSS/Principal.css';
import Cookies from 'js-cookie';
function Principal() {
  useEffect(() => {
    const rol = Cookies.get('rol');

    if (rol === '5') {
      document.getElementById('placaBtn').style.display = 'none';
      document.getElementById('asistenciaQRBtn').style.display = 'none';
      document.getElementById('registrousuariobtn').style.display = 'none';

    } else{
      
    }

  }, []);
  return (
    <div>
    <header>
      <img src={require("../../componentes/logoerlan.png")} className="logoerlan"/>
      <img src={require("../../componentes/slogan.png")} className="sloganerlan"/>

    </header>
    <nav>
    <a id="registrousuariobtn" className="atras" href="/usuario-registro"><i class="fa-solid fa-user"></i> Registrar Usuario</a>
    <a className="salir"href="/"><i class="fa-solid fa-users-slash"></i> Cerrar Sesión</a>
    </nav>

    <div className='cardsasistencia'>
      <div className='contenedordecards'>
            <h1 className='headerprincipal'>Servicios</h1>
            <div className='Divservicios'> 
            <a id="asistenciaDNIBtn" className="linkdni" href="/asistencia-dni">
              <i className="fa-regular fa-address-card"></i> Asistencia Por DNI
            </a>

            <a id="asistenciaQRBtn" className="linkdni" href="/asistencia-qr">
              <i className="fa-solid fa-qrcode"></i> Asistencia Por QR
            </a>
            <a id="placaBtn" className="linkdni" href="/placa-registro">
              <i className="fa-solid fa-barcode"></i> Registrar Placa
            </a>
            </div>

            <h1 className='headerprincipal'>Dashboard</h1>

            <div className='Divservicios'> 

            <a id="personalseguridadbtn" className="linkdni" href="/personalseguridad">
            <i class="fa-solid fa-user-shield"></i> Personal de Seguridad
            </a>
            <a id="asistenciaQRBtn" className="linkdni" href="/subirimagen">
              <i className="fa-regular fa-address-card"></i> Subir Imagenes
            </a>
            <a id="asistenciaQRBtn" className="linkdni" href="/subirimagen">
              <i className="fa-regular fa-address-card"></i> Subir Imagenes
            </a>
            </div>

        </div>
    </div>
    </div>

    
  )
}

export default Principal