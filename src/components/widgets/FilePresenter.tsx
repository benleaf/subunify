import { BundleStorageFile, StoredFile } from "@/types/server/ProjectResult"
import GlassText from "../glassmorphism/GlassText"
import { CssSizes } from "@/constants/CssSizes"
import GlassCard from "../glassmorphism/GlassCard"
import MediaContent from "./MediaContent"
import { ProxySettingTypes } from "@/types/server/ProxySettingTypes"
import { DownloadItem } from "../form/DownloadItem"
import { getDisplayFile } from "@/helpers/FilesForDisplay"

type Props = {
    file: BundleStorageFile,
    message: string,
    height?: number,
    downloadType?: ProxySettingTypes
}

const FilePresenter = ({ file, message, downloadType }: Props) => {
    const storedFile: StoredFile = getDisplayFile(file)
    const proxy = storedFile.proxyFiles?.find(proxy => proxy.proxyType === downloadType)
    return <GlassCard marginSize="small" paddingSize="small">
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: CssSizes.small, justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', flex: 1, minWidth: 300 }}>
                <div>
                    <GlassText size="large">{file.name}</GlassText>
                    <GlassText size="moderate">{message}</GlassText>
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        gap: CssSizes.small,
                        alignItems: 'center',
                    }}
                >
                    {!proxy && <DownloadItem
                        file={storedFile}
                        bytes={storedFile.bytes}
                        proxyType={downloadType}
                        lastFileRestore={storedFile.lastFileRestore}
                    />}
                    {proxy && <DownloadItem
                        file={storedFile}
                        bytes={+proxy.bytes}
                        proxyType={downloadType}
                        transformation={proxy.transformation}
                        lastFileRestore={storedFile.lastFileRestore}
                    />}
                </div>
            </div>
            <div style={{ flex: 2 }}>
                <MediaContent file={storedFile} height={400} />
            </div>
        </div>
    </GlassCard>
}

export default FilePresenter