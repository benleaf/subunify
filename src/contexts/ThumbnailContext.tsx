import { StoredFile } from "@/types/server/ProjectResult";
import React, { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";
import { isError } from "@/api/isError";
import { getExtension } from "@/helpers/FileProperties";

interface ThumbnailType {
    retrieveThumbnails: (files: StoredFile[]) => Promise<void>
    getUrl: (file: StoredFile) => string
}

const PREVIEW_EXTENSIONS = ['mp4', 'mov']
const ThumbnailContext = createContext<ThumbnailType | undefined>(undefined)

export const ThumbnailProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [thumbnails, setThumbnails] = useState<{ [fileName: string]: string }>({})
    const { authAction } = useAuth()

    const retrieveThumbnails = async (files: StoredFile[]) => {
        const validFiles = files.filter(
            file => PREVIEW_EXTENSIONS.includes(getExtension(file.name).toLocaleLowerCase())
        )

        validFiles.map(file =>
            authAction<{ url: string }>(`storage-file/download/${file.id}/THUMBNAIL`, 'GET')
                .then(result => isError(result) ? console.error(result) : addThumbnail(file.id, result.url))
        )
    }

    const addThumbnail = (id: string, url: string) => {
        setThumbnails(old => ({ ...old, [id]: url }))
    }

    const getUrl = (file: StoredFile) => {
        return thumbnails[file.id]
    }

    return <ThumbnailContext.Provider value={{ retrieveThumbnails, getUrl }}>
        {children}
    </ThumbnailContext.Provider>;
};

export const useThumbnail = () => {
    const context = useContext(ThumbnailContext);
    if (!context) throw new Error("useThumbnail must be used within an ThumbnailProvider");
    return context;
};
