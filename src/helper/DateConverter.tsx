function padTo2Digits(num: any) {
    return num.toString().padStart(2, '0');
}

export function formatDate(date: any) {
    return [
        date.getFullYear(),
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
    ].join('-');
}