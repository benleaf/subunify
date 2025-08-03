import React, { createContext, useContext, useRef, useState } from "react";
import UploadManager from "@/helpers/UploadManager";
import { Moment } from "moment";

interface UploadType {
    uploadManager: UploadManager
    projectDataStored: { [projectId: string]: number },
    uploadStats: { totalUploaded?: number, startTime?: Moment, eta?: string, mbps?: number },
    setUploadStats: React.Dispatch<React.SetStateAction<{
        totalUploaded?: number;
        startTime?: Moment;
        eta?: string;
        mbps?: number;
    }>>
    setDataStored: (projectId: string, newDataStored: number) => void
}

const UploadContext = createContext<UploadType | undefined>(undefined)

export const UploadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [projectDataStored, setProjectDataStored] = useState<UploadType['projectDataStored']>({})
    const [uploadStats, setUploadStats] = useState<UploadType['uploadStats']>({})
    const uploadManager = useRef<UploadManager>(new UploadManager());

    const updateDataStored = (projectId: string, change: number) => {
        setProjectDataStored(old => ({ ...old, [projectId]: old[projectId] ? old[projectId] + change : change }))
    }

    const setDataStored = (projectId: string, newDataStored: number) => {
        setProjectDataStored(old => ({ ...old, [projectId]: newDataStored }))
    }

    const addUploaded = (uploaded: number) => {
        setUploadStats(old => ({ ...old, totalUploaded: (old.totalUploaded ?? 0) + uploaded }))
    }

    uploadManager.current.addCallbacks({ updateDataStored, addUploaded })

    return <UploadContext.Provider value={{ uploadManager: uploadManager.current, projectDataStored, setDataStored, uploadStats, setUploadStats }}>
        {children}
    </UploadContext.Provider>;
};

export const useUpload = () => {
    const context = useContext(UploadContext);
    if (!context) throw new Error("useUpload must be used within an UploadProvider");
    return context;
};
