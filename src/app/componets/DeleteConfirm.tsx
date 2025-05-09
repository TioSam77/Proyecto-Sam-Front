
"use client";
import { useState } from "react";

interface Props {
    name: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const DeleteConfirm = ({ name, onConfirm, onCancel }: Props) => {
    const [input, setInput] = useState("");

    const isValid = input.trim().toLowerCase() === name.trim().toLowerCase();

    return (
        <div style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000
        }}>
            <div style={{
                background: "white",
                padding: "2rem",
                borderRadius: "1rem",
                width: "90%",
                maxWidth: "400px",
                boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
                textAlign: "center"
            }}>
                <h2>¿Seguro que deseas eliminar a <strong>{name}</strong>?</h2>
                <p>Escribe el nombre exacto para confirmar:</p>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Nombre del profesor"
                    style={{ width: "100%", padding: "0.5rem", marginTop: "1rem" }}
                />
                <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "space-between" }}>
                    <button onClick={onCancel} className="bluebutton">Cancelar</button>
                    <button
                        onClick={onConfirm}
                        className="redbutton"
                        disabled={!isValid}
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirm;
