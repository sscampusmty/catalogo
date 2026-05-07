// TYPES
import { DialogState } from "@/types/Dialog";

export default function getErrorDialog(errorCode: string): DialogState {
    if(errorCode === "invalid-project-id") {
        return {
            title: "ID DE PROYECTO INVÁLIDO",
            description: "El ID del proyecto no es válido. Por favor, intenta de nuevo",
            type: "error"
        }
    }
    else if (errorCode === "project-not-found") {
        return {
            title: "PROYECTO NO ENCONTRADO",
            description: "No se encontró el proyecto solicitado. Por favor, intenta de nuevo",
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
            description: "Puede que no veas los alumnos de este proyecto o no los puedas editar porque no estamos dentro de un periodo de servicio social",
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
