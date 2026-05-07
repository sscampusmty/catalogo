import { useId, useState } from "react";

import globalStyles from "../input.module.css";
import styles from "./checkInput.module.css";

// TYPES
import { InputProps } from "@/types/Input";

export default function TextInput({
    label,
    value,
    description,
    locked,
    onChange,
}: InputProps) {
    const [showDescription, setShowDescription] = useState(false);
    const [inputValue, setInputValue] = useState(value);
    const inputId = useId();
    
    return (
        <div className={styles.inlineInputContainer}>
            <div className={styles.textGroup}>
                <label className={styles.label} htmlFor={inputId}>
                    {label}
                </label>

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
            </div>

            <input
                type="checkbox"
                id={inputId}
                checked={(inputValue || "").toString().toLowerCase() === "true"}
                onChange={(e) => {
                    const newValue = e.target.checked ? "true" : "";
                    onChange(newValue);
                    setInputValue(newValue);
                }}
                className={styles.checkbox}
                disabled={locked}
            />

            {showDescription && description && (
                <div className={globalStyles.description}>
                    {description}
                </div>
            )}
        </div>
    )
}