import styles from './table.module.css';
import { useEffect, useState } from 'react';

// COMPONENTS
import LoadingTableColumns from '@/components/table/LoadingTableColumns';
import LoadingTableData from '@/components/table/LoadingTableData';

// HELPER FUNCTIONS
import UpdateTableData from '@/utils/components/table/UpdateTableData';

// TYPES
import { TableProps } from '@/types/Table';

export default function Table({columns, data, loading, onUpdateTableData, onRowClick, onColumnDetailsClick, className}: TableProps) {
    const [activeColumns, setActiveColumns] = useState(columns);

    useEffect(() => {
        console.log("Columns: ", columns);
        console.log("Data: ", data);
        // setActiveColumns(columns.filter(column => column.name !== "Calificación en Canvas" && column.name !== "Estatus de Calificación"));
    }, [columns]);

    if(loading) {
        return (
        <div className={`${styles.table} ${className}`}>
            <LoadingTableColumns/>
            <LoadingTableData/>
        </div>
        )
    } else {
        return (
            <div className={`${styles.table} ${className}`}>
                <div className={styles.columnNamesContainer}>
                    {
                        activeColumns.map((column, index) => (
                            <div className={`${styles.columnNameContainer} ${styles[column?.width]}`} key={index}>
                                <p className={`${styles.columnName} ${styles[column?.width]}`}>{ column?.name }</p>

                                {
                                    column?.columnDetails && (
                                        <p
                                            className={styles.columnDetailsButton}
                                            onClick={() => onColumnDetailsClick && onColumnDetailsClick(column)}
                                            title="Da click para ver más detalles"
                                        >?</p>
                                    )
                                }
                            </div>
                        ))
                    }
                </div>
                
                <div className={styles.rowContainer}>
                {
                    data.map((row, rowIdx) => (
                        <div
                            className={`${styles.row} ${onRowClick && styles.clickableRow}`}
                            key={rowIdx}
                            onClick={() => onRowClick && onRowClick({data: row, index: rowIdx})}
                        >
                            {
                                row.map((cell, cellIdx) => {
                                    const column = columns[cellIdx];

                                    return (
                                        <div
                                            className={`${styles.cellContainer} ${styles[column?.width]}`}
                                            key={cellIdx}
                                        >
                                            {
                                                column?.editable ? (
                                                    <input
                                                        className={`${column?.type === "boolean" ? styles.checkbox : styles.input} ${styles[column?.width]}`}
                                                        type={column?.type === "boolean" ? "checkbox" : column?.type}
                                                        value={cell}
                                                        checked={(cell && cell != false)}
                                                        onChange={(e) => UpdateTableData(e, data, rowIdx, cellIdx, onUpdateTableData)}
                                                    />
                                                ) : (
                                                    <p className={`${styles.cell} ${styles[column?.width]}`}>{cell}</p>
                                                )
                                            }
                                        </div>
                                    )
                                })
                            }
                        </div>
                    ))
                }
                </div>
            </div>
        )
    }
}
