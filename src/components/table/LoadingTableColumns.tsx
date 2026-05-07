import styles1 from './loadingTable.module.css';
import styles2 from './table.module.css';

const styles = { ...styles1, ...styles2 };

export default function LoadingTableColumns() {
    return (
        <div className={styles.columnNamesContainer}>
            {
                Array.from({ length: 5 }).map((_, index) => (
                    <div className={styles.loadingColumn} key={index}></div>
                ))
            }
        </div>
    )
}
