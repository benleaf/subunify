export const getFileSize = (bytes: number) => {
    let size = bytes
    if (size < 1000) return `${size} Bytes`
    size /= 1000
    if (size < 1000) return `${(size).toFixed(1)} KB`
    size /= 1000
    if (size < 1000) return `${(size).toFixed(1)} MB`
    size /= 1000
    if (size < 1000) return `${(size).toFixed(1)} GB`
    size /= 1000
    if (size < 1000) return `${(size).toFixed(1)} TB`
}

export const getFileCost = (bytes: number) => {
    return `$${getNumericFileCost(bytes).toFixed(2)}`
}

export const getNumericFileCost = (bytes: number) => {
    return bytes * 0.000000000005
}