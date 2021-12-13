import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  Navigation,
  Footer,
  Home,
  Habitaciones,
  Login
} from "./components";

ReactDOM.render(
  <Router>
    <Navigation />
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route exact path="/habitaciones" element={<Habitaciones />} />
      <Route exact path="/Login" element={<Login />} />
    </Routes>
    <Footer />
  </Router>,

  document.getElementById("root")
);

