export const formatPrice = (value, fixed = 2) => {
    if (!value) {
        return Number(0).toFixed(fixed)
    }
    return Number(value / 10 ** fixed).toFixed(fixed)
}

export const formatDate = (date, split = '-') => {
    if (!date) return ''
    const _date = new Date(date)
    let year = _date.getFullYear()
    let month = _date.getMonth() + 1
    let day = _date.getDate()

    return [year, month.toString().padStart(2, '0'), day.toString().padStart(2, '0')].join(split)
}

export const formatTime = (time) => {
    if (!time) return ''
    const _date = new Date(time)
    let year = _date.getFullYear()
    let month = _date.getMonth() + 1
    let day = _date.getDate()
    let hour = _date.getHours()
    let minute = _date.getMinutes()

    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
}
export const formatTimeToSeconds = (time) => {
    if (!time) return ''
    const _date = new Date(time)
    let year = _date.getFullYear()
    let month = _date.getMonth() + 1
    let day = _date.getDate()
    let hour = _date.getHours()
    let minute = _date.getMinutes()
    let seconds = _date.getSeconds()
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

export default (Vue) => {
    Vue.filter('formatPrice', formatPrice)
    Vue.filter('formatDate', formatDate)
    Vue.filter('formatTime', formatTimeToSeconds)
    Vue.filter('formatTimeToSeconds', formatTimeToSeconds)
}