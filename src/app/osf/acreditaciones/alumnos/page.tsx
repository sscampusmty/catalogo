"use client"
import styles from "./page.module.css";

import Columns from "@/utils/pages/acreditaciones/columns.json";
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

// COMPONENTS
import Navbar from "@/components/navbar/Navbar";
import Dialog from "@/components/dialog/Dialog";
import Table from "@/components/table/Table";
import Icon from "@/components/icon/Icon";
import ActivityIndicator from "@/components/activityIndicator/ActivityIndicator";

// HELPER FUNCTIONS
import URLParse from "@/utils/URLParse";
import GetStudents from "@/utils/pages/acreditaciones/students/GetStudents";
import UpdateStudents from "@/utils/pages/acreditaciones/students/UpdateStudents";
import ExportToExcel from "@/utils/pages/acreditaciones/students/ExportToExcel";
// import SearchStudents from "@/utils/pages/acreditaciones/students/SearchStudents";

// TYPES
import { DialogState } from "@/types/Dialog";
import { Column } from '@/types/Table';
import BadgesPopup from "./components/BadgesPopup";

export default function Home() {
  const params = useSearchParams();
  
  const projectName = URLParse(params.get("proyecto") || "");
  const projectID = URLParse(params.get("id") || "");
  const maxHours = parseInt(atob(URLParse(params.get("max") || "", true)));

  const [columns, setColumns] = useState(Columns["students"] as Column[] || []);
  const [students, setStudents] = useState<{data: any[][], row: number}[]>([]);

  const [dataSaved, setDataSaved] = useState<0|1|-1>(1); // 0 = false, 1 = true, -1 = saving cahnges
  const [loading, setLoading] = useState<boolean>(true);
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [showBadgesPopup, setShowBadgesPopup] = useState<boolean>(false);

  function setData(data: any) {
    setColumns(columns.slice(0, -1));
    setStudents(data);
  }

  function updateTable(data: any[][]) {
    const newData = data.map((student, index) => {
      return {
        data: student,
        row: students[index].row
      }
    });

    setStudents(newData);
    setDataSaved(0);
  }

  function exportToExcel() {
    if(dataSaved == 0) {
      setDialog({
        title: "Cambios sin guardar",
        description: "Debes guardar los cambios antes de exportar la tabla a Excel.",
        type: "warning"
      });

      return;
    };

    ExportToExcel(columns.map(col => col.name), students.map(student => student?.data), URLParse(projectName, true))
  }

  useEffect(() => {
    GetStudents(projectID, setData, setLoading, setDialog);
  }, []);

  return (
    <main className={styles.main}>
      <Navbar/>

      <div className={styles.header}>
        <h1 className={styles.title}> { URLParse(projectName, true) } </h1>
        
        {/* <div className={styles.searchbar}>
          <input
            type="text"
            placeholder="Buscar"
            className={styles.input}
            // onChange={(e) => SearchStudents(e.target.value, students, setStudentsCopy, setStudents)}
          />
          <Icon
            name="search"
            color="var(--gray)"
            size="20px"
          />
        </div> */}
      </div>

      <Table
        columns={ columns || [] }
        data={ students.map(student => student?.data) || [] }
        onUpdateTableData={updateTable}
        onColumnDetailsClick={() => setShowBadgesPopup(true)}
        className={styles.table}
        loading={loading}
      />

      <div className={styles.buttonsContainer}>
        <button
          className={styles.downloadButton}
          title="Descargar la tabla en formato Excel"
          onClick={() => exportToExcel()}
        >
          <Icon
            name="excel"
            color="var(--white)"
            size="24px"
            className={styles.downloadButtonIcon}
          />

          DESCARGAR A EXCEL
        </button>
        <button
          className={dataSaved == 1 || dataSaved == -1 ? styles.disabledButton : styles.saveButton}
          title="Enviar y guardar cambios en la base de datos"
          onClick={() => UpdateStudents(projectID, students, maxHours, dataSaved, setDataSaved, setDialog)}
        >
          {
            dataSaved == -1 && (
              <ActivityIndicator color="white" className={styles.activityIndicator} />
            )
          }
          {dataSaved == -1 ? "ENVIANDO" : "ENVIAR"}
        </button>
      </div>

      <Dialog
        title={ dialog ? dialog.title : "" }
        description={ dialog ? dialog.description : "" }
        show={ dialog ? true : false }
        onClose={() => setDialog(null)}
        buttonText="ACEPTAR"
        type={ dialog ? dialog.type : "error" }
      />

      <BadgesPopup
        show={showBadgesPopup}
        onClose={() => setShowBadgesPopup(false)}
      />
    </main>
  );
}
