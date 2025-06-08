import React, { createContext, useContext, useRef, useState } from "react";
import UploadManager from "@/helpers/UploadManager";

interface UploadType {
    uploadManager: UploadManager
    projectDataStored: { [projectId: string]: number },
    setDataStored: (projectId: string, newDataStored: number) => void
}

const UploadContext = createContext<UploadType | undefined>(undefined)

export const UploadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [projectDataStored, setProjectDataStored] = useState<UploadType['projectDataStored']>({})
    const uploadManager = useRef<UploadManager>(new UploadManager());

    const updateDataStored = (projectId: string, change: number) => {
        setProjectDataStored(old => ({ ...old, [projectId]: old[projectId] ? old[projectId] + change : change }))
    }

    const setDataStored = (projectId: string, newDataStored: number) => {
        setProjectDataStored(old => ({ ...old, [projectId]: newDataStored }))
    }

    uploadManager.current.addCallbacks({ updateDataStored })

    return <UploadContext.Provider value={{ uploadManager: uploadManager.current, projectDataStored, setDataStored }}>
        {children}
    </UploadContext.Provider>;
};

export const useUpload = () => {
    const context = useContext(UploadContext);
    if (!context) throw new Error("useUpload must be used within an UploadProvider");
    return context;
};
