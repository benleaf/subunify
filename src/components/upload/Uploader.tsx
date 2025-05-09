import { TaggedFile } from "@/pages/FileUpload"
import FileUploadModal from "../modal/FileUploadModal"

type Props = {
    taggedFiles: TaggedFile[]
}

const Uploader = ({ taggedFiles }: Props) => {
    return <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <FileUploadModal startUpload fileRecords={taggedFiles.map(file => ({ ...file, description: file.tags.join() }))} />
    </div>
}

export default Uploader