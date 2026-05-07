export default async function GetSections() {
    try {
        const API_URL = process.env.API_URL;

        const response = await fetch(`${API_URL}/catalogo/getSections`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            throw new Error('Error fetching project');
        }

        const sections = await response.json();
        return sections?.sections || [];
    }
    catch (error) {
        console.error('Error fetching sections:', error);
        return null;
    }
}
