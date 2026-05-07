export type DialogState = {
    title: string,
    description: string,
    type: "error" | "success" | "info" | "warning",
    buttonText?: string
};