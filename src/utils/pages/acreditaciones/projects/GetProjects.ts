// HELPER FUNCTIONS
import GetWelcomeMessage from "../GetWelcomeMessage";
import getErrorDialog from "./GetErrorDialog";
import GenerateToken from "@/utils/GenerateToken";

// TYPES
import { UID, ErrorCallback, LoadingCallback } from "@/types/GetData";

const API_URL = process.env.API_URL;

export default async function GetProjects(
    UID: UID,
    onResponse: (response: { organization: string; projects: { data: any[][]; id: string; }[]; }) => void,
    onLoading: LoadingCallback,
    onError: ErrorCallback
) {
    if(GetWelcomeMessage() === "No hay periodo de servicio social activo") {
        onError(getErrorDialog("no-active-period"));
        await new Promise(resolve => setTimeout(resolve, 3000));
    }

    if(!UID || typeof UID != "string" || UID.length < 5) {
        onError(getErrorDialog("invalid-organization-id"));
        onLoading(false);
        return;
    }

    await fetch(`${API_URL}/acreditaciones/getProjects?UID=${UID}&token=${GenerateToken(UID)}`, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        }
    })
        .then(res => {
            onLoading(true);
            return res;
    })
        .then(res => {
            if(res.status === 200) {
                return res.json();
            } else {
                if(res.status === 404) {
                    onError(getErrorDialog("organization-not-found"));
                } else {
                    onError(getErrorDialog(`network-error-${res.status}`));
                }
            }
        })
        .then(data => {
            if(data) onResponse(data);
            onLoading(false);
        })
        .catch(err => {
            onError(getErrorDialog(err.message));
            onLoading(false);
        });
};
