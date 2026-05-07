import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "../firebase/config";

export default function CheckUserAuth(
    setUserUID: (uid: string | null) => void,
    redirect: (route: string) => void,
    route: string = "/osf/login"
): () => void {
    const auth = getAuth(app);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            setUserUID(user.uid);
        } else {
            alert('No estás autenticado. Por favor, inicia sesión.');
            redirect(route);
        }
    });

    return () => unsubscribe();
}
