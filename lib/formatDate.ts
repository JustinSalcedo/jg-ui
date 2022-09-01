const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const fullMonth = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

// 2022-09-13, 2019-08-25 => Sep 13 | Aug 25, 2019
export function dateToMonthDay(date: string | Date) {
    const formatDate = (typeof date === 'string') ? new Date(date) : date
    const monthDate = `${month[formatDate.getUTCMonth()]} ${formatDate.getUTCDate()}`

    if (formatDate.getUTCFullYear() === new Date().getUTCFullYear()) {
        return monthDate
    }
    return monthDate + ', ' + formatDate.getUTCFullYear()
}

// Sep 13 | Aug 25, 2019 => 2022-09-13, 2019-08-25
export function monthDayToDate(date: string) {
    if (!date) return
    let dateWithYear = date
    if (!date.split(', ')[1]) dateWithYear = date + ', ' + new Date().getFullYear()
    const formatDate = new Date(dateWithYear)
    return `${formatDate.getFullYear()}-${twoDigits(formatDate.getMonth() + 1)}-${twoDigits(formatDate.getDate())}`
}

// 1998-07-09 => July 1998
export function dateToFullMonth(date: string | Date) {
    const formatDate = (typeof date === 'string') ? new Date(date) : date
    const monthYear = `${fullMonth[formatDate.getUTCMonth()]} ${formatDate.getUTCFullYear()}`
    return monthYear
}

// July 1998 => 1998-07-01
export function fullMonthToDate(date: string) {
    if (!date) return
    const formatDate = new Date(date)
    return `${formatDate.getFullYear()}-${twoDigits(formatDate.getMonth() + 1)}-${twoDigits(formatDate.getDate())}`
}

// Only numbers < 100
function twoDigits(n: number) {
    const i = Math.floor(n)
    return i < 10 ? '0' + i : '' + i
}