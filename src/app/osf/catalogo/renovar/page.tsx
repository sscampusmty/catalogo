"use client"
import { useState, useEffect, useCallback, Suspense } from 'react';
import styles from './page.module.css';
// import FormFields from '../FormFields.json';
import { useSearchParams } from 'next/navigation';

// COMPONENTS
import Navbar from "@/components/navbar/Navbar";
import Tabs from "@/components/tabs/Tabs";
import Input from '@/components/input/Input';
import ActivityIndicator from '@/components/activityIndicator/ActivityIndicator';
import Dialog from '@/components/dialog/Dialog';

// UTILS
import GetProject from "@/utils/pages/catalogo/GetProject";
import GetSections from '@/utils/pages/catalogo/GetSections';
import { GetOpciones } from '@/utils/pages/catalogo/GetOpciones';

// TYPES
import { TabFields, Tab } from '@/types/Tabs';
import { DialogState } from '@/types/Dialog';

export default function Proyectos() {
    return (
        <Suspense fallback={
            <main className={styles.main}>
                <Navbar/>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <ActivityIndicator color="var(--primary)" />
                </div>
            </main>
        }>
            <ProyectosContent />
        </Suspense>
    );
}

function ProyectosContent() {
    const API_URL = process.env.API_URL;

    const params = useSearchParams();
    const projectName = params.get("projectName") || "";
    const projectOsf = params.get("osf") || "";
    const row = params.get("row") || "";

    const lockStepsEnabled = true;

    const [showDialog, setShowDialog] = useState<DialogState | null>(null);

    const [loading, setLoading] = useState(true);
    const [loadingFields, setLoadingFields] = useState(false);
    const [columnsData, setColumnsData] = useState<{name: string, key: number}[] | null>(null);
    const [rawProjectData, setRawProjectData] = useState<string[] | null>(null);
    const [tabs, setTabs] = useState<Tab[]>([]);
    const [activeTab, setActiveTab] = useState<Tab>();
    const [fields, setFields] = useState<TabFields>({});
    const [completedSections, setCompletedSections] = useState<string[]>([]);
    const [availableSections, setAvailableSections] = useState<string[]>([]);

    const getIncompleteFields = useCallback((tabName?: string) => {
        if (!tabName) return [];

        const tabFields = fields[tabName];
        if (!tabFields || tabFields.length === 0) return [];
        
        const visibleFields = tabFields.filter(field => field.show !== false && !field.inhabilitado);
        
        const incompleteFields = visibleFields.filter((field) => {
            if(field.tipo === "check") {
                return field.value !== "true";
            }
            const emptyValue = field.value === undefined || field.value === null || field.value === "";
            return emptyValue || field.value.toString().trim().length === 0;
        });
        
        const result = incompleteFields.map(field => field.campo);
        
        return result;
    }, [fields]);

    const isTabComplete = useCallback((tabName?: string) => {
        if (!tabName) return false;
        const tabFields = fields[tabName];

        if (!tabFields) return false;
        if (tabFields.length === 0) return true;

        return getIncompleteFields(tabName).length === 0;
    }, [fields, getIncompleteFields]);

    const showIncompleteTabDialog = (tabName?: string) => {
        const pendingFields = getIncompleteFields(tabName);

        const description = pendingFields.length
            ? `${pendingFields.length === 1
                ? "Falta completar el siguiente campo:"
                : "Faltan completar los siguientes campos:"}
${pendingFields.map(field => `• ${field}`).join('\n')}`
            : "Completa todos los campos visibles antes de continuar.";

        setShowDialog({
            title: "Sección incompleta",
            description,
            type: "error"
        });
    };

    const handleFieldChange = (tab: string, fieldIndex: number, value: string) => {        
        setFields(prev => {
            const updatedFields = { ...prev };
            if (updatedFields[tab] && updatedFields[tab][fieldIndex]) {
                updatedFields[tab][fieldIndex].value = value;
            }
            return updatedFields;
        });

        setRawProjectData(prev => {
            if (!prev || !columnsData) return prev;

            const field = fields[tab][fieldIndex];
            const colIdx = columnsData.find(col => col.name === field.campo)?.key;

            if (colIdx !== undefined && colIdx >= 0) {
                const updatedRawData = [...prev];
                updatedRawData[colIdx] = value;
                return updatedRawData;
            }

            return prev;
        });
    };

    const handleShowHideFields = () => {        
        if(!activeTab || !fields[activeTab.nombre] || !rawProjectData || !columnsData) return;

        for(let field of fields[activeTab.nombre]) {
            if(field.mostrar_campo_si_nombre_del_campo && field.mostrar_campo_si_valor_del_campo) {
                const colIdx = columnsData?.find(col => col.name === field.mostrar_campo_si_nombre_del_campo)?.key || -1;

                let fieldValue = rawProjectData && rawProjectData[colIdx] ? rawProjectData[colIdx] : "";

                if(fieldValue !== field.mostrar_campo_si_valor_del_campo) {
                    field.show = false;
                } else {
                    field.show = true;
                }
            }
        }

        setFields(prev => ({ ...prev }));
    }

    const handleShowHideTabs = () => {
        for(let tab of tabs) {
            if(tab.mostrarSiNombreDelCampo && tab.mostrarSiValorDelCampo) {
                const colIdx = columnsData?.find(col => col.name === tab.mostrarSiNombreDelCampo)?.key || -1;

                let fieldValue = rawProjectData && rawProjectData[colIdx] ? rawProjectData[colIdx] : "";

                if(fieldValue !== tab.mostrarSiValorDelCampo) {
                    tab.hidden = true;

                    if(activeTab?.nombre === tab.nombre) {
                        // If the active tab is the one being hidden, switch to the first available tab
                        const firstVisibleTab = tabs.find(t => !t.hidden);

                        if(firstVisibleTab) {
                            setActiveTab(firstVisibleTab);
                        }
                    }
                }
                else {
                    tab.hidden = false;
                }
            }
        }
    };

    const handleNextTab = (activeTab: Tab) => {
        if (lockStepsEnabled && !isTabComplete(activeTab.nombre)) {
            showIncompleteTabDialog(activeTab.nombre);
            return;
        }

        const currentIndex = tabs.indexOf(activeTab);
        
        let nextIndex = currentIndex + 1;
        while(nextIndex < tabs.length && tabs[nextIndex].hidden) {
            nextIndex++;
        }

        if(nextIndex < tabs.length) {
            const nextTab = tabs[nextIndex];

            if (nextTab?.nombre) {
                setAvailableSections(prev => (
                    prev.includes(nextTab.nombre)
                        ? prev
                        : [...prev, nextTab.nombre]
                ));
            }

            setActiveTab(nextTab);
        }
    }

    const handlePrimaryAction = () => {
        if (!activeTab) return;

        const isLastTab = tabs.indexOf(activeTab) === tabs.length - 1;

        if (isLastTab) {
            if (lockStepsEnabled && !isTabComplete(activeTab.nombre)) {
                showIncompleteTabDialog(activeTab.nombre);
                return;
            }

            handleSendChanges();
            return;
        }

        handleNextTab(activeTab);
    };

    const handleSendChanges = async () => {
        let periodo = "";

        if(rawProjectData && rawProjectData[15]) {
            let periodoValue = rawProjectData[15].toLowerCase();
            periodo = periodoValue.includes("intensivo") || periodoValue.includes("verano") ? "intensivo" : "semestre";
        }

        try {
            const response = await fetch(`${API_URL}/catalogo/updateProject`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    rawProjectData,
                    row,
                    projectName,
                    projectOSF: projectOsf,
                    periodo: periodo,
                })
            });

            if (!response.ok) {
                throw new Error('Error fetching projects');
            } else {
                setShowDialog({
                    title: "Cambios enviados",
                    description: "Los cambios realizados en el proyecto han sido enviados para su revisión.",
                    type: "success"
                });
            }
        } catch (error) {
            setShowDialog({
                title: "Error al enviar los cambios",
                description: `Hubo un error por parte de la aplicación: ${(error as Error).message}`,
                type: "error"
            });
            setLoading(false);
        }
    }

    useEffect(() => {
        GetSections().then((sections: Tab[]) => {
            setTabs(sections);

            const firstVisible = sections.find(section => !section.hidden) || sections[0];
            if (firstVisible?.nombre) {
                setActiveTab(firstVisible);
                setAvailableSections([firstVisible.nombre]);
            }

            const initialSectionName = firstVisible?.nombre || sections[0]?.nombre || "";
            if (!initialSectionName) {
                setLoading(false);
                return;
            }

            GetProject(
                parseInt(row || "0"),
                projectName,
                projectOsf,
                initialSectionName
            )
            .then((response) => {
                if(!response) return;

                setRawProjectData(response.rawProjectData || null);
                setColumnsData(response.columns || null);

                let newFields: TabFields = {};
                newFields[initialSectionName] = response.fields || []

                setFields(newFields);
            })
            .finally(() => {
                setLoading(false);
            });
        });
    }, []);

    useEffect(() => {
        if(!activeTab || fields[activeTab.nombre]) return;

        setLoadingFields(true);

        GetProject(
            parseInt(row || "0"),
            projectName,
            projectOsf,
            activeTab.nombre || "", // Sección
            rawProjectData || undefined
        ).then((response) => {
            if(!response) return;

            setRawProjectData(response.rawProjectData || null);

            let newFields: TabFields = {};
            newFields[activeTab.nombre] = response.fields || [];

            setFields(prev => ({ ...prev, ...newFields }))
        })
        .finally(() => {
            setLoadingFields(false);
        });
    }, [activeTab]);

    useEffect(() => {
        handleShowHideFields();
        handleShowHideTabs();
    }, [activeTab, rawProjectData, columnsData]);

    useEffect(() => {
        if (!lockStepsEnabled || !tabs.length) return;

        const completed = tabs
            .filter(tab => tab.nombre && isTabComplete(tab.nombre))
            .map(tab => tab.nombre);

        setCompletedSections(completed);
    }, [fields, tabs, lockStepsEnabled, isTabComplete]);

    useEffect(() => {
        if (lockStepsEnabled) return;
        if (completedSections.length) {
            setCompletedSections([]);
        }
    }, [lockStepsEnabled, completedSections.length]);

    // Helper to get the value of a field by its name from rawProjectData and columnsData
    const getFieldValue = useCallback((fieldName: string): string | undefined => {
        if (!columnsData || !rawProjectData) return undefined;
        const col = columnsData.find(col => col.name === fieldName);
        if (!col) return undefined;
        return rawProjectData[col.key];
    }, [columnsData, rawProjectData]);

    return (
        <main className={styles.main}>
            <Navbar/>

            <div className={styles.headerContainer}>
                <h1 className={styles.title}>RENOVAR PROYECTO: </h1>
                <div className={styles.metadataContainer}>
                    {
                        !loading && (
                            <h1 className={styles.lastUpdate}>
                                Última actualización:
                                <span>
                                    04/05/2025 14:44 hrs
                                </span>
                            </h1>
                        )
                    }

                    <h2 className={styles.orgName}>
                        {projectName || "Proyecto sin nombre"}
                    </h2>
                </div>
            </div>

            <div className={styles.contentContainer}>
                {
                    activeTab && !loading && (
                        <Tabs
                            options={tabs}
                            selected={activeTab}
                            completedTabs={completedSections}
                            lockSteps={lockStepsEnabled}
                            availableTabs={lockStepsEnabled ? availableSections : tabs.map(tab => tab.nombre)}
                            onSelect={setActiveTab}
                        />
                    )
                }

                {
                    loading || loadingFields && (
                        <div className={styles.inputsContainer}>
                            <ActivityIndicator
                                color='var(--purple)'
                                size={40}
                            />
                        </div>
                    )
                }

                {
                    !loading && !loadingFields && (
                        <div className={styles.formContainer}>

                            {
                                activeTab && (
                                    <div className={styles.inputsContainer}>
                                        {
                                            (fields[activeTab.nombre] || []).map((field, idx) => {
                                                if(field.show !== false) return (
                                                    <Input
                                                        key={`${field.campo}-${idx}-${activeTab.nombre}`}
                                                        label={field.campo}
                                                        type={field.tipo}
                                                        value={field.value}
                                                        description={field.descripcion}
                                                        locked={field.inhabilitado}
                                                        getOptionsMethod={(campo, callback) => GetOpciones(campo, callback, getFieldValue)}
                                                        onChange={(value: string) => handleFieldChange(activeTab.nombre, idx, value)}
                                                    />
                                                )
                                            })
                                        }

                                        <div className={styles.buttonsContainer}>
                                            <button 
                                                className={`${styles.button} ${styles.send}`}
                                                onClick={handlePrimaryAction}
                                            >
                                                {
                                                    tabs.indexOf(activeTab) === tabs.length - 1
                                                        ? "Enviar cambios para revisión"
                                                        : "Siguiente"
                                                }
                                            </button>
                                        </div>

                                        <p className={styles.buttonsInfo}>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
                                        </p>
                                    </div>
                                )
                            }
                        </div>
                    )
                }
            </div>

            <Dialog
                title={ showDialog ? showDialog.title : "" }
                description={ showDialog ? showDialog.description : "" }
                show={ showDialog ? true : false }
                onClose={() => {
                    if(showDialog?.title === "Cambios enviados") {
                        window.history.back();
                    }
                    else {
                        setShowDialog(null)
                    }
                }}
                buttonText="ACEPTAR"
                type={ showDialog ? showDialog.type : "error" }
                color={"var(--purple)"}
            />
        </main>
    )
}
