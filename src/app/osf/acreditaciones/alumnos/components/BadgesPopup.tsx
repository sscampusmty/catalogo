import styles from './badgesPopup.module.css';

// COMPONENTS
import Popup from '@/components/popup/Popup';

export default function BadgesPopup({ show, onClose }: { show: boolean, onClose: () => void }) {
    return (
        <Popup show={show} onClose={() => onClose()}>
            <h2 className={styles.popupTitle}>ASIGNACIÓN DE ALUMNOS DESTACADOS</h2>
            <p className={styles.popupDescription}>
            Esta insignia reconoce a los estudiantes por su desempeño
            en el proyecto. Se pueden seleccionar hasta 3 alumnos,
            que demuestren dos o más de las siguientes actitudes.
            </p>

            <div className={styles.badgesContainer}>
            <div className={styles.badgeContainer}>
                <h3 className={styles.badgeTitle}>
                LÍDER COMPROMETIDO
                </h3>
                <p className={styles.badgeDescription}>
                El estudiante identifica sus propias habilidades y
                limitaciones e impulsa las capacidades del equipo,
                generando un trabajo de alto valor que considere
                las aportaciones de la OSF y/o la comunidad que
                atiende. Moviliza e inspira actores clave para dar
                atención a la problemática.
                </p>
            </div>

            <div className={styles.badgeContainer}>
                <h3 className={styles.badgeTitle}>
                ANALÍTICO / INQUISITIVO
                </h3>
                <p className={styles.badgeDescription}>
                El estudiante cuestiona las normas promoviendo e
                cumplimiento de los Derechos Humanos, investiga
                las fuentes del problema, no se conforma con el
                estatu quo.
                </p>
            </div>

            <div className={styles.badgeContainer}>
                <h3 className={styles.badgeTitle}>
                CONGRUENTE
                </h3>
                <p className={styles.badgeDescription}>
                El estudiante es coherente con los valores TEC,
                con el fin de promover la dignidad humana, la
                convivencia justa y el desarrollo sostenible.
                (Ejemplo: el estudiante reconoce la vulnerabilidad
                de las personas que se atienden “Caso
                Reconocimiento de la dignidad de recolectores de
                basura”).
                </p>
            </div>

            <div className={styles.badgeContainer}>
                <h3 className={styles.badgeTitle}>
                ADAPTABLE
                </h3>
                <p className={styles.badgeDescription}>
                El estudiante demuestra su capacidad de reacción
                oportuna para responder a los cambios que se
                puedan presentar durante la experiencia.
                </p>
            </div>

            <div className={styles.badgeContainer}>
                <h3 className={styles.badgeTitle}>
                TRANSFORMADOR
                </h3>
                <p className={styles.badgeDescription}>
                El estudiante ya no es indiferente a esta
                problemática social, y asume el compromiso de su
                involucramiento directo, ofreciendo soluciones
                innovadoras que son más eficaces, eficientes,
                sostenibles o justas que las soluciones actuales.
                </p>
            </div>
            </div>
        </Popup>
    )
};
