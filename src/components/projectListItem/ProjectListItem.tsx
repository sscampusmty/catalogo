import styles from './projectListItem.module.css'

export default function ProjectListItem({project, onSelect, selected}: {project: any, onSelect?: () => void, selected?: boolean}) {
    return (
        <div
            className={styles.container}
            onClick={onSelect}
            style={selected ? { color: 'var(--purple)' } : {}}
        >
            <div className={styles.checkIndicator}>
                {selected && <div className={styles.checkIndicatorSelected}></div>}
            </div>

            <div className={styles.content}>
                <p
                    className={styles.projectName}
                    style={selected ? { textDecoration: 'underline' } : {}}
                >
                    Nombre del proyecto
                </p>

                <div className={styles.metadataContainer}>
                    <p className={styles.info}>
                        <span className={styles.label}>Modalidad:</span>
                        Presencial
                    </p>
                    <p className={styles.info}>
                        <span className={styles.label}>Cupo:</span>
                        27 Espacios
                    </p>
                    <p className={styles.info}>
                        <span className={styles.label}>Periodo:</span>
                        Semestre Feb - Jun
                    </p>
                    <p className={styles.info}>
                        <span className={styles.label}>Horas:</span>
                        160 Horas
                    </p>
                </div>
            </div>
        </div>
    )
}