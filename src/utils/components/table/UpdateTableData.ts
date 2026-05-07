import { ChangeEvent } from "react";

export default function UpdateTableData(e: ChangeEvent<HTMLInputElement>, data: any[][], rowIdx: number, cellIdx: number, callback: (data: any[][]) => void) {
    let newTableData = [...data];
    newTableData[rowIdx][cellIdx] = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    callback(newTableData);
}
