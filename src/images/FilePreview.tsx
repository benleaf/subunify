function isImage(file: File) {
    return file.type.startsWith("image/");
}

function isVideo(file: File) {
    return file.type.startsWith("video/");
}


function generateImageThumbnail(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d")!;
                const MAX_HEIGHT = 40;

                const scale = MAX_HEIGHT / img.height;
                canvas.height = MAX_HEIGHT;
                canvas.width = Math.min(img.width * scale, 300);

                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL("image/jpeg"));
            };
            img.onerror = reject;
            img.src = reader.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}


function generateVideoThumbnail(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const video = document.createElement("video");

        video.src = url;
        video.muted = true;
        video.playsInline = true;

        video.onloadedmetadata = async () => {
            try {
                await video.play();

                // Wait a short time for video to start playing (e.g. 500ms)
                setTimeout(() => {
                    const scale = 40 / video.videoHeight;
                    const width = Math.min(video.videoWidth * scale * scale, 300)
                    const height = 40;

                    const canvas = document.createElement("canvas");
                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext("2d")!;
                    ctx.drawImage(video, 0, 0, width, height);

                    const thumbnail = canvas.toDataURL("image/jpeg");
                    video.pause();
                    URL.revokeObjectURL(url);

                    resolve(thumbnail);
                }, 500); // Wait 500ms before capturing the frame
            } catch (err) {
                reject(err);
            }
        };

        video.onerror = (e) => {
            reject(new Error("Video load error"));
        };
    });
}

export async function generateThumbnail(file: File): Promise<string | 'NO_PREVIEW_AVAILABLE'> {
    if (isImage(file)) {
        return await generateImageThumbnail(file);
    } else if (isVideo(file)) {
        return await generateVideoThumbnail(file);
    }

    return 'NO_PREVIEW_AVAILABLE'
}