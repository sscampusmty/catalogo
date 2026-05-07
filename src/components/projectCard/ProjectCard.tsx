import styles from './projectCard.module.css'
import { useState, useEffect } from 'react'

type ProjectData = {
    duracion_y_fechas_del_proyecto: string
    modalidad_del_proyecto_solidario: string
    nombre_del_proyecto: string
    nombre_oficial_de_la_osf: string
    periodo: string
}

export default function ProjectCard({
    project,
    onEdit,
    onRenew,
    active = true,
    type
}: {
    project: ProjectData,
    onEdit?: () => void,
    onRenew?: () => void,
    active?: boolean,
    type?: "prod" | "intensive" | "semester"
}) {
    const [projectTitle, setProjectTitle] = useState(project.nombre_del_proyecto || "Proyecto sin nombre");

    useEffect(() => {
        setProjectTitle(project.nombre_del_proyecto.length > 70 ? project.nombre_del_proyecto.slice(0, 67) + "..." : project.nombre_del_proyecto);
    }, []);

    const handleShowFullTitle = () => {
        if(projectTitle.length <= 70) {
            setProjectTitle(project.nombre_del_proyecto);
        } else {
            setProjectTitle(project.nombre_del_proyecto.slice(0, 67) + "...");
        }
    }

    return (
        <div className={`${styles.container} ${!active ? styles.inactive : ''}`}>
            <div className={styles.header}>
                <h2
                    className={styles.title}
                    onClick={() => handleShowFullTitle()}
                    style={{
                        cursor: project.nombre_del_proyecto && project.nombre_del_proyecto.length > 70 ? 'zoom-in' : 'default',
                        userSelect: 'text',
                        WebkitTapHighlightColor: 'transparent',
                        WebkitUserSelect: 'text',
                        MozUserSelect: 'text',
                        msUserSelect: 'text',
                        backgroundColor: 'transparent',
                        caretColor: 'auto',
                    }}
                >
                    {projectTitle}
                </h2>

                <div className={styles.projectInfo}>
                    <p className={styles.lastUpdate}><span className={styles.label}>Periodo:</span>{project.periodo || "No específicado"}</p>
                    {
                        type !== "prod" && active && (
                            <p className={styles.type}>
                                <span className={styles.label}>Proceso de Renovación:</span>
                                {type === "intensive" ? "Intensivo" : type === "semester" ? "Semestral" : "Producción"}
                            </p>
                        )
                    }
                </div>
            </div>

            <div className={styles.body}>
                <p className={styles.info}>
                    <span className={styles.label}>Modalidad:</span>
                    {project.modalidad_del_proyecto_solidario || "No especificada"}
                </p>
                <p className={styles.info}>
                    <span className={styles.label}>Cupo:</span>
                    27 Espacios
                </p>
                <p className={styles.info}>
                    <span className={styles.label}>Horas:</span>
                    {project.duracion_y_fechas_del_proyecto?.match(/(\d+)\s*[Hh]oras/)?.[0].trim() || "No especificadas"}
                </p>
                <p className={styles.info}>
                    <span className={styles.label}>Última actualización:</span>
                    12/12/2023 - 14:34 hrs
                </p>
            </div>

            <div className={styles.buttonsContainer}>
                <button
                    className={styles.button}
                    onClick={() => onEdit?.()}
                >
                    VER PROYECTO
                </button>
                {active && type === "prod" && (
                    <button
                        className={`${styles.button} ${styles.renewButton}`}
                        onClick={() => onRenew?.()}
                    >
                        RENOVAR PROYECTO
                    </button>
                )}
            </div>
        </div>
    )
}
