"use client";

import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from '@/../firebase/clientApp';
import style from "@/app/css/create.module.css"
import stylesLogin from "@/app/css/Login.module.css";

export default function CreateSubject() {
    const [subjectName, setSubjectName] = useState("");
    const [error, setError] = useState<string | null>("");
    const [alert, setAlert] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async () => {
        setAlert("");
        setError("");
        if (!subjectName.trim()) return;
        setLoading(true);

        try {
            const res = await fetch("https://api-uj4mkoe42a-uc.a.run.app/post-subject", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: subjectName.trim() }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Error al registrar materia");
            }

            setAlert("Materia registrada");
            setSubjectName("");
        } catch (error) {
            setError(`Error al registrar materia: ${error}`);
        } finally {
            setLoading(false);
        }
    };


    return (
        <section className={style.sectionContainer}>
            <div className={style.boxWrapper}>

                <div className={style.loginBox}>

                    <h2 className="text-xl font-semibold mb-2">Creacion de materias</h2>

                    <div className={style.separator}>

                        <label>Nombre de la materia</label>
                        <input
                            type="text"
                            value={subjectName}
                            onChange={(e) => setSubjectName(e.target.value)}
                            placeholder="Nombre de la materia"
                            className={style.input}
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bluebutton"
                    >
                        {loading ? "Guardando..." : "Enviar"}
                    </button>
                </div>

            </div>
            <div className={stylesLogin.messageContainer}>
                {error && <div className={stylesLogin.errorBox}>{error}</div>}
                {alert && <div className={stylesLogin.alertBox}>{alert}</div>}
                {loading && <div className={stylesLogin.loading}>loading</div>}
            </div>
        </section>
    );
}
