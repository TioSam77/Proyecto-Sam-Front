"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import "../css/calendar.css"

const notClaseDays = ["2025-03-05", "2025-03-10", "2025-03-15"];
const claseDays = ["2025-02-05", "2025-02-10", "2025-02-15"];

export default function CustomCalendar() {
    const [date, setDate] = useState(new Date());

    return (
        <div className="calendar">

            <Calendar
                onChange={setDate}
                value={date}
                locale="es"
                className="border p-2 rounded-lg shadow-md"
                tileClassName={({ date }) => {
                    const dateString = format(date, "yyyy-MM-dd");

                    if (notClaseDays.includes(dateString)) {
                        return "notClase-day";
                    }

                    if (claseDays.includes(dateString)) {
                        return "clase-day";
                    }

                    return "";
                }}
            />
        </div>
    );
}
