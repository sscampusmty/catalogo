import { useState, useEffect } from "react";

import globalStyles from "../input.module.css";
import styles from "./selectInput.module.css";

// TYPES
import { InputProps } from "@/types/Input";
import ActivityIndicator from "@/components/activityIndicator/ActivityIndicator";

export default function SelectInput({
    label,
    value,
    description,
    locked,
    getOptionsMethod,
    onChange
}: InputProps) {
    const [loading, setLoading] = useState(false);
    const [showDescription, setShowDescription] = useState(false);
    const [inputValue, setInputValue] = useState(value ?? "");
    const [opciones, setOpciones] = useState<string[]>(value ? [value] : []);

    useEffect(() => {
        if(opciones?.length > 0 && loading) {
            setLoading(false);
        }
    }, [opciones]);

    useEffect(() => {
        setInputValue(value ?? "");
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
                    <select
                        value={inputValue ?? ""}
                        onClick={() => {
                            if(opciones.length > 1) return;

                            setLoading(true);
                            getOptionsMethod(label, setOpciones)
                        }}
                        onChange={(e) => {
                            onChange(e.target.value);
                            setInputValue(e.target.value);
                        }}
                        className={!inputValue ? styles.placeholderInput : styles.input}
                    >
                        <option value="" disabled hidden={inputValue !== ""}>
                            Selecciona una opcion
                        </option>
                        {opciones.map((option, index) => (
                            <option key={index} value={option} className={styles.option}>
                                {option}
                            </option>
                        ))}
                    </select>
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