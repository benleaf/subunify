import { StoredFile } from "@/types/server/ProjectResult";
import React, { createContext, useContext, useState } from "react";
import { isError } from "@/api/isError";
import { getExtension } from "@/helpers/FileProperties";
import { VideoFiles as VideoFiles } from "@/constants/VideoFiles";
import { useAction } from "./actions/infrastructure/ActionContext";
import { ImageFiles } from "@/constants/ImageFiles";

interface ThumbnailType {
    setProjectThumbnails: (projectId: string) => Promise<void>
    retrieveThumbnails: (files: StoredFile[]) => Promise<void>
    getUrl: (file: StoredFile) => string | undefined
    thumbnails: { [fileName: string]: string; }
}

const ThumbnailContext = createContext<ThumbnailType | undefined>(undefined)

export const ThumbnailProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [thumbnails, setThumbnails] = useState<{ [fileName: string]: string }>({})
    const { getFileDownloadUrl, getProjectThumbnails } = useAction()

    const setProjectThumbnails = async (projectId: string) => {
        await getProjectThumbnails(projectId) // TODO: when removed images will often fail to load. But only on first load. after refresh they work. Why?
        const thumbnails = await getProjectThumbnails(projectId)
        for (const thumbnail of thumbnails) {
            addThumbnail(thumbnail.fileId, thumbnail.url)
        }
    }

    const retrieveThumbnails = async (files: StoredFile[]) => {
        const videoFiles = files.filter(
            file => VideoFiles.includes(getExtension(file.name).toLocaleLowerCase())
        )

        videoFiles.map(file =>
            getFileDownloadUrl(file, 'VIDEO_THUMBNAIL')
                .then(result => !result || isError(result) ? console.error(result) : addThumbnail(file.id, result.url))
        )

        const imageFiles = files.filter(
            file => ImageFiles.includes(getExtension(file.name).toLocaleLowerCase())
        )

        imageFiles.map(file =>
            getFileDownloadUrl(file, 'IMAGE_THUMBNAIL')
                .then(result => !result || isError(result) ? console.error(result) : addThumbnail(file.id, result.url))
        )
    }

    const addThumbnail = (id: string, url: string) => {
        setThumbnails(old => ({ ...old, [id]: url }))
    }

    const getUrl = (file: StoredFile) => {
        if (!file.created) return
        return thumbnails[file.id]
    }

    return <ThumbnailContext.Provider value={{ setProjectThumbnails, retrieveThumbnails, getUrl, thumbnails }}>
        {children}
    </ThumbnailContext.Provider>;
};

export const useThumbnail = () => {
    const context = useContext(ThumbnailContext);
    if (!context) throw new Error("useThumbnail must be used within an ThumbnailProvider");
    return context;
};
