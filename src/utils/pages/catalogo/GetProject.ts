import { columNameToNumber } from "@/utils/SheetColumnsUtils";
import URLParse from "@/utils/URLParse";

const API_URL = process.env.API_URL;

type SectionFieldsResponse = {
    fields: {
        campo: string;
        tipo: "opciones" | "multiselect" | "texto" | "texto largo" | "check" | "número" | "teléfono" | "email" | "Sí / No";
        descripcion: string;
        inhabilitado: boolean;
        se_muestra_en_el_catalogo: boolean;
        mostrar_campo_si_nombre_del_campo?: string;
        mostrar_campo_si_valor_del_campo?: string;
        imagen?: string;
        maximo_de_opciones_a_elegir?: number;
        obligatorio_actualizar_en_renovacion?: boolean;
        column?: string;
        value: any;
    }[]
}

async function GetRawProjectData(row: number, projectName: string, osf: string) {
    try {
        projectName = URLParse(projectName);
        osf = URLParse(osf);

        const response = await fetch(`${API_URL}/catalogo/getProjectRawData?row=${row}&projectName=${projectName}&osf=${osf}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            throw new Error('Error fetching project data');
        }

        const {data, columns}: { data: string[], columns: {name: string, key: number}[]} = await response.json() || [];

        return {data, columns}
    }
    catch (error) {
        console.error('Error fetching raw project data:', error);
        return null;
    }
}

export default async function GetProject(row: number, projectName: string, osf: string, section: string, projectData?: any[]) {
    try {
        section = URLParse(section);

        const fieldsResponse = await fetch(`${API_URL}/catalogo/getSectionFields?section=${section}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!fieldsResponse.ok) {
            throw new Error('Error fetching fields data');
        }

        let columns: {name: string, key: number}[] = [];

        if(!projectData) {
            const result = await GetRawProjectData(row, projectName, osf);

            if(!result) return null;

            projectData = result.data || [];
            columns = result.columns || [];
        }

        const fields: SectionFieldsResponse["fields"] = (await fieldsResponse.json()).fields || [];

        for(let field of fields) {
            const idx = columNameToNumber(field.column || "") - 1;

            let value = idx >= 0 && projectData[idx] ? projectData[idx] : "";

            if(field.tipo === "check") {
                value = value == "" ? undefined : value.toString().toLowerCase() === "true" ? true : false;
            }
            else if(field.tipo === "número") {
                value = parseFloat(value) || 0;
            }
            else if(field.tipo === "Sí / No") {
                value = value == "" ? undefined : value.toString().toLowerCase() === "sí" ? true : false;
            }

            field["value"] = value;
        }

        return {
            fields,
            rawProjectData: projectData,
            columns: columns
        };
    }
    catch (error) {
        console.error('Error fetching project:', error);
        return null;
    }
}
