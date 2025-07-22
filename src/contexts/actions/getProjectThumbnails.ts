import { isError } from "@/api/isError"
import { ActionInput } from "@/types/actions/ActionInput"

export const getProjectThumbnails = ({ authAction }: ActionInput) => async (projectId: string) => {
    const thumbnails: { fileId: string, url: string }[] = []
    const videoThumbnails = await authAction<{ fileId: string, url: string }[]>(
        `file-download/project-urls/${projectId}/VIDEO_THUMBNAIL`,
        'GET'
    )

    if (!isError(videoThumbnails)) {
        thumbnails.push(...videoThumbnails)
    }

    const imageThumbnails = await authAction<{ fileId: string, url: string }[]>(
        `file-download/project-urls/${projectId}/IMAGE_THUMBNAIL`,
        'GET'
    )
    if (!isError(imageThumbnails)) {
        thumbnails.push(...imageThumbnails)
    }

    return thumbnails
}