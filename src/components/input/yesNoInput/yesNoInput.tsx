import { useEffect, useState } from "react";

import globalStyles from "../input.module.css";
import styles from "./yesNoInput.module.css";

// TYPES
import { InputProps } from "@/types/Input";

export default function YesNoInput({
    label,
    value,
    description,
    locked,
    onChange,
    type,
}: InputProps) {
    const [showDescription, setShowDescription] = useState(false);
    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
        let normalizedTrueValues = ["sí", "si", "yes", "y", "true", "1"];
        let normalizedFalseValues = ["no", "n", "false", "0"];

        if (typeof value === "string") {
            if (normalizedTrueValues.includes(value.toLowerCase())) {
                setInputValue("Sí");
            } else if (normalizedFalseValues.includes(value.toLowerCase())) {
                setInputValue("No");
            } else {
                setInputValue("");
            }
        } else if (typeof value === "boolean") {
            setInputValue(value ? "Sí" : "No");
        }
    }, [value]);

    return (
        <div className={globalStyles.container}>
            <label className={globalStyles.label}>
                {label}

                {description && (
                    <button
                        type="button"
                        aria-label="Show description"
                        onClick={() => setShowDescription((prev) => !prev)}
                        className={globalStyles.infoButton}
                    >
                        <span className={globalStyles.infoIcon}>i</span>
                    </button>
                )}
            </label>
            
            {
                locked ? (
                    <p
                        className={globalStyles.lockedValue}
                        onClick={() => alert("Este campo está bloqueado y no se puede editar.")}
                    >
                        { inputValue }
                    </p>
                ) : (
                    <div className={styles.buttonsContainer}>
                        <button
                            type="button"
                            className={`${styles.button} ${inputValue === "Sí" ? styles.selected : ""}`}
                            onClick={() => {
                                onChange("Sí");
                                setInputValue("Sí");
                            }}
                        >
                            Sí
                        </button>
                        <button
                            type="button"
                            className={`${styles.button} ${inputValue === "No" ? styles.selected : ""}`}
                            onClick={() => {
                                onChange("No");
                                setInputValue("No");
                            }}
                        >
                            No
                        </button>
                    </div>
                )
            }

            {showDescription && description && (
                <div className={globalStyles.description}>
                    {description}
                </div>
            )}
        </div>
    )
}