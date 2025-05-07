"use client";

import { useState } from "react";
import Login from "../componets/Login";

export default function Page() {
  const [userType, setUserType] = useState("Alumno");


  return (
    <section>
      <Login
        userType={userType}
        setUserType={setUserType}
      />
    </section>
  );
}
