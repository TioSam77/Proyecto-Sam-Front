"use client";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Header = () => {
  const handleLogout = () => {
    // Aquí puedes limpiar el estado del usuario, eliminar el token, etc.
    localStorage.removeItem("token"); // Ejemplo si usas JWT
    window.location.href = "/Login"; // Redirige al usuario a la página de login
  };

  return (
    <nav className="navbar bg-body-tertiary fixed-top">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Logo */}
        <a className="navbar-brand d-flex align-items-center " href="/">
          <img src="/logo.jpg" alt="Interactivo Logo" height="40" className="me-2" />
          <h3 className="logo">Interactivo</h3>
        </a>

        {/* Botón de Offcanvas */}
        <div>
          <button>mensaje</button>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar"
            aria-controls="offcanvasNavbar"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>

        {/* Menú lateral */}
        <div
          className="offcanvas offcanvas-end"
          tabIndex={-1}
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
              Menú
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body">
            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
              <li className="nav-item">
                <a className="nav-link active" href="/">Inicio</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/Login">Acceder</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/Registro">Registrarse</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/Profesor">Profesor</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/Alumno">Alumno</a>
              </li>
              <li >
                <button onClick={handleLogout}>
                  Cerrar sesión
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
