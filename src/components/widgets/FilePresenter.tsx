import { StoredFile } from "@/types/server/ProjectResult"
import GlassText from "../glassmorphism/GlassText"
import { CssSizes } from "@/constants/CssSizes"
import { DownloadPanel } from "../form/DownloadPanel"
import GlassCard from "../glassmorphism/GlassCard"
import MediaContent from "./MediaContent"
import { Button, Divider, Fab } from "@mui/material"
import { Download } from "@mui/icons-material"
import { useAction } from "@/contexts/actions/infrastructure/ActionContext"
import { isError } from "@/api/isError"
import { ProxySettingTypes } from "@/types/server/ProxySettingTypes"
import { ProxySettingLabels } from "@/constants/ProxySettingLabels"

type Props = {
    file: StoredFile,
    message: string,
    isRight: boolean,
    height?: number,
    downloadType?: ProxySettingTypes
}

const FilePresenter = ({ file, isRight, message, downloadType }: Props) => {
    const { getFileDownloadUrl } = useAction()

    const download = async () => {
        const response = await getFileDownloadUrl(file, downloadType ?? 'RAW')

        if (!response || isError(response)) {
            console.error(response)
            return
        }

        const { url } = response
        window.open(url, '_self');
    }

    return <GlassCard marginSize="small" paddingSize="small">
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: CssSizes.small, justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', flex: 1, minWidth: 300 }}>
                <GlassText size="moderate">{message}</GlassText>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        gap: CssSizes.small,
                        alignItems: 'center',
                        cursor: 'pointer'
                    }}
                    onClick={download}
                >
                    <Fab size='small' onClick={download} color="primary" >
                        <Download fontSize="medium" />
                    </Fab>
                    <GlassText size="moderate"><u>{file.name} : {ProxySettingLabels[downloadType ?? 'RAW']}</u></GlassText>
                </div>
            </div>
            <div style={{ flex: 2 }}>
                <MediaContent file={file} height={400} />
            </div>
        </div>
    </GlassCard>
}

export default FilePresenter