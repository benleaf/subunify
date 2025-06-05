const kb = 2 ** 10

export const getFileSize = (bytes: number) => {
    let size = bytes
    if (size < kb) return `${size} Bytes`
    size /= kb
    if (size < kb) return `${(size).toFixed(1)} KB`
    size /= kb
    if (size < kb) return `${(size).toFixed(1)} MB`
    size /= kb
    if (size < kb) return `${(size).toFixed(1)} GB`
    size /= kb
    if (size < kb) return `${(size).toFixed(1)} TB`
}

export const terabytesToBytes = (terabytes: number) => {
    return terabytes * (2 ** 40)
}

export const getFileCost = (bytes: number) => {
    return `$${getNumericFileMonthlyCost(bytes).toFixed(2)}`
}

export const getNumericFileMonthlyCost = (bytes: number) => {
    return bytes * (2 ** -40) * 1.5
}

export const getNumericFileUploadCost = (bytes: number) => {
    return bytes * (2 ** -40) * 6.5
}

export const largestSizeForMinPayment = getFileSize((2 ** 40 / 1.5) * 0.6)