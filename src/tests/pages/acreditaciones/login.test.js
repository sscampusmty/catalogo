import HandleLogin from "../../../utils/pages/acreditaciones/HandleLogin";

describe("Login", () => {
    it("Should parse username to email", async () => {
        const testCases = [
            { username: "t e@.s_-t$1  23", password: "test", expectedEmail: "test123@gmail.com" }
        ];

        for (const { username, password, expectedEmail } of testCases) {
            const { username: email } = await HandleLogin(username, password, () => {}, () => {}, () => {});
            expect(email).toBe(expectedEmail);
        }
    });

    it("Should call onLoading callback", async () => {
        const calls = [];

        const onLoading = (state) => {
            calls.push(state);
        };

        const testCases = [
            { username: "test", password: "test", expectedCalls: [true, false] },
            { username: "test", password: "test12345", expectedCalls: [true] }
        ];

        for (const { username, password, expectedCalls } of testCases) {
            await HandleLogin(username, password, () => {}, onLoading, () => {});
            expect(calls.splice(0, expectedCalls.length)).toStrictEqual(expectedCalls);
        }
    });

    it("Should call redirect callback", async () => {
        let currentPath = "";

        const onRedirect = (path) => {
            currentPath = path;
        };

        const testCases = [
            { username: "test", password: "test12345", expectedRedirect: "/acreditaciones/8CE1w232PmTjoEyJOmgbIqaYWYX2/proyectos" },
        ];

        for (const { username, password, expectedRedirect } of testCases) {
            await HandleLogin(username, password, () => {}, () => {}, onRedirect);
            expect(currentPath).toBe(expectedRedirect);
        }
    });

    it("Should call onError", async () => {
        let currentError = null;

        const onError = (e) => {
            currentError = e;
        };

        const testCases = [
            { username: "", password: "test", error: true }, // Missing username
            { username: "test", password: "", error: true }, // Missing password
            { username: "", password: "", error: true }, // Missing username and password
            { username: "test@gmail.com", password: "test12345", error: true }, // Invalid user
            { username: "test", password: "password", error: true }, // Invalid credentials
            { username: "test", password: "test12345", error: false } // Valid credentials
        ];

        for (const { username, password, error } of testCases) {
            currentError = null;
            
            await HandleLogin(username, password, onError, () => {}, () => {});

            if(error) {
                expect(currentError).not.toBeNull();
            } else {
                expect(currentError).toBeNull();
            }
        }
    });
});