"use client"
import { useEffect, useState, } from "react";
import { useRouter } from 'next/navigation';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import app from '@/utils/firebase/config';

// COMPONENTS
import Navbar from "@/components/navbar/Navbar";
import Dialog from "@/components/dialog/Dialog";
import ActivityIndicator from "@/components/activityIndicator/ActivityIndicator";

// UTILS
import GenerateToken from "@/utils/GenerateToken";

// STYLES
import styles from "./page.module.css";

export default function Admin() {
    const router = useRouter();

    const API_URL = process.env.API_URL;

    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    const [user, setUser] = useState<any>(null);
    const [authorizedUser, setAuthorizedUser] = useState<boolean|null>(null);

    const [loading, setLoading] = useState<{users: boolean, data: boolean}>({users: false, data: false});

    const [logs, setLogs] = useState<any>({
        createUsers: "",
        loadDatabase: "",
    });

    const ValidateUser = () => {
        if(user?.emailVerified) {
            return (process.env.AUTHORIZED_EMAILS || "").split(",").includes(user?.email)
        } else {
            return false
        }
    }

    const LoadDatabase = async () => {
        setLoading({
            ...loading,
            data: true,
        });

        if(ValidateUser()) {
            console.log("Cargando base de datos...")
            console.log(JSON.stringify({ token: GenerateToken(user?.uid) }));

            await fetch(`${API_URL}/loadDatabase?token=${GenerateToken(user?.uid)}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token: GenerateToken(user?.uid) })
            })
            .then(response => response.json())
            .then(data => {
                setLogs({
                    ...logs,
                    loadDatabase: data?.message,
                })
            })
            .catch(error => {
                alert("Error al cargar la base de datos, por favor intenta de nuevo")
                setLogs({
                    ...logs,
                    loadDatabase: error,
                })
            })
            .finally(() => {
                setLoading({
                    ...loading,
                    data: false,
                })
            })
        } else {
            alert("No tienes permisos para realizar esta acción")
        }
    };

    const CreateUsers = async () => {
        setLoading({
            ...loading,
            users: true,
        })
        if(ValidateUser()) { 
            await fetch(`${API_URL}/createUsers?token=${GenerateToken(user?.uid)}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    onlyActive: true,
                    token: GenerateToken(user?.uid),
                })
            })
            .then(response => response.json())
            .then(data => {
                if(data.error.message == "Failed to create any new users") {
                    const nonCreatedOrgs = data.error.failedOrgs.orgs.filter((org: any) => org.error !== "auth/email-already-in-use")

                    if(nonCreatedOrgs.length === 0) {
                        data = "No hay organizaciones con usuarios pendientes por crear"
                    }
                    else {
                        data = `No se pudieron crear los siguientes usuarios: ${`\n\n`} ${data.error.failedOrgs.orgs.map((org: any) => `Organización: ${org.organization} - Error: ${org.error}`).join(`${'\n'}`)}`
                    }
                }

                setLogs({
                    ...logs,
                    createUsers: data,
                })
            })
            .catch(error => {
                alert("Error al crear usuarios, por favor intenta de nuevo")

                setLogs({
                    ...logs,
                    createUsers: error
                })
            })
            .finally(() => {
                setLoading({
                    ...loading,
                    users: false,
                })
            })
        } else {
            alert("No tienes permisos para realizar esta acción")
        }
    };

    useEffect(() => {
        if(!user && !auth.currentUser) {
            signInWithPopup(auth, provider)
            .then((result) => {
                setUser({
                    email: result.user.email,
                    emailVerified: result.user.emailVerified,
                    uid: result.user.uid,
                });
            }).catch((error) => {
                console.log(error)
            })
        }
    }, []);

    useEffect(() => {
        if (user) {
            if(!ValidateUser()) {
                setAuthorizedUser(false);
                signOut(auth);
            } else {
                setAuthorizedUser(true);
            }
        }
    }, [user]);

    return (
        <div className={styles.main}>
            <Navbar/>
            {
                authorizedUser === true ? (
                    <div>
                        {
                            loading.users ? (
                                <ActivityIndicator/>
                            ) : (
                                <button
                                    style={{
                                        backgroundColor: "var(--blue)",
                                        border: "2px solid var(--white)",
                                        display: "flex",
                                        alignItems: "center",
                                        cursor: "pointer",
                                        color: "var(--white)",
                                        height: "2.5rem",
                                        borderRadius: "5px",
                                        textTransform: "uppercase",
                                        padding: "0 1.5rem",
                                    }}
                                    onClick={() => CreateUsers()}
                                >
                                    Crear Usuarios
                                </button>
                            )
                        }
                        <p>
                            {JSON.stringify(logs.createUsers)?.replaceAll('"', "")}
                        </p>
                        {
                            loading.data ? (
                                <ActivityIndicator/>
                            ) : (
                                <button
                                    style={{
                                        backgroundColor: "var(--blue)",
                                        border: "2px solid var(--white)",
                                        display: "flex",
                                        alignItems: "center",
                                        cursor: "pointer",
                                        color: "var(--white)",
                                        height: "2.5rem",
                                        borderRadius: "5px",
                                        textTransform: "uppercase",
                                        padding: "0 1.5rem",
                                        marginTop: "6vh"
                                    }}
                                    onClick={() => LoadDatabase()}
                                >
                                    Cargar Base de Datos
                                </button>
                            )
                        }
                        <p>
                            {JSON.stringify(logs.loadDatabase)?.replaceAll('"', "")}
                        </p>
                    </div>
                ) : (
                    <Dialog
                        title="USUARIO NO AUTORIZADO"
                        description="No tienes permisos para acceder a esta página"
                        show={authorizedUser === false ? true : false}
                        onClose={() => router.push("/acreditaciones")}
                        type="error"
                    />
                )
            }
        </div>
    )
}
