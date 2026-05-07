// HELPER FUNCTIONS
import getErrorDialog from "./GetErrorDialog";
import GenerateToken from "@/utils/GenerateToken";

// TYPES
import { ErrorCallback, LoadingCallback, ResponseCallback } from "@/types/GetData";

const API_URL = process.env.API_URL;

export default async function GetProjects(projectID: string, onResponse: ResponseCallback, onLoading: LoadingCallback, onError: ErrorCallback) {
    if(!projectID || typeof projectID != "string" || projectID.length < 5) {
        onError(getErrorDialog("invalid-project-id"));
        onLoading(false);
        return;
    }

    await fetch(`${API_URL}/getStudents?projectID=${projectID}&token=${GenerateToken(projectID)}`, {
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
                    onError(getErrorDialog("project-not-found"));
                } else {
                    onError(getErrorDialog(`network-error-${res.status}`));
                }
            }
        })
        .then(data => {
            if(data) onResponse(data.students);
            onLoading(false);
        })
        .catch(err => {
            onError(getErrorDialog(err.message));
            onLoading(false);
        });
};
