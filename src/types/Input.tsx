export interface InputProps {
    label: string;
    type?: "opciones" | "multiselect" | "texto" | "texto largo" | "check" | "número" | "teléfono" | "email" | "Sí / No";
    value: string;
    description?: string;
    locked?: boolean;
    getOptionsMethod: (label: string, setOptions: (options: string[]) => void) => void;
    onChange: (value: string) => void;
};
