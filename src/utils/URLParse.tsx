export default function URLParse(text: string, revert?: boolean) {
    const dictionary = [
        ["%20", " "],
        ["%23", "#"],
        ["%26", "&"],
        ["%3F", "?"],
        ["%2F", "/"],
        ["%3A", ":"],
        ["%3B", ";"],
        ["%3D", "="],
        ["%40", "@"],
        ["%5B", "["],
        ["%5D", "]"]
    ];

    for(const [to, from] of dictionary) {
        if(revert) {
            text = text.replaceAll(to, from);
        } else {
            text = text.replaceAll(from, to);
        }
    }

    return text;
}
