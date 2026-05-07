export type TabFields = {
    [key: string]: {
        campo: string;
        tipo: "opciones" | "multiselect" | "texto" | "texto largo" | "check" | "número" | "teléfono" | "email" | "Sí / No";
        descripcion: string;
        inhabilitado: boolean;
        se_muestra_en_el_catalogo: boolean;
        mostrar_campo_si_nombre_del_campo?: string;
        mostrar_campo_si_valor_del_campo?: string;
        imagen?: string;
        maximo_de_opciones_a_elegir?: number;
        obligatorio_actualizar_en_renovacion?: boolean;
        column?: string;
        value: string;
        show?: boolean;
    }[]
}

export type Tab = {
    nombre: string;
    description?: string;
    mostrarSiNombreDelCampo?: string;
    mostrarSiValorDelCampo?: string;
    hidden?: boolean;
};


export interface TabsProps {
  options: Tab[];
  selected: Tab;
  completedTabs?: string[];
  lockSteps?: boolean;
    availableTabs?: string[];
  onSelect: (option: Tab) => void;
  className?: string;
};
