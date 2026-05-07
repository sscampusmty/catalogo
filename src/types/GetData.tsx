// TYPES
import { DialogState } from "@/types/Dialog";

export type ProjectsResponse = {
    organization: string;
    projects: {data: any[][], id: string}[];
};

export type StudentsResponse = {
    students: any[];
};

export type UID = string | string[] | undefined;
export type ResponseCallback = (response: StudentsResponse | ProjectsResponse) => void;
export type LoadingCallback = (loading: boolean) => void;
export type ErrorCallback = (dialog: DialogState) => void;
