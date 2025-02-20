import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Login from "./componets/Login";
import Register from "./componets/Register";
import RecoverPassword from "./componets/RecoverPassword";

export default function Page() {
  return (
    <section>
      <Login />
      <Register />
      <RecoverPassword/>
    </section>
  );
}
