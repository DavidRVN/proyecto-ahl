import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { MdLocalHotel } from "react-icons/md";
import Cookies from "universal-cookie";

function Home() {
  const baseUrl = "https://localhost:44348/Hoteles";
  const [data, setData] = useState([]);
  const cookies = new Cookies();

  var logueado = cookies.get("id");
  if (logueado == null) {
    window.location.href = "http://localhost:3000/login";
  }

  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalDetalles, setModalDetalles] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);

  const [hotelSeleccionado, setHotelSeleccionado] = useState({
    idHotel: "",
    nombreHotel: "",
    direccionHotel: "",
    telefonoHotel: "",
    ciudadHotel: "",
    categoriaHotel: "",
    disponible: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHotelSeleccionado({
      ...hotelSeleccionado,
      [name]: value,
    });
    var estrellas = document.getElementById("estrellas").value;
    hotelSeleccionado.categoriaHotel = estrellas;
  };

  const peticionGet = async () => {
    await axios
      .get(baseUrl)
      .then((response) => {
        setData(response.data);
      })
      .catch(console.error());
  };

  const peticionGuardarHotel = async () => {
    delete hotelSeleccionado.idHotel;
    var estrellas = document.getElementById("estrellas").value;
    hotelSeleccionado.categoriaHotel = estrellas;
    hotelSeleccionado.disponible = 1;
    await axios
      .post(baseUrl, hotelSeleccionado)
      .then((response) => {
        setData(data.concat(response.data));
        abrirCerrarModal();
      })
      .catch(console.error());
  };

  const peticionPut = async () => {
    hotelSeleccionado.disponible = parseInt(hotelSeleccionado.disponible);
    await axios
      .put(baseUrl + "/" + hotelSeleccionado.idHotel, hotelSeleccionado)
      .then((response) => {
        var respuesta = response.data;
        var dataAuxiliar = data;
        dataAuxiliar.map(function (hotel) {
          if (hotel.idHotel === respuesta.idHotel) {
            hotel.nombreHotel = respuesta.nombreHotel;
            hotel.direccionHotel = respuesta.direccionHotel;
            hotel.telefonoHotel = respuesta.telefonoHotel;
            hotel.ciudadHotel = respuesta.ciudadHotel;
            hotel.categoriaHotel = respuesta.categoriaHotel;
            hotel.disponible = respuesta.disponible;
          }
        });
        editarModal();
        peticionGet();
      })
      .catch(console.error());
  };

  const peticionGetId = async () => {
    await axios
      .get(baseUrl + "/" + hotelSeleccionado.idHotel)
      .then((response) => {
        setData(response.data);
      })
      .catch(console.error());
  };

  const abrirCerrarModal = () => {
    setModalInsertar(!modalInsertar);
  };

  const mostrarDetalles = () => {
    setModalDetalles(!modalDetalles);
  };

  const seleccionarHotel = (hotel, caso) => {
    setHotelSeleccionado(hotel);
    caso === "Editar" && editarModal();
    caso === "Detalles" && mostrarDetalles() && peticionGetId();
  };

  const editarModal = () => {
    setModalEditar(!modalEditar);
  };

  useEffect(() => {
    peticionGet();
  }, []);

  return (
    <div className="home">
      <div class="container">
        <h2 style={{ padding: "25px" }}>
          Gestión de Hoteles <MdLocalHotel />{" "}
          <button
            className="btn btn-success rounded-pill"
            onClick={() => abrirCerrarModal()}
          >
            Nuevo registro
          </button>
        </h2>

        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Nombres</th>
              <th>Dirección </th>
              <th>Telefono </th>
              <th>Ciudad </th>
              <th>Categoría</th>
              <th>Disponibilidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map((hotel) => (
              <tr key={hotel.idHotel}>
                <td>{hotel.nombreHotel}</td>
                <td>{hotel.direccionHotel}</td>
                <td>{hotel.telefonoHotel}</td>
                <td>{hotel.ciudadHotel}</td>
                <td>{hotel.categoriaHotel} estrellas </td>
                {(hotel.disponible === 1 && <td>Disponible</td>) ||
                  (hotel.disponible === 0 && <td>No disponible</td>)}
                <td>
                  <button
                    className="btn btn-primary rounded-pill"
                    onClick={() => seleccionarHotel(hotel, "Detalles")}
                  >
                    Detalles
                  </button>{" "}
                  <button
                    className="btn btn-warning rounded-pill"
                    onClick={() => seleccionarHotel(hotel, "Editar")}
                  >
                    Editar
                  </button>{" "}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Modal isOpen={modalInsertar}>
          <ModalHeader> Registrar un nuevo Hotel </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label>Nombre Hotel</label>
              <br />
              <input
                type="text"
                className="form-control"
                name="nombreHotel"
                onChange={handleChange}
              />
              <br />
              <label>Dirección Hotel</label>
              <br />
              <input
                type="text"
                className="form-control"
                name="direccionHotel"
                onChange={handleChange}
              />
              <br />
              <label>Teléfono Hotel</label>
              <br />
              <input
                type="text"
                className="form-control"
                name="telefonoHotel"
                onChange={handleChange}
              />
              <br />
              <label>Ciudad Hotel</label>
              <br />
              <input
                type="text"
                className="form-control"
                name="ciudadHotel"
                onChange={handleChange}
              />
              <br />
              <label>Categoría</label>
              <br />

              <select className="form-control" id="estrellas">
                <option style={{ color: "#808080" }} value={"select"}>
                  Selecciona categoría
                </option>
                <option value="5">5 Estrellas</option>
                <option value="4">4 Estrellas</option>
                <option value="3">3 Estrellas</option>
                <option value="2">2 Estrellas</option>
                <option value="1">1 Estrellas</option>
              </select>
              <br />
              <br />
              <input
                type="text"
                className="form-control"
                name="disponible"
                value="1"
                onChange={handleChange}
                hidden
              />
              <br />
            </div>
          </ModalBody>
          <ModalFooter>
            <button
              className="btn btn-primary"
              onClick={() => abrirCerrarModal()}
            >
              Cerrar
            </button>
            <button
              className="btn btn-success"
              onClick={() => peticionGuardarHotel()}
            >
              Guardar
            </button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={modalDetalles}>
          <ModalHeader> Detalles </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <h2>Detalles de los hoteles</h2>
              {hotelSeleccionado.nombreHotel}
              {""} <br />
              {hotelSeleccionado.direccionHotel}
              {""} <br />
              {hotelSeleccionado.telefonoHotel}
              {""} <br />
              {hotelSeleccionado.ciudadHotel}
              {""} <br />
              {hotelSeleccionado.categoriaHotel}
              {""} estrellas <br />
              {(hotelSeleccionado.disponible === 1 && <td>Disponible</td>) ||
                (hotelSeleccionado.disponible === 0 && <td>No disponible</td>)}
            </div>
          </ModalBody>
          <ModalFooter>
            <button
              className="btn btn-primary"
              onClick={() => mostrarDetalles()}
            >
              Cerrar
            </button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={modalEditar}>
          <ModalHeader> Actualizar Hotel </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <input
                type="text"
                readOnly
                className="form-control"
                name="idHotel"
                onChange={handleChange}
                hidden
                value={hotelSeleccionado && hotelSeleccionado.idHotel}
              />

              <label>Nombre Hotel</label>
              <br />
              <input
                type="text"
                className="form-control"
                name="nombreHotel"
                onChange={handleChange}
                value={hotelSeleccionado && hotelSeleccionado.nombreHotel}
              />
              <br />
              <label>Dirección Hotel</label>
              <br />
              <input
                type="text"
                className="form-control"
                name="direccionHotel"
                onChange={handleChange}
                value={hotelSeleccionado && hotelSeleccionado.direccionHotel}
              />
              <br />
              <label>Teléfono Hotel</label>
              <br />
              <input
                type="text"
                className="form-control"
                name="telefonoHotel"
                onChange={handleChange}
                value={hotelSeleccionado && hotelSeleccionado.telefonoHotel}
              />
              <br />
              <label>Ciudad Hotel</label>
              <br />
              <input
                type="text"
                className="form-control"
                name="ciudadHotel"
                onChange={handleChange}
                value={hotelSeleccionado && hotelSeleccionado.ciudadHotel}
              />
              <br />
              <label>Categoría</label>
              <br />
              <input
                type="text"
                className="form-control"
                name="categoriaHotel"
                onChange={handleChange}
                value={hotelSeleccionado && hotelSeleccionado.categoriaHotel}
              />
              <br />
              <label>Disponibilidad</label>
              <br />
              <input
                type="text"
                className="form-control"
                name="disponible"
                onChange={handleChange}
                value={hotelSeleccionado && hotelSeleccionado.disponible}
              />
              <br />
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-primary" onClick={() => editarModal()}>
              Cerrar
            </button>
            <button className="btn btn-warning" onClick={() => peticionPut()}>
              Actualizar
            </button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
}

export default Home;
