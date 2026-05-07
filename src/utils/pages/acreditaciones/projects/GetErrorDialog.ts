// TYPES
import { DialogState } from "@/types/Dialog";

export default function getErrorDialog(errorCode: string): DialogState {
    if(errorCode === "invalid-organization-id") {
        return {
            title: "ID DE ORGANIZACIÓN INVÁLIDO",
            description: "El ID de la organización no es válido. Por favor, intenta de nuevo",
            type: "error"
        }
    }
    else if(errorCode === "organization-not-found") {
        return {
            title: "ORGANIZACIÓN NO ENCONTRADA",
            description: "No se encontró la organización con el ID proporcionado",
            type: "error"
        }
    }
    else if(errorCode.includes("network-error")) {
        return {
            title: `ERROR DE RED (${errorCode.split("-")[2]})`,
            description: "Hubo un error al intentar conectarse al servidor. Por favor, intenta de nuevo",
            type: "error"
        }
    }
    else if(errorCode === "no-active-period") {
        return {
            title: "FUERA DE PERIODO DE ACREDITACIONES",
            description: "Puede que no veas tus proyectos porque no estamos dentro de un periodo de servicio social",
            type: "warning",
            buttonText: "ACEPTAR"
        }
    }
    else {
        return {
            title: "ERROR DESCONOCIDO",
            description: `Ocurrió un error desconocido: ${errorCode}`,
            type: "error"
        }
    }
}
