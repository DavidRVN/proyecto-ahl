import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { MdBedroomParent } from "react-icons/md";
import Cookies from "universal-cookie";

function Habitaciones() {
  const baseUrl = "https://pruebaapisahl.azurewebsites.net/Hoteles";
  const baseUrlHabitaciones = "https://pruebaapisahl.azurewebsites.net/Habitaciones/";
  const [data, setData] = useState([]);

  const cookies = new Cookies();
  var logueado = cookies.get("id");
  if (logueado == null) {
    window.location.href = "https://ahl-proyecto.azurewebsites.net/login";
  }
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);

  const [dataHotel, setdataHotel] = useState([]);

  const [habitacionSeleccionada, setHabitacionSeleccionada] = useState({
    idHabitacion: "",
    tpHabitacion: "",
    precioHabitacion: "",
    tipoMoneda: "",
    disponibilidad: "",
    hotelasignado: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHabitacionSeleccionada({
      ...habitacionSeleccionada,
      [name]: value,
    });
  };

  // Manejo de peticiones

  const peticionGetHoteles = async () => {
    await axios
      .get(baseUrl)
      .then((response) => {
        setdataHotel(response.data);
      })
      .catch(console.error());
  };

  const peticionGet = async () => {
    await axios
      .get(baseUrlHabitaciones)
      .then((response) => {
        setData(response.data);
      })
      .catch(console.error());
  };

  const peticionPost = async () => {
    delete habitacionSeleccionada.idHabitacion;
    habitacionSeleccionada.disponibilidad = 1;
    var hotelA = document.getElementById("hotelA").value;
    habitacionSeleccionada.hotelasignado = hotelA;
    await axios
      .post(baseUrlHabitaciones, habitacionSeleccionada)
      .then((response) => {
        setData(data.concat(response.data));
        abrirCerrarModal();
      })
      .catch(console.error());
  };

  const peticionPut = async () => {
    var disponibilidad = document.getElementById("disponibilidadH").value;
    habitacionSeleccionada.disponibilidad = disponibilidad;
    // habitacionSeleccionada.disponibilidad = parseInt(habitacionSeleccionada.disponibilidad);
    var hotelA = document.getElementById("hotelA").value;
    habitacionSeleccionada.hotelasignado = hotelA;
    await axios
      .put(
        baseUrlHabitaciones + habitacionSeleccionada.idHabitacion,
        habitacionSeleccionada
      )
      .then((response) => {
        var respuesta = response.data;
        var dataAuxiliar = data;
        dataAuxiliar.map(function (hotel) {
          if (hotel.idHabitacion === respuesta.idHabitacion) {
            hotel.tpHabitacion = respuesta.tpHabitacion;
            hotel.precioHabitacion = respuesta.precioHabitacion;
            hotel.tipoMoneda = respuesta.tipoMoneda;
          }
        });
        editarModal();
        peticionGet();
      })
      .catch(console.error());
  };

  const peticionGetId = async () => {
    await axios
      .get(baseUrlHabitaciones + "/" + habitacionSeleccionada.idHabitacion)
      .then((response) => {
        setData(response.data);
      })
      .catch(console.error());
  };

  //Manejo de los modals

  const abrirCerrarModal = () => {
    setModalInsertar(!modalInsertar);
  };
  const editarModal = () => {
    setModalEditar(!modalEditar);
  };

  const seleccionarHotel = (h, caso) => {
    setHabitacionSeleccionada(h);
    caso === "Editar" && editarModal() && peticionGetId();
    //caso === "Detalles" && mostrarDetalles() && peticionGetId();
  };

  useEffect(() => {
    peticionGet();
    peticionGetHoteles();
  }, []);

  return (
    <div className="habitaciones">
      <div class="container">
        <br />
        <h2>
          Asignación de Habitaciones <MdBedroomParent />
          <button
            className="btn btn-primary rounded-pill"
            onClick={() => abrirCerrarModal()}
          >
            Nuevo registro
          </button>
          <br />
          <br />
          <br />
        </h2>

        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Tipo de habitación </th>
              <th>Precio </th>
              <th>Moneda </th>
              <th>Disponibilidad</th>
              <th>hotel Asignado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map((habitacion) => (
              <tr key={habitacion.idHabitacion}>
                <td>{habitacion.tpHabitacion}</td>
                <td>{habitacion.precioHabitacion}</td>
                <td>{habitacion.tipoMoneda}</td>
                {(habitacion.disponibilidad === 1 && <td>Disponible</td>) ||
                  (habitacion.disponibilidad === 0 && <td>No disponible</td>)}
               
                {dataHotel.map((e, key) => {
                          if(e.idHotel === habitacion.hotelasignado){
                            return (
                      
                              <td key={key} value={e.idHotel}>
                                {e.nombreHotel}
                              </td>
                            );
                          }
                  })}
                <td>
                  <button
                    className="btn btn-warning rounded-pill"
                    onClick={() => seleccionarHotel(habitacion, "Editar")}
                  >Modificar                    
                  </button>{" "}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Modal isOpen={modalInsertar}>
          <ModalHeader> Registrar una Habitación </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label>Tipo de Habitación</label>
              <br />
              <input
                type="text"
                className="form-control"
                name="tpHabitacion"
                onChange={handleChange}
              />
              <br />
              <label>Precio</label>
              <br />
              <input
                type="text"
                className="form-control"
                name="precioHabitacion"
                onChange={handleChange}
              />
              <br />
              <label>Tipo de Moneda</label>
              <br />
              <input
                type="text"
                className="form-control"
                name="tipoMoneda"
                onChange={handleChange}
              />
              <br />            
         
              <br />
              <label>Hotel asginado</label>
              <br />
              <select id="hotelA" className="form-control">
                <option style={{ color: "#808080" }} value={"select"}>
                  Selecciona categoría
                </option>
                {dataHotel.map((e, key) => {
                  return (
                    <option key={key} value={e.idHotel}>
                      {e.nombreHotel}
                    </option>
                  );
                })}
              </select>
              <br />
            </div>
          </ModalBody>
          <ModalFooter>
            <button
              className="btn btn-primary rounded-pill"
              onClick={() => abrirCerrarModal()}
            >
              Cerrar
            </button>
            <button
              className="btn btn-success rounded-pill"
              onClick={() => peticionPost()}
            >
              Guardar
            </button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={modalEditar}>
          <ModalHeader>Modificar Habitación </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <div className="form-group">
                <label>Nombre Hotel</label>
                <br />
                <input
                  type="text"
                  readOnly
                  className="form-control"
                  name="idHabitacion"
                  onChange={handleChange}
                  value={
                    habitacionSeleccionada && habitacionSeleccionada.idHabitacion
                  }
                />
                <label>Tipo de Habitación</label>
                <br />
                <input
                  type="text"
                  className="form-control"
                  name="tpHabitacion"
                  onChange={handleChange}
                  value={habitacionSeleccionada && habitacionSeleccionada.tpHabitacion}
                />
                <br />
                <label>Precio</label>
                <br />
                <input
                  type="text"
                  className="form-control"
                  name="precioHabitacion"
                  onChange={handleChange}
                  value={habitacionSeleccionada && habitacionSeleccionada.precioHabitacion}
                />
                <br />
                <label>Tipo de Moneda</label>
                <br />
                <input
                  type="text"
                  className="form-control"
                  name="tipoMoneda"
                  onChange={handleChange}
                  value={habitacionSeleccionada && habitacionSeleccionada.tipoMoneda}
                />
                <br />
                <label>Disponibilidad</label>
                <br />

                <select id="disponibilidadH" className="form-control">
                  <option style={{ color: "#808080" }} value={"select"}>
                    Selecciona disponibilidad
                  </option>
                  <option value="1">Disponible</option>
                  <option value="0">No Disponible</option>
                </select>

                <br />
                <label>Hotel asginado</label>
                <br />
                <select id="hotelA" className="form-control">
                  <option style={{ color: "#808080" }} value={"select"}>
                    Selecciona Hotel
                  </option>
                  {dataHotel.map((e, key) => {
                    return (
                      <option key={key} value={e.idHotel}>
                        {e.nombreHotel}
                      </option>
                    );
                  })}
                </select>
                <br />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-primary" onClick={() => editarModal()}>
              Cerrar
            </button>
            <button className="btn btn-warning"  onClick={() => peticionPut()}>Actualizar</button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
}

export default Habitaciones;
