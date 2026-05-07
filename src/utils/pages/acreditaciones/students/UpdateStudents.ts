// UTILS
import GetWelcomeMessage from "@/utils/pages/acreditaciones/GetWelcomeMessage";
import GenerateToken from "@/utils/GenerateToken";

// TYPES
import { Column } from "@/types/Table";
import { DialogState } from "@/types/Dialog";

export default async function UpdateStudents(
    projectID: string,
    students: {data: any[][]; row: number;}[],
    maxHours: number,
    dataSaved: 0|1|-1,
    onDataSaved: (state: 0|1|-1) => void,
    onDialog: (dialog: DialogState | null) => void
) {
    if(GetWelcomeMessage() == "No hay periodo de servicio social activo") {
        onDialog({
          title: "Periodo de acreditaciones inactivo",
          description: "No se puede guardar la tabla de alumnos porque periodo de acreditaciones no está activo.",
          type: "warning"
        });
        return;
    }

    // @ts-ignore
    if(students.some(student => parseInt(student.data[5]) > maxHours)) {
        onDialog({
            title: "Máximo de horas excedido",
            description: "Algunos alumnos han excedido el máximo de horas permitidas. Por favor, ajusta las horas antes de enviar.",
            type: "warning"
        });
        return;
    }

    // @ts-ignore
    if(students.some(student => isNaN(parseInt(student.data[5])))) {
        onDialog({
            title: "Faltan alumnos con horas acreditadas",
            description: "Hay alumnos sin horas acreditadas, o con horas acreditadas en un formato incorrecto. Por favor, revisa los datos antes de enviar.",
            type: "warning"
        });
        return;
    }

    // @ts-ignore
    if(students.some(student => parseInt(student.data[5])%10)) {
        onDialog({
            title: "Horas acreditadas incorrectas",
            description: "Las horas acreditadas deben ser múltiplos de 10. Por favor, ajusta las horas antes de enviar.",
            type: "warning"
        });
        return;
    }

    if(dataSaved == 1) {
        onDialog({
            title: "No hay cambios por guardar",
            description: "No se han realizado cambios en la tabla, por lo que no hay nada que guardar.",
            type: "warning"
        });
    }
    else if(dataSaved == -1) {
        return;
    }
    else {
        onDataSaved(-1); // Loading

        fetch(`${process.env.API_URL}/updateStudents?projectID=${projectID}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                students, 
                uid: projectID,
                token: GenerateToken(projectID)
            })
        })
        .then(res => {
            if(res.status === 200) {
                return res.json();
            } else {
                onDialog({
                    title: "Error al guardar cambios",
                    description: "Hubo un error al guardar los cambios en la base de datos. Por favor, intenta de nuevo.",
                    type: "error"
                });
            }
        })
        .then(data => {
            console.log(data);
            onDataSaved(1);
            onDialog({
                title: "Cambios guardados",
                description: "Los cambios se enviaron y guardaron correctamente en nuestra base de datos",
                type: "success"
            });
        })
        .catch(err => {
            onDialog({
                title: "Error al guardar cambios",
                description: err,
                type: "error"
            });
        });
    }
}
