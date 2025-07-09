import { ProxySettingTypes } from "@/types/server/ProxySettingTypes";

export const ProxySettingLabels: { [key in ProxySettingTypes]: string } = {
    VIDEO_CODEC_4K: '4K',
    VIDEO_CODEC_2K: '2K',
    VIDEO_CODEC_1080P: '1080P',
    VIDEO_THUMBNAIL: 'Thumbnail',
    IMAGE_THUMBNAIL: 'Thumbnail',
    RAW: 'RAW',
}