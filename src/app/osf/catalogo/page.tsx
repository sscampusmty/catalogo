"use client"
import styles from './page.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// COMPONENTS
import Navbar from "@/components/navbar/Navbar";
import ProjectCard from "@/components/projectCard/ProjectCard";
import Popup from '@/components/popup/Popup';
import ProjectListItem from '@/components/projectListItem/ProjectListItem';
import ActivityIndicator from '@/components/activityIndicator/ActivityIndicator';

// UTILS
import CheckUserAuth from "@/utils/auth/CheckUserAuth";
import URLParse from '@/utils/URLParse';

export default function Catalogo() {
    const router = useRouter();
    const API_URL = process.env.API_URL;

    interface Project {
        row: string;
        data: {
            duracion_y_fechas_del_proyecto: string
            modalidad_del_proyecto_solidario: string
            nombre_del_proyecto: string
            nombre_oficial_de_la_osf: string
            periodo: string
        };
        type: "prod" | "intensive" | "semester"
    }

    const [loadingActive, setLoadingActive] = useState(true);
    const [loadingInactive, setLoadingInactive] = useState(true);

    const [showRenewProjectPopup, setShowRenewProjectPopup] = useState(false);

    const [activeProjects, setActiveProjects] = useState<Project[]>([]);
    const [inactiveProjects, setInactiveProjects] = useState<Project[]>([]);
    const [osf, setOsf] = useState("Nombre de la Organización");
    const [UID, setUID] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = CheckUserAuth(setUID, router.push, "");
        return () => unsubscribe();
    }, []);

    const GetActiveProjects = async () => {
        if (!UID) return;

        // FETCH ACTIVE PROJECTS FROM "Producción"
        try {
            const response = await fetch(`${API_URL}/catalogo/getActiveProjects?uid=${UID}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error('Error fetching prod projects');
            }

            const { projects, osf } = await response.json();

            setActiveProjects(prevProjects => [...prevProjects, ...projects]);
            setOsf(osf);
            setLoadingActive(false);
        } catch (error) {
            console.error('Error fetching prod projects:', error);
            setLoadingActive(false);
        }

        // FETCH ACTIVE PROJECTS FROM "Intensivo"
        try {
            const response = await fetch(`${API_URL}/catalogo/getActiveIntensiveProjects?uid=${UID}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error('Error fetching intensive projects');
            }

            const { projects, osf } = await response.json();

            setActiveProjects(prevProjects => [...prevProjects, ...projects]);
            setOsf(osf);
            setLoadingActive(false);
        } catch (error) {
            console.error('Error fetching intensive projects:', error);
            setLoadingActive(false);
        }

        // FETCH ACTIVE PROJECTS FROM "Semestre"
        try {
            const response = await fetch(`${API_URL}/catalogo/getActiveSemesterProjects?uid=${UID}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error('Error fetching semester projects');
            }

            const { projects, osf } = await response.json();

            setActiveProjects(prevProjects => [...prevProjects, ...projects]);
            setOsf(osf);
            setLoadingActive(false);
        } catch (error) {
            console.error('Error fetching semester projects:', error);
            setLoadingActive(false);
        }
    }

    const GetInactiveProjects = async () => {
        if (!UID) return;

        try {
            const response = await fetch(`${API_URL}/catalogo/getInactiveProjects?uid=${UID}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error('Error fetching projects');
            }

            const { projects, osf } = await response.json();

            setInactiveProjects(projects);
            setOsf(osf);
            setLoadingInactive(false);
        } catch (error) {
            console.error('Error fetching projects:', error);
            setLoadingInactive(false);
        }
    }

    const HandleRenewProject = (name: string, row: string) => {
        const projectName = URLParse(name, true);
        const projectOsf = URLParse(osf, true);

        router.push(`/osf/catalogo/renovar?row=${row}&osf=${projectOsf}&projectName=${projectName}`)
    }

    const HandleEditProject = (name: string, row: string) => {
        const projectName = URLParse(name, true);
        const projectOsf = URLParse(osf, true);

        router.push(`/osf/catalogo/proyecto?row=${row}&osf=${projectOsf}&projectName=${projectName}`)
    }

    useEffect(() => {
        if (UID) {
            GetActiveProjects();
            GetInactiveProjects();
        }
    }, [UID]);

    return (
        <main className={styles.main}>
            <Navbar icon>
                {/* <button
                    className={styles.primaryNavButton}
                    onClick={() => {}}
                >
                    CREAR NUEVO PROYECTO
                </button> */}
            </Navbar>

            {
                !loadingActive && (
                    <h1 className={styles.orgName}>{ osf || "---"}</h1>
                )
            }
            
            <h2 className={styles.title}>PROYECTOS SOLIDARIOS</h2>

            <h3 className={styles.subtitle}>PROYECTOS ACTIVOS</h3>
            {
                loadingActive ? (
                    <div className={styles.projectsContainer}>
                        <ActivityIndicator
                            color='var(--purple)'
                            size={40}
                        />
                    </div>
                ) : (
                    <div className={styles.projectsContainer}>
                        {
                            activeProjects.length > 0 ? (
                                activeProjects.map((project, index) => (
                                    <ProjectCard
                                        onEdit={() => HandleEditProject(project.data.nombre_del_proyecto, project.row)}
                                        onRenew={() => HandleRenewProject(project.data.nombre_del_proyecto, project.row)}
                                        project={project.data}
                                        key={index}
                                        active={true}
                                        type={project.type}
                                    />
                                ))
                            ) : (
                                <p className={styles.noProjects}>No hay proyectos disponibles</p>
                            )
                        }
                    </div>
                )
            }

            <h3 className={styles.subtitle}>PROYECTOS INACTIVOS</h3>
            {
                loadingInactive ? (
                    <div className={styles.projectsContainer}>
                        <ActivityIndicator
                            color='var(--purple)'
                            size={40}
                        />
                    </div>
                ) : (
                    <div className={styles.projectsContainer}>
                        {
                            inactiveProjects.length > 0 ? (
                                inactiveProjects.map((project, index) => (
                                    <ProjectCard
                                        onEdit={() => HandleEditProject(project.data.nombre_del_proyecto, project.row)}
                                        onRenew={() => HandleRenewProject(project.data.nombre_del_proyecto, project.row)}
                                        project={project.data}
                                        key={index}
                                        active={false}
                                    />
                                ))
                            ) : (
                                <p className={styles.noProjects}>No hay proyectos disponibles</p>
                            )
                        }
                    </div>
                )
            }
        </main>
    )
}
