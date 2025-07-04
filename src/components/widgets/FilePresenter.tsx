import { StoredFile } from "@/types/server/ProjectResult"
import GlassText from "../glassmorphism/GlassText"
import { CssSizes } from "@/constants/CssSizes"
import { DownloadPanel } from "../form/DownloadPanel"
import GlassCard from "../glassmorphism/GlassCard"
import MediaContent from "./MediaContent"

type Props = {
    file: StoredFile,
    message: string,
    isRight: boolean,
    height?: number,
}

const FilePresenter = ({ file, isRight, message }: Props) => {
    return <GlassCard marginSize="small" paddingSize="small">
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: CssSizes.small, justifyContent: 'space-between' }}>
            <div style={{ flex: 1 }}>
                <MediaContent file={file} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', flex: 1, minWidth: 300 }}>
                <div>
                    <GlassText size="big">{file.name}</GlassText>
                    <GlassText size="moderate">{message}</GlassText>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: CssSizes.small, justifyContent: 'space-between' }}>
                    <DownloadPanel file={file} />
                </div>
            </div>
        </div>
    </GlassCard>
}

export default FilePresenter