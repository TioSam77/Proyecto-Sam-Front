import daysOff from '@/app/data/daysOff.json';

const calcularPascua = (year: number): Date => {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, month - 1, day);
};

export const isHoliday = (dateStr: string): string | null => {
    if (!dateStr) return null;

    const [yearStr, monthStr, dayStr] = dateStr.split("-");
    const year = parseInt(yearStr);
    const month = parseInt(monthStr);
    const day = parseInt(dayStr);

    const pascua = calcularPascua(year);
    const juevesSanto = new Date(pascua);
    juevesSanto.setDate(pascua.getDate() - 3);
    const viernesSanto = new Date(pascua);
    viernesSanto.setDate(pascua.getDate() - 2);

    for (const feriado of daysOff) {
        if (feriado.movil) {
            if (
                feriado.nombre.toLowerCase().includes("jueves") &&
                juevesSanto.getDate() === day &&
                juevesSanto.getMonth() + 1 === month
            ) return feriado.nombre;

            if (
                feriado.nombre.toLowerCase().includes("viernes") &&
                viernesSanto.getDate() === day &&
                viernesSanto.getMonth() + 1 === month
            ) return feriado.nombre;

            continue;
        }

        if (feriado.mes === month && feriado.dia === day) {
            return feriado.nombre;
        }
    }

    return null;
};
