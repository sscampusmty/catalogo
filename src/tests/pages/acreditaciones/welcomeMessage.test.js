import GetWelcomeMessage from '../../../utils/pages/acreditaciones/GetWelcomeMessage';
import Periodos from '../../../utils/pages/acreditaciones/Periodos';

describe('GetWelcomeMessage', () => {
    it("Should return the correct welcome message for each period", () => {
        const TestCases = [
            { date: '2024-03-12', expected: Periodos[0].mensaje },
            { date: '2024-06-12', expected: Periodos[0].mensaje },
            { date: '2024-06-17', expected: "No hay periodo de servicio social activo" },
            { date: '2024-06-20', expected: Periodos[1].mensaje },
            { date: '2024-08-02', expected: Periodos[1].mensaje },
            { date: '2024-08-06', expected: "No hay periodo de servicio social activo" },
            { date: '2024-08-12', expected: Periodos[2].mensaje },
            { date: '2024-12-01', expected: Periodos[2].mensaje },
            { date: '2024-12-12', expected: "No hay periodo de servicio social activo" },
            { date: '2024-01-14', expected: Periodos[3].mensaje },
            { date: '2025-02-25', expected: Periodos[3].mensaje },
            { date: '2025-02-27', expected: "No hay periodo de servicio social activo" },
        ];

        TestCases.forEach(testCase => {
            const splitDate = testCase.date.split("-");
            const day = parseInt(splitDate[2]);

            if(day >= 10) {
                // If it is a double digit day, add one to the date day (because javascript is weird)
                testCase.date = `${splitDate[0]}-${splitDate[1]}-${parseInt(splitDate[2])+1}`
            }

            jest.useFakeTimers().setSystemTime(new Date(testCase.date));

            const welcomeMessage = GetWelcomeMessage();

            expect(welcomeMessage).toBe(testCase.expected);
        });
    })
});