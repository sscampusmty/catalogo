export type Column = {
    name: string,
    key: string,
    type: "text" | "number" | "boolean",
    editable: boolean,
    width: "long" | "medium" | "short",
    columnDetails?: boolean
};

export type TableProps = {
    columns: Column[],
    data: any[][],
    onUpdateTableData: (data: any[][]) => void,
    onRowClick?: ({data, index}: {data: any, index: number}) => void,
    onColumnDetailsClick?: (column: Column) => void,
    loading: boolean,
    className: string
};
