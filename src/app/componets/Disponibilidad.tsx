'use client'
import { useState } from "react";

const Aviability = () => {
        const [showForm, setShowForm] = useState(false);
    return
    <section>
        {showForm && (
            <div >
                <input type="text" name="title" placeholder="Título" value={} onChange={} />
                <input type="date" name="startDate" value={} onChange={} />
                <input type="date" name="endDate" value={} onChange={} />
                <div>
                    <button
                        onClick={}>
                        Cancelar
                    </button>
                    <button
                        onClick={}>
                        Guardar
                    </button>
                </div>
            </div>
        )}
    </section>
}

export default Aviability;