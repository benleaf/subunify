export const getFileExtension = (file: File) => getExtension(file.name)

export const getExtension = (name: string) => name.split('.').pop()!