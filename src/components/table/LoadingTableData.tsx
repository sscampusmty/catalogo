import styles1 from './loadingTable.module.css';
import styles2 from './table.module.css';

const styles = { ...styles1, ...styles2 };

export default function LoadingTableData() {
    return (
        <div>
            {
                Array.from({ length: 4 }).map((_, index) => (
                    <div className={styles.loadingRow} key={index}></div>
                ))
            }
        </div>
    )
}
