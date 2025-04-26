import { FileOpen } from "@mui/icons-material";
import React, { useState, useEffect } from "react";

export const FILE_TYPES = {
    IMAGE: "image",
    VIDEO: "video",
    UNKNOWN: "unknown",
};

export const SUPPORTED_EXTENSIONS = {
    IMAGE: ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg", "avif"],
    VIDEO: ["mp4", "webm", "ogg"],
};

export const getFileExtension = (url: string) => {
    if (!url.includes(".")) return "";
    const extenstion = url?.split(".")?.pop()?.toLowerCase();
    if (extenstion) {
        return extenstion;
    }
    return "";
};

export const getFileType = async (
    fileType: string | undefined,
    preview: string | File,
    axiosInstance: any = null
): Promise<string> => {
    if (fileType) return fileType;

    try {

        let extension;

        if (typeof preview === 'object' && preview instanceof File)
            extension = preview.type.split('/')[1];

        else {
            const url = new URL(preview);
            const pathname = url.pathname.toLowerCase();
            extension = getFileExtension(pathname);
        }

        if (SUPPORTED_EXTENSIONS.IMAGE.includes(extension)) {
            return FILE_TYPES.IMAGE;
        } else if (SUPPORTED_EXTENSIONS.VIDEO.includes(extension)) {
            return FILE_TYPES.VIDEO;
        }

        const fetcher = axiosInstance ? axiosInstance.get : fetch;
        const response = axiosInstance
            ? await fetcher(preview)
            : await fetcher(preview, { method: "GET" });
        const contentType = axiosInstance
            ? response.headers["content-type"]
            : response.headers.get("Content-Type");

        if (contentType.startsWith("image/")) return FILE_TYPES.IMAGE;
        if (contentType.startsWith("video/")) return FILE_TYPES.VIDEO;
    } catch (error) {
        console.warn("Invalid URL or local file detected.", error);
    }

    return FILE_TYPES.UNKNOWN;
};

interface FilePreviewProps {
    preview: string | File;
    clarity?: number;
    placeHolderImage?: string;
    errorImage?: string;
    fileType?: string;
    axiosInstance?: any;
}

const FilePreview: React.FC<FilePreviewProps> = ({
    preview,
    clarity,
    placeHolderImage,
    errorImage,
    fileType,
    axiosInstance = null,
}) => {
    const [fileUrl, setFileUrl] = useState<string>('');
    const [resolvedType, setResolvedType] = useState<string>(fileType ?? "");
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        // If preview is a File, create an object URL
        if (preview instanceof File) {
            const url = URL.createObjectURL(preview);
            setFileUrl(url);
            return () => URL.revokeObjectURL(url); // Cleanup on unmount
        } else {
            setFileUrl(preview);
        }
    }, [preview]);

    useEffect(() => {
        const resolveType = async () => {
            const type = await getFileType(fileType, preview, axiosInstance);
            setResolvedType(type);
        };

        resolveType();
    }, [preview, fileType, axiosInstance]);

    const openInNewTab = (url: string) => {
        if (url) {
            window.open(url, "_blank", "noopener,noreferrer");
        }
    };

    function rendered() {
        //Render complete
        setIsLoading(false);
    }

    function startRender() {
        //Rendering start
        requestAnimationFrame(rendered);
    }

    function loaded() {
        requestAnimationFrame(startRender);
    }

    function renderFile() {
        if (!resolvedType) {
            return null;
        }

        if (resolvedType === FILE_TYPES.IMAGE) {
            return (
                <img
                    onLoad={loaded}
                    src={fileUrl}
                    alt="Preview"
                    style={{ maxWidth: 100, maxHeight: 75 }}
                    className={`preview-file ${isLoading ? "hidden" : ""}`}
                    onClick={() => openInNewTab(fileUrl)}
                />
            );
        } else if (resolvedType === FILE_TYPES.VIDEO) {
            return (
                <video
                    onLoad={loaded}
                    src={fileUrl}
                    controls
                    style={{ maxWidth: 100, maxHeight: 75 }}
                    className={`preview-file ${isLoading ? "hidden" : ""}`}
                    onClick={() => openInNewTab(fileUrl)}
                />
            );
        } else if (resolvedType === FILE_TYPES.UNKNOWN && errorImage) {
            console.log("errorImage", errorImage);
            return (
                <img
                    src={errorImage}
                    width={40}
                    height={40}
                    alt="errorImage"
                    className={`preview-file ${isLoading ? "hidden" : ""}`}
                    onLoad={() => setIsLoading(false)}
                />);
        } else {
            return <FileOpen />
        }
    }

    if (!resolvedType && placeHolderImage) {
        return (
            <img src={placeHolderImage} alt="placeHolder" className="preview-file" />
        );
    }

    return (
        <>
            {renderFile()}
            {isLoading ? (
                <div className="loader-container">
                    <div className="loader"></div>
                </div>
            ) : null}
        </>
    );
};

export default FilePreview;