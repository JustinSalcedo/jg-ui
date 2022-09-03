export function shrinkTitle(title: string) {
    if (title.length > 34) {
        return title.slice(0, 30) + '...'
    }
    return title
}