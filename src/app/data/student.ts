export type Attendance = "P" | "PL" | "N" | "A" | null;

export interface AttendanceRecord {
    id: number;
    name: string;
    attendance: {
        [date: string]: Attendance;
    };
    grade:number | null;
}

export interface ConfirmedDates {
    [date: string]: boolean;
}