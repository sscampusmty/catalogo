"use client"
import styles from "./page.module.css";

import Columns from "@/utils/pages/acreditaciones/columns.json";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// HELPER FUNCTIONS
import URLParse from "@/utils/URLParse";
import GetProjects from '@/utils/pages/acreditaciones/projects/GetProjects';
import CheckUserAuth from "@/utils/auth/CheckUserAuth";

// COMPONENTS
import Navbar from "@/components/navbar/Navbar";
import Dialog from "@/components/dialog/Dialog";
import Table from "@/components/table/Table";

// TYPES
import { DialogState } from "@/types/Dialog";
import { Column } from '@/types/Table';

export default function Home() {
  const router = useRouter();

  const columns = Columns["projects"] as Column[] || [];

  const [UID, setUID] = useState<string|null>(null);

  const [projects, setProjects] = useState<any[][]>();
  const [projectIds, setProjectIds] = useState<string[]>([]);
  const [organization, setOrganization] = useState<string>("");

  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  function setData(data: {organization: string, projects: {data: any[][], id: string}[]}) {
    setOrganization(data.organization);

    let projectsArray: any[][] = [];
    let projectIdsArray: string[] = [];

    data.projects.forEach((project: {data: any[][], id: string}) => {
      projectsArray.push(project.data);
      projectIdsArray.push(project.id);
    });

    setProjects(projectsArray);
    setProjectIds(projectIdsArray);
  }

  useEffect(() => {
    const unsubscribe = CheckUserAuth(setUID, router.push);
    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    if(UID && UID !== "") {
      GetProjects(UID, setData, setLoading, setDialog);
    }
  }, [UID]);

  return (
    <main className={styles.main}>
      <Navbar/>

      <h1 className={styles.title}>PROYECTOS</h1>
      <h2 className={styles.orgName}>{ organization }</h2>

      <Table
        columns={ columns || [] }
        data={ projects || [] }
        onUpdateTableData={setProjects}
        onRowClick={(row) => {
          if(!projects) return;
          
          const projectId = projectIds[row.index];
          const projectName = URLParse(projects[row.index][0]);
          const maxHours = URLParse(btoa(projects[row.index][5]));
          
          router.push(`/acreditaciones/alumnos?proyecto=${projectName}&id=${projectId}&max=${maxHours}`);
        }}
        className={styles.table}
        loading={loading}
      />

      <Dialog
        title={ dialog ? dialog.title : "" }
        description={ dialog ? dialog.description : "" }
        show={ dialog ? true : false }
        onClose={() => setDialog(null)}
        buttonText="ACEPTAR"
        type={ dialog ? dialog.type : "error" }
      />
    </main>
  );
}
