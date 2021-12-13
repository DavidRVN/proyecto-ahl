import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import md5 from 'md5';
import Cookies from 'universal-cookie';

function Login(props) {

    const baseUrl = "https://localhost:44348/Usuarios";
    const cookies = new Cookies();
    
  const [usuarioSeleccionado, setHotelSeleccionado] = useState({
    idusuario: "",
    nombre: "",
    apellido: "",
    usuario: "",
    contraseña: "",
    rol: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHotelSeleccionado({
      ...usuarioSeleccionado,
      [name]: value,
    });    
  };

  
  const peticionGet = async () => {
    await axios
    .get(baseUrl + "/" + usuarioSeleccionado.usuario+"/"+md5(usuarioSeleccionado.contraseña))
      .then((response) => {
        return response.data;
      }).then(response=>{
        if(response.length>0){
            var respuesta = response[0];
            cookies.set('id',respuesta.idusuario, {path:'/'});
            cookies.set('nombre',respuesta.nombre, {path:'/'});
            cookies.set('apellido',respuesta.apellido, {path:'/'});
            cookies.set('usuario',respuesta.usuario, {path:'/'}); 
            alert("Bienvenido" + respuesta.nombre+ " "+ respuesta.apellido);
            window.location.href ='http://localhost:3000/';
        }
        else{
            alert("Usuario o contraseña incorrectos");
        }
      })
      .catch(console.error());
  };

  useEffect(() => {    
  }, []);


    
  return (
    <div class="row">
    <div class="col-6 mx-auto p-4 m-5 border-light shadow-sm">
    <div className="login">
      <div class="container">
        <h2 style={{ padding: "25px" }}>Iniciar sessión</h2>
        <div class="form-style">
       
            <div class="form-group pb-6">
              <input
                type="text"
                placeholder="Usuario"
                class="form-control"             
                aria-describedby="emailHelp"
                name="usuario"
                onChange={handleChange}
              />
            </div>
            <div class="form-group pb-3">
              <input
                type="password"
                placeholder="Contraseña"
                class="form-control"
                name="contraseña" 
                onChange={handleChange}
              />
            </div>
            <div class="d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center">
                <input name="" type="checkbox" value="" />{" "}
                <span class="pl-2 font-weight-bold">Recordarme</span>
              </div>
            </div>
            <div class="pb-2">
              <button                
                class="btn btn-warning w-100 font-weight-bold mt-2"
                onClick={()=>peticionGet()}
              >
                Iniciar
              </button>
            </div>
         
        </div>
      </div>
    </div>
    </div>
    </div>
  );
}

export default Login;
