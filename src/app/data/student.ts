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

export const initialData: AttendanceRecord[] = [
    { id: 67, name: "Paola", attendance: { "9-jul": "P", "16-jul": "PL", "23-jul": null }, grade: 9 },
    { id: 170, name: "Amelia", attendance: { "9-jul": "P", "16-jul": "N", "23-jul": null }, grade: null },
    { id: 182, name: "Carolina", attendance: { "9-jul": "P", "16-jul": "P", "23-jul": null }, grade: null },
    { id: 123, name: "Jorge", attendance: { "9-jul": "N", "16-jul": "P", "23-jul": null }, grade: null },
    { id: 56, name: "Erick", attendance: { "9-jul": "PL", "16-jul": "P", "23-jul": null }, grade: null },
    { id: 567, name: "David", attendance: { "9-jul": "A", "16-jul": "P", "23-jul": null }, grade: null },
    { id: 356, name: "pablo", attendance: { "9-jul": "A", "16-jul": "P", "23-jul": null }, grade: null },
    { id: 234, name: "juan", attendance: { "9-jul": "A", "16-jul": "P", "23-jul": null }, grade: null },
    { id: 5, name: "santy", attendance: { "9-jul": "A", "16-jul": "P", "23-jul": null }, grade: null },
    { id: 7, name: "memo", attendance: { "9-jul": "A", "16-jul": "P", "23-jul": null }, grade: null },
    { id: 787, name: "luna", attendance: { "9-jul": "A", "16-jul": "P", "23-jul": null }, grade: null },
    { id: 53, name: "jesica", attendance: { "9-jul": "A", "16-jul": "P", "23-jul": null }, grade: null },
    { id: 52, name: "issac", attendance: { "9-jul": "A", "16-jul": "P", "23-jul": null }, grade: null },
    { id: 54, name: "newton", attendance: { "9-jul": "A", "16-jul": "P", "23-jul": null }, grade: null },
    { id: 64, name: "socrates", attendance: { "9-jul": "A", "16-jul": "P", "23-jul": null }, grade: null },
];

export const initialConfirmedDates: ConfirmedDates = {
    "9-jul": true,
    "16-jul": false,
    "23-jul": false,
    "24-jul": false,
    "25-jul": false,
    "26-jul": false,
    "27-jul": false,
    "28-jul": false,
    "29-jul": false,
    "30-jul": false,
    "31-jul": false,
    "32-jul": false,
    "33-ago": false,
};