"use client"
import styles from "./page.module.css";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// HELPER FUNCTIONS
import GetWelcomeMessage from "@/utils/pages/acreditaciones/GetWelcomeMessage";
import HandleLogin from "@/utils/pages/acreditaciones/HandleLogin";

// COMPONENTS
import Navbar from "@/components/navbar/Navbar";
import Dialog from "@/components/dialog/Dialog";
import Icon from "@/components/icon/Icon";
import ActivityIndicator from "@/components/activityIndicator/ActivityIndicator";

// TYPES
import { DialogState } from "@/types/Dialog";


export default function Login() {
  return (
    <Suspense fallback={
      <main className={styles.main}>
        <Navbar/>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <ActivityIndicator color="var(--primary)" />
        </div>
      </main>
    }>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const params = useSearchParams();

  const page = params.get("page") || "acreditaciones";

  const WelcomeMessage = page == "acreditaciones" ? GetWelcomeMessage() : null;

  const [org, setOrg] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showDialog, setShowDialog] = useState<DialogState | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <main className={styles.main}>
      <Navbar/>
      <h1 className={styles.title}>{
        page == "acreditaciones" ? "PLATAFORMA DE ACREDITACIONES" : "CATALOGO DE PROYECTOS"
      }</h1>

      <p className={styles.welcomeMessage} style={{ maxWidth: page == "acreditaciones" ? "100%" : "80ch" }}>
        {
          WelcomeMessage ? WelcomeMessage :
          "¡Bienvenido al catálogo de proyectos de servicio social! Aquí podrás explorar y gestionar tus proyectos registrados de servicio social."
        }
      </p>

      <div className={styles.loginContainer} style={{ backgroundColor: page == "acreditaciones" ? "var(--blue)" : "var(--purple)" }}>
        <h2 className={styles.loginTitle}>INICIAR SESIÓN</h2>
        <p className={styles.loginDescription}>
          Accede con las credenciales (usuario y contraseña) que te
          fueron asignadas
        </p>

        <div className={styles.inputContainer}>
          <label htmlFor="org">NOMBRE DE LA INSTITUCIÓN:</label>

          <div className={styles.inputInsideContainer}>
            <Icon
              name="user"
              color={page === "acreditaciones" ? "var(--blue)" : "var(--purple)"}
              size="1.4rem"
            />
            <input
              type="text"
              id="org"
              name="org"
              onChange={(e) => setOrg(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.inputContainer}>
          <label htmlFor="password">CONTRASEÑA:</label>

          <div className={styles.passwordInputContainer}>
            <div className={styles.inputInsideContainer}>
              <Icon
                name="lock"
                color={page === "acreditaciones" ? "var(--blue)" : "var(--purple)"}
                size="1.4rem"
              />
              <input
                type={ showPassword ? "text" : "password" }
                id="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              className={styles.passwordButton}
              onClick={() => setShowPassword(!showPassword)}
              style={{
                backgroundColor: page === "acreditaciones" ? "var(--blue)" : "var(--purple)"
              }}
            >
              <Icon
                name={ showPassword ? "eye" : "closed-eye" }
                color="var(--white)"
                size="1.3rem"
              />
              { showPassword ? "OCULTAR" : "MOSTRAR" } CONTRASEÑA
            </button>
          </div>
        </div>
      </div>

      <button
        className={styles.loginButton}
        disabled={loading}
        onClick={() => {
          HandleLogin(org, password, setShowDialog, setLoading)
          .then((uid) => {
            if(uid) {
              if(page === "acreditaciones") {
                router.push(`/osf/acreditaciones/proyectos`);
              } else {
                router.push(`/osf/catalogo`);
              }
            }
          })
        }}
      >
        {
          loading ? (
            <ActivityIndicator
              color="var(--white)"
              size="1.8rem"
            />
          ) : (
            "ENTRAR"
          )
        }
      </button>

      <Dialog
        title={ showDialog ? showDialog.title : "" }
        description={ showDialog ? showDialog.description : "" }
        show={ showDialog ? true : false }
        onClose={() => setShowDialog(null)}
        buttonText="INTENTAR DE NUEVO"
        type={ showDialog ? showDialog.type : "error" }
      />
    </main>
  );
}
