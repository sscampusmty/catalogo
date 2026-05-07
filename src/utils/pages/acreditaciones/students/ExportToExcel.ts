import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx'

export default function ExportToExcel (columns: string[], data: any[][], fileName: string) {
    data.unshift(columns);

    const worksheet = XLSX.utils.json_to_sheet(data, { skipHeader: true });
    const workbook = XLSX.utils.book_new();
    
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Alumnos');
    
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], {type: 'application/octet-stream'});

    saveAs(blob, `${fileName}.xlsx`);
};
