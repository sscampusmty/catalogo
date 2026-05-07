"use client"
import styles from "./dialog.module.css";

import { useEffect } from 'react';

// COMPONENTS
import Icon from "../icon/Icon";

type DialogProps = {
    title: string;
    description: string;
    show: boolean;
    type?: "info" | "success" | "warning" | "error";
    decision?: boolean;
    buttonText?: string;
    color?: string;
    onClose: () => void;
    onAccept?: () => void;
}

export default function Dialog({
        title,
        description,
        show,
        onAccept,
        onClose,
        decision,
        type = "info",
        buttonText,
        color
    }: DialogProps) {

    useEffect(() => {
        if(show) {
            document.querySelector(`.${styles.background}`)?.classList.add(styles.show);
            document.querySelector(`.${styles.dialogContainer}`)?.classList.add(styles.show);
        } else {
            document.querySelector(`.${styles.background}`)?.classList.remove(styles.show);
            document.querySelector(`.${styles.dialogContainer}`)?.classList.remove(styles.show);
        }
    }, [show]);

    const accentColor = color ? color : type == "error" ? "var(--red)" : type == "warning" ? "var(--orange)" : type == "success" ? "var(--blue)" : "black";

    return (
        <div className={styles.background}>
            <div className={styles.dialogContainer}>
                <Icon
                    name="x"
                    size="24px"
                    color={"black"}
                    onClick={() => onClose()}
                    className={styles.closeButton}
                />

                <div className={styles.titleContainer}>
                    <Icon
                        name={type == "success" ? "star" : type}
                        size="24px"
                        color={accentColor}
                    />
                    <h2 className={styles.title}> {title.toUpperCase()} </h2>
                </div>
                <p className={styles.description}> {description} </p>
                
                <div className={styles.dialogButtons}>
                    <button
                        className={styles.cancelButton}
                        onClick={() => onClose()}
                        style={{
                            backgroundColor: decision ? "var(--white)" : accentColor,
                            color: decision ? accentColor : "var(--white)",
                            border: decision ? `2px solid ${accentColor}` : "none"
                        }}
                    >
                        { decision ? "CANCELAR" : buttonText ? buttonText : "ACEPTAR" }
                    </button>
                    {
                        decision && (
                            <button
                                className={styles.acceptButton}
                                onClick={() => onAccept && onAccept()}
                                style={{ backgroundColor: accentColor }}
                            >
                                { buttonText ? buttonText : "ACEPTAR" }
                            </button>
                        )
                    }
                </div>
            </div>
        </div>
    )
}
