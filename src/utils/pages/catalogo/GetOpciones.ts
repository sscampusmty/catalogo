/**
 * Fetches options for a field, handling conditional options.
 * If an option contains mostrar_opcion_si_nombre_del_campo and mostrar_opcion_si_valor_del_campo,
 * it will only be included if the value of the referenced field matches.
 * @param campo The field for which to fetch options
 * @param callback Callback to receive the filtered options
 * @param getFieldValue Optional function to get the value of a field (for conditional options)
 */
export async function GetOpciones(
    campo: string,
    callback: (options: string[]) => void,
    getFieldValue?: (fieldName: string) => string | undefined
) {
    const API_URL = process.env.API_URL;

    try {
        const response = await fetch(`${API_URL}/catalogo/getOptions?field=${encodeURIComponent(campo)}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            console.error("Failed to fetch options:", response.statusText);
            return [];
        }

        const data = await response.json();

        const options = (data?.options || [])
            .filter((opt: any) => {
                if (
                    opt.mostrar_opcion_si_nombre_del_campo &&
                    opt.mostrar_opcion_si_valor_del_campo &&
                    typeof getFieldValue === 'function'
                ) {
                    const fieldValue = getFieldValue(opt.mostrar_opcion_si_nombre_del_campo);
                    return fieldValue === opt.mostrar_opcion_si_valor_del_campo;
                }
                return true;
            })
            .map((opt: any) => opt.opcion) || [];

        callback(options);
    } catch (error) {
        console.error("Error fetching options:", error);
        return [];
    }
}

/**
 * Fetches renewal options for a field, handling conditional options.
 * If an option contains mostrar_opcion_si_nombre_del_campo and mostrar_opcion_si_valor_del_campo,
 * it will only be included if the value of the referenced field matches.
 * @param campo The field for which to fetch options
 * @param callback Callback to receive the filtered options
 * @param getFieldValue Optional function to get the value of a field (for conditional options)
 */
export async function GetOpcionesRenovacion(
    campo: string,
    callback: (options: string[]) => void,
    getFieldValue?: (fieldName: string) => string | undefined
) {
    const API_URL = process.env.API_URL;

    try {
        const response = await fetch(`${API_URL}/catalogo/getRenewOptions?field=${encodeURIComponent(campo)}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            console.error("Failed to fetch options:", response.statusText);
            return [];
        }

        const data: { options: {
            campo: string;
            mostrar_opcion_si_nombre_del_campo?: string;
            mostrar_opcion_si_valor_del_campo?: string;
            opcion: string;
        }[] } = await response.json();

        const options = (data?.options || [])
            .filter((opt: any) => {
                if (
                    opt.mostrar_opcion_si_nombre_del_campo &&
                    opt.mostrar_opcion_si_valor_del_campo &&
                    typeof getFieldValue === 'function'
                ) {
                    const fieldValue = getFieldValue(opt.mostrar_opcion_si_nombre_del_campo);
                    return fieldValue === opt.mostrar_opcion_si_valor_del_campo;
                }
                return true;
            })
            .map((opt: any) => opt.opcion) || [];

        callback(options);
    } catch (error) {
        console.error("Error fetching options:", error);
        return [];
    }
}