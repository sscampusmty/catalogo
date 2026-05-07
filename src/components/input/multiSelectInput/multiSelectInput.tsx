import { useState, useEffect, useRef } from "react";

import globalStyles from "../input.module.css";
import styles from "./multiSelectInput.module.css";

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
    const [inputValue, setInputValue] = useState(value ?? ""); // "option1" || "option1, option2, option3"
    const [opciones, setOpciones] = useState<string[]>(value ? [value] : []);
    const [showOptions, setShowOptions] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowOptions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleOptionClick = (option: string) => {
        let newValue: string[];
        
        const currentOptions = inputValue ? inputValue.split("[NEXTOPTION] ") : [];

        if(currentOptions.includes(option)) {
            newValue = currentOptions.filter((opt) => opt !== option);
        } else {
            newValue = [...currentOptions, option];
        }
        setInputValue(newValue.join("[NEXTOPTION] "));

        console.log("New value:", newValue.join("[NEXTOPTION] "));

        onChange(newValue.join("[NEXTOPTION] "));
    }

    useEffect(() => {
        if(opciones?.length > 0 && loading) {
            setLoading(false);
        }
    }, [opciones]);

    useEffect(() => {
        setInputValue(value ?? "");
    }, [value]);

    return (
        <div className={globalStyles.container} ref={containerRef}>
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
                    <div
                        onClick={() => {
                            if(opciones.length > 1) return;

                            setLoading(true);
                            getOptionsMethod(label, setOpciones)
                        }}
                        className={!inputValue ? styles.placeholderInput : styles.input}
                    >
                        <p
                            className={styles.inputValue}
                            onClick={(e) => {setShowOptions(!showOptions)}}
                        >
                            {
                                inputValue ? (
                                    inputValue.split("[NEXTOPTION] ").map((option, index) => (
                                        <span key={index} className={styles.selectedOption}>
                                            {option}
                                            {index < inputValue.split("[NEXTOPTION] ").length - 1 && ", "}
                                        </span>
                                    ))
                                ) : "Selecciona una o varias opciones"
                            }
                        </p>

                        {
                            showOptions && opciones.length > 1 && (
                                <div className={styles.optionsContainer}>
                                    {opciones.map((option, index) => (
                                        <p
                                            key={index}
                                            className={styles.option}
                                            onClick={() => handleOptionClick(option)}
                                        >
                                            <span
                                                className={`${styles.checkbox} ${(inputValue ? inputValue.split("[NEXTOPTION] ") : []).includes(option) ? styles.checked : ""}`}
                                            >
                                                {(inputValue ? inputValue.split("[NEXTOPTION] ") : []).includes(option) ? "✓" : ""}
                                            </span>
                                            {option}
                                        </p>
                                    ))}
                                </div>
                            )
                        }
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