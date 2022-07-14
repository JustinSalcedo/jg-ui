export default function formatLabels(label: string): string {
    return label
        .split('')
        .map((char, index) => {
            if (char.match(/([A-Z])+/)) {
                return ' ' + char.toLowerCase()
            }
            if (!index) {
                return char.toUpperCase()
            }
            return char
        })
        .join('')
}