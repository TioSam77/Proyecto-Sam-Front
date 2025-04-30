
import React from 'react';
import styles from '@/app/css/infoCourse.module.css';
import { usePathname } from 'next/navigation';

interface InfoCourseProps {
    description: string;
    teacher: string;
}

const InfoCourse: React.FC<InfoCourseProps> = ({ description, teacher }) => {
    const pathname = usePathname()
    const isStudent = pathname.includes('/Alumno')

    return (
        <div className={styles.card}>
            <p className={styles.teacher}>Profesor: {teacher}</p>
            <div className={styles.flexrow}>
                <p className={styles.description}>{description}</p>

                {isStudent ?
                    <button className='bluebutton'>Adrir temario</button>
                    :
                    <button className='bluebutton'>Agregar Temario</button>}
            </div>
        </div>
    );
};

export default InfoCourse;
