import { useState } from "react";

import globalStyles from "../input.module.css";
import styles from "./textAreaInput.module.css";

// TYPES
import { InputProps } from "@/types/Input";

export default function TextAreaInput({
    label,
    value,
    description,
    locked,
    onChange
}: InputProps) {
    const [showDescription, setShowDescription] = useState(false);
    const [inputValue, setInputValue] = useState(value);

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
                    <textarea
                        value={inputValue}
                        onChange={(e) => {
                            onChange(e.target.value);
                            setInputValue(e.target.value);
                        }}
                        className={styles.input}
                        rows={4}
                        cols={50}
                    />
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