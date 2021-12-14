import React from "react";
import { NavLink } from "react-router-dom";
import Cookies from "universal-cookie";

function Navigation(props) {
  const cookies = new Cookies();

  var loggueado = cookies.get("id");

  //
  const cerrarSesion = () => {
    cookies.remove("id");
    window.location.href ='https://ahl-proyecto.azurewebsites.net/Login';
  }; 

  return (
    <div className="navigation">
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <div className="container">
          <NavLink className="navbar-brand" to="/">
            Administrador de alojamiento de hoteles locales
          </NavLink>
          <div id="navBar">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                {loggueado != null && (
                  <NavLink className="nav-link" to="/">
                    Hoteles
                    <span className="sr-only">(current)</span>
                  </NavLink>
                )}
              </li>
              <li className="nav-item">
                {loggueado != null && (
                  <NavLink className="nav-link" to="/habitaciones">
                    Habitaciones
                  </NavLink>
                )}
              </li>

              <li className="nav-item">
                <NavLink className="nav-link" to="/habitaciones">
                  {loggueado != null && (
                    <a onClick={() => cerrarSesion()}>Cerrar sesión</a>
                  )}
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navigation;
