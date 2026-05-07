import { useState } from "react";

import globalStyles from "../input.module.css";
import styles from "./textInput.module.css";

// TYPES
import { InputProps } from "@/types/Input";

export default function TextInput({
    label,
    value,
    description,
    locked,
    onChange,
    type,
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
                    <input
                        value={inputValue}
                        onChange={(e) => {
                            onChange(e.target.value);
                            setInputValue(e.target.value);
                        }}
                        className={styles.input}
                        type={type}
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