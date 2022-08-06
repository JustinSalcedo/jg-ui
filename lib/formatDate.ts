const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const fullMonth = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export function dateToMonthDay(date: string | Date) {
    const formatDate = (typeof date === 'string') ? new Date(date) : date
    const monthDate = `${month[formatDate.getUTCMonth()]} ${formatDate.getUTCDate()}`

    if (formatDate.getUTCFullYear() === new Date().getUTCFullYear()) {
        return monthDate
    }
    return monthDate + ', ' + formatDate.getUTCFullYear()
}

export function dateToFullMonth(date: string | Date) {
    const formatDate = (typeof date === 'string') ? new Date(date) : date
    const monthYear = `${fullMonth[formatDate.getUTCMonth()]} ${formatDate.getUTCFullYear()}`
    return monthYear
}