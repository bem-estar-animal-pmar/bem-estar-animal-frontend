export function parseBrasiliaDate(dateObj: Date, hour = 0, minute = 0) {
    const year = dateObj.getFullYear()
    const month = String(dateObj.getMonth() + 1).padStart(2, "0")
    const day = String(dateObj.getDate()).padStart(2, "0")
    const h = hour.toString().padStart(2, "0")
    const m = minute.toString().padStart(2, "0")

    return new Date(`${year}-${month}-${day}T${h}:${m}:00.000-03:00`)
}

export function getNowInBrasilia() {
    const nowBrasilia = new Date().toLocaleString("en-US", {
        timeZone: "America/Sao_Paulo",
    })
    return new Date(nowBrasilia)
}

export function getTodayInBrasilia() {
    const now = getNowInBrasilia();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
}

