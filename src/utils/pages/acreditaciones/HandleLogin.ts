import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

import app from '@/utils/firebase/config';

// TYPES
import { DialogState } from "@/types/Dialog";
type OnErrorCallback = (dialog: DialogState | null) => void;
type OnLoadingCallback = (loading: boolean) => void;

function getErrorDialog(errorCode: string): DialogState | null {
    if(errorCode === "auth/invalid-email") {
        return {
            title: "NOMBRE INVÁLIDO",
            description: "El nombre ingresado no es válido. Revisa mayúsculas, minúsculas, símbolos y espacios",
            type: "error"
        };
    }
    else if(errorCode === "auth/missing-password") {
        return {
            title: "CONTRASEÑA FALTANTE",
            description: "Ingresa la contraseña asignada para tu cuenta para poder acceder a la plataforma",
            type: "warning"
        };
    }
    else if (errorCode === "auth/invalid-credential") {
        return {
            title: "CREDENCIALES INCORRECTAS",
            description: "Las credenciales ingresadas son incorrectas, revisa mayúsculas, minúsculas, símbolos y espacios",
            type: "error"
        };
    }
    else if(errorCode === "missing-user") {
        return {
            title: "NOMBRE FALTANTE",
            description: "Ingresa el nombre de tu institución para poder acceder a la plataforma",
            type: "warning"
        };
    }
    else if(errorCode === "missing-password") {
        return {
            title: "CONTRASEÑA FALTANTE",
            description: "Ingresa la contraseña asignada para tu cuenta para poder acceder a la plataforma",
            type: "warning"
        };
    }
    else {
        return {
            title: `ERROR ${errorCode}`,
            description: "Ha ocurrido un error inesperado, por favor intenta de nuevo, si el problema persiste contacta a soporte técnico",
            type: "error"
        };
    }
}

export default async function HandleLogin(
    username: string,
    password: string,
    onError: OnErrorCallback,
    onLoading: OnLoadingCallback,
): Promise<string | null> {    
    onLoading(true);

    const auth = getAuth(app);

    if(username === "" || password === "") {
        const errorCode = username === "" ? "missing-user" : "missing-password";
        onError(getErrorDialog(errorCode));
        onLoading(false);
        return null;
    }

    username = `${username.replace(/[^a-zA-Z0-9]/g, '')}@gmail.com`

    try {
        const { user } = await signInWithEmailAndPassword(auth, username, password);
        return user?.uid ? user?.uid : null;
        // if(user?.uid) {
        //     redirect(`/acreditaciones/${user?.uid}/proyectos`);
        // }
    } catch (e: any) {
        onError(getErrorDialog(e.code));
        onLoading(false);
        return null;
    }    
}
