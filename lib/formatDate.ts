const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function dateToMonthDay(date: string | Date) {
    const formatDate = (typeof date === 'string') ? new Date(date) : date
    const monthDate = `${month[formatDate.getUTCMonth()]} ${formatDate.getUTCDate()}`

    if (formatDate.getUTCFullYear() === new Date().getUTCFullYear()) {
        return monthDate
    }
    return monthDate + ', ' + formatDate.getUTCFullYear()
}