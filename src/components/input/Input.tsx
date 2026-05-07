import { useEffect, useState } from "react";
import styles from "./input.module.css";

// COMPONENTS
import TextInput from "./textInput/textInput";
import TextAreaInput from "./textAreaInput/textAreaInput";
import SelectInput from "./selectInput/selectInput";
import MultiSelectInput from "./multiSelectInput/multiSelectInput";
import YesNoInput from "./yesNoInput/yesNoInput";
import CheckInput from "./checkInput/checkInput";

// TYPES
import { InputProps } from "@/types/Input";

const Input: React.FC<InputProps> = (props) => {
    return (
        <div>
            {
                props.type === "texto" || props.type === "número" || props.type === "teléfono" || props.type === "email" ? (
                    <TextInput {...props} />
                ) : props.type === "texto largo" ? (
                    <TextAreaInput {...props} />
                ) : props.type === "opciones" ? (
                    <SelectInput {...props} />
                ) : props.type === "multiselect" ? (
                    <MultiSelectInput {...props} />
                ) : props.type === "Sí / No" ? (
                    <YesNoInput {...props} />
                ) : props.type === "check" ? (
                    <CheckInput {...props} />
                ) : null
            }
        </div>
    );
};

export default Input;
